import { toast } from "react-toastify";
import { useState } from "react";
import { ActionResponse } from "@/types/action";

export function useAction() {
  const [isProcessing, setIsProcessing] = useState(false);

  const execute = async <T>(
    promise: () => Promise<ActionResponse<T>>,
  ): Promise<ActionResponse<T>> => {
    try {
      setIsProcessing(true);
      const result = await promise();
      const { error } = result;
      if (error) {
        toast.error(error.message);
        return result;
      }
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return { execute, isProcessing };
}
