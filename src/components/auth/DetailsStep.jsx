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

export function DetailsStep({ onGoogleSignup, onSendOtp, onSuccess }) {
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
          {/* Google path never touches the OTP step - onGoogleSignup is a plain
              callback so you can wire in redirect / popup / SDK logic. */}
          <Button variant="outline" type="button" onClick={onGoogleSignup}>
            <GoogleIcon />
            Sign up with Google
          </Button>
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

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="size-4"
    >
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        fill="currentColor"
      />
    </svg>
  );
}
