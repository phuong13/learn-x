"use client"

import { useState, useRef, useEffect } from "react"

export function RippleButton({ children, color = "rgba(255, 255, 255, 0.3)", duration = 500, className, ...props }) {
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef(null)
  const counter = useRef(0)

  const addRipple = (event) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Calculate size based on button dimensions
    const size = Math.max(rect.width, rect.height) * 2

    // Add new ripple
    const newRipple = { x, y, size, id: counter.current }
    counter.current = counter.current + 1

    setRipples([...ripples, newRipple])
  }

  // Clean up ripples after animation completes
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples(ripples.slice(1))
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [ripples, duration])

  return (
    <button
      ref={buttonRef}
      className={`py-2 px-4  bg-gradient-to-br from-[#5BCEC9] to-[#14919B]
    shadow-md hover:shadow-lg text-white rounded-lg relative overflow-hidden ${className || ""}`}
      onClick={addRipple}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            borderRadius: "50%",
            backgroundColor: color,
            transform: "scale(0)",
            animation: `ripple ${duration}ms linear`,
          }}
        />
      ))}
      {children}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}
