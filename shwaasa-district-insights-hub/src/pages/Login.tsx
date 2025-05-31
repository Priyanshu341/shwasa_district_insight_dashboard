// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     const ADMIN_USERNAME = "admin";
//     const ADMIN_PASSWORD = "admin123"; // Change to env or secure method later

//     if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
//       localStorage.setItem("isAdminLoggedIn", "true");
//       navigate("/dashboard");
//     } else {
//       setError("Invalid credentials. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background">
//       <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
//         <h2 className="text-2xl font-bold mb-4">Admin Login</h2>

//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full border p-2 mb-3 rounded"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 mb-4 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90">
//           Log In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../components/assets/logo_transparent_background.png"; // adjust path if needed

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "SETV12345$";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-[#D6B3FF]">
      <div className="w-full h-[650px] max-w-md p-8 bg-[#FFC1E3] rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto w-40 mb-3 h-35"
          />
          <h1 className="text-3xl font-bold mt-5 text-orange-600">
            Telangana District Dashboard
          </h1>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4 text-black">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full p-2 mt-1 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-2 mt-1 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

