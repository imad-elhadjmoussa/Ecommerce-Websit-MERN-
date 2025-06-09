import { FaBoxOpen, FaShoppingCart, FaThList } from "react-icons/fa";
import {
    FaLeaf,
    FaAward,
    FaHeadset,
    FaShippingFast,
} from "react-icons/fa";

export const policies = [
    {
        id: 1,
        title: "Product Catalog",
        icon: <FaThList className="text-2xl text-primary" />,
        description: "Browse a wide range of high-quality products in various categories.",
    },
    {
        id: 2,
        title: "Smart Shopping Cart",
        icon: <FaShoppingCart className="text-2xl text-primary" />,
        description: "Easily add, edit, or remove items with real-time price updates.",
    },
    {
        id: 3,
        title: "Fast & Reliable Delivery",
        icon: <FaBoxOpen className="text-2xl text-primary" />,
        description: "Enjoy quick delivery and real-time order tracking on every purchase.",
    }
];


export const features = [
    {
        title: "Sustainability",
        description: "We're committed to eco-friendly practices, from packaging to product sourcing.",
        icon: <FaLeaf className="text-green-600 dark:text-green-400 text-xl" />,
        bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
        title: "Quality",
        description: "Every product is carefully selected to meet our high standards.",
        icon: <FaAward className="text-blue-600 dark:text-blue-400 text-xl" />,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
        title: "Customer First",
        description: "Your satisfaction is our top priority with 24/7 support.",
        icon: <FaHeadset className="text-purple-600 dark:text-purple-400 text-xl" />,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
        title: "Fast Delivery",
        description: "98% of orders arrive within 2 business days.",
        icon: <FaShippingFast className="text-orange-600 dark:text-orange-400 text-xl" />,
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
];
