"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { loginSchema, LoginFormData } from "@/schemas/login-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "../form-field";
import { LoginFailedError } from "@/errors/login-failed-error";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = useCallback(async (data: LoginFormData) => {
    await authClient.signIn.email(data);

    const session = await authClient.getSession();

    if (!session?.data?.user) {
      throw new LoginFailedError("Invalid email or password");
    }
  }, []);

  const login = useMutation({
    mutationFn: handleLogin,
    onSuccess: () => router.push("/"),
    onError: () => toast.error("Invalid email or password"),
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>

      <form
        onSubmit={handleSubmit((data) => login.mutate(data))}
        className="space-y-4"
      >
        <CardContent className="space-y-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            register={register}
            error={errors.email?.message}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            register={register}
            error={errors.password?.message}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={login.isPending}
            aria-busy={login.isPending}
          >
            {login.isPending ? "Loading..." : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link href="auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
