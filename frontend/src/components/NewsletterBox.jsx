import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AnimatedSection from "./AnimatedSection";

const NewsletterBox = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setEmail("");
        }, 1500);
    };

    return (
        <div className="w-full  py-12"> {/* Full width background */}
            <AnimatedSection>
                <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                    <div className="space-y-2 flex-1">
                        <h3 className="text-2xl font-bold">Stay Updated</h3>
                        <p className="text-base text-gray-600">
                            Subscribe to our newsletter for the latest products, deals, and news.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1">
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 min-w-[200px]  text-base"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className=" px-6"
                            >
                                {isLoading ? "Subscribing..." : "Subscribe"}
                            </Button>
                        </div>
                        <p className="mt-3 text-sm text-gray-500">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </form>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default NewsletterBox;