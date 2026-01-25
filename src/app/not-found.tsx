import Link from "next/link";

function NotFoundPage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-medium mb-4">This page not found</h1>
      <p className="text-md">
        click on the{" "}
        <Link href="/signin" className="text-yellow-500">
          Signin
        </Link>{" "}
        to show it
      </p>
    </div>
  );
}

export default NotFoundPage;
