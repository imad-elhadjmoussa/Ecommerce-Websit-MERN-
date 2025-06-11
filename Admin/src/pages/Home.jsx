import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllOrders } from '../lib/api';
import { getAllProducts } from '../lib/api';
import { format } from 'date-fns';
import { 
    Package, 
    ShoppingCart, 
    TrendingUp, 
    DollarSign,
    Loader2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const Home = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0,
        recentOrders: [],
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const [ordersResponse, productsResponse] = await Promise.all([
                    getAllOrders(),
                    getAllProducts()
                ]);

                const orders = ordersResponse.orders;
                const products = productsResponse.products;

                // Calculate statistics
                const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
                const orderStatusCounts = orders.reduce((acc, order) => {
                    acc[order.status] = (acc[order.status] || 0) + 1;
                    return acc;
                }, {});

                // Get recent orders (last 5)
                const recentOrders = [...orders]
                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                    .slice(0, 5);

                setStats({
                    totalOrders: orders.length,
                    totalProducts: products.length,
                    totalRevenue,
                    recentOrders,
                    pendingOrders: orderStatusCounts.pending || 0,
                    processingOrders: orderStatusCounts.processing || 0,
                    shippedOrders: orderStatusCounts.shipped || 0,
                    deliveredOrders: orderStatusCounts.delivered || 0,
                    cancelledOrders: orderStatusCounts.cancelled || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const statusColors = {
        pending: "bg-yellow-500",
        processing: "bg-blue-500",
        shipped: "bg-purple-500",
        delivered: "bg-green-500",
        cancelled: "bg-red-500"
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all statuses
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            Available in store
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRevenue} DA</div>
                        <p className="text-xs text-muted-foreground">
                            From all orders
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.totalOrders ? Math.round(stats.totalRevenue / stats.totalOrders) : 0} DA
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Per order
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Order Status Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Badge className={statusColors.pending}>Pending</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                        <Badge className={statusColors.processing}>Processing</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.processingOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                        <Badge className={statusColors.shipped}>Shipped</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.shippedOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <Badge className={statusColors.delivered}>Delivered</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                        <Badge className={statusColors.cancelled}>Cancelled</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.cancelledOrders}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        Order #{order._id.slice(-6).toUpperCase()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(order.orderDate), 'PPpp')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className={statusColors[order.status]}>
                                        {order.status}
                                    </Badge>
                                    <p className="text-sm font-medium">{order.totalAmount} DA</p>
                                </div>
                            </div>
                        ))}
                        {stats.recentOrders.length === 0 && (
                            <p className="text-center text-muted-foreground">No recent orders</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;