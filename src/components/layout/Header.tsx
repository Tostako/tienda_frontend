import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, LogOut, UserCircle, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useBackendCategories } from '../../hooks/useBackend';
import { CATEGORIES as LOCAL_CATEGORIES } from '../../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

const staticLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Ofertas', href: '/ofertas' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { cartCount, setSearchQuery, customer, isAuthenticated, logout } = useApp();
  const { categories: backendCategories } = useBackendCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const allCategories = backendCategories && backendCategories.length > 0
    ? backendCategories
    : LOCAL_CATEGORIES.map((c) => ({ id: c.slug, name: c.name, image: '' }));

  const mainCategories = allCategories.slice(0, 2);
  const dropdownCategories = allCategories;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setSearchQuery(searchValue.trim());
      navigate(`/catalogo?search=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchOpen(false);
      setSearchValue('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  const isCategoryActive = (catId: string) => location.pathname === `/catalogo/${catId}`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-luxe-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-montserrat font-bold tracking-[0.3em] text-luxe-black">
              LUXE
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {staticLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-xs font-montserrat font-medium uppercase tracking-wider transition-colors hover:text-luxe-blue ${
                  isActive(link.href) ? 'text-luxe-blue' : 'text-luxe-black'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {mainCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo/${cat.id}`}
                className={`text-xs font-montserrat font-medium uppercase tracking-wider transition-colors hover:text-luxe-blue ${
                  isCategoryActive(cat.id) ? 'text-luxe-blue' : 'text-luxe-black'
                }`}
              >
                {cat.name}
              </Link>
            ))}

            {/* More categories dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 text-xs font-montserrat font-medium uppercase tracking-wider transition-colors hover:text-luxe-blue ${
                  allCategories.some((c) => isCategoryActive(c.id)) && !mainCategories.some((c) => isCategoryActive(c.id))
                    ? 'text-luxe-blue'
                    : 'text-luxe-black'
                }`}
              >
                Mas Categorias
                <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white border border-luxe-gray shadow-lg py-2"
                  >
                    {dropdownCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/catalogo/${cat.id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className={`block px-4 py-2 text-sm font-montserrat transition-colors hover:bg-luxe-gray-light hover:text-luxe-blue ${
                          isCategoryActive(cat.id) ? 'text-luxe-blue font-semibold' : 'text-luxe-black'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/sobre-nosotros"
              className={`text-xs font-montserrat font-medium uppercase tracking-wider transition-colors hover:text-luxe-blue ${
                location.pathname === '/sobre-nosotros' ? 'text-luxe-blue' : 'text-luxe-black'
              }`}
            >
              Sobre Nosotros
            </Link>
            <Link
              to="/contacto"
              className={`text-xs font-montserrat font-medium uppercase tracking-wider transition-colors hover:text-luxe-blue ${
                location.pathname === '/contacto' ? 'text-luxe-blue' : 'text-luxe-black'
              }`}
            >
              Contacto
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-luxe-black hover:text-luxe-blue transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              to="/carrito"
              className="relative p-2 text-luxe-black hover:text-luxe-blue transition-colors"
              aria-label="Carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-luxe-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth: Desktop */}
            {isAuthenticated && customer ? (
              <div className="hidden sm:block relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="max-w-[80px] truncate">{customer.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white border border-luxe-gray shadow-lg py-2"
                    >
                      <div className="px-4 py-2 border-b border-luxe-gray-light">
                        <p className="text-sm font-montserrat font-medium text-luxe-black truncate">{customer.name}</p>
                        <p className="text-xs font-montserrat text-luxe-gray-medium truncate">{customer.email}</p>
                      </div>
                      <Link
                        to="/cuenta"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-montserrat text-luxe-black hover:bg-luxe-gray-light hover:text-luxe-blue transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Mi Cuenta
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-montserrat text-luxe-black hover:bg-luxe-gray-light hover:text-luxe-coral transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:block p-2 text-luxe-black hover:text-luxe-blue transition-colors"
                aria-label="Iniciar sesion"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-luxe-black hover:text-luxe-blue transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-b border-luxe-gray"
          >
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full px-4 py-3 pr-12 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-luxe-gray-medium hover:text-luxe-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white z-50 shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-luxe-gray">
                <span className="text-lg font-montserrat font-bold tracking-[0.3em]">LUXE</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-luxe-black hover:text-luxe-blue transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex flex-col p-4">
                {isAuthenticated && customer && (
                  <div className="px-4 py-3 mb-2 bg-luxe-gray-light">
                    <p className="text-sm font-montserrat font-medium text-luxe-black">{customer.name}</p>
                    <p className="text-xs font-montserrat text-luxe-gray-medium">{customer.email}</p>
                  </div>
                )}
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors border-b border-luxe-gray-light"
                >
                  Inicio
                </Link>
                {allCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/catalogo/${cat.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors border-b border-luxe-gray-light"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  to="/ofertas"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors border-b border-luxe-gray-light"
                >
                  Ofertas
                </Link>
                <Link
                  to="/sobre-nosotros"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors border-b border-luxe-gray-light"
                >
                  Sobre Nosotros
                </Link>
                <Link
                  to="/contacto"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors border-b border-luxe-gray-light"
                >
                  Contacto
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/cuenta"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 py-3 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors border-b border-luxe-gray-light"
                    >
                      <User className="w-4 h-4" />
                      Mi Cuenta
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="flex items-center gap-2 py-3 mt-2 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-coral transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 py-3 mt-4 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors border-b border-luxe-gray-light"
                    >
                      <User className="w-4 h-4" />
                      Iniciar Sesion
                    </Link>
                    <Link
                      to="/registro"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 py-3 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Crear Cuenta
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
