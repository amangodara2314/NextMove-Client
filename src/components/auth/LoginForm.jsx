import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/authSchema";
import GoogleAuthButton from "./GoogleAuthButton";
import { ChessKnightIcon } from "lucide-react";

export function LoginForm({
  className,
  submitHandler,
  handleGoogleSignupSuccess,
  handleGoogleSignupError,
  ...props
}) {
  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0">
          <form
            onSubmit={handleSubmit((data) => submitHandler(data, setError))}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <ChessKnightIcon className="size-16" />
                <h1 className="text-2xl font-semibold">NextMove</h1>
                <p className="text-balance text-muted-foreground">
                  Multiplayer Chess Game
                </p>
              </div>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                continue with
              </FieldSeparator>
              <GoogleAuthButton
                handleOnSuccess={handleGoogleSignupSuccess}
                handleOnError={handleGoogleSignupError}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
