import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FaLeaf, FaAward, FaHeadset, FaShippingFast } from "react-icons/fa";
import { Link } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import { features } from "../lib/data";

const About = () => {
    return (
        <div className=" py-12">
            {/* Hero Section */}
            <AnimatedSection >
                <section className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        From humble beginnings to becoming your favorite shopping destination - this is our journey.
                    </p>
                </section>
            </AnimatedSection>

            {/* Our Story */}
            <section className="mb-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <AnimatedSection
                        className="flex flex-col justify-center"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
                            <p className="text-lg mb-4">
                                Founded in 2015, ShopEase started as a small boutique with a big dream - to make online shopping effortless,
                                enjoyable, and accessible to everyone.
                            </p>
                            <p className="text-lg mb-6">
                                Today, we're proud to serve millions of customers worldwide with carefully curated products,
                                exceptional service, and a commitment to sustainability.
                            </p>
                        </div>
                    </AnimatedSection>
                    <AnimatedSection
                        className="flex justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <div className="rounded-lg overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&auto=format&fit=crop"
                                alt="Our team working together"
                                className="w-full h-auto object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Our Values */}
            <section className="mb-20">
                <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((item, index) => (
                        <AnimatedSection
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >

                            <Card key={index} className="h-full">
                                <CardHeader className="pb-0">
                                    <div className={`${item.bgColor} p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold">{item.title}</h3>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        </AnimatedSection>
                    ))}
                </div>

            </section>



            {/* CTA */}
            <AnimatedSection
                
            >
                <section className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Be part of our journey to make shopping better for everyone.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/collection" >
                            <Button>Shop Now</Button>
                        </Link>
                        <Link to="/contact" >
                            <Button variant="outline">Contact Us</Button>
                        </Link>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};


const TeamMember = ({ name, role, image, bio }) => {
    return (
        <Card className="h-full">
            <CardHeader className="items-center pb-0">
                <img
                    src={image}
                    alt={name}
                    className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-muted-foreground">{role}</p>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">{bio}</p>
            </CardContent>
        </Card>
    );
};

export default About;