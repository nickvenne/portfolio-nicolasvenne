import { cn } from "~/lib/utils";
import React, {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
} from "react";
import { useSpring } from "framer-motion";
import { useIsMobile } from "~/hooks/useIsMobile";

interface StarProps {
  x: number;
  y: number;
  initialX: number;
  initialY: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number | null;
  parallaxFactor: number;
}

interface StarBackgroundProps {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  parallaxIntensity?: number;
  className?: string;
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00015,
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  parallaxIntensity = 0.05, 
  className,
}) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const isMobile = useIsMobile();
  const springX = useSpring(0, { damping: 30, stiffness: 100, mass: 0.5 });
  const springY = useSpring(0, { damping: 30, stiffness: 100, mass: 0.5 });
  const scrollSpring = useSpring(0, { 
    damping: isMobile ? 40 : 25, 
    stiffness: isMobile ? 60 : 80, 
    mass: isMobile ? 1.5 : 1 
  });
  
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(null);

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle =
          allStarsTwinkle || Math.random() < twinkleProbability;
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x: x,
          y: y,
          initialX: x,
          initialY: y,
          radius: Math.random() * 0.05 + 0.5,
          opacity: Math.random() * 0.5 + 0.5,
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed +
              Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
          parallaxFactor: Math.random() * 0.6 + 0.2
        };
      });
    },
    [
      starDensity,
      allStarsTwinkle,
      twinkleProbability,
      minTwinkleSpeed,
      maxTwinkleSpeed,
    ]
  );

  useEffect(() => {
    const initCanvas = () => {
      if (!canvasRef.current) return;
      
      let width: number, height: number;
      
      if (isMobile) {
        width = window.screen.width;
        height = window.screen.height;
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }
      
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      
      setCanvasSize({ width, height });
      setStars(generateStars(width, height));
    };
    
    initCanvas();
    
    const handleResize = () => {
      if (isMobile) return;
      if (canvasRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update canvas size and regenerate stars
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        
        setCanvasSize({ width, height });
        setStars(generateStars(width, height));
      }
    };
    
    if (!isMobile) {
      let resizeTimeout: ReturnType<typeof setTimeout>;
      
      const debouncedResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 200);
      };
      
      window.addEventListener('resize', debouncedResize);
      
      return () => {
        window.removeEventListener('resize', debouncedResize);
        clearTimeout(resizeTimeout);
      };
    } else {
      const handleOrientationChange = () => {
        setTimeout(() => {
          if (canvasRef.current) {
            const width = window.screen.width;
            const height = window.screen.height;
            
            const canvas = canvasRef.current;
            canvas.width = width;
            canvas.height = height;
            
            setCanvasSize({ width, height });
            setStars(generateStars(width, height));
          }
        }, 300);
      };
      
      window.addEventListener('orientationchange', handleOrientationChange);
      
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    }
  }, [generateStars, isMobile]);
  
  useEffect(() => {
    springX.set(0);
    springY.set(0);
    
    if (isMobile) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
        const y = ((event.clientY - rect.top) / canvas.height) * 2 - 1;
        
        springX.set(x);
        springY.set(y);
        
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [springX, springY, isMobile]);
  
  useEffect(() => {
    if (isMobile) {
      scrollSpring.set(0);
      return;
    }
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollSpring.set(currentScrollY);
      setScrollPosition(currentScrollY);
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollSpring]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (stars.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const springOffsetX = springX.get();
      const springOffsetY = springY.get();
      const currentScrollY = scrollSpring.get();
      
      stars.forEach((star) => {
        let mouseOffsetX = 0;
        let mouseOffsetY = 0;
        
        if (!isMobile) {
          mouseOffsetX = springOffsetX * star.parallaxFactor * parallaxIntensity * canvas.width;
          mouseOffsetY = springOffsetY * star.parallaxFactor * parallaxIntensity * canvas.height;
        }
        
        const scrollOffsetY = isMobile 
          ? 0 
          : -currentScrollY * (1 - star.parallaxFactor * 0.8);
        
        const drawX = star.initialX + mouseOffsetX;
        
        let baseY = star.initialY + mouseOffsetY + scrollOffsetY;
        
        const totalHeight = canvas.height * (isMobile ? 2.5 : 1.5);
        
        let wrappedY = ((baseY % totalHeight) + totalHeight) % totalHeight;
        
        ctx.beginPath();
        ctx.arc(drawX, wrappedY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        if (wrappedY > totalHeight - canvas.height * 0.2) {
          ctx.beginPath();
          ctx.arc(drawX, wrappedY - totalHeight, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fill();
        }
        
        if (wrappedY < canvas.height * 0.2) {
          ctx.beginPath();
          ctx.arc(drawX, wrappedY + totalHeight, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fill();
        }

        if (star.twinkleSpeed !== null) {
          star.opacity =
            0.5 +
            Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [stars, parallaxIntensity, springX, springY, scrollSpring, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full fixed inset-0", className)}
    />
  );
};
