import { FaShippingFast, FaExchangeAlt, FaLock, FaThList, FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { policies } from "../lib/data";
import { Link } from "react-router-dom";


const OurPolicy = () => {

    return (
        <section className="py-12 bg-background">
            <AnimatedSection>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-3">Our Services</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        We provide the best shopping experience with these benefits
                    </p>
                </div>
            </AnimatedSection>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {policies.map((policy, index) => (
                    <AnimatedSection
                        key={policy.id}
                        initial={{ scale: 0, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="text-center p-6 rounded-lg bg-muted/50 hover:bg-muted transition">
                            <div className="flex justify-center mb-4 text-primary">
                                {policy.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{policy.title}</h3>
                            <p className="text-muted-foreground">{policy.description}</p>
                        </div>
                    </AnimatedSection>
                ))}
            </div>

            <div className="text-center mt-12">
                <Link to="/about">
                    <Button variant="outline" className="px-8 py-4">
                        Learn More
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default OurPolicy;