import { Button } from "@/components/ui/button";
import ProductItem from "./ProductItem";
import { useShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const LatestCollection = () => {
    const { products = [] } = useShopContext();

    // Sort products by date (newest first) and take the first 8
    const newestProducts = [...products]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

    return (
        <section
            className="py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 4 }}
        >
            <AnimatedSection>
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold mb-2">Latest Collections</h2>
                    <p className="text-muted-foreground">Discover our newest arrivals</p>
                </div>
            </AnimatedSection>


            {newestProducts.length > 0 ? (
                <>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newestProducts.map((product) => (
                            <AnimatedSection
                                key={product._id}  // Using _id from your product structur
                            >
                                <ProductItem
                                    key={product._id}  // Using _id from your product structure
                                    product={product}
                                />
                            </AnimatedSection>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/collection" className="inline-block">
                            <Button variant="outline" className="px-8 py-4">
                                View All Products
                            </Button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No new products available at the moment.</p>
                </div>
            )}
        </section>


    );
};

export default LatestCollection;