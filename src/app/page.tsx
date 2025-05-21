"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { SeverityPie, IssuesBar, ScoreLine, HistoricalScores } from "../components/Charts";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import FixModal from "../components/FixModal";
import { getScanHistory } from "../services/api";
import { useAuth } from "../context/AuthContext"; // Import Auth context

export default function Home() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const { isAuthenticated, user } = useAuth(); // Use auth context
  const itemsPerPage = 10;

  // Load history only if authenticated
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) {
        setScanHistory([]);
        return;
      }
      
      try {
        const history = await getScanHistory();
        setScanHistory(history);
      } catch (error) {
        console.error("Failed to fetch scan history:", error);
        setScanHistory([]);
      }
    };
    
    fetchHistory();
  }, [isAuthenticated]); // Re-fetch when auth state changes

  // Calculate derived metrics from scan result
  const severityData = scanResult?.issues ? [
    { name: "Errors", value: scanResult.issues.filter((i: any) => i.type === "error").length },
    { name: "Warnings", value: scanResult.issues.filter((i: any) => i.type === "warning").length },
    { name: "Notices", value: scanResult.issues.filter((i: any) => i.type === "notice").length }
  ] : [];

  // Improved function to calculate more accurate category scores
  function calculateCategoryScore(issues: any[], elements: string[]) {
    if (!issues || !Array.isArray(issues)) return 100;
    
    // Filter issues by elements with improved detection
    const categoryIssues = issues.filter(i => {
      const selector = (i.selector || i.element || '').toLowerCase();
      const message = (i.message || i.description || '').toLowerCase();
      
      return elements.some(el => {
        const elLower = el.toLowerCase();
        return selector.includes(elLower) || message.includes(elLower);
      });
    });
    
    if (categoryIssues.length === 0) return 100;
    
    // Weight different issue types
    const errorCount = categoryIssues.filter(i => i.type === "error").length;
    const warningCount = categoryIssues.filter(i => i.type === "warning").length;
    const noticeCount = categoryIssues.filter(i => i.type === "notice").length;
    
    // Calculate score with better weights
    const baseScore = 100;
    // Limit how many issues we count to avoid extreme negative scores
    const maxIssues = 10;
    const errorDeduction = Math.min(errorCount, maxIssues) * 8;
    const warningDeduction = Math.min(warningCount, maxIssues) * 4;
    const noticeDeduction = Math.min(noticeCount, maxIssues) * 1;
    
    const score = Math.max(0, baseScore - errorDeduction - warningDeduction - noticeDeduction);
    return Math.round(score);
  }

  // Calculate overall score with improved algorithm
  function calculateOverallScore(issues: any[]) {
    if (!issues || !Array.isArray(issues)) return 100;
    
    // Count issues by type
    const errorCount = issues.filter(i => i.type === "error").length;
    const warningCount = issues.filter(i => i.type === "warning").length;
    const noticeCount = issues.filter(i => i.type === "notice").length;
    
    // Scale the impact based on total issues to avoid extreme negative scores
    const totalIssues = errorCount + warningCount + noticeCount;
    const scaleFactor = totalIssues > 50 ? 50 / totalIssues : 1;
    
    // Base score of 100, with scaled deductions
    const baseScore = 100;
    const errorDeduction = errorCount * 3 * scaleFactor;
    const warningDeduction = warningCount * 1 * scaleFactor;
    const noticeDeduction = noticeCount * 0.5 * scaleFactor;
    
    const score = Math.max(0, baseScore - errorDeduction - warningDeduction - noticeDeduction);
    return Math.round(score);
  }
  
  // Get current issues for pagination
  const indexOfLastIssue = currentPage * itemsPerPage;
  const indexOfFirstIssue = indexOfLastIssue - itemsPerPage;
  const currentIssues = scanResult?.issues 
    ? scanResult.issues.slice(indexOfFirstIssue, indexOfLastIssue) 
    : [];
    
  // Handle scanning process
  const handleScanStart = () => {
    setLoading(true);
    setError(null);
  };
  
  const handleScan = (result: any) => {
    setScanResult(result);
    setLoading(false);
    
    // Refresh history only if authenticated
    if (isAuthenticated) {
      getScanHistory().then(setScanHistory).catch(console.error);
    }
  };
  
  const handleScanError = (errorMsg: string) => {
    setError(errorMsg);
    setLoading(false);
  };

  // Function to render welcome view for new users
  const renderWelcomeView = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-800 to-slate-800/70 rounded-xl p-8 shadow-lg animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
          Web Accessibility Analyzer
        </h2>
        <p className="text-slate-300 text-lg mb-6">
          Ensure your websites are accessible to everyone, including people with disabilities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600 hover:border-teal-500/30 transition-all hover:shadow-lg">
            <div className="rounded-full bg-teal-500/20 w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-100">Scan Any Website</h3>
            <p className="text-slate-400">
              Enter any URL to analyze accessibility issues on any public website.
            </p>
          </div>
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600 hover:border-teal-500/30 transition-all hover:shadow-lg">
            <div className="rounded-full bg-teal-500/20 w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012-2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-100">Get Detailed Reports</h3>
            <p className="text-slate-400">
              View comprehensive reports with visualizations and specific issues.
            </p>
          </div>
          <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600 hover:border-teal-500/30 transition-all hover:shadow-lg">
            <div className="rounded-full bg-teal-500/20 w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-100">Fix Issues</h3>
            <p className="text-slate-400">
              Get actionable recommendations to improve accessibility.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-slate-100">Why Accessibility Matters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-teal-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-slate-200">Reach More Users</h3>
                <p className="mt-1 text-sm text-slate-400">
                  About 15% of the world's population has some form of disability. Make your content available to everyone.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-teal-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-slate-200">Legal Compliance</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Many countries require websites to be accessible. Avoid potential legal issues and fines.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-teal-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-slate-200">Better User Experience</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Accessible websites are generally easier to use for everyone, not just those with disabilities.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-teal-400 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-slate-200">SEO Benefits</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Many accessibility practices also improve search engine optimization and site performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-300 mb-4">
            Create an account to track your website's accessibility progress over time.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header 
        onScan={handleScan} 
        onScanStart={handleScanStart}
        onScanError={handleScanError}
      />
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-100">
          {isAuthenticated ? `Welcome, ${user?.name || 'User'}` : 'Dashboard'}
        </h2>
        
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg mb-8">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        ) : scanResult ? (
          <>
            {/* URL Banner */}
            <div className="bg-slate-800 p-4 rounded-lg mb-8 flex justify-between items-center">
              <div>
                <span className="text-slate-400 mr-2">Analyzed:</span>
                <a href={scanResult.url} target="_blank" rel="noopener noreferrer" 
                   className="text-teal-400 hover:underline font-medium">
                  {scanResult.url}
                </a>
              </div>
              <div className="text-slate-400">
                {new Date(scanResult.createdAt || scanResult.date || Date.now()).toLocaleString()}
              </div>
            </div>
          
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                <h3 className="text-lg font-medium opacity-90 mb-1">Errors</h3>
                <p className="text-4xl font-bold">
                  {scanResult.issues?.filter((i) => i.type === "error").length || 0}
                </p>
                <p className="text-sm mt-2 opacity-80">Critical accessibility issues</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                <h3 className="text-lg font-medium opacity-90 mb-1">Warnings</h3>
                <p className="text-4xl font-bold">
                  {scanResult.issues?.filter((i) => i.type === "warning").length || 0}
                </p>
                <p className="text-sm mt-2 opacity-80">Potential accessibility concerns</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                <h3 className="text-lg font-medium opacity-90 mb-1">Notices</h3>
                <p className="text-4xl font-bold">
                  {scanResult.issues?.filter((i) => i.type === "notice").length || 0}
                </p>
                <p className="text-sm mt-2 opacity-80">Suggestions for improvement</p>
              </div>
            </div>
            
            {/* Chart sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-700/50">
                <h3 className="text-lg font-medium mb-4 text-slate-100">Issue Types</h3>
                <div className="h-64 md:h-72">
                  <SeverityPie data={severityData} />
                </div>
              </div>
              
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-700/50">
                <h3 className="text-lg font-medium mb-4 text-slate-100">Issue Categories</h3>
                <div className="h-64 md:h-72">
                  <IssuesBar data={scanResult.issues || []} />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Only show history chart if authenticated and has history */}
              {isAuthenticated && (
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-700/50">
                  <h3 className="text-lg font-medium mb-4 text-slate-100">
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 100-2H3zm0 4a1 1 0 000 2h6a1 1 100-2H3zm0 4a1 1 100 2h10a1 1 100-2H3z" clipRule="evenodd" />
                      </svg>
                      Historical Performance
                    </span>
                  </h3>
                  <div className="h-64 md:h-72">
                    <HistoricalScores data={scanHistory} />
                  </div>
                </div>
              )}
              
              <div className={`bg-slate-800/80 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-700/50 ${!isAuthenticated ? 'lg:col-span-2' : ''}`}>
                <h3 className="text-lg font-medium mb-4 text-slate-100">Accessibility Score</h3>
                <div className="h-64 md:h-72 flex items-center justify-center">
                  <ScoreLine score={calculateOverallScore(scanResult.issues)} />
                </div>
              </div>
            </div>

            {/* Issues Table with Pagination */}
            {scanResult.issues?.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6 shadow-lg mb-8">
                <h3 className="text-lg font-medium mb-6 text-slate-100">Accessibility Issues</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Element</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Issue</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Context</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {currentIssues.map((issue: any, index: number) => (
                        <tr key={index} className="hover:bg-slate-700/50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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
                          <td className="px-4 py-3 text-sm font-mono text-slate-400">
                            {issue.context ? (
                              <span title={issue.context} className="truncate block max-w-xs">
                                {issue.context.length > 30 ? `${issue.context.slice(0, 30)}...` : issue.context}
                              </span>
                            ) : 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                            <button 
                              onClick={() => setSelectedIssue(issue)}
                              className="text-teal-400 hover:text-teal-300"
                            >
                              View Fix
                            </button>
                          </td>
                        </tr>
                      ))}
                      
                      {currentIssues.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                            No issues found. Great job!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {scanResult.issues.length > itemsPerPage && (
                  <div className="mt-6">
                    <Pagination 
                      totalItems={scanResult.issues.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          // Show rich welcome content instead of history when there's no scan result
          renderWelcomeView()
        )}
      </main>
      
      {selectedIssue && (
        <FixModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}
    </div>
  );
}
