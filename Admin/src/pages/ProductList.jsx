import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { deleteProduct, getProducts } from "../lib/api";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const data = await getProducts();
                setProducts(data.products);
            } catch (err) {
                setError(err.message);
                toast.error("Failed to load products", {
                    description: err.message || "Please try again later",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            const toastId = toast.loading("Deleting product...");

            await deleteProduct(productId);

            // Update the UI by removing the deleted product
            setProducts(prev => prev.filter(product => product._id !== productId));

            toast.dismiss(toastId);
            toast.success("Product deleted successfully");
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to delete product", {
                description: err.message || "Please try again later",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>No products found. Add some products to get started.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Product List</h1>

            <Table>
                <TableCaption>A list of your products.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Sizes</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                {product.images?.length > 0 && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="h-16 w-16 object-cover rounded"
                                    />
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    {product.sizes?.map(size => (
                                        <span key={size} className="px-2 py-1 bg-gray-100 rounded text-sm">
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}