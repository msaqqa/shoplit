import ProductList from "@/components/client/ProductList";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton";
import Image from "next/image";
import { Suspense } from "react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const categoryId = (await searchParams).categoryId;

  return (
    <div className="">
      <div className="relative aspect-[3/1] mb-12">
        <Image src="/featured.png" alt="Featured Product" fill priority />
      </div>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList categoryId={categoryId} params="homePage" />
      </Suspense>
    </div>
  );
}
