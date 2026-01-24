"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { resetPassword } from "@/services/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Alert, AlertTitle } from "@/components/ui/alert";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);
  const [error, setError] = useState<string | null>(null);

  const formSchema = z
    .object({
      newPassword: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
          "Password must contains uppercase, lowercase and special character",
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  type PasswordFormInputs = z.infer<typeof formSchema>;

  const form = useForm<PasswordFormInputs>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: PasswordFormInputs) => {
    setIsProcessing(true);
    try {
      const res = (await resetPassword({ ...data, token, email })) as {
        message: string;
      };
      toast.success(res.message);
      router.replace("/signin");
    } catch (error) {
      setError((error as { message: string }).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="block w-full md:w-[400px] mx-auto space-y-5">
      <div className="space-y-1.5 pb-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          Reset Password
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {passwordVisible ? (
                      <EyeOff className="text-muted-foreground" />
                    ) : (
                      <Eye className="text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={passwordConfirmationVisible ? "text" : "password"}
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setPasswordConfirmationVisible(
                        !passwordConfirmationVisible,
                      )
                    }
                    className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                    aria-label={
                      passwordConfirmationVisible
                        ? "Hide password confirmation"
                        : "Show password confirmation"
                    }
                  >
                    {passwordConfirmationVisible ? (
                      <EyeOff className="text-muted-foreground" />
                    ) : (
                      <Eye className="text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? <Spinner className="size-4 animate-spin" /> : null}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
