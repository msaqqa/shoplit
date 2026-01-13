import ProductInteraction from "@/components/ProductInteraction";
import { geTProductByID } from "@/services/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import React from "react";

// TEMPORARY
// const product: TProduct = {
//   id: 1,
//   name: "Adidas CoreFit T-Shirt",
//   shortDescription:
//     "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//   description:
//     "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//   price: 59.9,
//   sizes: ["xs", "s", "m", "l", "xl"],
//   colors: ["gray", "purple", "green"],
//   images: {
//     gray: "/products/1g.png",
//     purple: "/products/1p.png",
//     green: "/products/1gr.png",
//   },
// };

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}) => {
  const product = await geTProductByID(Number(params.id));
  return {
    title: product?.name,
    describe: product?.description,
  };
};

async function SingleProductPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { size?: string; color?: string };
}) {
  const { id } = params;
  if (Number.isNaN(id)) {
    notFound();
  }
  const product = await geTProductByID(Number(id));
  if (!product) {
    notFound();
  }
  console.log("product", product);
  const size = searchParams?.size;
  const color = searchParams?.color;
  const selectedSize = String(
    size ?? (Array.isArray(product.sizes) ? product.sizes[0] : undefined)
  );
  const selectedColor = String(
    color ?? (Array.isArray(product.colors) ? product.colors[0] : undefined)
  );
  const imageSrc =
    selectedColor && product.images
      ? (product.images as Record<string, string>)[selectedColor]
      : "";

  return (
    <div className="flex flex-col gap-4 lg:flex-row md:gap-12 mt-12">
      {/* IMAGE */}
      <div className="w-full lg:w-5/12 relative aspect-[2/3]">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain rounded-md"
        />
      </div>
      {/* DETAILS */}
      <div className="w-full lg:w-7/12 flex flex-col gap-4">
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="text-gray-500">{product.description}</p>
        <h2 className="text-2xl font-semibold">${product.price.toFixed(2)}</h2>
        <ProductInteraction
          product={{
            ...product,
            sizes: product.sizes as string[],
            colors: product.colors as string[],
            images: product.images as Record<string, string>,
          }}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
        />
        {/* CARD INFO */}
        <div className="flex items-center gap-2 mt-4">
          <Image
            src="/klarna.png"
            alt="klarna"
            width={50}
            height={25}
            className="rounded-md"
          />
          <Image
            src="/cards.png"
            alt="cards"
            width={50}
            height={25}
            className="rounded-md"
          />
          <Image
            src="/stripe.png"
            alt="stripe"
            width={50}
            height={25}
            className="rounded-md"
          />
        </div>
        <p className="text-gray-500 text-xs">
          By clicking Pay Now, you agree to our{" "}
          <span className="underline hover:text-black">Terms & Conditions</span>{" "}
          and <span className="underline hover:text-black">Privacy Policy</span>
          . You authorize us to charge your selected payment method for the
          total amount shown. All sales are subject to our return and{" "}
          <span className="underline hover:text-black">Refund Policies</span>.
        </p>
      </div>
    </div>
  );
}

export default SingleProductPage;
