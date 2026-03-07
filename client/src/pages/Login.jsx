// src/pages/Login.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // email format check
  const validateEmail = (value) => {
    setEmail(value);
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    setEmailValid(value.trim().length === 0 ? true : ok);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!emailValid) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const { data } = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      toast.success("Successfully logged in");
      setTimeout(() => {
        login(data.token);
        navigate("/");
      }, 900);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-6">
      <ToastContainer position="top-right" theme="dark" />

      {/* Main Card */}
      <div className="w-full max-w-6xl rounded-3xl shadow-2xl flex overflow-hidden bg-black/20 backdrop-blur-md border border-gray-800">
     
        <div className="w-2/5 p-14 flex flex-col justify-center gap-4 text-white">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 mb-8">Let's Login to your account</p>

          <motion.form
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
           
<div className="relative">
  <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => validateEmail(e.target.value)}
    required
    placeholder=" "                
    autoComplete="email"
    className={`peer w-full rounded-xl border ${
      emailValid ? "border-gray-600" : "border-red-500"
    } bg-transparent px-4 pt-6 pb-3 text-white outline-none
      focus:border-purple-500 focus:shadow-[0_0_0_1px_rgb(168,85,247)]
      transition`}
  />

  <label
    htmlFor="email"
    className="absolute left-3 top-4 text-gray-400 transition-all
      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-400
      peer-[&:not(:placeholder-shown)]:-top-2
      peer-[&:not(:placeholder-shown)]:text-xs
      peer-[&:not(:placeholder-shown)]:text-gray-300
      peer-autofill:-top-2 peer-autofill:text-xs peer-autofill:text-gray-300
      bg-[#111827] px-1"
  >
    Email 
  </label>

              <AnimatePresence>
                {!emailValid && email.trim().length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-2 text-xs text-red-400"
                  >
                    Please enter a valid email address
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            
           <div className="relative">
  <input
    id="password"
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    placeholder=" "
    autoComplete="current-password"
    className="peer w-full rounded-xl border border-gray-600
      bg-transparent px-4 pt-6 pb-3 pr-11 text-white outline-none
      focus:border-purple-500 focus:shadow-[0_0_0_1px_rgb(168,85,247)]
      transition"
  />

  <label
    htmlFor="password"
    className="absolute left-3 top-4 text-gray-400 transition-all
      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-400
      peer-[&:not(:placeholder-shown)]:-top-2
      peer-[&:not(:placeholder-shown)]:text-xs
      peer-[&:not(:placeholder-shown)]:text-gray-300
      peer-autofill:-top-2 peer-autofill:text-xs peer-autofill:text-gray-300
      bg-[#111827] px-1"
  >
    Enter Your Password
  </label>

  <button
    type="button"
    onClick={() => setShowPassword((s) => !s)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>

  <button
    type="button"
    onClick={() => setShowPassword((s) => !s)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
    aria-label={showPassword ? "Hide password" : "Show password"} >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>

  </div>
        
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    type="submit"
    className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition-all duration-300 cursor-pointer"
    >
    Login
    </motion.button>
    </motion.form>

          
    <p className="text-gray-400 text-sm mt-8 text-center">
      Don’t have an account?{" "}
      <Link
      to="/register"
      className="text-purple-400 hover:text-pink-400 hover:hand transition-colors">
      Sign up
      </Link>
      </p>
    
    </div>

  <div className="w-3/5 relative p-6">
  <video
    autoPlay
    muted
    loop
    playsInline
    className="w-full h-full object-cover rounded-2xl"
  >
    <source src="/videos/loginpage2.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-black/520 bg-backdrop-blur rounded-2xl"></div>
</div>
     </div>
    </div>
  );
};

export default Login;