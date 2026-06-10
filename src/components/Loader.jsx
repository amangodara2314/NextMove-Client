import { Spinner } from "@/components/ui/spinner";

export default function Loader() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Spinner className="size-5" />
    </div>
  );
}
