"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

// Define the form schema with Zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "ኢሜይል ያስፈልጋል።" })
    .email({ message: "እባክዎ ትክክለኛ ኢሜይል አድራሻ ያስገቡ።" }),
  password: z.string().min(1, { message: "የይለፍ ቃል ያስፈልጋል።" }),
  rememberMe: z.boolean().optional().default(false),
});

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string>("");
  const router = useRouter();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setAuthError(""); // Clear previous errors
    
    try {
      console.log("🔐 Sign-in attempt:", { email: values.email, hostname: window.location.hostname });
      
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
          callbackURL: "/dashboard",
          rememberMe: values.rememberMe,
        },
        {
          onSuccess: (ctx) => {
            console.log("✅ Sign-in successful:", ctx);
            toast.success("በተሳካ ሁኔታ ተገብያለህ!");
            router.push("/dashboard");
          },
          onError: (error) => {
            console.error("❌ Sign-in error:", error);
            const errorMessage = error?.error?.message || "ትክክል ያልሆነ ኢሜይል ወይም የይለፍ ቃል። እባክዎ እንደገና ይሞክሩ።";
            setAuthError(errorMessage);
            toast.error(errorMessage);
          },
        }
      );
    } catch (error) {
      console.error("🚨 Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "ያልተጠበቀ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።";
      setAuthError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-8">
          {/* Logo and Header */}
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
            {/* <h2 className="text-2xl font-bold" style={{ color: '#382606' }}>
              የራስዎን ቅጾች ይፍጠሩ
            </h2> */}
            <Link href="/" className="hover:underline text-sm mt-2" style={{ color: '#f4be42' }}>
              ← ወደ ዋና ገጽ ተመለስ
            </Link>
          </div>

          {/* Login Form */}
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="block text-sm font-medium"
                          style={{ color: '#382606' }}
                        >
                          ኢሜይል አድራሻ
                        </Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="w-full bg-white border-gray-300 rounded-md focus:ring-2 focus:border-[#f4be42] focus:ring-[#f4be42]"
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
                      <FormItem className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label
                            htmlFor="password"
                            className="block text-sm font-medium"
                            style={{ color: '#382606' }}
                          >
                            የይለፍ ቃል
                          </Label>
                          <Link
                            href="#"
                            className="text-sm hover:underline"
                            style={{ color: '#f4be42' }}
                          >
                            የይለፍ ቃል ረሳህ?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              className="w-full bg-white border-gray-300 rounded-md focus:ring-2 focus:border-[#f4be42] focus:ring-[#f4be42] pr-10"
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
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            id="remember"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-300 data-[state=checked]:bg-[#f4be42] data-[state=checked]:border-[#f4be42]"
                          />
                        </FormControl>
                        <Label htmlFor="remember" className="text-sm" style={{ color: '#382606' }}>
                          አስታውሰኝ
                        </Label>
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
                    className="w-full text-white border-0"
                    style={{ backgroundColor: '#f4be42' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "በመግባት ላይ..." : "ግባ"}
                  </Button>
                </form>
              </Form>

              <div className="text-center mt-6">
                <p className="text-sm" style={{ color: '#382606', opacity: 0.8 }}>
                  አባል አይደለህም?{" "}
                  <Link href="/register" className="hover:underline" style={{ color: '#f4be42' }}>
                    ድርጅትዎን ይመዝግቡ
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
