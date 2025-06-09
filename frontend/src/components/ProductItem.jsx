import React from 'react';
import { Link } from 'react-router-dom';
import { useShopContext } from '../context/ShopContext';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

const ProductItem = ({ product }) => {
    const { currency } = useShopContext();

    // Format price with currency


    return (
        <Link to={`/product/${product._id}`} className="block group">
            <div className='border border-gray-200 rounded-lg overflow-hidden  transition-all'>
                {/* Image with badge for bestseller */}
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.bestSeller && (
                        <Badge variant="destructive" className="absolute top-2 left-2">
                            Bestseller
                        </Badge>
                    )}
                </div>

                {/* Product details */}
                <div className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg line-clamp-1">
                            {product.name}
                        </h3>
                        {product.rating && (
                            <div className="flex items-center text-sm text-gray-600">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                {product.rating.toFixed(1)}
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 capitalize">
                        {product.category} • {product.subCategory}
                    </p>

                    {/* Available sizes */}
                    <div className="flex flex-wrap gap-1 mt-1">
                        {product.sizes?.map(size => (
                            <span
                                key={size}
                                className="text-xs px-2 py-1 bg-gray-100 rounded-md"
                            >
                                {size}
                            </span>
                        ))}
                    </div>

                    {/* Price */}
                    <div className="font-semibold text-lg mt-2">
                        {
                            `${product.price.toFixed(2)}${currency}`
                        }
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductItem;