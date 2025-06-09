import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { clothingCategories } from "./../lib/constants";
import { addProduct } from "../lib/api";
import { sizes } from "../lib/constants";

// Validation schema
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    price: z.string()
        .min(1, "Price is required.")
        .refine(val => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Price must be greater than 0."
        }),
    category: z.string().min(1, "Category is required."), // This will be gender (Men/Women)
    subCategory: z.string().min(1, "Subcategory is required."), // This will be clothing type
    bestSeller: z.boolean().default(false),
});

export default function AddProduct() {
    const [images, setImages] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: "",
            category: "",
            subCategory: "",
            bestSeller: false,
        },
    });

    const selectedCategory = form.watch("category");
    const availableSubCategories = clothingCategories
        .find(cat => cat.gender === selectedCategory)?.categories || [];

    const handleImageUpload = (e) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        if (files.length + images.length > 4) {
            toast.error("Maximum 4 images allowed", {
                description: "Please select up to 4 images only",
            });
            return;
        }
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const onSubmit = async (data) => {
        if (images.length === 0) {
            toast.error("Images are required", {
                description: "Please upload at least one image",
            });
            return;
        }

        if (selectedSizes.length === 0) {
            toast.error("Sizes are required", {
                description: "Please select at least one size",
            });
            return;
        }

        const productData = {
            ...data,
            price: parseFloat(data.price),
            images,
            sizes: selectedSizes,
            // For backend, we'll send both category (gender) and subCategory (clothing type)
            category: `${data.category}` // Or format as needed
        };

        const toastId = toast.loading("Adding product...");

        try {
            await addProduct(productData);
            toast.dismiss(toastId);
            toast.success("Product added successfully!", {
                description: `${data.name} has been added to your products.`,
            });

            form.reset();
            setImages([]);
            setSelectedSizes([]);
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Failed to add product", {
                description: error.message || "Please try again later",
            });
        }
    };
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name*</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter product name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description*</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter product description"
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price*</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter price"
                                        step="0.01"
                                        min="0.01"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Product Images* (Max 4)</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        className="h-32 w-full object-cover rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            {images.length < 4 && (
                                <label className="flex items-center justify-center h-32 w-full border-2 border-dashed rounded-md cursor-pointer">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <span className="text-muted-foreground">+ Upload</span>
                                </label>
                            )}
                        </div>
                        <FormDescription>
                            Upload at least one image of your product (max 4)
                        </FormDescription>
                        {images.length === 0 && (
                            <p className="text-sm font-medium text-destructive">
                                At least one image is required
                            </p>
                        )}
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category*</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue("subCategory", ""); // Reset subcategory when category changes
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clothingCategories.map((category) => (
                                            <SelectItem key={category.gender} value={category.gender}>
                                                {category.gender}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subcategory*</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={!selectedCategory}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subcategory" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {availableSubCategories.map((subCat) => (
                                            <SelectItem key={subCat.value} value={subCat.value}>
                                                {subCat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Available Sizes*</FormLabel>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <Button
                                    key={size}
                                    type="button"
                                    variant={selectedSizes.includes(size) ? "default" : "outline"}
                                    onClick={() => toggleSize(size)}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                        <FormDescription>
                            Select at least one size available for this product
                        </FormDescription>
                        {selectedSizes.length === 0 && (
                            <p className="text-sm font-medium text-destructive">
                                At least one size is required
                            </p>
                        )}
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="bestSeller"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Mark as Best Seller</FormLabel>
                                    <FormDescription>
                                        This product will be featured in the best sellers section
                                    </FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Add Product</Button>
                </form>
            </Form>
        </div>
    );
}