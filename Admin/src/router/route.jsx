import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../MainLayout';
import Home from '../pages/Home';
import AddProduct from '../pages/AddProduct';
import ProductList from '../pages/ProductList';
import Orders from '../pages/Orders';
import PrivateRoute from '../components/PrivateRoute';
import Login from '../pages/Login';
import PublicRoute from '../components/PublicRoute';

const router = createBrowserRouter([
    {
        path: '/login',
        element: ( 
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: '/',
        element: (
            <PrivateRoute>
                <MainLayout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true, 
                element: <Home />
            },
            { 
                path: 'add-product', 
                element: <AddProduct /> 
            },
            { 
                path: 'product-list', 
                element: <ProductList /> 
            },
            { 
                path: 'orders', 
                element: <Orders /> 
            },
            // Catch all route - redirect to home
            {
                path: '*',
                element: <Navigate to="/" replace />
            }
        ],
    },
    // Catch all route for root level paths
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
]);

export default router;
