"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { resetPassword } from "@/app/actions/passwordReset";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Saving..." : "Set new password"}
    </button>
  );
}

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, dispatch] = useFormState(resetPassword, undefined);

  if (state?.success) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-700">Your password has been reset.</p>
        <Link href="/admin/login" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          New password
        </label>
        <p className="mt-1 text-xs text-gray-400">At least 8 characters, with a letter and a number.</p>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm new password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white"
          />
        </div>
      </div>

      <div>
        <SubmitButton />
      </div>

      {state?.error && (
        <div className="text-sm text-red-500 font-medium text-center">{state.error}</div>
      )}
    </form>
  );
}
