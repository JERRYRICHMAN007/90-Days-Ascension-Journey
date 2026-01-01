import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Dropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select...',
  className,
  align = 'center'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0, buttonWidth: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Calculate menu position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updatePosition = () => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          setMenuPosition({
            top: rect.bottom + 8,
            left: align === 'right' ? rect.right : align === 'center' ? rect.left + rect.width / 2 : rect.left,
            width: Math.max(rect.width, 200),
            buttonWidth: rect.width
          });
        }
      };

      updatePosition();
      
      // Update position on scroll or resize
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isOpen, align]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const target = event.target;
      
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    // Use capture phase and slight delay to ensure dropdown is rendered
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <>
      <div ref={dropdownRef} className={cn("relative", className)}>
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-4 py-2",
            "rounded-lg border bg-card hover:bg-muted/50",
            "transition-colors"
          )}
        >
          <span className={cn(
            "truncate",
            !selectedOption && "text-muted-foreground"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform flex-shrink-0",
            isOpen && "rotate-180"
          )} />
        </button>
      </div>

      {typeof document !== 'undefined' && isOpen && createPortal(
        <>
          {/* Invisible overlay to catch clicks */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999998,
              pointerEvents: 'auto',
            }}
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown menu */}
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
                width: `${menuPosition.width}px`,
                zIndex: 999999,
                pointerEvents: 'auto',
              }}
              className={cn(
                "bg-card border rounded-lg shadow-xl overflow-hidden"
              )}
            >
              <div className="max-h-60 overflow-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-muted transition-colors",
                      "flex items-center gap-2",
                      value === option.value && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {option.icon && <option.icon className="w-4 h-4" />}
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}
