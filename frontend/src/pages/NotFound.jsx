// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6">The page you're looking for doesn't exist.</p>
            <Link to="/" className="">
                <Button>
                    Go back home
                </Button>
            </Link>
        </div>
    );
}

export default NotFound;
