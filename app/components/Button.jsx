const Button = ({ children, type = "button", className = "", ...props }) => (
  <button
    type={type}
    className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
)

export default Button

