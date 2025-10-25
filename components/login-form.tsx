"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image"; // <-- 1. Import next/image
import { FcGoogle } from "react-icons/fc"; // <-- 2. Import a Google icon

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/protected`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          {/* 3. Added your app branding here */}
          {/* Changed to flex-col and items-center to stack and center them */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <Image src="/logo.svg" alt="Hoo Path icon" width={100} height={100} className="rounded-lg"/>
          </div>

          {/* Added text-center to these for a consistent look */}
          <CardTitle className="text-xl text-center">Welcome!</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSocialLogin}>
            <div className="flex flex-col gap-6">
              {error && <p className="text-sm text-destructive-500">{error}</p>}
              {/* 4. Styled the button */}
              <Button
                variant="outline" // <-- Makes it white with a border
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    <FcGoogle className="mr-2 h-5 w-5" />{" "}
                    {/* <-- Google icon */}
                    Continue with Google
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
