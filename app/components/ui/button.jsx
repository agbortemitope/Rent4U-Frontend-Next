import { cn } from "../../lib/utils"

export function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={cn(
        "w-full rounded-lg px-4 py-3 h-[2.875rem] md:h-[3.75rem] text-center md:text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#3730E1] focus:ring-offset-2",
        variant === "primary" && "bg-[#3730E1] text-white hover:bg-[#2820D9]",
        variant === "secondary" && "text-[#3730E1] border-2 border-[#3730E1] hover:bg-[#3730E1]/5",
        className,
      )}
      {...props}
    />
  )
}

