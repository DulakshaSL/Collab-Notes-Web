// src/pages/Register.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (value) => {
    setEmail(value);
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    setEmailValid(value.trim().length === 0 ? true : ok);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!emailValid) {
      toast.error("Please enter a valid email");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      toast.success("Account created successfully");

      setTimeout(() => {
        login(data.token);
        navigate("/login");
      }, 900);

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] p-6">

      <ToastContainer position="top-right" theme="dark" />

      {/* Main Card */}
      <div className="w-full max-w-6xl rounded-3xl shadow-2xl flex overflow-hidden bg-black/20 backdrop-blur-md border border-gray-800">

        {/* LEFT SIDE VIDEO */}
        <div className="w-3/5 relative p-6">

          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-[650px] object-cover rounded-2xl"
          >
            <source src="/videos/img2.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-6 rounded-2xl" />

        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-3/5 p-14 flex flex-col justify-center gap-4 text-white">

          <h1 className="text-4xl font-bold mb-2">Let's Create an Account</h1>
          <p className="text-gray-400 mb-8">Write, share, and collaborate in one place.</p>

          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >

          
            <div className="relative">

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder=" "
                className="peer w-full rounded-xl border border-gray-600 bg-transparent px-4 pt-6 pb-3 text-white outline-none
                focus:border-purple-500 focus:shadow-[0_0_0_1px_rgb(168,85,247)] transition"
              />

              <label
                htmlFor="name"
                className="absolute left-3 top-4 text-gray-400 transition-all
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-400
                peer-[&:not(:placeholder-shown)]:-top-2
                peer-[&:not(:placeholder-shown)]:text-xs
                peer-[&:not(:placeholder-shown)]:text-gray-300
                bg-[#111827] px-1"
              >
                Full Name
              </label>

            </div>

            {/* Email */}
            <div className="relative">

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                required
                placeholder=" "
                className={`peer w-full rounded-xl border ${
                  emailValid ? "border-gray-600" : "border-red-500"
                } bg-transparent px-4 pt-6 pb-3 text-white outline-none
                focus:border-purple-500 focus:shadow-[0_0_0_1px_rgb(168,85,247)] transition`}
              />

              <label
                htmlFor="email"
                className="absolute left-3 top-4 text-gray-400 transition-all
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-400
                peer-[&:not(:placeholder-shown)]:-top-2
                peer-[&:not(:placeholder-shown)]:text-xs
                peer-[&:not(:placeholder-shown)]:text-gray-300
                bg-[#111827] px-1"
              >
                Email
              </label>

            </div>

            {/* Password */}
            <div className="relative">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
                className="peer w-full rounded-xl border border-gray-600 bg-transparent px-4 pt-6 pb-3 pr-11 text-white outline-none
                focus:border-purple-500 focus:shadow-[0_0_0_1px_rgb(168,85,247)] transition"
              />

              <label
                htmlFor="password"
                className="absolute left-3 top-4 text-gray-400 transition-all
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-400
                peer-[&:not(:placeholder-shown)]:-top-2
                peer-[&:not(:placeholder-shown)]:text-xs
                peer-[&:not(:placeholder-shown)]:text-gray-300
                bg-[#111827] px-1"
              >
                Enter Your Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

            
            <div className="relative">

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder=" "
                className="peer w-full rounded-xl border border-gray-600 bg-transparent px-4 pt-6 pb-3 pr-11 text-white outline-none
                focus:border-purple-500 focus:shadow-[0_0_0_1px_rgb(168,85,247)] transition"
              />

              <label
                htmlFor="confirmPassword"
                className="absolute left-3 top-4 text-gray-400 transition-all
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-400
                peer-[&:not(:placeholder-shown)]:-top-2
                peer-[&:not(:placeholder-shown)]:text-xs
                peer-[&:not(:placeholder-shown)]:text-gray-300
                bg-[#111827] px-1"
              >
                Confirm Your Password
              </label>

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transition-all duration-300 cursor-pointer"
            >
              Register
            </motion.button>

          </motion.form>

          <p className="text-gray-400 text-sm mt-8 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-pink-400 hover:hand"
            >
              Login
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Register;