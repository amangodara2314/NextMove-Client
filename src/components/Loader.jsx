import { Spinner } from "@/components/ui/spinner";
import { cn } from "../lib/utils";

export default function Loader({ className }) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Spinner className={cn("size-5", className)} />
    </div>
  );
}
