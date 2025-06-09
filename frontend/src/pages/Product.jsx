import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useShopContext } from '../context/ShopContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner'; // Add this import at the top
import { useUser } from '../context/UserContext';
import AnimatedSection from '../components/AnimatedSection';

const Product = () => {
    const { productId: id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { user } = useUser();

    const { addToCart, currency } = useShopContext();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data.product);
                if (data.product.sizes && data.product.sizes.length > 0) {
                    setSelectedSize(data.product.sizes[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        if (!user) {
            toast.warning('Please log in to add items to your cart');
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        try {
            await addToCart(product._id, quantity, {
                size: selectedSize
            });

            toast.success(`${product.name} added to cart!`, {
                description: `${quantity} x ${product.name} (${selectedSize})`,
                action: {
                    label: 'View Cart',
                    onClick: () => window.location.href = '/cart'
                }
            });
        } catch (error) {
            toast.error('Failed to add to cart', {
                description: error.message || 'Please try again'
            });
        }
    };

    const nextImage = () => {
        if (!product) return;
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        if (!product) return;
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    if (loading) {
        return (
            <div className=" py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Skeleton className="aspect-square w-full" />
                        <div className="grid grid-cols-4 gap-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="aspect-square w-full" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500">{error}</p>
                <Button variant="link" className="mt-4" asChild>
                    <Link to="/products">
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Back to Products
                    </Link>
                </Button>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    // Format price with currency
    const formatPrice = (price) => {
        return (price).toFixed(2); // Assuming price is in cents
    };

    return (
        <AnimatedSection>
            <div className=" py-8">
                <Button variant="link" className="pl-0 mb-6" asChild>
                    <Link to="/collection">
                        <ChevronLeft className="h-5 w-5 mr-2" />
                        Back to Collection
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square overflow-hidden rounded-lg">
                            <img
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                className=" w-full h-full object-cover transition-transform duration-300"
                            />

                            {/* Navigation Arrows - only show if multiple images */}
                            {product.images.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                                        onClick={prevImage}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                                        onClick={nextImage}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                {product.bestSeller && (
                                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                                        Best Seller
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails - only show if multiple images */}
                        {product.images.length > 1 && (
                            <div className={`grid gap-2 ${product.images.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                                {product.images.map((image, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="icon"
                                        className={`aspect-square p-0 overflow-hidden rounded-lg ${currentImageIndex === index ? 'ring-2 ring-primary' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold">{product.name}</h1>

                        </div>

                        <div className="space-y-4">
                            <span className="text-3xl font-bold">
                                {formatPrice(product.price)}{currency}
                                {product.discountPrice && (
                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                        {currency}{formatPrice(product.discountPrice)}
                                    </span>
                                )}
                            </span>
                            <p className="text-muted-foreground">{product.description}</p>
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                            <h3 className="font-medium">Category</h3>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="capitalize">{product.category}</Badge>
                                {product.subCategory && (
                                    <Badge variant="secondary" className="capitalize">{product.subCategory}</Badge>
                                )}
                            </div>
                        </div>

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-medium">Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <Button
                                            key={size}
                                            variant={selectedSize === size ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-2">
                            <Button
                                className="flex-1 gap-2"
                                size="lg"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </Button>
                        </div>


                    </div>
                </div>

                {/* Product Tabs */}
                <Tabs defaultValue="description" className="mt-12">
                    <TabsList className="w-full max-w-md">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground">
                                    {product.description || 'No detailed description available for this product.'}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="details" className="mt-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium mb-2">Product Information</h4>
                                        <Separator className="my-2" />
                                        <div className="grid grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Category</p>
                                                <p className="capitalize">{product.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Subcategory</p>
                                                <p className="capitalize">{product.subCategory}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Date Added</p>
                                                <p>{new Date(product.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>


                </Tabs>
            </div>
        </AnimatedSection>
    );
};

export default Product;