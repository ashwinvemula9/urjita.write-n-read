import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Animated background component remains the same
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <FloatingElement key={i} index={i} />
      ))}
    </div>
  );
};

const FloatingElement = ({ index }) => {
  const size = 50 + Math.random() * 100;
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  const baseDelay = -index * 2;

  return (
    <div
      className="absolute rounded-full bg-gradient-to-br from-white/20 to-white/5 
                 backdrop-blur-3xl transition-all duration-300 ease-in-out
                 animate-float"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
        animationDelay: `${baseDelay}s`,
        animationDuration: '20s',
      }}
    >
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent 
                   animate-pulse"
        style={{ animationDelay: `${baseDelay + 1}s` }}
      />
    </div>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const signInHandler = (e) => {
    e.preventDefault();
    login({ user: "Designer", userType: "designer", token: "siiyqqoioiw" });
    toast.success("SignIn Successful", { autoClose: 1500 });
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 p-12 relative overflow-hidden">
        <AnimatedBackground />

        {/* Dynamic Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-primary-500 to-transparent rounded-full blur-3xl opacity-50 top-[-150px] left-[-150px]"></div>
          <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-accent-500 to-transparent rounded-full blur-2xl opacity-40 bottom-[-100px] right-[-100px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full items-start text-left">
          {/* Branding */}
          <div className="flex items-center space-x-4">
            <Cpu className="w-12 h-12 text-white drop-shadow-xl" />
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                URJITA
              </span>
              <span className="text-sm font-medium text-white/80 tracking-widest uppercase">
                Electronics 
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-6xl lg:text-8xl font-extrabold text-white"
                style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.05em', lineHeight: '1.1' }}>
              Welcome <br /> to the <br />
              <span className="text-transparent bg-gradient-to-r from-accent-500 to-accent-400 bg-clip-text">
                Future
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed max-w-lg">
              Join us as we redefine possibilities. Experience innovation at its
              peak, where imagination meets technology.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center space-x-6 mt-auto">
            <span className="text-white/50 text-sm">|</span>
            <span className="text-white/70 text-sm">© 2025 Urjita Electronics</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-neutral-900">Sign in</h2>
          </div>

          <form className="space-y-6" onSubmit={signInHandler}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <div className="flex items-center bg-neutral-50 rounded-lg border border-neutral-300 
                               transition-all duration-300 ease-in-out
                               hover:border-primary-400 focus-within:border-primary-500 
                               focus-within:ring-2 focus-within:ring-primary-500/50">
                  <div className="flex items-center justify-center w-12">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="block w-full bg-transparent py-3 px-2 text-neutral-900 
                             placeholder:text-neutral-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="flex items-center bg-neutral-50 rounded-lg border border-neutral-300 
                               transition-all duration-300 ease-in-out
                               hover:border-primary-400 focus-within:border-primary-500 
                               focus-within:ring-2 focus-within:ring-primary-500/50">
                  <div className="flex items-center justify-center w-12">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="block w-full bg-transparent py-3 px-2 text-neutral-900 
                             placeholder:text-neutral-400 focus:outline-none sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center w-12 hover:text-neutral-600 
                             transition-colors duration-200"
                  >
                    {showPassword ? 
                      <EyeOff className="h-5 w-5 text-neutral-400" /> : 
                      <Eye className="h-5 w-5 text-neutral-400" />
                    }
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium 
                         transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-primary-600 text-white rounded-lg 
                       transform transition-all duration-300 ease-out
                       hover:bg-primary-700 hover:scale-[1.02] hover:shadow-lg 
                       hover:shadow-primary-500/25 active:scale-[0.98]"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Sign in</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;