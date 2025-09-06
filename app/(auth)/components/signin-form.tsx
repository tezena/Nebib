"use client";

import type React from "react";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import LoginBackground from "@/components/ui/blue-pattern-background";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SigninForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      setAuthError(""); // Clear previous errors
      console.log("🔐 Sign-in: Attempting to sign in with:", values.email);
      
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onRequest: (ctx) => {
            console.log("🔐 Sign-in: Request context:", ctx);
          },
          onSuccess: (ctx) => {
            console.log("✅ Sign-in: Success context:", ctx);
            router.push("/dashboard");
            console.log("logged in successfully");
            toast.success("Admin signed successfully");
          },
          onError: (ctx) => {
            console.log("❌ Sign-in: Error context:", ctx);
            const errorMessage = ctx.error?.message || "Invalid email or password. Please try again.";
            setAuthError(errorMessage);
            toast.error(errorMessage);
          },
        }
      );
    } catch (err) {
      console.log("🚨 Sign-in: Exception:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with SVG waves */}
      <LoginBackground />

      {/* Login card */}
      <div className="w-full max-w-[480px] bg-white rounded-3xl p-8 space-y-6 shadow-xl z-10">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to Account
          </h1>
          <p className="text-muted-foreground">
            Please enter your email and password to continue
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••"
                        className="h-12 bg-muted/50 border-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember Password
              </label>
            </div>

            {/* Authentication Error Display */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-[#4F6EF7] text-white rounded-lg font-medium hover:bg-[#4F6EF7]/90 transition-colors"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
