"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { createOrder, updateOrder } from "@/app/actions/orders";
import { toast } from "react-toastify";
import { TProducts } from "@/types/products";
import { TUsers } from "@/types/users";
import { OrderFormInputs, orderFormSchema } from "@/lib/schemas/orders";
import { getProducts } from "@/app/actions/products";
import { getUsers } from "@/app/actions/users";
import { Spinner } from "../ui/spinner";
import { Plus, ShoppingBasket } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { useAction } from "@/hooks/use-action";
import { TOrder } from "@/types/orders";

function AddOrder({
  tableBtn = false,
  order,
}: {
  tableBtn?: boolean;
  order?: TOrder;
}) {
  const [dataProducts, setProducts] = useState<TProducts>([]);
  const [users, setUsers] = useState<Omit<TUsers, "password">>([]);
  const [open, setOpen] = useState(false);
  const { execute, isProcessing } = useAction();

  useEffect(() => {
    const fetchData = async () => {
      const { data: productsData } = await getProducts();
      const fixedProductsData = (productsData?.data ?? []).map((product) => ({
        ...product,
        sizes: product.sizes as string[],
        colors: product.colors as string[],
        images: product.images as Record<string, string>,
      }));
      setProducts(fixedProductsData);
      const { data: usersData } = await getUsers();
      setUsers(usersData?.data ?? []);
    };
    fetchData();
  }, []);

  const form = useForm<OrderFormInputs>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      userId: order?.userId,
      email: order?.email,
      amount: order?.amount,
      status: order?.status || "success",
      products: order?.products || [{ name: "", quantity: 1, price: 0 }],
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
    const { data: result } = await (order
      ? execute(() => updateOrder(order.id, data))
      : execute(() =>
          createOrder({
            ...data,
            userId: Number(data.userId),
          }),
        ));
    toast.success(result?.message);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SidebarMenuButton
          className={`cursor-pointer ${tableBtn && "w-auto flex items-center gap-2 bg-blue-500 text-white px-2 py-1 text-sm rounded-md cursor-pointer"}`}
        >
          {order ? (
            <span>Edit Order</span>
          ) : (
            <>
              <Plus />
              <span>Add Order</span>
            </>
          )}
        </SidebarMenuButton>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="mb-4">
            {order ? "Update" : "Add"} Order
          </SheetTitle>
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
                          value={String(order ? order?.userId : field.value)}
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            const user = users.find(
                              (u) => u.id == Number(value),
                            );
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
                                  // 1. Update the product name in the form field
                                  field.onChange(val);
                                  // 2. Find the selected product details from the source data
                                  const selected = dataProducts.find(
                                    (p) => p.name === val,
                                  );
                                  if (selected) {
                                    // 3. Set default values for the selected row
                                    form.setValue(
                                      `products.${index}.price`,
                                      selected.price,
                                    );
                                    form.setValue(
                                      `products.${index}.quantity`,
                                      1,
                                    );
                                    const currentProducts =
                                      form.getValues("products");
                                    const updatedProducts = currentProducts.map(
                                      (p, i) =>
                                        i === index
                                          ? {
                                              ...p,
                                              name: val,
                                              price: selected.price,
                                              quantity: 1,
                                            }
                                          : p,
                                    );
                                    const total = updatedProducts.reduce(
                                      (acc, p) =>
                                        acc +
                                        (Number(p.quantity) || 0) *
                                          (Number(p.price) || 0),
                                      0,
                                    );
                                    form.setValue("amount", total);
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
                                      i === index ? { ...p, quantity: qty } : p,
                                  );
                                  form.setValue("products", updatedProducts);
                                  const total = updatedProducts.reduce(
                                    (acc, p) => acc + p.quantity * p.price,
                                    0,
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
                  onClick={() => append({ name: "", quantity: 0, price: 0 })}
                >
                  Add Product
                </Button>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {order ? "Update" : "Add"} order
                  <ShoppingBasket className="w-3 h-3" />
                  {isProcessing ? (
                    <Spinner className="size-4 animate-spin" />
                  ) : null}
                </Button>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default AddOrder;
