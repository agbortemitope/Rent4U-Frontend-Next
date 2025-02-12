const Input = ({ label, id, type = "text", className = "", ...props }) => (
	<div className="flex flex-col">
		<label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
			{label}
		</label>
		<input
			id={id}
			type={type}
			className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
			{...props}
		/>
	</div>
)

export default Input

