import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { DetailsStep } from "./DetailsStep";
import { OtpStep } from "./OtpStep";

const STEPS = [
  { key: "details", label: "Your details" },
  { key: "otp", label: "Verify email" },
];

export function RegisterForm({
  className,
  onGoogleSignupSuccess,
  onGoogleSignupError,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
  ...props
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [registrationData, setRegistrationData] = useState(null);
  const step = STEPS[stepIndex].key;

  const goToOtpStep = (data) => {
    setRegistrationData(data);
    setStepIndex(1);
  };

  const goBackToDetails = () => setStepIndex(0);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="">
          <div className="p-6 md:p-8">
            <StepProgress steps={STEPS} currentIndex={stepIndex} />

            {step === "details" && (
              <DetailsStep
                onGoogleSignupSuccess={onGoogleSignupSuccess}
                onGoogleSignupError={onGoogleSignupError}
                onSendOtp={onSendOtp}
                onSuccess={goToOtpStep}
              />
            )}

            {step === "otp" && (
              <OtpStep
                email={registrationData?.email}
                onVerifyOtp={onVerifyOtp}
                onResendOtp={onResendOtp}
                onBack={goBackToDetails}
              />
            )}
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

function StepProgress({ steps, currentIndex }) {
  return (
    <div className="mb-6 flex items-center gap-2" aria-hidden="true">
      {steps.map((s, i) => (
        <div
          key={s.key}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i <= currentIndex ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}
