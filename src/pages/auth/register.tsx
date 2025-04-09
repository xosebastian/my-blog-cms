import { RegisterForm } from "@/components/auth/register-form";
import Head from "next/head";

/**
 * Public page that renders the registration form.
 *
 * This page allows new users to sign up for an account.
 */
export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Create a new account" />
      </Head>
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <RegisterForm />
      </main>
    </>
  );
}
