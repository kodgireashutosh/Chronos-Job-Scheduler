
const Input = ({ label, id, type = "text", placeholder, ...props }) => (
  <div className="mb-5">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-slate-700 mb-1.5"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
      placeholder={placeholder}
      {...props}
    />
  </div>
);

export default Input;