"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/passwordReset";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Sending..." : "Send reset link"}
    </button>
  );
}

export default function ForgotPasswordForm() {
  const [state, dispatch] = useFormState(requestPasswordReset, undefined);

  if (state?.success) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-700">{state.message}</p>
        <Link href="/admin/login" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={dispatch} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
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

      <div className="text-center">
        <Link href="/admin/login" className="text-sm text-gray-500 hover:text-gray-900">
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
