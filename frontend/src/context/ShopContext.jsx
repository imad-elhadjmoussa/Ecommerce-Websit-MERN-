import { createContext, useContext, useEffect, useState } from "react";
import { fetchProducts } from "../lib/api";

const ShopContext = createContext();

export const ShopContextProvider = ({ children }) => {
    const currency = "DA";
    const delivery_fee = 10;
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);

    // Fetch cart data from API
    const fetchCart = async () => {
        try {
            setCartLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`,{
                credentials: 'include' // Include cookies for session management
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();
            setCart(data.cart || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setCartLoading(false);
        }
    };

    // Add item to cart via API
    const addToCart = async (productId, quantity = 1, options = {}) => {
        try {
            setCartLoading(true);
            const product = products.find(p => p._id === productId);
            if (!product) return;

            const cartItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity,
                size: options.size
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for session management
                body: JSON.stringify(cartItem)
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            // Refresh cart after successful addition
            await fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setCartLoading(false);
        }
    };

    // Remove item from cart via API
    const removeFromCart = async (productId) => {
        try {
            setCartLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/items/${productId}`, {
                method: 'DELETE',
                credentials: 'include' // Include cookies for session management
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            // Refresh cart after successful removal
            await fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        } finally {
            setCartLoading(false);
        }
    };

    // Update item quantity via API
    const updateCartItemQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            await removeFromCart(productId);
            return;
        }

        try {
            setCartLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/items/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for session management
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update item quantity');
            }

            // Refresh cart after successful update
            await fetchCart();
        } catch (error) {
            console.error("Error updating cart item:", error);
        } finally {
            setCartLoading(false);
        }
    };

    const cartTotal = cart.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
    );

    const cartItemCount = cart.reduce(
        (count, item) => count + item.quantity,
        0
    );

    const getProducts = async () => {
        const data = await fetchProducts();
        setProducts(data.products || []);
    }

    // Initial data loading
    useEffect(() => {
        getProducts();
        fetchCart();
    }, []);

    const value = {
        currency,
        products,
        delivery_fee,
        search,
        setSearch,
        cart,
        cartLoading,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartTotal,
        cartItemCount,
        setCart
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
}

export const useShopContext = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error("useShopContext must be used within a ShopContextProvider");
    }
    return context;
};