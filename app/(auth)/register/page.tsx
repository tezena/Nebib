"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

// Define the form schema with Zod
const formSchema = z
  .object({
    organizationName: z
      .string()
      .min(1, { message: "የድርጅት ስም ያስፈልጋል።" })
      .min(2, { message: "የድርጅት ስም ቢያንስ 2 ቁምፊ መሆን አለበት።" }),
    adminName: z
      .string()
      .min(1, { message: "የአስተዳዳሪ ስም ያስፈልጋል።" })
      .min(2, { message: "የአስተዳዳሪ ስም ቢያንስ 2 ቁምፊ መሆን አለበት።" }),
    adminEmail: z
      .string()
      .min(1, { message: "ኢሜይል ያስፈልጋል።" })
      .email({ message: "እባክዎ ትክክለኛ ኢሜይል አድራሻ ያስገቡ።" }),
    password: z
      .string()
      .min(1, { message: "የይለፍ ቃል ያስፈልጋል።" })
      .min(8, { message: "የይለፍ ቃል ቢያንስ 8 ቁምፊ መሆን አለበት።" }),
    confirmPassword: z
      .string()
      .min(1, { message: "እባክዎ የይለፍ ቃልዎን ያረጋግጡ።" })
      .min(8, { message: "የይለፍ ቃል ቢያንስ 8 ቁምፊ መሆን አለበት።" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "የይለፍ ቃሎች አይዛመዱም",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const router = useRouter();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "",
      adminName: "",
      adminEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setAuthError(""); // Clear previous errors
    try {
      // Here you would typically send the data to your API
      console.log(values);
      // Simulate API call
   await authClient.signUp.email(
        {
          email: values.adminEmail,
          password: values.password,
          name: values.adminName,
          organizationName: values.organizationName,
          callbackURL: "/dashboard",
        } as any,
        {
          onSuccess: (ctx) => {
            console.log("✅ Registration successful:", ctx);
            router.push("/dashboard");
          },
          onError: (error) => {
            console.error("❌ Registration error:", error);
            const errorMessage = error?.error?.message || "Registration failed. Please try again.";
            setAuthError(errorMessage);
          },
        }
      );
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      setAuthError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/logo.png"
                alt="ፍሬ Form Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-2xl font-semibold" style={{ color: '#382606' }}>ፍሬ Form</h1>
            </div>
           
            <Link href="/" className="hover:underline text-sm mt-2" style={{ color: '#f4be42' }}>
              ← ወደ ዋና ገጽ ተመለስ
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium" style={{ color: '#382606' }}>
                        የድርጅት ስም
                      </Label>
                      <FormControl>
                        <Input
                          className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:border-[#f4be42] focus:ring-[#f4be42] transition-all duration-200 bg-white"
                          style={{ color: '#382606' }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium" style={{ color: '#382606' }}>
                        የአስተዳዳሪ ስም
                      </Label>
                      <FormControl>
                        <Input
                          className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:border-[#f4be42] focus:ring-[#f4be42] transition-all duration-200 bg-white"
                          style={{ color: '#382606' }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium" style={{ color: '#382606' }}>
                        የአስተዳዳሪ ኢሜይል
                      </Label>
                      <FormControl>
                        <Input
                          className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:border-[#f4be42] focus:ring-[#f4be42] transition-all duration-200 bg-white"
                          style={{ color: '#382606' }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium" style={{ color: '#382606' }}>
                        የይለፍ ቃል
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:border-[#f4be42] focus:ring-[#f4be42] transition-all duration-200 bg-white pr-10"
                            style={{ color: '#382606' }}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <Label className="text-sm font-medium" style={{ color: '#382606' }}>
                        የይለፍ ቃል አረጋግጥ
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="border-gray-300 rounded-md h-10 px-4 focus:ring-2 focus:border-[#f4be42] focus:ring-[#f4be42] transition-all duration-200 bg-white pr-10"
                            style={{ color: '#382606' }}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Authentication Error Display */}
                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{authError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white h-10 mt-2 font-medium border-0"
                  style={{ backgroundColor: '#f4be42' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "በመመዝገብ ላይ..." : "ድርጅት ይመዝግቡ"}
                </Button>
              </form>
            </Form>

            <p className="text-sm text-center mt-3" style={{ color: '#382606', opacity: 0.8 }}>
              አካውንት አለዎት?{" "}
              <Link className="hover:underline" href="/sign-in" style={{ color: '#f4be42' }}>
                ግባ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
