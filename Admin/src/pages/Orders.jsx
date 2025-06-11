import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../lib/api';
import {
    Table,
    TableBody,
    TableCaption,
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
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    const [expandedOrders, setExpandedOrders] = useState(new Set());

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

    const toggleOrderDetails = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>Loading orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p>No orders found.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Orders Management</h1>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
                <Table>
                    <TableCaption>A list of all orders.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
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
                            <>
                                <TableRow key={order._id}>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toggleOrderDetails(order._id)}
                                        >
                                            {expandedOrders.has(order._id) ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
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
                                {expandedOrders.has(order._id) && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="bg-muted/50 p-4">
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Shipping Information</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Address:</span> {order.address.street}</p>
                                                            <p><span className="font-medium">City:</span> {order.address.city}</p>
                                                            <p><span className="font-medium">Postal Code:</span> {order.address.postalCode}</p>
                                                            <p><span className="font-medium">Country:</span> {order.address.country}</p>
                                                            <p><span className="font-medium">Phone:</span> {order.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Order Details</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <p><span className="font-medium">Order ID:</span> {order._id}</p>
                                                            <p><span className="font-medium">Order Date:</span> {format(new Date(order.orderDate), 'PPpp')}</p>
                                                            <p><span className="font-medium">Total Items:</span> {order.items.length}</p>
                                                            <p><span className="font-medium">Total Amount:</span> {order.totalAmount} DA</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mb-2">Items</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {order.items.map((item, index) => (
                                                            <div key={index} className="flex items-center space-x-4 p-3 bg-background rounded-lg border">
                                                                <img 
                                                                    src={item.image} 
                                                                    alt={item.name}
                                                                    className="h-16 w-16 object-cover rounded"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium truncate">{item.name}</p>
                                                                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                                                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                                    <p className="text-sm font-medium">{item.price} DA</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
};

export default Orders;