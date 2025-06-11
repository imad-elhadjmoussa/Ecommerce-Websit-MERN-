import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const statusColors = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    shipped: "bg-purple-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500"
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { orders: fetchedOrders } = await getAllOrders();
            setOrders(fetchedOrders);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            setUpdating(orderId);
            const { order: updatedOrder } = await updateOrderStatus(orderId, newStatus);
            
            // Update the order in the local state
            setOrders(orders.map(order => 
                order._id === orderId ? updatedOrder : order
            ));
            
            toast.success('Order status updated successfully');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdating(null);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders Management</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell className="font-medium">
                                    {order._id.slice(-6).toUpperCase()}
                                </TableCell>
                                <TableCell>
                                    {order.userId?.email || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>{order.items.length} items</TableCell>
                                <TableCell>{order.totalAmount} DA</TableCell>
                                <TableCell>
                                    <Badge 
                                        className={`${statusColors[order.status]} text-white`}
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        disabled={updating === order._id}
                                        value={order.status}
                                        onValueChange={(value) => handleStatusUpdate(order._id, value)}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            {updating === order._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <SelectValue placeholder="Update status" />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default Orders;