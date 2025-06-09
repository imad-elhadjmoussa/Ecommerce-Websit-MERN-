import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
    const slides = [
        {
            id: 1,
            title: "Men's Collection",
            subtitle: "Stylish Essentials",
            description: "Discover our premium selection for men",
            image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9", // Men's fashion image
            buttonText: "Shop Men",
            filters: {
                category: 'Men'
            }
        },
        {
            id: 2,
            title: "Women's Collection",
            subtitle: "Trending Now",
            description: "Explore our latest women's fashion",
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b", // Women's fashion image
            buttonText: "Shop Women",
            filters: {
                category: 'Women'
            }
        },
        {
            id: 3,
            title: "Men's T-Shirts",
            subtitle: "Premium Quality",
            description: "Comfortable and stylish t-shirts for every occasion",
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27", // Men's t-shirts image
            buttonText: "Shop T-Shirts",
            filters: {
                category: 'Men',
                subCategory: 't-shirts'
            }
        },
        {
            id: 4,
            title: "Women's Blouses",
            subtitle: "Elegant Designs",
            description: "Beautiful blouses to complement your style",
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea", // Women's blouses image
            buttonText: "Shop Blouses",
            filters: {
                category: 'Women',
                subCategory: 'blouses'
            }
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = () => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const generateQueryString = (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else {
                params.set(key, value);
            }
        });
        return params.toString();
    };

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                nextSlide();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, currentSlide]);

    return (
        <section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="w-full flex-shrink-0 relative"
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            height: 'calc(100vh - 64px)',
                            minHeight: '500px'
                        }}
                    >
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="relative z-10 flex h-full flex-col items-start justify-center px-8 text-white md:px-16 lg:px-24">
                            <span className="mb-2 text-lg font-medium md:text-xl">
                                {slide.subtitle}
                            </span>
                            <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                                {slide.title}
                            </h1>
                            <p className="mb-8 max-w-md text-lg md:text-xl">
                                {slide.description}
                            </p>
                            <a
                                href={`/collection?${generateQueryString(slide.filters)}`}
                                className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-100 transition-colors"
                            >
                                {slide.buttonText}
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-3 w-3 rounded-full transition-all ${currentSlide === index ? 'bg-white w-6' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;