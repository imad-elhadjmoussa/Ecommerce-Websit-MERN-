import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function Sidebar() {
    const location = useLocation();
    const pathname = location.pathname;

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
        },
        {
            name: "Customers",
            icon: Users,
            href: "/customers",
        },
        {
            name: "Settings",
            icon: Settings,
            href: "/settings",
        },
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
                    <Button size="sm" className="w-full">
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;