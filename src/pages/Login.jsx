import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-full h-full bg-gradient-to-br from-black to-transparent opacity-30" />
      {[...Array(7)].map((_, i) => (
        <FloatingElement key={i} index={i} />
      ))}
    </div>
  );
};

const FloatingElement = ({ index }) => {
  const size = 40 + Math.random() * 100; // Random size between 40 and 160
  const top = Math.random() * 100;  // Random vertical position (up to 100% of height)
  const left = Math.random() * 82;  // Random left position within 50% of the panel width
  const baseDelay = -index * 1.5;

  return (
    <div
      className="absolute rounded-full bg-gradient-to-br from-pink-500/40 to-blue-500/30 
                 backdrop-blur-lg transition-all duration-500 ease-in-out
                 animate-float shadow-xl"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,  // Random vertical positioning
        left: `${left}%`,  // Random horizontal positioning, restricted to 50% of the panel width
        animationDelay: `${baseDelay}s`,
        animationDuration: '25s',
      }}
    >
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/60 to-transparent 
                   animate-pulse"
        style={{ animationDelay: `${baseDelay + 1}s` }}
      />
    </div>
  );
};


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('s@g.com');
  const [password, setPassword] = useState('sample');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const signInHandler = (e) => {
    e.preventDefault();
    login({ user: "Designer", userType: "designer", token: "siiyqqoioiw" });
    toast.success("Welcome back!", { autoClose: 1500 });
    navigate('/');
  };

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
            <Cpu className="w-12 h-12 text-white/90 drop-shadow-2xl" />
            <div className="flex flex-col">
              <span className="text-4xl font-extrabold text-white bg-clip-text" 
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                URJITA
              </span>
              <span className="text-sm font-medium text-white/70 tracking-widest uppercase">
                Electronics 
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-8">
            <h1 className="text-7xl lg:text-8xl font-black text-white"
                style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.05em', lineHeight: '1.1' }}>
              Welcome <br /> to the <br />
              <span className="text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text
                             hover:from-orange-300 hover:to-orange-500 transition-all duration-300">
                Future
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-lg font-light">
              Join us as we redefine possibilities. Experience innovation at its
              peak, where imagination meets technology.
            </p>
          </div>

          <div className="flex items-center space-x-6 mt-auto">
            <span className="text-white/30 text-sm">|</span>
            <span className="text-white/50 text-sm">© 2025 Urjita Electronics</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent leading-relaxed">
  Sign in
</h2>

          </div>

          <form className="space-y-6" onSubmit={signInHandler}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                <div className="flex items-center bg-neutral-50 rounded-xl border border-neutral-200 
                               transition-all duration-300 ease-in-out group
                               hover:border-indigo-400 focus-within:border-indigo-500 
                               focus-within:ring-2 focus-within:ring-indigo-500/20">
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
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="flex items-center bg-neutral-50 rounded-xl border border-neutral-200 
                               transition-all duration-300 ease-in-out group
                               hover:border-indigo-400 focus-within:border-indigo-500 
                               focus-within:ring-2 focus-within:ring-indigo-500/20">
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center w-12 hover:text-neutral-600 
                             transition-colors duration-200"
                  >
                    {showPassword ? 
                      <EyeOff className="h-5 w-5 text-neutral-400 hover:text-indigo-500 transition-colors" /> : 
                      <Eye className="h-5 w-5 text-neutral-400 hover:text-indigo-500 transition-colors" />
                    }
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium 
                         transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

           <button
  type="submit"
  className="w-full h-12 bg-orange-500 text-white rounded-xl
           transform transition-all duration-300 ease-out
           hover:bg-orange-400 hover:scale-[1.02] hover:shadow-lg 
           hover:shadow-orange-500/25 active:scale-[0.98]"
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