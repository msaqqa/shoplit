"use client";
import { ProductFormInputs, productFormSchema } from "@/types/products";
import { TCategories } from "@/types/categoryies";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createProduct } from "@/app/actions/products";
import { uploadImageToCloudinary } from "@/services/cloudinary";
import { deleteImageFromCloudinary } from "@/app/actions/cloudinary";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { getCategories } from "@/services/categories";
import { colors, sizes } from "@/constants/products";
import { Spinner } from "../ui/spinner";
import { Plus, Shirt } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";

function AddProduct({ tableBtn = false }) {
  const [categories, setCategories] = useState<TCategories>([]);
  const [isDesabled, setIsDisabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getCategories();
      const categoriesData = (data as { data: TCategories }).data || [];
      setCategories(categoriesData);
    };
    loadData();
  }, []);

  const form = useForm<ProductFormInputs>({
    resolver: zodResolver(productFormSchema),
  });

  const handleProductForm: SubmitHandler<ProductFormInputs> = async (data) => {
    console.log(data);
    setIsProcessing(true);
    await createProduct(data);
    toast.success("Product created successfully");
    setOpenProduct(false);
    setIsProcessing(false);
  };

  return (
    <Sheet open={openProduct} onOpenChange={setOpenProduct}>
      <SheetTrigger asChild>
        <SidebarMenuButton
          className={`cursor-pointer ${tableBtn && "w-auto flex items-center gap-2 bg-blue-500 text-white px-2 py-1 text-sm rounded-md cursor-pointer"}`}
        >
          <Plus />
          <span>Add Product</span>
        </SidebarMenuButton>
      </SheetTrigger>
      <SheetContent
        className="overscroll-contain"
        onWheel={(e) => e.stopPropagation()}
      >
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <Form {...form}>
            <form
              className="px-4 space-y-8"
              onSubmit={form.handleSubmit(handleProductForm)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the short description of the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the description of the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the price of the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Enter the category of the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-4 my-2">
                        {sizes.map((size) => (
                          <div className="flex items-center gap-2" key={size}>
                            <Checkbox
                              id="size"
                              checked={field.value?.includes(size)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                if (checked) {
                                  field.onChange([...currentValues, size]);
                                } else {
                                  field.onChange(
                                    currentValues.filter((v) => v !== size),
                                  );
                                }
                              }}
                            />
                            <label htmlFor="size" className="text-xs">
                              {size}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Select the available sizes for the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {colors.map((color) => (
                            <div
                              className="flex items-center gap-2"
                              key={color}
                            >
                              <Checkbox
                                id="color"
                                checked={field.value?.includes(color)}
                                onCheckedChange={async (checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, color]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== color),
                                    );
                                  }
                                  // كمان نحذف الصورة المرتبطة بهذا اللون
                                  const imagesCopy = {
                                    ...form.getValues().images,
                                  };
                                  const image = imagesCopy[color];
                                  if (image) {
                                    delete imagesCopy[color];
                                    await deleteImageFromCloudinary(image);
                                  }
                                  form.setValue("images", imagesCopy);
                                }}
                              />
                              <label
                                htmlFor="color"
                                className="text-xs flex items-center gap-2"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                {color}
                              </label>
                            </div>
                          ))}
                        </div>
                        {field.value && field.value.length > 0 && (
                          <div className="mt-8 space-y-4">
                            <p className="text-sm font-medium">
                              Upload images for selected colors:
                            </p>
                            {field.value.map((color) => (
                              <div
                                className="flex items-center gap-2"
                                key={color}
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                <span className="text-sm min-w-[60px]">
                                  {color}
                                </span>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  // onChange={(e) => {
                                  //   const file = e.target.files?.[0];
                                  //   if (!file) return;

                                  //   const reader = new FileReader();
                                  //   reader.onloadend = () => {
                                  //     const imagesCopy = {
                                  //       ...form.getValues().images,
                                  //     };
                                  //     imagesCopy[color] = reader.result as string;
                                  //     form.setValue("images", imagesCopy);
                                  //   };
                                  //   reader.readAsDataURL(file);
                                  // }}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      setIsDisabled(true);
                                      const imageUrl =
                                        await uploadImageToCloudinary(file);
                                      const imagesCopy = {
                                        ...form.getValues().images,
                                      };
                                      imagesCopy[color] = imageUrl;
                                      form.setValue("images", imagesCopy);
                                      setIsDisabled(false);
                                    } catch (err) {
                                      console.error("Upload failed", err);
                                    }
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Select the available colors for the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isProcessing || isDesabled}>
                {isProcessing ? (
                  <Spinner className="size-4 animate-spin" />
                ) : null}
                Add product <Shirt className="w-3 h-3" />
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default AddProduct;
