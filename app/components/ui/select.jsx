"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

export function Select({ options, placeholder, value, onChange, className, error, ...props }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative h-[2.875rem] md:h-[3.75rem]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full rounded-lg border h-[2.875rem] md:h-[3.75rem] bg-white px-4 py-3 text-left text-lg transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[#3730E1]",
          error ? "border-red-500" : "border-gray-300",
          !value && "text-gray-500",
          className,
        )}
        {...props}
      >
        {value || placeholder}
        <ChevronDown
          className={cn(
            "absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className={cn(
                "w-full px-4 py-2 text-left text-lg transition-colors hover:bg-gray-50",
                value === option.value && "text-[#3730E1]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

