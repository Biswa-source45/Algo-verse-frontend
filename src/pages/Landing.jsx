import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle, Code, Zap, Cpu, Trophy, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/problems');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-x-hidden">
        
      {/* Hero Section */}
      <section ref={targetRef} className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex flex-col justify-center">
        {/* Background Decorations */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl -z-10" />
        
        <motion.div 
            style={{ y, opacity }}
            className="max-w-6xl mx-auto text-center relative"
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-200 bg-orange-50 mb-6">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span className="text-sm font-semibold text-orange-700">Your Path to Coding Excellence</span>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                  Master Algorithms,<br />
                  <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                    Ace Interviews
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Practice coding problems in Python, Java, C++, and JavaScript. 
                  Get instant feedback and track your progress toward your dream job.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <button 
                        onClick={handleGetStarted}
                        className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        Start Coding Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                        onClick={() => navigate('/problems')}
                        className="px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-orange-300 hover:bg-orange-50 transition-all"
                    >
                        Browse Problems
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900">500+</p>
                            <p className="text-slate-500 text-xs">Problems</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900">10K+</p>
                            <p className="text-slate-500 text-xs">Coders</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900">4</p>
                            <p className="text-slate-500 text-xs">Languages</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
      </section>

      {/* Parallax Dashboard Card */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20 -mt-8">
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ y: -10 }}
            className="max-w-5xl mx-auto"
        >
            <div className="relative rounded-2xl bg-white border-2 border-orange-100 shadow-2xl shadow-orange-500/10 overflow-hidden group hover:shadow-orange-500/20 hover:border-orange-200 transition-all duration-500">
                {/* Window Controls */}
                <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-100">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     </div>
                     <div className="text-xs text-slate-500 font-semibold">AlgoVerse Editor</div>
                     <div className="w-12"></div>
                </div>

                {/* Editor Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-slate-50">
                    {/* Code Panel */}
                    <div className="p-6 bg-slate-900 font-mono text-sm min-h-[400px] relative">
                        <div className="text-slate-400 leading-relaxed">
                             <span className="text-purple-400">def</span> <span className="text-yellow-300">twoSum</span>(nums, target):<br/>
                             &nbsp;&nbsp;<span className="text-slate-500"># Hash map approach</span><br/>
                             &nbsp;&nbsp;seen = <span className="text-yellow-300">{}</span><br/>
                             <br/>
                             &nbsp;&nbsp;<span className="text-purple-400">for</span> i, num <span className="text-purple-400">in</span> <span className="text-blue-400">enumerate</span>(nums):<br/>
                             &nbsp;&nbsp;&nbsp;&nbsp;complement = target - num<br/>
                             <br/>
                             &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> complement <span className="text-purple-400">in</span> seen:<br/>
                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> [seen[complement], i]<br/>
                             <br/>
                             &nbsp;&nbsp;&nbsp;&nbsp;seen[num] = i<br/>
                             <br/>
                             &nbsp;&nbsp;<span className="text-purple-400">return</span> []
                        </div>

                        {/* Language Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold border border-blue-500/30">
                            Python
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="p-6 space-y-4 bg-white">
                         <div>
                             <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                 Test Results
                             </h3>
                         </div>

                         <div className="space-y-3">
                             {[1, 2, 3].map(i => (
                                 <div key={i} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                     <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                     <div className="flex-1">
                                         <p className="text-sm font-semibold text-green-800">Test Case {i}</p>
                                         <p className="text-xs text-green-600">Passed • 12ms</p>
                                     </div>
                                     <div className="text-xs font-bold text-green-700">✓</div>
                                 </div>
                             ))}
                         </div>

                         <div className="pt-4 border-t border-slate-200">
                             <div className="flex items-center justify-between text-sm">
                                 <span className="text-slate-600">Runtime</span>
                                 <span className="font-bold text-orange-600">32ms (Beats 98%)</span>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl opacity-20 blur-2xl -z-10 group-hover:opacity-30 transition-opacity"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Everything You Need to Succeed</h2>
                <p className="text-slate-600 text-lg">Built for developers, by developers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        icon: Zap,
                        title: "Instant Execution",
                        desc: "Run code in milliseconds with our powerful cloud infrastructure",
                        color: "orange"
                    },
                    {
                        icon: Code,
                        title: "Multi-Language",
                        desc: "Practice in Python, Java, C++, JavaScript and more",
                        color: "amber"
                    },
                    {
                        icon: Cpu,
                        title: "Smart Analytics",
                        desc: "Track your progress with detailed performance metrics",
                        color: "orange"
                    }
                ].map((item, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all"
                    >
                         <div className={`w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                             <item.icon className="w-6 h-6 text-white" />
                         </div>
                         <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                         <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Level Up?</h2>
              <p className="text-orange-100 text-lg mb-8">Join thousands of developers mastering algorithms</p>
              <button 
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all shadow-2xl"
              >
                  Start Solving Problems
              </button>
          </div>
      </section>
    </div>
  );
}
