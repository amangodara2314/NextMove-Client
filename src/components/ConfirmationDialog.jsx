import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ConfirmationDialog({
  handleConfirm = () => {},
  handleCancel = () => {},
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",
  children,
  triggerButtonProps = {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleConfirmClick = async () => {
    setLoading(true);
    await handleConfirm();
    setIsOpen(false);
    setLoading(false);
  };

  const handleCancelClick = () => {
    handleCancel();
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger {...triggerButtonProps}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button onClick={handleCancelClick} variant="outline">
                Cancel
              </Button>
            }
          />
          <Button type="submit" onClick={handleConfirmClick} disabled={loading}>
            {loading ? "Processing..." : "Proceed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
