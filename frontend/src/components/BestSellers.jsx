import { Button } from "@/components/ui/button";
import ProductItem from "./ProductItem";
import { useShopContext } from "../context/ShopContext";
import { useEffect, useState } from "react";

const BestSellers = () => {
    const { products } = useShopContext();

    const [bestSellers, setBestSeller] = useState([]);
    // Filter to only include best sellers
    useEffect(() => {
        const bestSellingProducts = products.filter(product => product.bestSeller);
        setBestSeller(bestSellingProducts);
    }, [products]);

    if (bestSellers.length === 0) {
        return (
            <section className="py-12 ">
                <div className="container px-4 text-center">
                    <h2 className="text-5xl font-bold mb-2">Best Sellers</h2>
                    <p className="text-muted-foreground mb-6">No best sellers available at the moment</p>
                    <Button variant="outline" className="px-8 py-4">
                        View All Products
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 ">
            <div className="text-center mb-12">
                <h2 className="text-5xl font-bold mb-2">Best Sellers</h2>
                <p className="text-muted-foreground">Shop our most popular products</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSellers.map((product) => (
                    <ProductItem
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            <div className="text-center mt-10">
                <Button variant="outline" className="px-8 py-4">
                    View All Best Sellers
                </Button>
            </div>
        </section>
    );
};

export default BestSellers;