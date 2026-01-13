import ProductList from "@/components/ProductList";
import Image from "next/image";

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) => {
  const categoryId = (await searchParams).categoryId;

  return (
    <div className="">
      <div className="relative aspect-[3/1] mb-12">
        <Image src="/featured.png" alt="Featured Product" fill />
      </div>
      <ProductList categoryId={categoryId} params="homePage" />
    </div>
  );
};

export default HomePage;
