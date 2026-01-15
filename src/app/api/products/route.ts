import { NextResponse } from "next/server";

const products = [
  {
    id: 1,
    name: "Adidas CoreFit T-Shirt",
    category: "T-shirts", // تصنيف القمصان
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit...",
    price: 39.9,
    sizes: ["s", "m", "l", "xl", "xxl"],
    colors: ["gray", "purple", "green"],
    images: {
      gray: "/products/1g.png",
      purple: "/products/1p.png",
      green: "/products/1gr.png",
    },
  },
  {
    id: 2,
    name: "Puma Ultra Warm Zip",
    category: "Jackets", // تصنيف السترات (بسبب الـ Zip والتدفئة)
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit...",
    price: 59.9,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "green"],
    images: { gray: "/products/2g.png", green: "/products/2gr.png" },
  },
  {
    id: 3,
    name: "Nike Air Essentials Pullover",
    category: "Jackets", // الـ Pullover غالباً ما يصنف مع السترات أو الملابس العلوية الثقيلة
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit...",
    price: 69.9,
    sizes: ["s", "m", "l"],
    colors: ["green", "blue", "black"],
    images: {
      green: "/products/3gr.png",
      blue: "/products/3b.png",
      black: "/products/3bl.png",
    },
  },
  {
    id: 4,
    name: "Nike Dri Flex T-Shirt",
    category: "T-shirts",
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit...",
    price: 29.9,
    sizes: ["s", "m", "l"],
    colors: ["white", "pink"],
    images: { white: "/products/4w.png", pink: "/products/4p.png" },
  },
  {
    id: 5,
    name: "Under Armour StormFleece",
    category: "Jackets", // الـ Fleece يعتبر نوع من السترات الرياضية
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit...",
    price: 49.9,
    sizes: ["s", "m", "l"],
    colors: ["red", "orange", "black"],
    images: {
      red: "/products/5r.png",
      orange: "/products/5o.png",
      black: "/products/5bl.png",
    },
  },
  {
    id: 6,
    name: "Nike Air Max 270",
    category: "Shoes", // تصنيف الأحذية
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit...",
    price: 59.9,
    sizes: ["40", "42", "43", "44"],
    colors: ["gray", "white"],
    images: { gray: "/products/6g.png", white: "/products/6w.png" },
  },
  {
    id: 7,
    name: "Nike Ultraboost Pulse",
    category: "Shoes",
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit...",
    price: 69.9,
    sizes: ["40", "42", "43"],
    colors: ["gray", "pink"],
    images: { gray: "/products/7g.png", pink: "/products/7p.png" },
  },
  {
    id: 8,
    name: "Levi’s Classic Denim",
    category: "Jackets", // الـ Denim (الجينز) غالباً ما يكون سترة (Denim Jacket)
    shortDescription: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
    description: "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit...",
    price: 59.9,
    sizes: ["s", "m", "l"],
    colors: ["blue", "green"],
    images: { blue: "/products/8b.png", green: "/products/8gr.png" },
  },
];

export async function GET() {
  // const { searchParams } = new URL(req.url);
  // const categoryId = searchParams.get("categoryId");

  return NextResponse.json(products);
  // return NextResponse.json(
  //   categoryId
  //     ? products.filter((p) => p.categoryId === Number(categoryId))
  //     : products
  // );
}
