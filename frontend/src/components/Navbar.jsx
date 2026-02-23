import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/userContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const { Logout, user, loading } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const handleOnlogout = async () => {
    await Logout();
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll Progress Logic
  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setScrollProgress(Number((currentScrollY / scrollHeight).toFixed(4)) * 100);
      }
    };
    window.addEventListener("scroll", updateScroll);
    updateScroll(); // initialize on mount
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const isTransparent = location.pathname === '/' && !isScrolled;

  const getLinkClasses = (isActive) => {
    return `group relative text-sm tracking-wide font-medium transition-colors duration-300 py-2 inline-block ${isActive
      ? (isTransparent ? 'text-white' : 'text-[var(--color-espresso)]')
      : (isTransparent ? 'text-white/80 hover:text-white' : 'text-[var(--color-charcoal)] hover:text-[var(--color-espresso)]')
      }`;
  };

  const getButtonClasses = (isActive) => {
    return `group relative text-sm tracking-wide font-medium transition-colors duration-300 py-2 flex items-center gap-1 ${isActive
      ? (isTransparent ? 'text-white' : 'text-[var(--color-espresso)]')
      : (isTransparent ? 'text-white/80 hover:text-white' : 'text-[var(--color-charcoal)] hover:text-[var(--color-espresso)]')
      }`;
  };

  const getUnderlineClasses = (isActive) => {
    return `absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] transition-all duration-300 ${isTransparent ? 'bg-white/80' : 'bg-[var(--color-espresso)]'
      } ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`;
  };

  return (
    <nav className={`top-0 z-50 w-full transition-all duration-300 font-sans-lux ${location.pathname === '/'
      ? isScrolled
        ? 'fixed bg-white/90 backdrop-blur-2xl border-b border-black/[0.04] shadow-sm'
        : 'fixed bg-transparent border-transparent shadow-none'
      : 'sticky bg-white/90 backdrop-blur-2xl border-b border-black/[0.04] shadow-sm'
      }`}>
      {/* Scroll Progress Bar at the Top Edge */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] transition-all ease-out duration-150 ${isTransparent ? 'bg-white/30' : 'bg-[var(--color-espresso)]'}`}
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-5 flex justify-between items-center relative z-10">
        {/* Logo */}
        <Link to="/" className={`font-serif-lux text-3xl md:text-4xl font-bold tracking-tight hover:opacity-70 transition-opacity drop-shadow-sm ${isTransparent ? 'text-white' : 'text-[var(--color-espresso)]'}`}>
          KD Luxe
        </Link>

        {/* Menu */}
        <ul className="hidden md:flex space-x-10 items-center">
          <li>
            <Link to="/" className={getLinkClasses(location.pathname === '/')}>
              Home
              <span className={getUnderlineClasses(location.pathname === '/')}></span>
            </Link>
          </li>
          <li>
            <Link to="/product" className={getLinkClasses(location.pathname.startsWith('/product'))}>
              Collection
              <span className={getUnderlineClasses(location.pathname.startsWith('/product'))}></span>
            </Link>
          </li>

          <li>
            <button
              onClick={() => user ? navigate("/cart") : navigate("/login")}
              className={`group relative text-sm tracking-wide font-medium transition-colors duration-300 py-2 flex items-center gap-2 ${location.pathname === '/cart'
                ? (isTransparent ? 'text-white drop-shadow-md' : 'text-[var(--color-espresso)]')
                : (isTransparent ? 'text-white/80 hover:text-white drop-shadow-md' : 'text-[var(--color-charcoal)] hover:text-[var(--color-espresso)]')
                }`}
            >
              Cart
              {cart.length > 0 && user && (
                <span className={`bg-[var(--color-espresso)] text-white text-[10px] px-1.5 py-0.5 rounded-full tracking-widest leading-none font-bold shadow-sm`}>
                  {cart.length}
                </span>
              )}
              <span className={getUnderlineClasses(location.pathname === '/cart')}></span>
            </button>
          </li>

          <li>
            <button
              onClick={() => user ? navigate("/order") : navigate("/login")}
              className={getButtonClasses(location.pathname === '/order')}
            >
              Orders
              <span className={getUnderlineClasses(location.pathname === '/order')}></span>
            </button>
          </li>

          {user && user.role === "admin" && (
            <li>
              <Link to="/admindashboard" className={getLinkClasses(location.pathname === '/admindashboard')}>
                Admin
                <span className={getUnderlineClasses(location.pathname === '/admindashboard')}></span>
              </Link>
            </li>
          )}

          {user && user.role === "seller" && (
            <li>
              <Link to="/sellerdashboard" className={getLinkClasses(location.pathname === '/sellerdashboard')}>
                Atelier
                <span className={getUnderlineClasses(location.pathname === '/sellerdashboard')}></span>
              </Link>
            </li>
          )}

          {loading ? (
            <li className="ml-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse border border-black/5"></div>
            </li>
          ) : user ? (
            <li className="relative ml-4" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                {/* User profile circle */}
                <div className={`w-10 h-10 rounded-full border transition-colors overflow-hidden flex items-center justify-center shadow-sm bg-gray-50 border-black/10 group-hover:border-[var(--color-espresso)]`}>
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className={`font-sans-lux font-medium text-sm leading-none mt-1 text-[var(--color-espresso)]`}>
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </button>

              {/* Dropdown Menu - Clean White Card */}
              {showDropdown && (
                <div className="absolute right-0 mt-4 w-60 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/[0.04] py-2 animate-fade-in-up">
                  <div className="px-5 py-4 border-b border-black/[0.04]">
                    <p className="text-sm font-semibold text-[var(--color-espresso)] truncate">{user.name}</p>
                    <p className="text-xs text-[var(--color-charcoal)] mt-1 truncate">{user.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-[var(--color-charcoal)] hover:bg-gray-50 hover:text-[var(--color-espresso)] transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleOnlogout}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-[var(--color-charcoal)] hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </li>
          ) : (
            <li className="ml-4">
              <button
                onClick={() => navigate("/login")}
                className={`px-6 py-2.5 text-sm font-semibold transition-colors rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transform bg-[var(--color-espresso)] text-white hover:bg-black`}
              >
                Sign In
              </button>
            </li>
          )}
        </ul>

        {/* Mobile Icon */}
        <div className={`md:hidden text-2xl cursor-pointer hover:opacity-70 transition-opacity drop-shadow-sm ${isTransparent ? 'text-white' : 'text-[var(--color-espresso)]'}`}>
          ☰
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
