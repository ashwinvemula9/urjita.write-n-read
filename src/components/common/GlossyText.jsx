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
  
export default GlossyText