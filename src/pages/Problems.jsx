import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Trophy, TrendingUp, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8000';

export default function Problems() {
  const { user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const url = user 
          ? `${API_URL}/problems/?user_id=${user.id}` 
          : `${API_URL}/problems/`;
        const res = await axios.get(url);
        setProblems(res.data.problems || []);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [user]);

  const tracks = [
    { 
      name: 'Python', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
    },
    { 
      name: 'C++', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' 
    },
    { 
      name: 'Java', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      color: 'bg-red-50 border-red-200 hover:bg-red-100' 
    },
    { 
      name: 'JavaScript', 
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' 
    },
  ];

  const filteredProblems = filter === 'All' 
    ? problems 
    : problems.filter(p => p.difficulty === filter);

  const solvedCount = problems.filter(p => p.solved).length;

  return (
    <div className="pt-24 min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Problem Set</h1>
          <p className="text-slate-600">Master algorithms with curated coding challenges.</p>
          
          {user && (
            <div className="mt-6 flex items-center gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{solvedCount}</p>
                  <p className="text-sm text-slate-500">Problems Solved</p>
                </div>
              </div>
              <div className="h-12 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{problems.length}</p>
                  <p className="text-sm text-slate-500">Total Problems</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Tracks */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Practice by Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tracks.map((track) => (
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                key={track.name}
                className={`p-6 rounded-xl border-2 ${track.color} cursor-pointer shadow-sm transition-all flex flex-col items-center gap-3`}
              >
                <img src={track.icon} alt={track.name} className="w-16 h-16" />
                <span className="font-bold text-slate-700">{track.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">All Problems</h2>
          <div className="flex gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  filter === f 
                    ? "bg-orange-600 text-white shadow-md" 
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No problems found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProblems.map((problem, idx) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/problems/${problem.id}`}>
                  <div className="bg-white p-5 rounded-xl border-2 border-slate-100 hover:border-orange-300 hover:shadow-lg transition-all group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Status Icon */}
                        <div className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          problem.solved ? "bg-green-100" : "bg-slate-100"
                        )}>
                          {problem.solved ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-400" />
                          )}
                        </div>

                        {/* Problem Info */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={clsx(
                              "text-xs px-2 py-1 rounded-full font-semibold",
                              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            )}>
                              {problem.difficulty}
                            </span>
                            {problem.tags && problem.tags.map(tag => (
                              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* User Stats */}
                        {user && problem.attempts > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-slate-500">
                              {problem.attempts} attempt{problem.attempts > 1 ? 's' : ''}
                            </p>
                            {problem.best_score > 0 && (
                              <p className="text-sm font-semibold text-orange-600">
                                Best: {problem.best_score} pts
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
