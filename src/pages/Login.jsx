import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Code2, ArrowRight } from 'lucide-react';

export default function Login() {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/problems" replace />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center"
      >
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
           <Code2 className="w-8 h-8 text-orange-600" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
           Sign in to AlgoVerse to access premium problems, track your progress, and compete with others.
        </p>

        <button
          onClick={signInWithGoogle}
          className="w-full py-3.5 bg-white border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          <span className="group-hover:text-orange-700 transition-colors">Continue with Google</span>
          <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        
        <div className="mt-8 text-xs text-slate-400">
           By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </motion.div>
    </div>
  );
}
