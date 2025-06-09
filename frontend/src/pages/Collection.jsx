import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import { clothingCategories, sizes } from '../lib/constants';
import AnimatedSection from '../components/AnimatedSection';

const ITEMS_PER_PAGE = 9;

const Collection = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedGender, setSelectedGender] = useState('all');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [sortOption, setSortOption] = useState('newest');
    const [priceFilter, setPriceFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const { products = [], search } = useShopContext();

    // Initialize filters from URL params on component mount
    useEffect(() => {
        const gender = searchParams.get('category') || 'all';
        const subCategories = searchParams.getAll('subCategory') || [];
        const sizes = searchParams.getAll('size') || [];
        const sort = searchParams.get('sort') || 'newest';
        const price = searchParams.get('price') || 'all';
        const page = parseInt(searchParams.get('page') || '1', 10);

        setSelectedGender(gender);
        setSelectedCategories(subCategories);
        setSelectedSizes(sizes);
        setSortOption(sort);
        setPriceFilter(price);
        setCurrentPage(page);
    }, []); // Empty dependency array to run only on mount

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        if (selectedGender !== 'all') {
            params.set('category', selectedGender);
        }

        selectedCategories.forEach(cat => {
            params.append('subCategory', cat);
        });

        selectedSizes.forEach(size => {
            params.append('size', size);
        });

        if (sortOption !== 'newest') {
            params.set('sort', sortOption);
        }

        if (priceFilter !== 'all') {
            params.set('price', priceFilter);
        }

        if (currentPage !== 1) {
            params.set('page', currentPage.toString());
        }

        // Replace the current URL without causing a navigation
        setSearchParams(params, { replace: true });
    }, [selectedGender, selectedCategories, selectedSizes, sortOption, priceFilter, currentPage]);

    // Get available categories based on selected gender
    const availableCategories = selectedGender === 'all'
        ? []
        : clothingCategories.find(g => g.gender === selectedGender)?.categories || [];

    // Gender options including 'all'
    const genderOptions = [
        { value: 'all', label: 'All' },
        ...clothingCategories.map(gender => ({
            value: gender.gender,
            label: gender.gender
        }))
    ];

    // Filter products based on selections
    let filteredProducts = products.filter(product => {
        // Filter by search term
        if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        // Filter by gender (category)
        if (selectedGender !== 'all' && product.category !== selectedGender) {
            return false;
        }

        // Filter by subcategory
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.subCategory)) {
            return false;
        }

        // Filter by price
        if (priceFilter === 'under1000' && product.price >= 1000) return false;
        if (priceFilter === '1000to2000' && (product.price < 1000 || product.price > 2000)) return false;
        if (priceFilter === '2000to4000' && (product.price < 2000 || product.price > 4000)) return false;
        if (priceFilter === 'over4000' && product.price <= 4000) return false;

        // Filter by size
        if (selectedSizes.length > 0 && product.sizes && product.sizes.length > 0 &&
            !product.sizes.some(size => selectedSizes.includes(size))) {
            return false;
        }

        return true;
    });

    // Sort products
    filteredProducts = filteredProducts.sort((a, b) => {
        switch (sortOption) {
            case 'newest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'oldest':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'price-high':
                return b.price - a.price;
            case 'price-low':
                return a.price - b.price;
            default:
                return 0;
        }
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Handle gender change
    const handleGenderChange = (gender) => {
        setSelectedGender(gender);
        setSelectedCategories([]);
        setCurrentPage(1);
    };

    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setCurrentPage(1);
    };

    // Toggle size selection
    const toggleSize = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
        setCurrentPage(1);
    };

    return (
        <div className=" py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Our Collection</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <AnimatedSection
                    className="w-full md:w-1/4 "
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Sort By</h3>
                            <div className="space-y-2">
                                <Select
                                    value={sortOption}
                                    onValueChange={(value) => {
                                        setSortOption(value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest Arrivals</SelectItem>
                                        <SelectItem value="oldest">Oldest Arrivals</SelectItem>
                                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Price</h3>
                            <div className="space-y-2">
                                <Select
                                    value={priceFilter}
                                    onValueChange={(value) => {
                                        setPriceFilter(value);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Filter by price" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Prices</SelectItem>
                                        <SelectItem value="under1000">Under 1000DA</SelectItem>
                                        <SelectItem value="1000to2000">1000DA - 2000DA</SelectItem>
                                        <SelectItem value="2000to4000">2000DA - 4000DA</SelectItem>
                                        <SelectItem value="over4000">Over 4000DA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Category</h3>
                            <Select
                                value={selectedGender}
                                onValueChange={handleGenderChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    {genderOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedGender !== 'all' && availableCategories.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold">Categories</h3>
                                <div className="space-y-2">
                                    {availableCategories.map(({ label, value }) => (
                                        <div key={value} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`cat-${value}`}
                                                checked={selectedCategories.includes(value)}
                                                onCheckedChange={() => toggleCategory(value)}
                                            />
                                            <Label htmlFor={`cat-${value}`}>{label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {sizes.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold">Sizes</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map(size => (
                                        <Button
                                            key={size}
                                            variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => toggleSize(size)}
                                        >
                                            {size}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setSelectedGender('all');
                                setSelectedCategories([]);
                                setSelectedSizes([]);
                                setSortOption('newest');
                                setPriceFilter('all');
                                setCurrentPage(1);
                            }}
                        >
                            Clear All Filters
                        </Button>
                    </div>
                </AnimatedSection>

                {/* Product Grid */}
                <div className="w-full md:w-3/4">
                    <div className="mb-4 flex justify-between items-center">
                        <p className="text-muted-foreground">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                        </p>
                    </div>

                    {paginatedProducts.length === 0 ? (
                        <AnimatedSection>
                            <div className="text-center py-12">
                                <p className="text-lg text-muted-foreground">No products match your filters</p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setSelectedGender('all');
                                        setSelectedCategories([]);
                                        setSelectedSizes([]);
                                        setSortOption('newest');
                                        setPriceFilter('all');
                                        setCurrentPage(1);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </AnimatedSection>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedProducts.map(product => (
                                    <AnimatedSection
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <ProductItem key={product._id} product={product} />
                                    </AnimatedSection>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-8 gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collection;