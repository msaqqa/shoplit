"use client";
import {
  updateUserSchema,
  UserFormInputs,
  userFormSchema,
  UserUpdateInputs,
} from "@/lib/schemas/users";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { Edit, Eye, EyeOff, Plus, User } from "lucide-react";
import { signupUserClient } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { uploadImageToCloudinary } from "@/services/cloudinary";
import { useRouter } from "next/navigation";
import { updateUserById } from "@/app/actions/users";
import { Spinner } from "../ui/spinner";
import { TUser } from "@/types/users";
import { deleteImageFromCloudinary } from "@/app/actions/cloudinary";
import useUserStore from "@/stores/userStore";
import { useAction } from "@/hooks/use-action";

function AddUser({
  user,
  tableBtn = false,
}: {
  user?: TUser;
  tableBtn?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [open, setOpen] = useState(false);
  const [isImgProcessing, setIsImgProcessing] = useState(false);
  const { signinUser } = useUserStore();
  const { execute, isProcessing } = useAction();

  const form = useForm<UserFormInputs | UserUpdateInputs>({
    resolver: zodResolver(user ? updateUserSchema : userFormSchema),
    defaultValues: {
      avatar: user?.avatar || "",
      name: user?.name,
      email: user?.email,
      // phone: "+1 234 5678",
      // address: "123 Main St",
      // city: "New York",
    },
  });

  const handleFileChange = async (
    file?: File,
    onChange?: (value: string) => void,
  ) => {
    if (!file) return;
    try {
      setIsImgProcessing(true);
      // get current image from form state
      const oldImageUrl = form.getValues().avatar;
      // if there's an old image for this color, delete it from Cloudinary
      if (oldImageUrl) {
        await deleteImageFromCloudinary(oldImageUrl);
      }
      // upload new image to Cloudinary
      const url = await uploadImageToCloudinary(file);
      setPreview(url);
      onChange?.(url);
    } catch (err) {
      console.error(err);
      form.setError("avatar", {
        message: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsImgProcessing(false);
    }
  };

  const handleUserForm: SubmitHandler<
    UserFormInputs | UserUpdateInputs
  > = async (data: UserFormInputs | UserUpdateInputs) => {
    const updatedUser = {
      ...user,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
    if (user && user.id) {
      const { data: result } = await execute(() =>
        updateUserById(user.id, updatedUser),
      );
      if (result && result.data) {
        toast.success(result?.message);
        signinUser(result.data);
      }
    } else {
      const result = await signupUserClient(data as UserFormInputs);
      toast.success((result as { message?: string }).message);
    }
    setOpen(false);
    router.refresh();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={`justify-start gap-2 px-2 ${tableBtn ? "bg-blue-500 text-white hover:bg-blue-600" : ""}`}
        >
          {user ? (
            <>
              <Edit />
              <span>Edit User</span>
            </>
          ) : (
            <>
              <Plus />
              <span>Add User</span>
            </>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[400px] sm:w-[540px] overflow-y-auto"
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
              {/* Avatar Field */}
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
                              field.onChange,
                            )
                          }
                          className="hidden"
                          id="avatar-upload"
                        />
                        <Button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                        >
                          Upload{" "}
                          {isImgProcessing ? (
                            <Spinner className="size-4 animate-spin" />
                          ) : null}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>Upload a profile avatar.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the user.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email Field */}
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
              {/* Password Field */}
              {!user && (
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
              )}
              <Button
                disabled={isImgProcessing || isProcessing}
                type="submit"
                className="w-full"
              >
                {user ? "Update" : "Add"} user
                <User className="w-3 h-3" />
                {isProcessing ? (
                  <Spinner className="size-4 animate-spin" />
                ) : null}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default AddUser;
