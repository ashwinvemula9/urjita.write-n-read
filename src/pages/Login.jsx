import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/ReusableComponents";
import { authAPI } from "../services/api/endpoints";
import logo from "../assets/logo.svg";
import AnimatedBackground from "../components/common/AnimatedBackground";
import GlossyText from "../components/common/GlossyText";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("ashwin_design@design.com");
  const [password, setPassword] = useState("ashwin_design");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const signInHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      console.log("response", response);
      if (response?.access) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            accessToken: response.access,
            refreshToken: response.refresh,
            role: response.role,
            full_name: response.full_name,
          })
        );
        toast.success("Successfully logged in!");
        navigate("/");
      } else {
        throw new Error(response?.data?.error?.message);
      }
    } catch (error) {
      console.log("error", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password";
      toast.error(errorMessage);
      setPassword(""); // Clear password on failed login
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("pass", { confirmPassword, newPassword });
    if (confirmPassword !== newPassword) {
      toast.error("Passwords did not match, try again");
      return;
    }
    try {
      await authAPI.requestPasswordReset({ email, password });

      toast.success("Password reset successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form className="space-y-6" onSubmit={signInHandler}>
      <div className="space-y-5">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Email
          </label>
          <div
            className="flex items-center bg-neutral-50 rounded-xl border border-neutral-200 
                         transition-all duration-300 ease-in-out group
                         hover:border-indigo-400 focus-within:border-indigo-500 
                         focus-within:ring-2 focus-within:ring-indigo-500/20"
          >
            <div className="flex items-center justify-center w-12">
              <Mail className="h-5 w-5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="block w-full bg-transparent py-3 px-2 text-neutral-900 
                       placeholder:text-neutral-400 focus:outline-none sm:text-sm"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Password
          </label>
          <div
            className="flex items-center bg-neutral-50 rounded-xl border border-neutral-200 
                         transition-all duration-300 ease-in-out group
                         hover:border-indigo-400 focus-within:border-indigo-500 
                         focus-within:ring-2 focus-within:ring-indigo-500/20"
          >
            <div className="flex items-center justify-center w-12">
              <Lock className="h-5 w-5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="block w-full bg-transparent py-3 px-2 text-neutral-900 
                       placeholder:text-neutral-400 focus:outline-none sm:text-sm"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center justify-center w-12 hover:text-neutral-600 
                       transition-colors duration-200"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-neutral-400 hover:text-indigo-500 transition-colors" />
              ) : (
                <Eye className="h-5 w-5 text-neutral-400 hover:text-indigo-500 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-sm text-indigo-600 hover:text-indigo-500 font-medium 
                   transition-colors duration-200 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full h-12 rounded-xl transform transition-all duration-300 ease-out
                hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        disabled={loading}
      >
        <span className="flex items-center justify-center space-x-2">
          <span>{loading ? "Signing in..." : "Sign in"}</span>
          {!loading && <ArrowRight className="w-5 h-5" />}
        </span>
      </Button>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <div className="space-y-6">
      {!resetEmailSent ? (
        <form onSubmit={handleForgotPassword} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <div
              className="flex items-center bg-neutral-50 rounded-xl border border-neutral-200 
                           transition-all duration-300 ease-in-out group
                           hover:border-indigo-400 focus-within:border-indigo-500 
                           focus-within:ring-2 focus-within:ring-indigo-500/20"
            >
              <div className="flex items-center justify-center w-12">
                <Mail className="h-5 w-5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="block w-full bg-transparent py-3 px-2 text-neutral-900 
                         placeholder:text-neutral-400 focus:outline-none sm:text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* New Password Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              New Password
            </label>
            <div
              className="flex items-center bg-neutral-50 rounded-xl border border-neutral-200 
                           transition-all duration-300 ease-in-out group
                           hover:border-indigo-400 focus-within:border-indigo-500 
                           focus-within:ring-2 focus-within:ring-indigo-500/20"
            >
              <div className="flex items-center justify-center w-12">
                <Lock className="h-5 w-5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="block w-full bg-transparent py-3 px-2 text-neutral-900 
                         placeholder:text-neutral-400 focus:outline-none sm:text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Confirm Password
            </label>
            <div
              className="flex items-center bg-neutral-50 rounded-xl border border-neutral-200 
                           transition-all duration-300 ease-in-out group
                           hover:border-indigo-400 focus-within:border-indigo-500 
                           focus-within:ring-2 focus-within:ring-indigo-500/20"
            >
              <div className="flex items-center justify-center w-12">
                <Lock className="h-5 w-5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                className="block w-full bg-transparent py-3 px-2 text-neutral-900 
                         placeholder:text-neutral-400 focus:outline-none sm:text-sm"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 rounded-xl transform transition-all duration-300 ease-out
                    hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            disabled={loading}
          >
            <span className="flex items-center justify-center space-x-2">
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </span>
          </Button>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-full mx-auto flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900">
            Check Your Email
          </h3>
          <p className="text-neutral-600">
            We've sent password reset instructions to {email}
          </p>
        </div>
      )}

      <button
        onClick={() => {
          setShowForgotPassword(false);
          setResetEmailSent(false);
        }}
        className="flex items-center text-sm text-indigo-600 hover:text-indigo-500 
                 font-medium transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to login
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex bg-neutral-900">
      <div className="hidden lg:flex w-1/2 p-12 relative overflow-hidden">
        <AnimatedBackground />
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-pink-500/30 to-transparent rounded-full blur-3xl opacity-30 top-[-200px] left-[-150px]"></div>
          <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl opacity-30 bottom-[-100px] right-[-100px]"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full items-start text-left">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24">
              <img src={logo} alt="Logo" style={{ filter: "invert(1)" }} />
            </div>
            <div className="flex flex-col">
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"
                style={{
                  backgroundSize: "50px 50px",
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
                }}
              ></div>
              <span
                className="text-4xl font-extrabold text-white bg-clip-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                URJITA
              </span>
              <span className="text-sm font-medium text-white/70 tracking-widest uppercase">
                Electronics
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-8">
            <h1
              className="text-7xl lg:text-8xl font-black text-white"
              style={{
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "-0.05em",
                lineHeight: "1.1",
              }}
            >
              Welcome <br /> to the <br />
              <GlossyText />
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-lg font-light">
              Powering innovation through precision: Where advanced PCB
              manufacturing meets uncompromising quality standards
            </p>
          </div>

          <div className="flex items-center space-x-6 mt-auto">
            <span className="text-white/30 text-sm">|</span>
            <span className="text-white/50 text-sm">
              © 2025 Urjita Electronics
            </span>
          </div>
        </div>
      </div>
      {/* <DesignerInterface /> */}

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent leading-relaxed">
              {showForgotPassword ? "Reset Password" : "Sign in"}
            </h2>
            {showForgotPassword && !resetEmailSent && (
              <p className="mt-2 text-neutral-600 text-sm">
                Enter your email address and we'll send you instructions to
                reset your password.
              </p>
            )}
          </div>

          {showForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
