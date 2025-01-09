import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/ReusableComponents';
import logo from "../assets/logo.svg"
import {authAPI} from '../services/api/endpoints'

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


const GlossyText = () => {
  return (
    <div className="relative inline-block transform hover:scale-105 transition-transform duration-300">
      <span className="text-9xl font-black relative inline-block 
        bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent
        tracking-tight leading-none">
        Future
        
        {/* Main text glow effect */}
        <div className="absolute inset-0 blur-2xl bg-blue-500/20 -z-10" />
        
        
      </span>
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


const LoginPage = () =>{
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('testuser@gmail.com');
  const [password, setPassword] = useState('testuser');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const signInHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    //remove this after recieving the apis
    // login({
    //   user: "response.user || email",
    //   userType: "designer",
    //   token: "response.token"
    // });
    // toast.success("Successfully logged in!", { 
    //   autoClose: 1500,
    //   position: "top-right",
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    // });
    // navigate('/');
    
    //uncomment this
    try {
      // Call the API
      const response = await authAPI.login({ email, password });
      console.log(response)
      
      // Update auth context
      login({
        user: "sai"
        
      });

      // Show success message
      toast.success("Successfully logged in!", { 
        autoClose: 1500,
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate to home
      navigate('/');
    } catch (error) {
      // Show error message
      toast.error(error.message || "Login failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
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
          <div className="w-24 h-24"><img src={logo} alt="Logo" style={{ filter: 'invert(1)' }}/></div>
            <div className="flex flex-col">
            <div 
    className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"
    style={{ 
      backgroundSize: '50px 50px',
      backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)'
    }}
  ></div>
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
              <GlossyText/>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-lg font-light">
            Powering innovation through precision: Where advanced PCB manufacturing meets uncompromising quality standards
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
              {/* Email Input */}
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
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Input */}
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
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center w-12 hover:text-neutral-600 
                             transition-colors duration-200"
                    disabled={loading}
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

            <Button
              type="submit"
              variant='primary'
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
        </div>
      </div>
    </div>
  );
};
  

export default LoginPage;