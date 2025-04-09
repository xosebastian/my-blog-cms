import { LoginForm } from '@/components/auth/login-form'

/**
 * Public page that renders the login form.
 *
 * This page is displayed to unauthenticated users and provides
 * access to the authentication system.
 */
export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <LoginForm />
    </main>
  )
}
