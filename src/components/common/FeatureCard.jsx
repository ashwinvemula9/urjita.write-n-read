 
import { ArrowRight } from 'lucide-react';
export const FeatureCard = ({ title, description, icon: Icon, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-lg border border-neutral-200/50 
                 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer
                 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4
                       group-hover:bg-blue-500/20 transition-colors duration-300">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-bold text-neutral-800 mb-2">{title}</h3>
        <p className="text-neutral-600 mb-4">{description}</p>
        
        <div className="flex items-center text-blue-600 font-medium">
          <span className="mr-2">Launch</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );