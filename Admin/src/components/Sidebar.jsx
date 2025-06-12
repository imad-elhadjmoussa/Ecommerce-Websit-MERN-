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
import { useState, useEffect, useRef } from "react";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useUser();
    const sidebarRef = useRef(null);

    // Close sidebar when clicking outside or when route changes
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                !event.target.closest('.menu-button')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

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
            {/* Mobile Menu Button - More prominent and better positioned */}
            <button
                className="menu-button fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground shadow-lg md:hidden"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
            >
                {isOpen ? (
                    <X className="h-6 w-6" strokeWidth={2} />
                ) : (
                    <Menu className="h-6 w-6" strokeWidth={2} />
                )}
            </button>

            {/* Overlay with smooth animation */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
                    style={{ opacity: isOpen ? 1 : 0 }}
                />
            )}

            {/* Sidebar with swipe-friendly design */}
            <div
                ref={sidebarRef}
                className={`sidebar fixed left-0 top-0 h-screen w-64 bg-background border-r z-40 shadow-xl transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="flex h-full flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <Package className="h-6 w-6" />
                            <span className="text-lg">Admin Panel</span>
                        </Link>
                    </div>

                    {/* Scrollable nav items with better spacing */}
                    <div className="flex-1 overflow-y-auto py-2">
                        <nav className="grid items-start px-2 gap-1 text-sm font-medium lg:px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 p-3 rounded-lg mx-2 transition-all ${pathname === item.href
                                            ? "bg-primary text-primary-foreground"
                                            : "text-foreground hover:bg-accent"
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Logout button with better visibility */}
                    <div className="p-4 mt-auto border-t">
                        <Button
                            size="sm"
                            className="w-full py-3 font-medium"
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