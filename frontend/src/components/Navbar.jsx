import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, LogOut, UserCircle, Package, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useShopContext } from '../context/ShopContext';
import { useUser } from '../context/UserContext';
import logo from './../assets/logo.png';

export function Navbar() {
    const { user, logout, isLoading: isUserLoading } = useUser();
    const { setSearch, cartItemCount, isLoading: isCartLoading } = useShopContext();

    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate('/collection'); // Replace with your desired path
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Mobile menu */}
                <div className="flex md:hidden">
                    <Sheet >
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <SheetHeader>
                                <SheetTitle className="text-left">
                                    <Link to="/" className="flex items-center space-x-2"> {/* Removed md: classes */}
                                        <img src={logo} alt="logo" className="size-6" />
                                        <span className="text-lg font-bold">Shop</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="mt-6 flex flex-col px-2 space-y-2">
                                <Link to="/">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Home
                                    </Button>
                                </Link>
                                <Link to="/collection">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Collection
                                    </Button>
                                </Link>

                                <Link to="/about">
                                    <Button variant="ghost" className="w-full justify-start">
                                        About
                                    </Button>
                                </Link>
                                <Link to="/contact">
                                    <Button variant="ghost" className="w-full justify-start">
                                        Contact
                                    </Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Logo and Desktop Navigation */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="hidden items-center space-x-2 md:flex">
                        <img src={logo} alt="logo" className='size-8' />
                        <span className="text-lg inline-block font-bold">Shop</span>
                    </Link>

                    <nav className="hidden items-center space-x-1 md:flex">
                        <Link to="/">
                            <Button variant="ghost">Home</Button>
                        </Link>
                        <Link to="/collection">
                            <Button variant="ghost">Collection</Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="ghost">About</Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="ghost">Contact</Button>
                        </Link>
                    </nav>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-2">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-9 w-[150px] md:w-[200px] lg:w-[300px]"
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={handleSearchClick}
                        />
                    </div>

                    {isUserLoading ? (
                        <Button variant="ghost" size="icon" className="hover:bg-muted">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </Button>
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:bg-muted">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} alt={user.username} />
                                        <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="sr-only">User menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="p-2">
                                    <p className="font-medium">{user.username}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild>
                                    <Link to="/orders" className="flex items-center">
                                        <Package className="mr-2 h-4 w-4" />
                                        My Orders
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/login">
                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Login</span>
                            </Button>
                        </Link>
                    )}

                    <Link to="/cart">
                        <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                            {isCartLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartItemCount > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="absolute -right-1 -top-1 h-5 w-5 justify-center p-0"
                                        >
                                            {cartItemCount}
                                        </Badge>
                                    )}
                                </>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}