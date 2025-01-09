import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import { Users, UserPlus, UserMinus, Settings, X } from 'lucide-react';
import { authAPI } from '../../services/api/endpoints';
import { toast } from 'react-toastify';
import { ChevronDown } from 'lucide-react';

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// Add User Form Component
const AddUserForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    role: 'CADesigner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password === formData.password2) {
          
            setLoading(true);
            setError('');
        
            try {
                await authAPI.register(formData);
                toast.success("User Added Successfully")
                onClose();
            } catch (err) {
                setError(err.message);
                toast.success("An error occured while adding user")
            } finally {
              setLoading(false);
            }
        }
        setError("Passwords do not match, please check again")
    
  };
console.log(error)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={formData.password2}
          onChange={(e) => setFormData({...formData, password2: e.target.value})}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Role
        </label>
        <div className="relative">
  <select
    value={formData.role}
    onChange={(e) => setFormData({...formData, role: e.target.value})}
    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
  >
    <option value="User">Designer</option>
    <option value="Admin">Reviewer</option>
    <option value="Approver">Approver</option>
  </select>
  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
</div>
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </div>
    </form>
  );
};

// Feature Card Component (reused from Home page)
const FeatureCard = ({ title, description, icon: Icon, onClick }) => (
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
    </div>
  </div>
);

// Main Admin Page Component
const AdminInterface = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const features = [
    {
      title: 'Add User',
      description: 'Create new user accounts with specified roles and permissions.',
      icon: UserPlus,
      action: 'add-user'
    },
      {
          title: 'Remove User',
          description: 'Remove user accounts from the system.',
          icon: UserMinus,
          action: 'remove-user'
      } ,
    {
      title: 'More Options Coming Soon',
      description: 'Configure system-wide settings and preferences.',
      icon: Settings,
      action: 'settings'
    }
  ];

  const handleCardClick = (action) => {
    setActiveModal(action);
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-neutral-400">Manage users and system settings</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              onClick={() => handleCardClick(feature.action)}
            />
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      <Modal 
        isOpen={activeModal === 'add-user'} 
        onClose={() => setActiveModal(null)}
        title="Add New User"
      >
        <AddUserForm onClose={() => setActiveModal(null)} />
      </Modal>

      {/* Placeholder modals for other features */}
     
      <Modal 
        isOpen={activeModal === 'remove-user'} 
        onClose={() => setActiveModal(null)}
        title="Remove User"
      >
        <p className="text-neutral-600">User removal functionality coming soon...</p>
      </Modal>

      <Modal 
        isOpen={activeModal === 'settings'} 
        onClose={() => setActiveModal(null)}
        title="System Settings"
      >
        <p className="text-neutral-600">Settings functionality coming soon...</p>
      </Modal>
    </div>
  );
};

export default AdminInterface;