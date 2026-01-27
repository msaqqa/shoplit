import AccountForm from "@/components/client/AccountForm";

export const metadata = {
  title: "Account",
  robots: {
    index: false,
    follow: false,
  },
};

const AccountPage = () => {
  return <AccountForm />;
};

export default AccountPage;
