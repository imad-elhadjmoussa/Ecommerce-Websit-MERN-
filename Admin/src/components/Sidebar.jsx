import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;

    const handleLogout = async () => {
        try {
            await axios.post('/api/users/logout', {}, {
                withCredentials: true
            });
            
            // Clear any local storage or state if needed
            localStorage.removeItem('adminToken');
            
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error('Logout error:', error);
            toast.error("Failed to logout. Please try again.");
        }
    };

    const navItems = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            href: "/",
        },
        {
            name: "Add Product",
            icon: Package,
            href: "/add-product",
        },
        {
            name: "Products",
            icon: Package,
            href: "/product-list",
        },
        {
            name: "Orders",
            icon: ShoppingCart,
            href: "/orders",
        }
    ];

    return (
        <div className="hidden border-r bg-muted/40 md:block fixed left-0 top-0 h-screen w-64">
            <div className="flex h-full flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <Package className="h-6 w-6" />
                        <span className="">Admin Panel</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="grid items-start px-2 py-4 text-sm font-medium lg:px-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-4 mt-auto">
                    <Button 
                        size="sm" 
                        className="w-full"
                        onClick={handleLogout}
                        variant="destructive"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;