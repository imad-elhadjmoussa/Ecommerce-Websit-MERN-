import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import logo from "../assets/logo.png"; // Adjust the path as necessary

const Footer = () => {

    return (
        <AnimatedSection>
            <footer className="bg-background border-t">
                <div className=" py-12 mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <Link to="/" className="hidden items-center space-x-2 md:flex">
                                <img src={logo} alt="logo" className='size-8' />
                                <span className="text-lg inline-block font-bold">Shop</span>
                            </Link>

                            <p className="text-muted-foreground">
                                Your one-stop shop for all your needs. Quality products at affordable prices.
                            </p>
                            <div className="flex space-x-4">
                                <a href="http://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" aria-label="Facebook">
                                        <Facebook className="h-5 w-5" />
                                    </Button>
                                </a>
                                <a href="http://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" aria-label="Twitter">
                                        <Twitter className="h-5 w-5" />
                                    </Button>
                                </a>
                                <a href="http://instagram.com" target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" aria-label="Instagram">
                                        <Instagram className="h-5 w-5" />
                                    </Button>
                                </a>
                                <a href="http://linkedin.com" target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="icon" aria-label="LinkedIn">
                                        <Linkedin className="h-5 w-5" />
                                    </Button>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/collection" className="text-muted-foreground hover:text-primary transition-colors">
                                        Collection
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Customer Service</h4>
                            <ul className="space-y-2">
                                <li>
                                    <p className="text-muted-foreground hover:text-primary transition-colors">
                                        FAQ
                                    </p>
                                </li>
                                <li>
                                    <p className="text-muted-foreground hover:text-primary transition-colors">
                                        Shipping Policy
                                    </p>
                                </li>
                                <li>
                                    <p className="text-muted-foreground hover:text-primary transition-colors">
                                        Return Policy
                                    </p>
                                </li>
                                <li>
                                    <p className="text-muted-foreground hover:text-primary transition-colors">
                                        Privacy Policy
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Newsletter</h4>
                            <p className="text-muted-foreground">
                                Subscribe to our newsletter for the latest updates and offers.
                            </p>
                            <form className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="Your email"
                                        className="pl-10 w-full"
                                        required
                                    />
                                </div>
                                <Button type="submit">
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} ShopEase. All rights reserved.
                        </p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <p className="text-muted-foreground text-sm hover:text-primary transition-colors">
                                Terms of Service
                            </p>
                            <p className="text-muted-foreground text-sm hover:text-primary transition-colors">
                                Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </AnimatedSection>
    );
};

export default Footer;