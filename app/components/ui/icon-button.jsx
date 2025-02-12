import { cn } from "../../lib/utils"

export function IconButton({ icon: Icon, label, href, className, ...props }) {
  return (
    <div
      className={cn("flex flex-col items-center gap-4 group transition-transform hover:scale-105", className)}
      {...props}
    >
      <div className="md:w-40 md:h-40 w-24 h-24 rounded-full bg-white flex items-center justify-center group-hover:shadow-xl transition-shadow cursor-pointer">
        <Icon className="md:w-20 w-12 text-[#3730E1]" />
      </div>
      <span className="text-lg md:text-2xl font-medium text-[#3730E1]">{label}</span>
    </div>
  )
}

// export function IconButton({ icon: Icon, label, href, className, ...props }) {
//   return (
//     <Link
//       href={href}
//       className={cn("flex flex-col items-center gap-4 group transition-transform hover:scale-105", className)}
//       {...props}
//     >
//       <div className="md:w-40 md:h-40 w-24 h-24 rounded-full bg-white flex items-center justify-center group-hover:shadow-xl transition-shadow">
//         <Icon className="md:w-20 w-12 text-[#3730E1]" />
//       </div>
//       <span className="text-2xl font-medium text-[#3730E1]">{label}</span>
//     </Link>
//   )
// }

