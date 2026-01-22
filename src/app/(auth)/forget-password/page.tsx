"use client";
import Link from "next/link";
import { AlertCircleIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { forgetPassword } from "@/services/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formSchema = z.object({
    email: z.email({ message: "Please enter a valid email address." }),
  });

  type ForgetPasswordFormInputs = z.infer<typeof formSchema>;

  const form = useForm<ForgetPasswordFormInputs>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: ForgetPasswordFormInputs) => {
    setIsProcessing(true);
    try {
      await forgetPassword(data);
      router.push(`/verify-otp?email=${data.email}`);
    } catch (error) {
      setError((error as { message: string }).message);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="block w-full md:w-[400px] mx-auto space-y-5">
      <div className="space-y-1.5 pb-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Forget Password
        </h1>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="johndoe@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2.5">
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <Spinner className="size-4 animate-spin" />
              ) : null}
              Submit
            </Button>
          </div>

          <div className="space-y-3">
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link href="/signin">
                <ArrowLeft className="size-3.5" /> Back
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
