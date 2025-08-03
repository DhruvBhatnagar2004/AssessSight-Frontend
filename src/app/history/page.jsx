"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { HistoricalScores } from "../../components/Charts";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getScanHistory, getScanById } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScan, setSelectedScan] = useState(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getScanHistory();
        setHistory(data);
      } catch (err) {
        setError("Failed to load scan history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, router]);

  const handleScanSelect = async (id) => {
    try {
      setLoading(true);
      const scan = await getScanById(id);
      setSelectedScan(scan);
    } catch (err) {
      setError("Failed to load scan details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedScan(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header 
        onScan={() => {}} 
        onScanStart={() => {}} 
        onScanError={() => {}}
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100">
            {selectedScan ? 'Scan Details' : 'Scan History'}
          </h2>
          
          {selectedScan && (
            <button 
              onClick={handleBackToList}
              className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to history
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg mb-8">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        ) : selectedScan ? (
          // Detailed scan view
          <div className="space-y-6">
            {/* URL Banner */}
            <div className="bg-slate-800 p-4 rounded-lg mb-4 flex justify-between items-center">
              <div>
                <span className="text-slate-400 mr-2">Analyzed:</span>
                <a href={selectedScan.url} target="_blank" rel="noopener noreferrer" 
                  className="text-teal-400 hover:underline font-medium">
                  {selectedScan.url}
                </a>
              </div>
              <div className="text-slate-400">
                {new Date(selectedScan.createdAt || selectedScan.date).toLocaleString()}
              </div>
            </div>

            {/* Display scan details similar to the main dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h3 className="font-medium text-lg mb-2">Accessibility Score</h3>
                <div className="text-4xl font-bold text-teal-500">{selectedScan.score}%</div>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h3 className="font-medium text-lg mb-2">Issues</h3>
                <div className="flex justify-between">
                  <div>
                    <span className="text-red-400 font-bold">{selectedScan.issues?.filter(i => i.type === 'error').length || 0}</span>
                    <span className="text-slate-400 ml-1">Errors</span>
                  </div>
                  <div>
                    <span className="text-orange-400 font-bold">{selectedScan.issues?.filter(i => i.type === 'warning').length || 0}</span>
                    <span className="text-slate-400 ml-1">Warnings</span>
                  </div>
                  <div>
                    <span className="text-blue-400 font-bold">{selectedScan.issues?.filter(i => i.type === 'notice').length || 0}</span>
                    <span className="text-slate-400 ml-1">Notices</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h3 className="font-medium text-lg mb-2">Page</h3>
                <p className="text-slate-300 truncate">{selectedScan.documentTitle || selectedScan.url}</p>
              </div>
            </div>

            {/* List of Issues */}
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-lg mb-4">Detected Issues</h3>
              
              {selectedScan.issues?.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Element</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">Issue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {selectedScan.issues.map((issue, index) => (
                        <tr key={index} className="hover:bg-slate-700/30">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              issue.type === "error" 
                                ? "bg-red-900/30 text-red-400 border border-red-700" 
                                : issue.type === "warning"
                                ? "bg-amber-900/30 text-amber-400 border border-amber-700"
                                : "bg-blue-900/30 text-blue-400 border border-blue-700"
                            }`}>
                              {issue.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-sm text-slate-400">
                            {issue.selector || issue.element || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-300">
                            {issue.message || issue.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">No issues found. Great job!</p>
              )}
            </div>
          </div>
        ) : (
          // History list view
          <div className="space-y-6">
            {/* History Chart */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
              <h3 className="text-lg font-medium mb-4 text-slate-100">Performance Trend</h3>
              <div className="h-72">
                <HistoricalScores data={history} />
              </div>
            </div>
            
            {/* History List */}
            {history.length > 0 ? (
              <div className="bg-slate-800 rounded-lg border border-slate-700">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">URL</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Issues</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-800 divide-y divide-slate-700">
                      {history.map((scan) => (
                        <tr key={scan._id} className="hover:bg-slate-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {new Date(scan.createdAt || scan.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            <span className="truncate block max-w-xs" title={scan.url}>
                              {scan.url}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span 
                                className={`text-sm font-medium ${
                                  scan.score >= 90 ? 'text-green-400' :
                                  scan.score >= 70 ? 'text-cyan-400' :
                                  scan.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                                }`}
                              >
                                {scan.score}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <span className="text-red-400">{scan.issues?.filter(i => i.type === 'error').length || 0}</span>
                              <span className="text-orange-400">{scan.issues?.filter(i => i.type === 'warning').length || 0}</span>
                              <span className="text-blue-400">{scan.issues?.filter(i => i.type === 'notice').length || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              onClick={() => handleScanSelect(scan._id)}
                              className="text-teal-400 hover:text-teal-300 transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-slate-400 mb-4">No scan history available yet</p>
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
                >
                  Start scanning a website
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}