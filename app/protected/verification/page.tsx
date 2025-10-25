"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner"; // 1. Import the toast function
import { verifyUvaStudent } from "./actions";

export default function VerificationPage() {
  // --- State Management ---
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // 2. NEW: Add loading state for the submit button
  const [isLoading, setIsLoading] = useState(false);

  // --- Event Handlers (No change) ---
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(newEmail.endsWith("@virginia.edu"));
    if (isOtpSent) {
      setIsOtpSent(false);
      setOtp("");
    }
  };
  const handleEmailBlur = () => {
    setEmailTouched(true);
  };
  const handleSendOtp = () => {
    console.log("Pretending to send OTP to:", email);
    setIsOtpSent(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // Check for the demo OTP
    if (otp !== "123456") {
      toast.error("Invalid OTP. For the demo, use 123456.");
      setIsLoading(false);
      return;
    }

    // 3. Call the Server Action in a try/catch block
    try {
      // This calls your server function
      const result = await verifyUvaStudent(email);

      // Show a SUCCESS toast
      toast.success(result.message);

      // You could redirect here, e.g., router.push("/dashboard")
    } catch (error: any) {
      // Show an ERROR toast if the action throws an error
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Derived State (Updated) ---
  // 4. Update disabled state to include isLoading
  const isSubmitDisabled = otp.length !== 6 || !isEmailValid || isLoading;
  const showEmailError = emailTouched && !isEmailValid;

  return (
    <div className="flex flex-col gap-4 max-w-xs mx-auto p-4">
      <h1>Verify That You Are a UVA Student</h1>
      <div>
        <Input
          type="email"
          placeholder="your-id@virginia.edu"
          value={email}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
          aria-invalid={showEmailError}
          className={showEmailError ? "border-red-500" : ""}
          disabled={isLoading} // Disable input while loading
        />
        {showEmailError && (
          <p className="text-red-500 text-sm mt-1">
            Email must end with @virginia.edu
          </p>
        )}
      </div>

      {!isOtpSent ? (
        <Button
          onClick={handleSendOtp}
          disabled={!isEmailValid || isLoading} // Also disable this
        >
          Send OTP to this Email
        </Button>
      ) : (
        <>
          <p className="text-sm text-muted-foreground text-center">
            Enter the code sent to {email}.
          </p>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {/* 5. Attach the handleSubmit function and show loading state */}
          <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
            {isLoading ? "Verifying..." : "Submit"}
          </Button>
        </>
      )}
    </div>
  );
}
