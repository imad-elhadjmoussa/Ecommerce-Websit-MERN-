import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useShopContext } from "./../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const PlaceOrder = () => {
    const {
        cart,
        cartTotal,
        currency,
        setCart,
    } = useShopContext();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        address: {
            street: "",
            city: "",
            postalCode: "",
            country: "Algeria"
        },
        phone: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.address) {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const orderData = {
                address: formData.address,
                phone: formData.phone,
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/place-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const result = await response.json();
            setCart([]);
            navigate(`/orders`, { replace: true });

        } catch (err) {
            console.error("Error placing order:", err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-center space-y-4">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
                    <h2 className="text-2xl font-bold">Your cart is empty</h2>
                    <p className="text-muted-foreground">
                        Please add items to your cart before checking out.
                    </p>
                    <Button asChild className="mt-4 gap-2">
                        <Link to="/shop">
                            <ArrowLeft className="h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className=" py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Customer and Delivery Information */}
                <div className="lg:w-2/3">
                    <h1 className="text-2xl font-bold mb-6">Checkout</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Delivery Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="street">Street Address</Label>
                                    <Input
                                        id="street"
                                        name="street"
                                        value={formData.address.street}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.address.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input
                                            id="postalCode"
                                            name="postalCode"
                                            value={formData.address.postalCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            value={formData.address.country}
                                            onChange={handleChange}
                                            required
                                            disabled
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+213661234567"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div className="flex justify-between">
                            <Button variant="outline" asChild>
                                <Link to="/cart">
                                    Back to Cart
                                </Link>
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Placing Order..." : "Place Order"}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {cart.map((item) => (
                                    <div key={`${item._id}-${item.size}`} className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            {item.size && (
                                                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                            )}
                                            <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p>{(item.price * item.quantity).toFixed(2)}{currency}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            <div className="space-y-2">
                                

                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{(cartTotal).toFixed(2)}{currency}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;