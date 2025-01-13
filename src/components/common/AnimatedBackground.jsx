import FloatingElement from "./FLoatingElement";

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
  export default AnimatedBackground