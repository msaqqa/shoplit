import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { getOrders } from "@/app/actions/orders";
import { getProducts } from "@/app/actions/products";
import { TOrders } from "@/types/orders";
import { TProducts } from "@/types/products";
import Image from "next/image";

// const PopuarProducts = [
//   {
//     id: 1,
//     name: "Adidas CoreFit T-Shirt",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 39.9,
//     sizes: ["s", "m", "l", "xl", "xxl"],
//     colors: ["gray", "purple", "green"],
//     images: {
//       gray: "/products/1g.png",
//       purple: "/products/1p.png",
//       green: "/products/1gr.png",
//     },
//   },
//   {
//     id: 2,
//     name: "Puma Ultra Warm Zip",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 59.9,
//     sizes: ["s", "m", "l", "xl"],
//     colors: ["gray", "green"],
//     images: { gray: "/products/2g.png", green: "/products/2gr.png" },
//   },
//   {
//     id: 3,
//     name: "Nike Air Essentials Pullover",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 69.9,
//     sizes: ["s", "m", "l"],
//     colors: ["green", "blue", "black"],
//     images: {
//       green: "/products/3gr.png",
//       blue: "/products/3b.png",
//       black: "/products/3bl.png",
//     },
//   },
//   {
//     id: 4,
//     name: "Nike Dri Flex T-Shirt",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 29.9,
//     sizes: ["s", "m", "l"],
//     colors: ["white", "pink"],
//     images: { white: "/products/4w.png", pink: "/products/4p.png" },
//   },
//   {
//     id: 5,
//     name: "Under Armour StormFleece",
//     shortDescription:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     description:
//       "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
//     price: 49.9,
//     sizes: ["s", "m", "l"],
//     colors: ["red", "orange", "black"],
//     images: {
//       red: "/products/5r.png",
//       orange: "/products/5o.png",
//       black: "/products/5bl.png",
//     },
//   },
// ];

// const latestTransactions = [
//   {
//     id: 1,
//     title: "Order Payment",
//     badge: "John Doe",
//     image:
//       "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 1400,
//   },
//   {
//     id: 2,
//     title: "Payment for Services",
//     badge: "Jane Smith",
//     image:
//       "https://images.pexels.com/photos/4969918/pexels-photo-4969918.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 2100,
//   },
//   {
//     id: 3,
//     title: "Order Payment",
//     badge: "Michael Johnson",
//     image:
//       "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 1300,
//   },
//   {
//     id: 4,
//     title: "Payment for Services",
//     badge: "Lily Adams",
//     image:
//       "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 2500,
//   },
//   {
//     id: 5,
//     title: "Order Payment",
//     badge: "Sam Brown",
//     image:
//       "https://images.pexels.com/photos/1680175/pexels-photo-1680175.jpeg?auto=compress&cs=tinysrgb&w=800",
//     count: 1400,
//   },
// ];

async function CardList({ title }: { title: string }) {
  let popuarProducts: TProducts = [];
  let latestTransactions: TOrders = [];
  if (title === "popularProducts") {
    const { data } = await getProducts({
      params: "popularProducts",
    });
    popuarProducts = data as TProducts;
  } else {
    const { data } = await getOrders({ limit: 5 });
    latestTransactions = data as TOrders;
  }
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "popularProducts"
          ? popuarProducts.map((item) => {
              return (
                <Card
                  key={item.id}
                  className="flex-row items-center justify-between gap-4 p-4"
                >
                  <div className="w-12 h-12 rounded-sm relative overflow-hidden">
                    <Image
                      src={Object.values(item.images)[0] || ""}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <CardContent className="flex-1 p-0">
                    <CardTitle className="text-sm font-medium">
                      {item.name}
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="p-0">${item.price}</CardFooter>
                </Card>
              );
            })
          : latestTransactions.map((item) => {
              return (
                <Card key={item.id} className="gap-2 px-4">
                  <CardContent className="p-0">
                    <CardTitle className="text-sm font-medium">
                      {item.email}
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="p-0 flex justify-between">
                    <Badge variant="secondary">{item.status}</Badge>
                    <span>{item.amount / 100}$</span>
                  </CardFooter>
                </Card>
              );
            })}
      </div>
    </div>
  );
}

export default CardList;
