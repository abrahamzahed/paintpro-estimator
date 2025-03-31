
import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  autoSelectOnFocus?: boolean;
  integerOnly?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autoSelectOnFocus, integerOnly, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const combinedRef = useCombinedRefs(ref, inputRef);

    // Handle focus event to select all text when focused
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      if (autoSelectOnFocus && inputRef.current) {
        inputRef.current.select();
      }
      
      if (props.onFocus) {
        props.onFocus(e);
      }
    }, [autoSelectOnFocus, props.onFocus]);

    // Handle keypress to only allow integers if specified
    const handleKeyPress = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (integerOnly) {
        // Allow only digits, backspace, delete, tab, arrows, home, end
        const isDigit = /^\d$/.test(e.key);
        const isControlKey = [
          'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
          'Tab', 'Home', 'End'
        ].includes(e.key);
        
        if (!isDigit && !isControlKey) {
          e.preventDefault();
        }
      }
      
      if (props.onKeyPress) {
        props.onKeyPress(e);
      }
    }, [integerOnly, props.onKeyPress]);

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={combinedRef}
        onFocus={handleFocus}
        onKeyPress={handleKeyPress}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Helper to combine refs
function useCombinedRefs<T>(
  ...refs: Array<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return React.useCallback((element: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as React.MutableRefObject<T>).current = element;
      }
    });
  }, [refs]);
}

export { Input }
