"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { verifyOtp } from "@/services/auth";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, "Should be exactly 6 digits long"),
  });

  type EmailFormInput = z.infer<typeof formSchema>;

  const form = useForm<EmailFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: EmailFormInput) => {
    setIsProcessing(true);
    try {
      const res = await verifyOtp({ email, ...data });
      router.replace(
        `/reset-password?email=${email}&token=${(res as { token: string }).token}`,
      );
    } catch (error) {
      setError((error as { message: string }).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="block w-full md:w-[400px] mx-auto space-y-5">
      <div className="space-y-1 pb-3 text-center ">
        <h1 className="text-2xl font-semibold tracking-tight">
          Email Verification
        </h1>
        <p className="text-sm text-muted-foreground">
          Check your email and enter the code received it.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-5"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? <Spinner className="animate-spin" /> : null}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
