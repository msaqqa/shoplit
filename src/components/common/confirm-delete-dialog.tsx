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
import { ActionResponse, ActionSuccess } from "@/types/action";
import { TApiErrorResponse } from "@/types/api";

type PossibleResponse<T> =
  | ActionSuccess<T>
  | ActionResponse<T>
  | TApiErrorResponse;

type ConfirmDeleteDialogProps<T> = {
  trigger: ReactNode;
  title?: string;
  description?: string;
  onConfirm: () => Promise<PossibleResponse<T>[]>;
};

function ConfirmDeleteDialog<T>({
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone.",
  onConfirm,
}: ConfirmDeleteDialogProps<T>) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    const results = await onConfirm();
    console.log("results", results);
    // Check and show the errors for each individual row
    let errorCount = 0;
    results.map((res, index) => {
      if ("type" in res && res.type == "error") {
        errorCount++;
        const errorMsg = res.data?.message || "Something went wrong";
        toast.error(`${errorMsg} for item ${index + 1}`);
      } else if ("error" in res && res.error != null) {
        errorCount++;
      }
    });

    if (errorCount === 0) {
      const msg =
        (results[0]?.data as { message: string })?.message ||
        "Deleted successfully";
      toast.success(msg);
      setIsProcessing(false);
    }
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
