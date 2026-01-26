import ProductList from "@/components/client/ProductList";
import Image from "next/image";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const categoryId = (await searchParams).categoryId;

  return (
    <div className="">
      <div className="relative aspect-[3/1] mb-12">
        <Image src="/featured.png" alt="Featured Product" fill />
      </div>
      <ProductList categoryId={categoryId} params="homePage" />
    </div>
  );
}
