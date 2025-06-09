import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Login = () => {
    const { loginWithGoogleProvider, setUser } = useUser();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = isLogin
                ? `${import.meta.env.VITE_API_URL}/users/login`
                : `${import.meta.env.VITE_API_URL}/users/signup`;

            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { username: formData.username, email: formData.email, password: formData.password };

            const { data } = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            setUser(data.user);

            // Show success toast with Sonner
            toast.success(isLogin ? "You have successfully logged in!" : "Account created successfully!");

            // Redirect after a short delay to allow toast to be seen
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (err) {
            let errorMessage = 'An unexpected error occurred';

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || 'Authentication failed';

                // Handle specific error cases
                if (err.response?.status === 401) {
                    errorMessage = "Invalid email or password";
                } else if (err.response?.status === 400) {
                    errorMessage = "Validation error: " + (err.response?.data?.message || "Please check your input");
                } else if (err.response?.status === 409) {
                    errorMessage = "Email already in use";
                }
            }

            // Show error toast with Sonner
            toast.error(errorMessage);
            console.error('Authentication error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogleProvider();
            toast.success("Google authentication successful!");
        } catch (error) {
            toast.error("Failed to authenticate with Google");
            console.error('Google auth error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <FcGoogle className="mr-2 h-4 w-4" />
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                            {!isLogin && (
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : isLogin ? 'Sign in' : 'Sign up'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <Button
                            variant="link"
                            className="px-0 text-primary"
                            onClick={() => setIsLogin(!isLogin)}
                            disabled={isLoading}
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </Button>
                    </p>
                    
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;