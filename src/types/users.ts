// User type
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

// Users data type
export type TUsers = TUser[];

// User store type
export type TUserStoreState = {
  user: TUser | null;
  hasHydrated: boolean;
};

// User store actions type
export type TUserStoreActions = {
  signinUser: (user: TUser) => void;
  signoutUser: () => void;
};
