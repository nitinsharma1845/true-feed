"use client";

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function SignInButton() {
  const session = useSession();

  console.log(session, "Session");
  return (
    <button
      onClick={() => signIn()}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Sign In
    </button>
  );
}
