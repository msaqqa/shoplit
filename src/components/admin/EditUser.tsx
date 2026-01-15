"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "react-toastify";
import { uploadImage } from "@/lib/cloudinary";
import { updateUserById } from "@/services/users";
import { TUser } from "@/types/users";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  avatar: z.string().optional(),
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters!" })
    .max(50),
  email: z.string().email({ message: "Invalid email address!" }),
  // phone: z.string().min(10).max(15),
  // address: z.string().min(2),
  // city: z.string().min(2),
});

const EditUser = ({ user }: { user: TUser }) => {
  console.log("userrrrrrrrrr", user);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: user.avatar || "",
      name: user.name,
      email: user.email,
      // phone: "+1 234 5678",
      // address: "123 Main St",
      // city: "New York",
    },
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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const updatedUser: TUser = {
      ...user,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
    await updateUserById(user.id, updatedUser);
    router.refresh();
    setOpen(false);
    toast.success("User updated successfully!");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Edit User</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto max-w-lg">
        <SheetHeader>
          <SheetTitle className="mb-4">Edit User</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit(onSubmit)}
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
                      <FormDescription>
                        Upload a profile avatar.
                      </FormDescription>
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
                      <FormDescription>Enter user name.</FormDescription>
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
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Only admin can see your email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Phone */}
                {/* <FormField
                control={form.control}
                name=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Only admin can see your phone number (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                {/* Address */}
                {/* <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter user address (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

                {/* City */}
                {/* <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter user city (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default EditUser;
