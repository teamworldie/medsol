"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/rateLimit";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const email = String(formData.get("email") ?? "").toLowerCase();

  if (isRateLimited(`login:${ip}:${email}`, 5, 5 * 60 * 1000)) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
