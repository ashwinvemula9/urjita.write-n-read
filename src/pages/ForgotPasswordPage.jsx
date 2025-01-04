import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } else {
      setErrors(newErrors);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-200 rounded-full blur-xl opacity-60 animate-float" />
        <div className="absolute top-1/4 -right-8 w-32 h-32 bg-secondary-200 rounded-full blur-xl opacity-60 animate-float" 
             style={{"--orbit-radius": "4rem"}} />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-accent-200 rounded-full blur-xl opacity-40 animate-float" />
      </div>

      <div className="w-full max-w-md p-6 relative">
        <div className="backdrop-blur-md bg-white/90 rounded-2xl p-8 shadow-lg border border-neutral-200">
          {!isSuccess ? (
            <>
              <h3 className="text-2xl font-semibold text-neutral-800 mb-2">
                Reset your password
              </h3>
              <p className="text-neutral-600 text-sm mb-8">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-neutral-700 font-medium mb-2">Email</label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full h-12 rounded-xl px-4 pl-10
                        text-neutral-900 placeholder-neutral-400
                        bg-white/50 backdrop-blur-sm
                        border-2 focus:outline-none transition-all duration-300
                        ${errors.email 
                          ? 'border-accent-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200' 
                          : 'border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 group-hover:border-neutral-300'
                        }`}
                      placeholder="Enter your email"
                    />
                    <span className="absolute left-3 top-3.5 text-neutral-400 transition-colors group-hover:text-primary-500">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-accent-600 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary-600 hover:bg-primary-700
                    rounded-xl text-white font-medium
                    transition-all duration-300 shadow-lg hover:shadow-glow
                    disabled:opacity-50 disabled:cursor-not-allowed
                    relative overflow-hidden"
                >
                  <span className={`absolute inset-0 h-full w-full flex items-center justify-center
                    transition-opacity duration-300 ${isSubmitting ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  </span>
                  <span className={`transition-opacity duration-300 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                    Reset Password
                  </span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full mx-auto flex items-center justify-center shadow-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-neutral-900">Check Your Email</h3>
              <p className="text-neutral-600">
                We've sent password reset instructions to {email}
              </p>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-600">Remember your password?</span>{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;