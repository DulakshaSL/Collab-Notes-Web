import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", { name, email, password });
      login(data.token);
      navigate("/"); // redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.form
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-gray-900 bg-opacity-80 p-10 rounded-2xl shadow-2xl w-96 flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-white text-center">Register</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 rounded-lg bg-gray-800 bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-lg font-semibold text-white"
        >
          Register
        </motion.button>

        <p className="text-gray-300 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;