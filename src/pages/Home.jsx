import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { ArrowRight, FileText, Settings} from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-lg border border-neutral-200/50 
               hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer
               group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4
                     group-hover:bg-orange-500/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-orange-600" />
      </div>
      
      <h3 className="text-xl font-bold text-neutral-800 mb-2">{title}</h3>
      <p className="text-neutral-600 mb-4">{description}</p>
      
      <div className="flex items-center text-orange-500 font-medium">
        <span className="mr-2">Launch</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </div>
  </div>
);

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const features = [
    {
      title: 'Right Draw',
      description: 'Design and manage PCB layouts with our advanced drawing tools.',
      icon: FileText,
      path: '/right-draw'
    },
    {
      title: 'Sample',
      description: 'More Components coming soon.',
      icon: Settings,
      path: '/sample'
    },
    {
      title: 'Sample',
      description: 'More Components coming soon.',
      icon: Settings,
      path: '/sample'
    },
    {
      title: 'Sample',
      description: 'More Components coming soon.',
      icon: Settings,
      path: '/sample'
    }
  ];

  return user ? (
    <div className="min-h-screen bg-neutral-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome back, {user.user}</h1>
          <p className="text-neutral-400">Select a tool to get started with your project</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              onClick={() => navigate(feature.path)}
            />
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default Home;