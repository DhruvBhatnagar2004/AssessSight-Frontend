import React, { useState } from 'react';
import Pagination from './Pagination';

export default function IssuesTable({ issues, onSelectIssue }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Get current issues for pagination
  const indexOfLastIssue = currentPage * itemsPerPage;
  const indexOfFirstIssue = indexOfLastIssue - itemsPerPage;
  const currentIssues = issues.slice(indexOfFirstIssue, indexOfLastIssue);
  
  // Get severity class
  const getSeverityClass = (type) => {
    switch(type) {
      case "error":
        return "bg-red-900/30 text-red-400 border border-red-700";
      case "warning":
        return "bg-amber-900/30 text-amber-400 border border-amber-700";
      default:
        return "bg-blue-900/30 text-blue-400 border border-blue-700";
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Element</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Issue</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Context</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {currentIssues.map((issue, index) => (
              <tr key={issue.id || index} className="hover:bg-slate-700/50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityClass(issue.type)}`}>
                    {issue.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-slate-400">
                  {issue.element || issue.selector || 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {issue.message || issue.description}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-slate-400">
                  {issue.context ? (
                    <div className="max-w-xs truncate" title={issue.context}>
                      {issue.context.length > 30 ? `${issue.context.slice(0, 30)}...` : issue.context}
                    </div>
                  ) : 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-300">
                  {onSelectIssue && (
                    <button 
                      onClick={() => onSelectIssue(issue)}
                      className="text-teal-400 hover:text-teal-300 font-medium"
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
            
            {currentIssues.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No issues found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {issues.length > itemsPerPage && (
        <div className="mt-4">
          <Pagination 
            totalItems={issues.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}