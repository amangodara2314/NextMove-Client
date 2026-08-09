import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { otpSchema } from "../../validations/authSchema";

const RESEND_COOLDOWN_SECONDS = 30;

export function OtpStep({ email, onVerifyOtp, onResendOtp, onBack }) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data) => {
    try {
      await onVerifyOtp({ email, otp: data.otp });
    } catch (error) {
      setError("root", {
        message: error?.message || "That code didn't work. Please try again.",
      });
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      await onResendOtp?.(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      setError("root", {
        message: error?.message || "Couldn't resend the code. Try again.",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <p className="text-balance text-muted-foreground">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <Field className="items-center">
          <FieldLabel htmlFor="otp" className="sr-only">
            One-time code
          </FieldLabel>
          <Controller
            control={control}
            name="otp"
            render={({ field }) => (
              <InputOTP
                id="otp"
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isSubmitting}
                aria-invalid={!!errors.otp}
              >
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
            )}
          />
          {errors.otp && (
            <FieldError className="text-center">
              {errors.otp.message}
            </FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify & continue"}
          </Button>
          {errors.root && (
            <FieldError className="text-center">
              {errors.root.message}
            </FieldError>
          )}
        </Field>

        <FieldDescription className="text-center">
          Didn&apos;t get the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending}
            className="underline-offset-2 hover:underline disabled:no-underline disabled:opacity-50"
          >
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : resending
                ? "Sending..."
                : "Resend code"}
          </button>
        </FieldDescription>

        <FieldDescription className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="underline-offset-2 hover:underline"
          >
            Use a different email
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
