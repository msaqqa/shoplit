"use client";
import { ProductFormInputs, productFormSchema } from "@/lib/schemas/products";
import { TCategories } from "@/types/categoryies";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
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
import { createProduct, updateProduct } from "@/app/actions/products";
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
import React, { useEffect, useState } from "react";
import { getCategories } from "@/services/categories";
import { colors, sizes } from "@/constants/products";
import { Spinner } from "../ui/spinner";
import { Plus, Shirt } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { TProduct } from "@/types/products";
import { useAction } from "@/hooks/use-action";

function AddProduct({
  tableBtn = false,
  product,
}: {
  tableBtn?: boolean;
  product?: TProduct;
}) {
  const [categories, setCategories] = useState<TCategories>([]);
  const [isImgProcessing, setIsImgProcessing] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const { execute, isProcessing } = useAction();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCategories();
      const categoriesData = (result as { data: TCategories }).data || [];
      setCategories(categoriesData);
    };
    fetchData();
  }, []);

  const form = useForm<ProductFormInputs>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name,
      shortDescription: product?.shortDescription || "",
      description: product?.description || "",
      price: product?.price || 0,
      categoryId: product?.categoryId,
      sizes: (product?.sizes as (typeof sizes)[number][]) || [],
      colors: (product?.colors as (typeof colors)[number][]) || [],
      images: product?.images || {},
    },
  });

  const handleChangeColors = async (
    checked: string | boolean,
    color: string,
    field: ControllerRenderProps<ProductFormInputs, "colors">,
  ) => {
    const currentValues = field.value || [];
    if (checked) {
      field.onChange([...currentValues, color]);
    } else {
      field.onChange(currentValues.filter((v: string) => v !== color));
      // get current images from form state
      const currentImages = form.getValues().images || {};
      // if there's an old image for this color, delete it from Cloudinary
      const oldImageUrl = currentImages[color];
      if (oldImageUrl) {
        delete currentImages[color];
        await deleteImageFromCloudinary(oldImageUrl);
      }
      form.setValue("images", currentImages);
    }
  };

  const handleChangeImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    color: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImgProcessing(true);
    // get current images from form state
    const currentImages = form.getValues().images || {};
    const oldImageUrl = currentImages[color];
    // if there's an old image for this color, delete it from Cloudinary
    if (oldImageUrl) {
      await deleteImageFromCloudinary(oldImageUrl);
    }
    // upload new image to Cloudinary
    const imageUrl = await uploadImageToCloudinary(file);
    const imagesCopy = {
      ...form.getValues().images,
    };
    imagesCopy[color] = imageUrl;
    form.setValue("images", imagesCopy);
    setIsImgProcessing(false);
  };

  const handleProductForm: SubmitHandler<ProductFormInputs> = async (data) => {
    console.log(data);
    const { data: result } = await (product
      ? execute(() => updateProduct(product.id, data))
      : execute(() => createProduct(data)));
    toast.success(result?.message);
    setOpenProduct(false);
  };

  return (
    <Sheet open={openProduct} onOpenChange={setOpenProduct}>
      <SheetTrigger asChild>
        <SidebarMenuButton
          className={`cursor-pointer ${tableBtn && "w-auto flex items-center gap-2 bg-blue-500 text-white px-2 py-1 text-sm rounded-md cursor-pointer"}`}
        >
          {product ? (
            <span>Edit Product</span>
          ) : (
            <>
              <Plus />
              <span>Add Product</span>
            </>
          )}
        </SidebarMenuButton>
      </SheetTrigger>
      <SheetContent
        className="overscroll-contain"
        onWheel={(e) => e.stopPropagation()}
      >
        <SheetHeader>
          <SheetTitle className="mb-4">
            {product ? "Edit" : "Add"} Product
          </SheetTitle>
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
                                onCheckedChange={(checked) =>
                                  handleChangeColors(checked, color, field)
                                }
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
                                  onChange={(e) => handleChangeImage(e, color)}
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
              <Button
                type="submit"
                className="w-full"
                disabled={isImgProcessing || isProcessing}
              >
                Add {product ? "Update" : "Add"} product
                <Shirt className="w-3 h-3" />
                {isProcessing ? (
                  <Spinner className="size-4 animate-spin" />
                ) : null}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export default AddProduct;
