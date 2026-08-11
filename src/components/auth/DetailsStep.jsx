import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema } from "../../validations/authSchema";
import GoogleAuthButton from "./GoogleAuthButton";

export function DetailsStep({
  onGoogleSignupSuccess,
  onGoogleSignupError,
  onSendOtp,
  onSuccess,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // Email/password path: create the pending user, trigger the OTP email,
  // then hand off to the OTP step.
  const onSubmit = async (data) => {
    try {
      await onSendOtp(data);
      onSuccess({ fullName: data.username, email: data.email });
    } catch (error) {
      setError("root", {
        message: error?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 grid-cols-2">
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-balance text-muted-foreground">
            Join{" "}
            <span className="text-primary font-semibold text-lg">NextMove</span>{" "}
            in a couple of steps
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            placeholder="Jane Doe"
            {...register("username")}
          />
          {errors.username && (
            <FieldError>{errors.username.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="myaccount@example.com"
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••"
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending code..." : "Continue"}
          </Button>
          {errors.root && (
            <FieldError className="text-center">
              {errors.root.message}
            </FieldError>
          )}
        </Field>

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Or continue with
        </FieldSeparator>

        <Field>
          <GoogleAuthButton
            handleOnSuccess={onGoogleSignupSuccess}
            handleOnError={onGoogleSignupError}
          />
        </Field>

        <FieldDescription className="text-center">
          Already have an account? <Link to="/login">Login</Link>
        </FieldDescription>
      </FieldGroup>
      <div className="w-full h-full border border-border">
        Add a pawn image here
      </div>
    </form>
  );
}
