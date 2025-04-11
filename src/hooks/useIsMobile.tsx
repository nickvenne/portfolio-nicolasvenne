import { useState, useEffect } from "react";

/**
 * Hook to detect if the device is mobile
 * @returns {boolean} Whether the device is mobile
 */
export function useIsMobile() {
  // Initialize with false for SSR
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Check if the device is mobile
    const checkMobile = () => {
      const mobile = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
        window.matchMedia("(max-width: 768px)").matches;
      
      setIsMobile(mobile);
    };
    
    // Initial check
    checkMobile();
    
    // Recheck on resize (in case of orientation changes or window resizing)
    const handleResize = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return isMobile;
}