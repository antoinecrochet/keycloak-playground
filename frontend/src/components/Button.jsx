import React from 'react'

export default function Button({ children, variant = 'primary', ...props }) {
  const base = "px-3 py-1 rounded transition-all duration-150 active:scale-95";
  const variants = {
    primary: "bg-indigo-600 text-white shadow-md hover:bg-indigo-700",
    secondary: "border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-100",
    danger: "bg-red-600 text-white shadow-md hover:bg-red-700",
  };
        //   <button onClick={handleLogin} className="px-3 py-1 bg-indigo-600 text-white rounded">Login</button>
        //   <button onClick={handleLogout} className="px-3 py-1 border rounded">Logout</button>
        //   <button onClick={() => kc && kc.updateToken(5).then(() => setKc({ ...kc })).catch(() => { })} className="px-3 py-1 border rounded">Refresh token</button>
  return (
    <button {...props} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}