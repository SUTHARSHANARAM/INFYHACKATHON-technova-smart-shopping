import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Sparkles,
  Menu,
  X,
  LogOut,
  Layers,
  ChevronDown,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cartService } from '../../services/cartService';
import { wishlistService } from '../../services/wishlistService';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types';

interface HeaderProps {
  onOpenAiDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAiDrawer }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res.data) setCategories(res.data);
    }).catch(console.error);
  }, []);

  const fetchCounts = () => {
    if (isAuthenticated) {
      cartService.getCart().then((res) => {
        if (res.data) setCartCount(res.data.itemCount || 0);
      }).catch(() => setCartCount(0));

      wishlistService.getWishlist().then((res) => {
        if (res.data) setWishlistCount(res.data.items?.length || 0);
      }).catch(() => setWishlistCount(0));
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetchCounts();
    window.addEventListener('cart-updated', fetchCounts);
    window.addEventListener('wishlist-updated', fetchCounts);
    return () => {
      window.removeEventListener('cart-updated', fetchCounts);
      window.removeEventListener('wishlist-updated', fetchCounts);
    };
  }, [isAuthenticated]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-techDark-900 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="bg-brand-500 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase">
          INFYHACKATHON 2.0
        </span>
        <span className="font-medium text-gray-200">
          Smart Technology. Smarter Shopping. Free Shipping across India on orders over ₹1,999!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 flex items-center gap-1">
                Tech<span className="text-brand-600">Nova</span>
              </span>
              <span className="block text-[10px] font-medium text-gray-400 -mt-1 tracking-wider uppercase">
                Electronics Store
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search smartphones, laptops, 4K monitors, SSDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* AI Shopping Assistant Button */}
            <button
              onClick={onOpenAiDrawer}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">AI Shopping Assistant</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Compare Link */}
            <Link
              to="/compare"
              className="p-2.5 text-gray-600 hover:text-brand-600 hover:bg-gray-50 rounded-xl transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
              title="Compare Products"
            >
              <Layers className="w-5 h-5" />
              <span className="hidden lg:inline">Compare</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-gray-600 hover:text-brand-600 hover:bg-gray-50 rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-600 hover:text-brand-600 hover:bg-gray-50 rounded-xl transition-colors"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline font-semibold text-xs text-gray-800 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <UserIcon className="w-4 h-4" /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <ShoppingBag className="w-4 h-4" /> Order History
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Category Navigation */}
      <nav className="bg-gray-50 border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 overflow-x-auto py-2.5 no-scrollbar">
            <Link to="/products" className="hover:text-brand-600 py-1 transition-colors flex-shrink-0">
              All Products
            </Link>

            {categories.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="hover:text-brand-600 py-1 transition-colors flex-shrink-0"
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/products?featured=true"
              className="text-amber-600 hover:text-amber-700 font-bold py-1 transition-colors flex items-center gap-1 flex-shrink-0"
            >
              🔥 Hot Deals
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="space-y-2 text-sm font-medium">
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-800 hover:text-brand-600"
            >
              All Products
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-gray-600 hover:text-brand-600 text-xs pl-2"
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-800 hover:text-brand-600"
            >
              Compare Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-800 hover:text-brand-600"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-800 hover:text-brand-600"
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-left py-2 text-rose-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-brand-600 font-bold"
              >
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
