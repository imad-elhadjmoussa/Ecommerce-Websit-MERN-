// src/routes.jsx
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import Collection from '../pages/Collection';
import { createHashRouter } from 'react-router-dom';
import MainLayout from '../MainLayout';
import About from '../pages/About';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import Orders from '../pages/Orders';
import PlaceOrder from '../pages/PlaceOrder';
import Product from '../pages/Product';
import PublicRoute from '../components/PublicRoute';
import NotFound from '../pages/NotFound';

const router = createHashRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: 'collection', element: <Collection /> },
            { path: 'about', element: <About /> },
            { path: 'cart', element: <Cart /> },
            {
                path: 'login', element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                )
            },
            { path: 'contact', element: <Contact /> },
            { path: 'orders', element: <Orders /> },
            { path: 'place-order', element: <PlaceOrder /> },
            { path: 'product/:productId', element: <Product /> },
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;
