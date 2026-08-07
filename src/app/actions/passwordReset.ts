"use server";

import { prisma } from "@/lib/prisma";
import { generateToken, hashToken } from "@/lib/token";
import { validatePassword } from "@/lib/passwordPolicy";
import { isRateLimited } from "@/lib/rateLimit";
import { getResend, getFromEmail } from "@/lib/resend";
import { SITE_NAME } from "@/lib/siteConfig";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

const GENERIC_SUCCESS_MESSAGE = "If an account exists for that email, we've sent a password reset link.";

export async function requestPasswordReset(prevState: unknown, formData: FormData) {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  if (!email) {
    return { success: false, error: "Please enter your email address." };
  }

  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (await isRateLimited(`reset-request:${ip}:${email}`, 3, 15 * 60 * 1000)) {
    // Same generic message as success - don't reveal rate limiting to a potential enumeration attempt
    return { success: true, message: GENERIC_SUCCESS_MESSAGE };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return the same message whether or not the account exists, so this
  // endpoint can't be used to enumerate registered admin emails.
  if (!user) {
    return { success: true, message: GENERIC_SUCCESS_MESSAGE };
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);

  await prisma.$transaction([
    // Invalidate any previous outstanding reset requests for this user first.
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: { tokenHash, userId: user.id, expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
    }),
  ]);

  const baseUrl = await getBaseUrl();
  const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}`;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: getFromEmail(),
      to: email,
      subject: `Reset your ${SITE_NAME} admin password`,
      html: `
        <p>Someone requested a password reset for your ${SITE_NAME} admin account.</p>
        <p><a href="${resetUrl}">Click here to set a new password</a>. This link expires in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  } catch (e) {
    console.error("Failed to send password reset email:", e);
    // Still return the generic success message - don't leak whether sending failed,
    // and don't leave the user stuck on an error that hints the account exists.
  }

  return { success: true, message: GENERIC_SUCCESS_MESSAGE };
}

export async function resetPassword(prevState: unknown, formData: FormData) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!token) {
    return { success: false, error: "Missing or invalid reset link." };
  }
  if (password !== confirmPassword) {
    return { success: false, error: "Passwords don't match." };
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { success: false, error: passwordError };
  }

  const tokenHash = hashToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { success: false, error: "This reset link is invalid or has expired. Request a new one." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashedPassword } }),
    // Single-use: consume this token and any others issued for the same user.
    prisma.passwordResetToken.deleteMany({ where: { userId: resetToken.userId } }),
  ]);

  return { success: true };
}
