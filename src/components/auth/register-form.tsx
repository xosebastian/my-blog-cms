"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterFormData, registerSchema } from "@/schemas/register-schema";
import { FormField } from "../form-field";

import Link from "next/link";
import { generateAvatar } from "@/lib/avatar-service";
import { SignUpFailedError } from "@/errors/signup-failed-error";

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const signUp = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { name, email, password } = data;
      const generatedAvatar = generateAvatar(name);

      try {
        const res = await authClient.signUp.email({
          name,
          email,
          password,
          image: generatedAvatar,
        });

        const session = await authClient.getSession();

        if (!session?.data?.user) {
          throw new SignUpFailedError("Signup failed. Please try again.");
        }

        return res;
      } catch (error) {
        throw new SignUpFailedError(
          error instanceof Error
            ? error.message
            : "Unknown error during signup."
        );
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/");
    },
    onError: () => {
      toast.error("Registration failed. Email may already be in use.");
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Register to start creating and managing your articles.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={handleSubmit((data) => signUp.mutate(data))}
        className="space-y-4"
      >
        <CardContent className="space-y-4">
          <FormField
            id="name"
            label="Name"
            type="text"
            register={register}
            error={errors.name?.message}
          />
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
          <FormField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            register={register}
            error={errors.confirmPassword?.message}
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={signUp.isPending}
            aria-busy={signUp.isPending}
          >
            {signUp.isPending ? "Creating..." : "Sign Up"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="auth/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
