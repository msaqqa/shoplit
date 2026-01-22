"use client";
import Link from "next/link";
import { AlertCircleIcon, Eye, EyeOff, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { signinUserClient } from "@/services/auth";
import { toast } from "react-toastify";
import useUserStore from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TUser } from "@/types/users";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page() {
  const router = useRouter();
  const { signinUser } = useUserStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formSchema = z.object({
    email: z.email().min(1, "Email is required!"),
    password: z.string(),
    rememberMe: z.boolean().optional(),
  });

  type SigninFormInputs = z.infer<typeof formSchema>;

  const form = useForm<SigninFormInputs>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });
  const onSubmit = async (data: SigninFormInputs) => {
    setIsProcessing(true);
    try {
      const result = await signinUserClient(data);
      const { message, data: user } = result as {
        message: string;
        data: TUser;
      };
      toast.success(message);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      user?.role === "ADMIN" ? router.push("/admin") : router.push("/");
      signinUser(user);
    } catch (error: unknown) {
      setError((error as { message: string }).message);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full md:w-[400px] mx-auto space-y-5"
      >
        <div className="space-y-1.5 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Sign in
          </h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <Alert>
          <InfoIcon size="sm" color="orange" />
          <AlertTitle className="text-accent-foreground">
            For admin access:
          </AlertTitle>
          <AlertDescription className="text-mono font-semibold">
            email: admin@site.com and password: admin123
          </AlertDescription>
        </Alert>

        {/* <div className="flex flex-col gap-3.5">
          <Button variant="outline" type="button" onClick={handleGoogleSignin}>
            <Icons.googleColorful className="size-5! opacity-100!" />{' '}
            Sign in Google
          </Button>
        </div> */}

        {/* <div className="relative py-1.5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div> */}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="test.gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center gap-2.5">
                <FormLabel>password</FormLabel>
                <Link
                  href="/forget-password"
                  className="text-sm font-semibold text-foreground hover:text-primary"
                >
                  Forget password
                </Link>
              </div>
              <div className="relative">
                <Input
                  placeholder="********"
                  type={passwordVisible ? "text" : "password"} // Toggle input type
                  {...field}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
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

        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <>
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />

                <label
                  htmlFor="remember-me"
                  className="text-sm leading-none text-muted-foreground"
                >
                  Remember me
                </label>
              </>
            )}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Button type="submit" className="cursor-pointer">
            {isProcessing ? <Spinner className="size-4 animate-spin" /> : null}
            Sign in
          </Button>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Dont have account?{" "}
          <Link
            href="/signup"
            className="text-sm font-semibold text-foreground hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
}
