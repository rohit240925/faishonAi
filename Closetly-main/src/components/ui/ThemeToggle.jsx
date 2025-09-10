import React, { useState } from 'react';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import Button from './Button';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = ({ 
  className = "", 
  showLabel = false, 
  size = "default",
  variant = "ghost",
  position = "relative"
}) => {
  const { theme, setTheme, isDark, isLight } = useTheme();

  const themeOptions = [
    { 
      value: 'light', 
      icon: Sun, 
      label: 'Light Mode',
      description: 'Clean bright interface',
      gradient: 'from-amber-400 to-orange-400'
    },
    { 
      value: 'dark', 
      icon: Moon, 
      label: 'Dark Mode',
      description: 'Easy on the eyes',
      gradient: 'from-slate-600 to-slate-800'
    },
    { 
      value: 'system', 
      icon: Monitor, 
      label: 'System',
      description: 'Follow system preference',
      gradient: 'from-blue-500 to-purple-600'
    }
  ];

  const currentOption = themeOptions?.find(option => option?.value === theme);
  const IconComponent = currentOption?.icon || Palette;

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // Enhanced theme toggle button with smooth transitions
  return (
    <div className={cn("relative", className)}>
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative overflow-hidden group transition-all duration-300",
          "hover:shadow-primary/20 hover:shadow-lg",
          "bg-gradient-to-r from-primary/5 via-transparent to-primary/5",
          "border border-border/50 hover:border-primary/30",
          showLabel && "space-x-2",
          isDark() && "bg-gradient-to-r from-primary/10 via-transparent to-primary/10",
          position === "fixed" && "fixed top-4 right-4 z-50"
        )}
        onClick={() => {
          // Cycle through themes: light -> dark -> system -> light
          const currentIndex = themeOptions?.findIndex(opt => opt?.value === theme);
          const nextIndex = (currentIndex + 1) % themeOptions?.length;
          handleThemeChange(themeOptions?.[nextIndex]?.value);
        }}
        title={`Switch to ${themeOptions?.[(themeOptions?.findIndex(opt => opt?.value === theme) + 1) % themeOptions?.length]?.label}`}
      >
        {/* Icon container with smooth rotation */}
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "flex items-center justify-center",
            size === "sm" ? "w-4 h-4" : "w-5 h-5"
          )}
        >
          <IconComponent 
            className={cn(
              "transition-all duration-300",
              size === "sm" ? "w-4 h-4" : "w-5 h-5",
              theme === 'light' && "text-amber-500",
              theme === 'dark' && "text-slate-300",
              theme === 'system' && "text-blue-500"
            )} 
          />
        </motion.div>

        {/* Label with theme name */}
        {showLabel && (
          <motion.span
            key={`${theme}-label`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="text-sm font-medium"
          >
            {currentOption?.label}
          </motion.span>
        )}

        {/* Subtle glow effect on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5",
          "rounded-md"
        )} />
      </Button>
      {/* Enhanced tooltip with theme preview */}
      <div className={cn(
        "absolute top-full mt-2 left-1/2 transform -translate-x-1/2",
        "opacity-0 group-hover:opacity-100 transition-all duration-300",
        "pointer-events-none z-50",
        position === "fixed" && "right-0 left-auto transform-none translate-x-0"
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={cn(
            "glass-card rounded-lg p-3 min-w-[200px]",
            "border border-border/20 shadow-lg"
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                `bg-gradient-to-r ${currentOption?.gradient}`
              )}>
                <IconComponent className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">{currentOption?.label}</p>
                <p className="text-xs text-muted-foreground">
                  {currentOption?.description}
                </p>
              </div>
            </div>
            
            {/* Theme preview dots */}
            <div className="flex space-x-1 pt-2">
              {themeOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleThemeChange(option?.value);
                  }}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-200",
                    `bg-gradient-to-r ${option?.gradient}`,
                    option?.value === theme 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110" :"hover:scale-105 opacity-70 hover:opacity-100"
                  )}
                  title={option?.label}
                />
              ))}
            </div>
          </div>
          
          {/* Arrow pointer */}
          <div className={cn(
            "absolute -top-1 left-1/2 transform -translate-x-1/2",
            "w-2 h-2 bg-card border-l border-t border-border/20 rotate-45",
            position === "fixed" && "right-4 left-auto transform-none translate-x-0"
          )} />
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced theme toggle with dropdown for more control
export const ThemeToggleDropdown = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const themeOptions = [
    { 
      value: 'light', 
      icon: Sun, 
      label: 'Light Mode',
      description: 'Clean bright interface',
      gradient: 'from-amber-400 to-orange-400'
    },
    { 
      value: 'dark', 
      icon: Moon, 
      label: 'Dark Mode',
      description: 'Easy on the eyes',
      gradient: 'from-slate-600 to-slate-800'
    },
    { 
      value: 'system', 
      icon: Monitor, 
      label: 'Auto',
      description: 'Follow system preference',
      gradient: 'from-blue-500 to-purple-600'
    }
  ];

  const currentOption = themeOptions?.find(option => option?.value === theme);

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "space-x-2 bg-gradient-to-r from-primary/5 via-transparent to-primary/5",
          "border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
        )}
      >
        <currentOption.icon className="w-4 h-4" />
        <span className="text-sm">{currentOption?.label}</span>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 w-56 glass-card rounded-xl p-2 border border-border/20 shadow-xl z-50"
            >
              <div className="space-y-1">
                {themeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => {
                      setTheme(option?.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                      "text-left hover:bg-primary/10",
                      option?.value === theme 
                        ? "bg-primary/10 text-primary border border-primary/20" :"hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      `bg-gradient-to-r ${option?.gradient}`
                    )}>
                      <option.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{option?.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {option?.description}
                      </p>
                    </div>
                    {option?.value === theme && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;