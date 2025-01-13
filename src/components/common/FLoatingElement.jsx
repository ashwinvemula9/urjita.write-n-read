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
export default FloatingElement