import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { Play, Check, AlertCircle, Loader2, ChevronDown, Send, RotateCw } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8000';

const TEMPLATES = {
  python: `# Read from stdin, write to stdout
# Example: data = input()

`,
  javascript: `// Read from stdin using readline
// Write to stdout using console.log()

`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}
`
};

export default function Workspace() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(TEMPLATES.python);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setProblem(null);
        setSubmissionResult(null);
        setRunOutput(null);
        setActiveTab('description');
        
        const res = await axios.get(`${API_URL}/problems/${id}`);
        setProblem(res.data.problem);
      } catch (err) {
        console.error("Error loading problem", err);
      }
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    setCode(TEMPLATES[language] || TEMPLATES.python);
  }, [language]);

  const handleRun = async () => {
    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setIsRunning(true);
    setActiveTab('results');
    setRunOutput(null);
    setSubmissionResult(null);
    
    try {
      const payload = { language, code };
      const res = await axios.post(`${API_URL}/run/${id}`, payload);
      setRunOutput(res.data);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || "Execution failed";
      setRunOutput({ 
        error: errorMsg,
        is_error: true 
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Please Sign In to submit your solution!");
      return;
    }

    if (!code.trim()) {
      alert("Please write some code first!");
      return;
    }

    setSubmitting(true);
    setActiveTab('results');
    setRunOutput(null);
    setSubmissionResult(null);
    
    try {
      const token = localStorage.getItem('sb-access-token');
      const payload = { language, code };
      
      const res = await axios.post(`${API_URL}/submit/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSubmissionResult(res.data);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || "Submission failed";
      setSubmissionResult({ 
        error: errorMsg,
        passed: false 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading Problem...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen pt-16 flex flex-col bg-slate-50 overflow-hidden"
    >
      {/* Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/problems" className="text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors">
            ← Back
          </Link>
          <div className="h-6 w-px bg-gray-200"></div>
          <h2 className="font-bold text-slate-800 truncate max-w-sm flex items-center gap-2">
            {problem.title}
          </h2>
          <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium border", 
            problem.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
            problem.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
            'bg-red-50 text-red-700 border-red-200'
          )}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRun}
            disabled={isRunning || submitting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isRunning ? "Running..." : "Run"}
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={submitting || isRunning}
            className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</>
            ) : (
              <><Send className="w-4 h-4" />Submit</>
            )}
          </button>
        </div>
      </div>

      {/* Main Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('description')}
              className={clsx("px-6 py-3 text-sm font-semibold border-b-2 transition-colors",
                activeTab === 'description' 
                  ? "border-orange-500 text-orange-600 bg-orange-50/30" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              📝 Description
            </button>
            <button
              onClick={() => setActiveTab('results')} 
              className={clsx("px-6 py-3 text-sm font-semibold border-b-2 transition-colors relative",
                activeTab === 'results' 
                  ? "border-orange-500 text-orange-600 bg-orange-50/30" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              📊 Results
              {(runOutput || submissionResult) && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'description' ? (
                <motion.div 
                  key="desc"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="prose prose-slate prose-headings:font-bold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:text-slate-800 prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:rounded max-w-none"
                >
                  <ReactMarkdown>{problem.description}</ReactMarkdown>
                  
                  {problem.tags && problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8 not-prose">
                      {problem.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  {/* ... Results content (keeping the same as before) ... */}
                  {runOutput && !submissionResult && (
                    <div className={clsx(
                      "p-6 rounded-xl border-2 shadow-md",
                      runOutput.passed ? "bg-green-50 border-green-300" : "bg-amber-50 border-amber-300"
                    )}>
                      <div className="flex items-center gap-2 mb-4">
                        <Play className="w-5 h-5 text-slate-600" />
                        <h3 className="text-lg font-bold text-slate-800">Sample Test Result</h3>
                      </div>
                      
                      {runOutput.error || runOutput.is_error ? (
                        <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                          <p className="text-red-800 font-mono text-sm whitespace-pre-wrap">{runOutput.error || runOutput.output}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                            {runOutput.passed ? (
                              <><Check className="w-6 h-6 text-green-600" /><span className="font-bold text-green-700">Passed!</span></>
                            ) : (
                              <><AlertCircle className="w-6 h-6 text-amber-600" /><span className="font-bold text-amber-700">Wrong Answer</span></>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Input</label>
                              <pre className="bg-white p-3 rounded border text-slate-700 text-sm font-mono whitespace-pre-wrap">{runOutput.input}</pre>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Expected</label>
                              <pre className="bg-white p-3 rounded border text-slate-700 text-sm font-mono whitespace-pre-wrap">{runOutput.expected}</pre>
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Your Output</label>
                              <pre className={clsx("p-3 rounded border text-sm font-mono whitespace-pre-wrap", 
                                runOutput.passed ? "bg-green-100 text-green-800 border-green-300" : "bg-amber-100 text-amber-800 border-amber-300"
                              )}>{runOutput.output}</pre>
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600">Ready to submit? Click <strong>"Submit"</strong> to test all cases.</p>
                      </div>
                    </div>
                  )}

                  {submissionResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className={clsx(
                        "p-8 rounded-2xl text-center shadow-lg border-2",
                        submissionResult.passed 
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300" 
                          : "bg-gradient-to-br from-red-50 to-orange-50 border-red-300"
                      )}>
                        {submissionResult.error ? (
                          <>
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <AlertCircle className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-red-800">Submission Error</h2>
                            <p className="text-red-700">{submissionResult.error}</p>
                          </>
                        ) : submissionResult.passed ? (
                          <>
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                              <Check className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-extrabold mb-3 text-green-800">🎉 Accepted!</h2>
                            <p className="text-green-700 text-lg mb-4">All {submissionResult.total_tests} test cases passed!</p>
                            <div className="inline-flex items-center gap-2 bg-green-200 px-5 py-2 rounded-full">
                              <span className="text-3xl font-black text-green-800">{submissionResult.score}</span>
                              <span className="text-sm text-green-700 font-medium">points</span>
                            </div>
                            <Link to="/problems">
                              <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition-all">
                                Next Problem →
                              </button>
                            </Link>
                          </>
                        ) : (
                          <>
                            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <AlertCircle className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-extrabold mb-3 text-red-800">Wrong Answer</h2>
                            <p className="text-red-700 text-lg">{submissionResult.passed_tests}/{submissionResult.total_tests} tests passed</p>
                            {submissionResult.score > 0 && (
                              <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mt-4">
                                <span className="text-2xl font-bold text-orange-800">{submissionResult.score}</span>
                                <span className="text-sm text-orange-600">partial points</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      
                      {submissionResult.results && submissionResult.results.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-4">Test Cases</h3>
                          <div className="space-y-2">
                            {submissionResult.results.map((res, i) => (
                              <div 
                                key={i} 
                                className={clsx(
                                  "flex items-center justify-between p-3 rounded-lg border transition-all",
                                  res.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
                                    res.passed ? "bg-green-500" : "bg-red-500"
                                  )}>
                                    {res.passed ? '✓' : '✗'}
                                  </div>
                                  <span className="font-medium text-slate-700">Test {i + 1}</span>
                                </div>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">
                                  {res.runtime_ms}ms
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {!runOutput && !submissionResult && (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Play className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">No Results Yet</h3>
                      <p className="text-slate-500 mb-4">Run your code or submit to see results.</p>
                      <div className="max-w-sm mx-auto text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                        <p><strong>Run:</strong> Quick test with sample input</p>
                        <p className="mt-2"><strong>Submit:</strong> Full evaluation with all test cases</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Editor */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700 bg-[#252526]">
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm font-mono">
                {language === 'python' ? 'solution.py' : 
                 language === 'cpp' ? 'solution.cpp' : 
                 language === 'java' ? 'Main.java' : 'solution.js'}
              </span>
              
              <div className="relative group">
                <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-700 px-3 py-1.5 rounded-md text-sm font-medium">
                  {language === 'python' ? '🐍 Python' : 
                   language === 'javascript' ? '⚡ JS' : 
                   language === 'cpp' ? '⚙️ C++' : '☕ Java'}
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-1 min-w-[140px] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl hidden group-hover:block z-20 overflow-hidden">
                  {[
                    { key: 'python', label: '🐍 Python' },
                    { key: 'javascript', label: '⚡ JavaScript' },
                    { key: 'cpp', label: '⚙️ C++' },
                    { key: 'java', label: '☕ Java' }
                  ].map(lang => (
                    <button 
                      key={lang.key}
                      onClick={() => setLanguage(lang.key)}
                      className={clsx(
                        "block w-full text-left px-4 py-2.5 text-slate-300 hover:bg-slate-700 text-sm",
                        language === lang.key && "bg-slate-700 text-white"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              theme="vs-dark"
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineHeight: 22,
                padding: { top: 16 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                formatOnPaste: true,
                autoIndent: "full",
                tabSize: 4,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
