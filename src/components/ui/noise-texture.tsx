import { useEffect, useRef } from "react"

export function PerlinNoiseTexture({
  opacity = 0.15,
  className = "",
  color = "#ffffff",
}: {
  opacity?: number
  className?: string
  color?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Generate noise pattern once and use it for all instances
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    // Create the noise once at a fixed size
    const noiseSize = 256
    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = noiseSize
    offscreenCanvas.height = noiseSize
    const offCtx = offscreenCanvas.getContext('2d')
    
    if (!offCtx) return
    
    // Generate the noise pattern once
    const generateNoisePattern = () => {
      const imageData = offCtx.createImageData(noiseSize, noiseSize)
      const data = imageData.data
      
      // Parse the color to RGB
      const div = document.createElement("div")
      div.style.color = color
      document.body.appendChild(div)
      const rgbColor = window.getComputedStyle(div).color
      document.body.removeChild(div)
    
      // Extract RGB values
      const rgbMatch = rgbColor.match(/\d+/g)
      const r = rgbMatch ? Number.parseInt(rgbMatch[0]) : 255
      const g = rgbMatch ? Number.parseInt(rgbMatch[1]) : 255
      const b = rgbMatch ? Number.parseInt(rgbMatch[2]) : 255
    
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random()
        data[i] = r * value     // Red
        data[i + 1] = g * value // Green
        data[i + 2] = b * value // Blue
        data[i + 3] = 255       // Alpha
      }
    
      offCtx.putImageData(imageData, 0, 0)
    }
    
    generateNoisePattern()
    
    // Function to resize canvas and tile the noise pattern
    const updateCanvas = () => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        // Get parent dimensions
        const parent = canvas.parentElement
        if (!parent) return
        
        const rect = parent.getBoundingClientRect()
        
        // Set canvas size to match parent
        canvas.width = rect.width
        canvas.height = rect.height
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Create a pattern from the noise and fill the canvas
        const pattern = ctx.createPattern(offscreenCanvas, 'repeat')
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      })
    }
    
    // Initial update
    updateCanvas()
    
    // Debounce resize to avoid performance issues
    let resizeTimeout: number | null = null
    let rafId: number | null = null
    
    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout)
      }
      
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
      
      resizeTimeout = window.setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          updateCanvas()
          rafId = null
        })
      }, 100)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Store orientation change handler reference for cleanup
    const handleOrientationChange = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout)
      }
      
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
      
      resizeTimeout = window.setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          updateCanvas()
          rafId = null
        })
      }, 200)
    }
    
    window.addEventListener('orientationchange', handleOrientationChange)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
      
      // Clean up any pending timers and animations
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout)
      }
      
      if (rafId) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [color])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity, zIndex: 1 }}
    />
  )
}

