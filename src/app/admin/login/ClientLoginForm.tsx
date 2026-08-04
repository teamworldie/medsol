"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { authenticate } from "./actions";

export default function ClientLoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

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
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medsol-blue focus:border-medsol-blue sm:text-sm text-gray-900 bg-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-medsol-blue focus:border-medsol-blue sm:text-sm text-gray-900 bg-white"
          />
        </div>
      </div>

      <div>
        <LoginButton />
      </div>

      {errorMessage && (
        <div className="text-sm text-red-500 font-medium text-center">
          {errorMessage}
        </div>
      )}

      <div className="text-center">
        <Link href="/admin/forgot-password" className="text-sm text-gray-500 hover:text-gray-900">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medsol-blue hover:bg-medsol-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medsol-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}
