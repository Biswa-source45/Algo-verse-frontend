import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, FileCode, Send, CheckCircle, Plus, Trash2, Edit, Loader2, X } from 'lucide-react';
import clsx from 'clsx';

const API_URL = 'http://localhost:8000';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProblem, setShowAddProblem] = useState(false);
  
  const [newProblem, setNewProblem] = useState({
    title: '',
    slug: '',
    description: '',
    difficulty: 'Easy',
    tags: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('sb-access-token');
    
    try {
      setLoading(true);
      const [statsRes, usersRes, problemsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/problems/`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setProblems(problemsRes.data.problems || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      alert('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('sb-access-token');
    
    try {
      const payload = {
        ...newProblem,
        tags: newProblem.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      
      await axios.post(`${API_URL}/admin/problems`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Problem created  successfully!');
      setShowAddProblem(false);
      setNewProblem({ title: '', slug: '', description: '', difficulty: 'Easy', tags: '' });
      fetchData();
    } catch (err) {
      console.error('Error creating problem:', err);
      alert(err.response?.data?.detail || 'Failed to create problem');
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    
    const token = localStorage.getItem('sb-access-token');
    
    try {
      await axios.delete(`${API_URL}/admin/problems/${problemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Problem deleted successfully!');
      fetchData();
    } catch (err) {
      console.error('Error deleting problem:', err);
      alert('Failed to delete problem');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 pt-16">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600">Manage problems and monitor users</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={Users} title="Total Users" value={stats?.total_users || 0} color="blue" />
          <StatCard icon={FileCode} title="Total Problems" value={stats?.total_problems || 0} color="orange" />
          <StatCard icon={Send} title="Submissions" value={stats?.total_submissions || 0} color="purple" />
          <StatCard icon={CheckCircle} title="Accepted" value={stats?.successful_submissions || 0} color="green" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {['overview', 'users', 'problems'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-6 py-3 font-semibold capitalize border-b-2 transition-colors",
                activeTab === tab
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Platform Overview</h2>
            <div className="space-y-4">
              <p className="text-slate-700">Welcome to the Admin Dashboard.</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li>{stats?.total_users || 0} users registered</li>
                <li>{stats?.total_problems || 0} problems available</li>
                <li>{stats?.total_submissions || 0} total submissions</li>
                <li>{stats?.successful_submissions || 0} successful submissions</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Username</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Display Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Solved</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Attempts</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm">{user.username}</td>
                      <td className="py-3 px-4">{user.display_name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {user.problems_solved || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{user.total_attempts || 0}</td>
                      <td className="py-3 px-4 text-slate-500 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Problems</h2>
              <button
                onClick={() => setShowAddProblem(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-md transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Problem
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Title</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Slug</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Difficulty</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Tags</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map(problem => (
                      <tr key={problem.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium">{problem.title}</td>
                        <td className="py-3 px-4 font-mono text-sm text-slate-600">{problem.slug}</td>
                        <td className="py-3 px-4">
                          <span className={clsx(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          )}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {problem.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteProblem(problem.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Add Problem Modal */}
        {showAddProblem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Add New Problem</h3>
                <button
                  onClick={() => setShowAddProblem(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddProblem} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={newProblem.title}
                    onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Two Sum"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Slug</label>
                  <input
                    type="text"
                    required
                    value={newProblem.slug}
                    onChange={(e) => setNewProblem({...newProblem, slug: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                    placeholder="two-sum"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                  <select
                    value={newProblem.difficulty}
                    onChange={(e) => setNewProblem({...newProblem, difficulty: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Markdown)</label>
                  <textarea
                    required
                    rows={10}
                    value={newProblem.description}
                    onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                    placeholder="Given an array..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newProblem.tags}
                    onChange={(e) => setNewProblem({...newProblem, tags: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="array, hash-table"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-md transition-all"
                  >
                    Create Problem
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProblem(false)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p>
      <p className="text-sm text-slate-600 font-medium">{title}</p>
    </motion.div>
  );
}
