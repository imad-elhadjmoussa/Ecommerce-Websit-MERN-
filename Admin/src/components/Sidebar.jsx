import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { useState, useEffect } from "react";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useUser();

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen]);

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await logout();
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
        <>
            {/* Mobile Menu Button */}
            <button
                className="menu-button fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`sidebar fixed left-0 top-0 h-screen w-64 bg-muted/40 border-r z-40 transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}>
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
                                    className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                                        pathname === item.href
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

            {/* Main Content Spacer */}
            <div className="hidden md:block w-64" />
        </>
    );
}

export default Sidebar;