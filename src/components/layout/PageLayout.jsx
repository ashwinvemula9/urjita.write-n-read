import React from 'react';

const PageLayout = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 to-neutral-900">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        <div className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl mt-14 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout; 