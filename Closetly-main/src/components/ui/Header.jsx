import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, CreditCard, Settings, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { cn } from '../../utils/cn';

const Header = () => {
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowUserMenu(false);
  }, [location?.pathname]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigation = [
    { name: 'AI Studio', href: '/ai-fashion-generation-studio', icon: Palette },
    { name: 'Portfolio', href: '/outfit-generator', icon: User },
    { name: 'Subscription', href: '/subscription-management', icon: CreditCard },
  ];

  const isActivePath = (path) => location?.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span>FashionGen</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user && navigation?.map((item) => (
              <Link
                key={item?.name}
                to={item?.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActivePath(item?.href)
                    ? "bg-primary/10 text-primary" :"text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item?.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle size="sm" />
            
            {user ? (
              <div className="relative" onClick={(e) => e?.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="space-x-2"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:inline-block">
                    {userProfile?.full_name || 'Account'}
                  </span>
                </Button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-border">
                          <p className="text-sm font-medium">{userProfile?.full_name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-muted-foreground">Credits: </span>
                            <span className="text-xs font-medium ml-1">
                              {userProfile?.current_api_credits || 0}
                            </span>
                          </div>
                        </div>
                        
                        <div className="py-1">
                          <button
                            onClick={() => navigate('/customer-portal')}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center space-x-2"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Account Settings</span>
                          </button>
                          <button
                            onClick={() => navigate('/subscription-management')}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center space-x-2"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Subscription</span>
                          </button>
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center space-x-2 text-destructive"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login-registration')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/login-registration')}
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <nav className="py-4 space-y-2">
                {user && navigation?.map((item) => (
                  <Link
                    key={item?.name}
                    to={item?.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      isActivePath(item?.href)
                        ? "bg-primary/10 text-primary" :"text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item?.name}</span>
                  </Link>
                ))}
                
                {!user && (
                  <div className="px-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => navigate('/login-registration')}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="w-full justify-start"
                      onClick={() => navigate('/login-registration')}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;