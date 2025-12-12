import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-xl rotate-3 group-hover:rotate-6 transition-transform shadow-lg"></div>
               <div className="absolute inset-0 bg-black rounded-xl border border-white/10 flex items-center justify-center -rotate-3 group-hover:-rotate-6 transition-transform z-10">
                  <span className="text-orange-500 font-black text-xl font-mono">&lt;/&gt;</span>
               </div>
            </div>
            <div className="flex flex-col">
               <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-600 transition-all">
                  ALGOVERSE
               </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/problems" className="text-slate-600 hover:text-orange-600 font-medium transition-colors">
              Problems
            </Link>

            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-medium transition-colors border border-purple-200">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-800 capitalize">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.isAdmin ? 'Admin' : 'Coder'}</p>
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                    >
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                        <div className="flex items-center gap-3 mb-2">
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                          />
                          <div className="flex-1">
                            <p className="font-bold text-slate-800 capitalize">{user.name}</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                          </div>
                        </div>
                        <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                          user.isAdmin 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.isAdmin ? '👑 Administrator' : '💻 Coder'}
                        </span>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-red-600 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login">
                <button className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg font-medium transition-all">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-white border-t border-gray-100"
        >
          <div className="px-4 py-6 space-y-4">
            <Link to="/problems" className="block text-slate-600 hover:text-orange-600 font-medium">
              Problems
            </Link>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="block text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full border-2 border-slate-200"
                    />
                    <div>
                      <p className="font-semibold text-slate-800 capitalize">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        user.isAdmin 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.isAdmin ? 'Admin' : 'Coder'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <button className="w-full px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg font-medium">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
