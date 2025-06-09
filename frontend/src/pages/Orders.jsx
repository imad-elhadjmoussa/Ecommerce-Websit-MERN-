import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShopContext } from "@/context/ShopContext";
import { useUser } from "@/context/UserContext"; // Add this import
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom"; // Add this import

const OrdersPage = () => {
    const { currency } = useShopContext();
    const { user } = useUser(); // Get user from context
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to fetch orders");
            const data = await response.json();
            setOrders(data.orders);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) { // Only fetch orders if user is logged in
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]); // Add user to dependency array

    const getStatusBadge = (status) => {
        const variants = {
            pending: "secondary",
            processing: "blue",
            shipped: "purple",
            delivered: "green",
            cancelled: "destructive"
        };
        return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatAddress = (address) => {
        return `${address.street}, ${address.city} ${address.postalCode}, ${address.country}`;
    };

    if (!user) {
        return (
            <div className=" py-8 text-center">
                <h2 className="text-xl font-bold mb-2">Please log in to view your orders</h2>
                <p className="text-muted-foreground mb-4">
                    You need to be logged in to see your order history.
                </p>
                <Button asChild>
                    <Link to="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchOrders}>Retry</Button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-xl font-bold mb-2">No orders found</h2>
                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className=" py-8">
            <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4">
                {orders.map((order) => (
                    <Card key={order._id}>
                        <CardHeader className="p-4 border-b">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {formatDate(order.orderDate)}
                                        </span>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <p className="text-sm">
                                        {formatAddress(order.address)}
                                    </p>
                                </div>
                                <div className="font-semibold">
                                    {order.totalAmount.toFixed(2)}{currency}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="divide-y">
                                {order.items.map((item) => (
                                    <div key={item._id} className="p-4 flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-16 w-16 rounded-md object-cover border"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {item.price.toFixed(2)}{currency} × {item.quantity}
                                                {item.size && ` • Size: ${item.size}`}
                                            </p>
                                        </div>
                                        <div className="font-medium">
                                            {(item.price * item.quantity).toFixed(2)}{currency}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;