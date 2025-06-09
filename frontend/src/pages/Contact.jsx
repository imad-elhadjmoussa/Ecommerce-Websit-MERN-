
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

export default function ContactPage() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert("Thank you for your message! We'll get back to you soon.");
    };

    return (
        <div className=" py-12">
            <AnimatedSection>

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
                    <p className="text-muted-foreground">
                        We'd love to hear from you! Reach out with any questions or feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="">
                        <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Input id="name" placeholder="Your Name" required />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Your Email"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Input id="subject" placeholder="Subject" required />
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    id="message"
                                    className="min-h-[120px]"
                                    placeholder="Your Message"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="">
                            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Email</h3>
                                        <p className="text-muted-foreground">
                                            imadelahdjmoussa20@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Phone className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Phone</h3>
                                        <p className="text-muted-foreground">05 59 51 05 07</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Address</h3>
                                        <p className="text-muted-foreground">
                                            Algeria
                                        </p>
                                    </div>
                                </div>


                            </div>
                        </div>


                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
}