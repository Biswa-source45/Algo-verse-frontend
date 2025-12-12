import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black tracking-tight text-white mb-2">ALGOVERSE</h2>
            <p className="text-slate-400 text-sm mb-4 max-w-sm">
              Master algorithms and data structures with instant feedback. 
              Built for the next generation of developers.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/problems" className="hover:text-orange-400 transition-colors">Problems</Link></li>
              <li><Link to="/login" className="hover:text-orange-400 transition-colors">Sign In</Link></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AlgoVerse. All rights reserved. Built with ❤️ for developers.</p>
        </div>
      </div>
    </footer>
  );
}
