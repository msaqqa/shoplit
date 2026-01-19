"use client";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/app/actions/orders";
import { toast } from "react-toastify";
import { TProducts } from "@/types/products";
import { TUsers } from "@/types/users";
import { OrderFormInputs, orderFormSchema } from "@/types/orders";
import { getUsers } from "@/services/users";
import { getProducts } from "@/app/actions/products";

const AddOrder = ({ onSuccess }: { onSuccess: () => void }) => {
  const [dataProducts, setProducts] = useState<TProducts>([]);
  const [users, setUsers] = useState<TUsers>([]);

  useEffect(() => {
    const loadData = async () => {
      const productsData = await getProducts();
      const fixedProductsData = productsData.map((product) => ({
        ...product,
        sizes: product.sizes as string[],
        colors: product.colors as string[],
        images: product.images as Record<string, string>,
      }));
      setProducts(fixedProductsData);
      const usersData = await getUsers();
      setUsers(usersData);
    };
    loadData();
  }, []);

  const form = useForm<OrderFormInputs>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      email: "",
      amount: 0,
      status: "pending",
      products: [{ name: "", quantity: 1, price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    if (fields.length > 0 && dataProducts.length > 0) {
      form.setValue("products.0.name", dataProducts[0].name);
      form.setValue("products.0.price", dataProducts[0].price);
    }
  }, [dataProducts, form, fields]);

  const products = form.watch("products");

  useEffect(() => {
    const total = products.reduce((acc, p) => acc + p.quantity * p.price, 0);
    form.setValue("amount", total);
  }, [products, form]);

  const handleOrderForm = async (data: OrderFormInputs) => {
    await createOrder({ ...data, userId: Number(data.userId) });
    toast.success("Order created successfully");
    onSuccess();
  };

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="mb-4">Add Order</SheetTitle>
        <SheetDescription asChild>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleOrderForm)}
            >
              {/* User ID */}
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl className="w-full">
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                          const user = users.find((u) => u.id == Number(value));
                          form.setValue("email", user?.email as string);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select user name" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((u) => (
                            <SelectItem key={u.id} value={String(u.id)}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Email</FormLabel>
                    <FormControl className="w-full">
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem> */}
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount (ReadOnly) */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Products */}
              <h3 className="text-lg font-medium">Products</h3>
              {fields.map((field, index) => (
                <>
                  <div key={field.id} className="flex gap-2 items-end mb-2">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name={`products.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(val) => {
                                field.onChange(val);
                                const selected = dataProducts.find(
                                  (p) => p.name === val
                                );
                                if (selected) {
                                  form.setValue(
                                    `products.${index}.price`,
                                    selected.price
                                  );
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {dataProducts.map((p) => (
                                  <SelectItem key={p.name} value={p.name}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name={`products.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={1}
                              onChange={(e) => {
                                const qty = Number(e.target.value);
                                field.onChange(qty);
                                const currenTProducts =
                                  form.getValues("products");
                                const updatedProducts = currenTProducts.map(
                                  (p, i) =>
                                    i === index ? { ...p, quantity: qty } : p
                                );
                                form.setValue("products", updatedProducts);
                                const total = updatedProducts.reduce(
                                  (acc, p) => acc + p.quantity * p.price,
                                  0
                                );
                                form.setValue("amount", total);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Price */}
                    <FormField
                      control={form.control}
                      name={`products.${index}.price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index > 0 && (
                    <Button
                      variant="destructive"
                      type="button"
                      className="flex w-auto mb-3"
                      onClick={() => remove(index)}
                    >
                      Delete
                    </Button>
                  )}
                </>
              ))}

              <Button
                className="flex w-auto bg-blue-500 text-white"
                type="button"
                onClick={() => append({ name: "", quantity: 1, price: 0 })}
              >
                Add Product
              </Button>

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  );
};

export default AddOrder;
