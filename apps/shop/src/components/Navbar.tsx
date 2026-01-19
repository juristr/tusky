import { ShoppingCart, Search, User, Menu, Heart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@tusky/util-auth';

const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 mr-8"
              data-testid="navbar-title"
            >
              ShopSecure
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Home
              </Link>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Shop
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Categories
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Deals
              </a>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <Heart size={22} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-indigo-600 relative"
              >
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </a>
              <div className="relative group">
                <a href="#" className="text-gray-600 hover:text-indigo-600 flex items-center gap-2">
                  <User size={22} />
                  {user && <span className="text-sm font-medium" data-testid="navbar-username">{user.username}</span>}
                </a>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Current Orders
                    </Link>
                    <Link
                      to="/orders/past"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Order History
                    </Link>
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="text-gray-600 hover:text-indigo-600 flex items-center gap-1"
                data-testid="navbar-logout"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <button className="md:hidden text-gray-600">
            <Menu size={24} />
          </button>
        </div>
      </div>

      <div className="bg-indigo-600 py-2">
        <div className="container mx-auto px-4">
          <p className="text-white text-center text-sm">
            Free shipping on all orders over $50! Shop now and save.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
