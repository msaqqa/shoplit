"use client";
import {
  TUser,
  updateUserSchema,
  UserFormInputs,
  userFormSchema,
  UserUpdateInputs,
} from "@/types/users";
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
import { Edit, Eye, EyeOff, Plus } from "lucide-react";
import { signupUserClient } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { uploadImage } from "@/lib/cloudinary";
import { useRouter } from "next/navigation";
import { updateUserById } from "@/app/actions/users";
import { SidebarMenuButton } from "../ui/sidebar";

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

  const handleUserForm: SubmitHandler<
    UserFormInputs | UserUpdateInputs
  > = async (data: UserFormInputs | UserUpdateInputs) => {
    const updatedUser = {
      ...user,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
    console.log(data);
    await (user && user.id
      ? updateUserById(user.id, updatedUser)
      : signupUserClient(data as UserFormInputs));
    toast.success("User added successfully");
    setOpen(false);
    router.refresh();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SidebarMenuButton
          className={`cursor-pointer ${tableBtn && "w-auto flex items-center gap-2 bg-blue-500 text-white px-2 py-1 text-sm rounded-md cursor-pointer"}`}
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
        </SidebarMenuButton>
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
                          Upload
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
              <Button type="submit">{user ? "Update" : "Add"} user</Button>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default AddUser;
