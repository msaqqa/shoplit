"use client";
import { ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import { Spinner } from "../ui/spinner";

type ConfirmDeleteDialogProps = {
  trigger: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => Promise<void>;
  showToast?: boolean;
};

function ConfirmDeleteDialog({
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  onConfirm,
  showToast = true,
}: ConfirmDeleteDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm();
    if (showToast) {
      toast.success("Deleted successfully");
    }
    setIsProcessing(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="w-[100px]">Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-[100px] bg-red-400 text-white px-2 py-1 text-sm cursor-pointer hover:bg-red-500"
          >
            {isProcessing ? (
              <>
                <Spinner className="size-4 animate-spin" /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDeleteDialog;
