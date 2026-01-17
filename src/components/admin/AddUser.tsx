"use client";
import { UserFormInputs, userFormSchema } from "@/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signupUserClient } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { uploadImage } from "@/lib/cloudinary";
import { useRouter } from "next/navigation";

function AddUser({ onSuccess }: { onSuccess: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [preview, setPreview] = useState("");

  const form = useForm<UserFormInputs>({
    resolver: zodResolver(userFormSchema),
  });

  const handleFileChange = async (
    file?: File,
    onChange?: (value: string) => void
  ) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setPreview(url);
      onChange?.(url);
    } catch (err) {
      console.error(err);
      form.setError("avatar", {
        message: "Failed to upload image. Please try again.",
      });
    }
  };

  const handleUserForm: SubmitHandler<UserFormInputs> = async (data) => {
    console.log(data);
    await signupUserClient(data);
    router.refresh();
    toast.success("User added successfully");
    onSuccess();
  };

  return (
    <SheetContent
      className="overscroll-contain"
      onWheel={(e) => e.stopPropagation()}
    >
      <SheetHeader>
        <SheetTitle className="mb-4">Add User</SheetTitle>
      </SheetHeader>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <Form {...form}>
          <form
            className="px-4 space-y-8"
            onSubmit={form.handleSubmit(handleUserForm)}
          >
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        {preview ? (
                          <AvatarImage src={preview} />
                        ) : (
                          <AvatarFallback>U</AvatarFallback>
                        )}
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        onChange={(e) =>
                          handleFileChange(
                            e?.target?.files?.[0],
                            field.onChange
                          )
                        }
                        className="hidden"
                        id="avatar-upload"
                      />
                      <Button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                      >
                        Upload
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Upload a profile avatar.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter the name of the user.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <Input
                      placeholder="********"
                      type={passwordVisible ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
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
            <Button type="submit">Add user</Button>
          </form>
        </Form>
      </ScrollArea>
    </SheetContent>
  );
}

export default AddUser;
