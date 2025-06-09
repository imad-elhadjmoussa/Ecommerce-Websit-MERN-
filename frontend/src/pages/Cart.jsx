import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useShopContext } from "../context/ShopContext";
import { useUser } from "../context/UserContext";  // Add this import
import { Link } from "react-router-dom";

const CartPage = () => {
  const {
    cart,
    cartTotal,
    cartItemCount,
    removeFromCart,
    updateCartItemQuantity,
    currency
  } = useShopContext();

  const { user } = useUser();  // Get user from context

  const handleQuantityChange = async (productId, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    await updateCartItemQuantity(productId, quantity);
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className=" py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Please log in to view your cart</h2>
          <p className="text-muted-foreground">
            You need to be logged in to access your shopping cart.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="mt-4 gap-2">
              <Link to="/login">
                Log In
              </Link>
            </Button>
            
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="py-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild className="mt-4 gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Main cart view
  return (
    <div className=" py-8 max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <h1 className="text-2xl font-bold mb-6">Your Cart ({cartItemCount})</h1>

          <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {cart.map((item) => (
              <Card key={`${item._id}-${item.size}`} className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full rounded-md object-cover border"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">
                            Size: <span className="font-medium">{item.size}</span>
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                          className="w-20 h-8"
                        />
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(item.price * item.quantity).toFixed(2)}{currency}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.price.toFixed(2)}{currency} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <Card className="p-6 sticky top-4">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{cartTotal.toFixed(2)}{currency}</span>
                </div>

                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{cartTotal.toFixed(2)}{currency}</span>
                </div>
              </div>

              <Link to="/place-order" className="w-full">
                <Button className="w-full gap-2" size="lg">
                  <ShoppingCart className="h-4 w-4" />
                  Checkout
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;