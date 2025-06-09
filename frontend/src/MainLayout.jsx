import { Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ShopContextProvider } from './context/ShopContext';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';
import { Toaster } from 'sonner';

function MainLayout() {
  return (
    <UserProvider>
      <ShopContextProvider>
        <main className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* navbar */}
          <Navbar />
          <div className=' overflow-x-hidden'>
            <Outlet />
          </div>

          <Footer />
          <Toaster richColors position="top-right" />
        </main>
      </ShopContextProvider>
    </UserProvider>

  )
}

export default MainLayout
