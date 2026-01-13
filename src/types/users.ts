import { z } from "zod";
// User
export type TUser = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENT";
  avatar?: string | null;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUsers = TUser[];

export const userFormSchema = z.object({
  name: z.string().min(1, { message: "User name is required!" }),
  password: z.string().min(1, { message: "password is required!" }),
  email: z.email().min(1, "Email is required!"),
  avatar: z.string().optional(),
});

export type UserFormInputs = z.infer<typeof userFormSchema>;

// User store
export type TUserStoreState = {
  user: TUser | object;
  hasHydrated: boolean;
};

export type TUserStoreActions = {
  signinUser: (user: TUser) => void;
  signoutUser: () => void;
};
