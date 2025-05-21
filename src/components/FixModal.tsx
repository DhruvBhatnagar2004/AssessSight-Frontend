import React, { useState, useEffect } from 'react';

interface FixModalProps {
  issue: any;
  onClose: () => void;
}

export default function FixModal({ issue, onClose }: FixModalProps) {
  const [fixSuggestion, setFixSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchFix() {
      setLoading(true);
      
      try {
        if (issue.context || issue.html) {
          // Get backend URL with fallback
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
          
          const response = await fetch(`${backendUrl}/api/fix`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              html: issue.context || issue.html,
              issue: issue
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to get fix suggestion');
          }
          
          const data = await response.json();
          setFixSuggestion(data.fix);
        } else {
          // No HTML context available
          setFixSuggestion(getGeneralFix(issue));
        }
      } catch (err) {
        console.error('Error getting fix suggestion:', err);
        setError("Couldn't generate fix suggestion");
        setFixSuggestion(getGeneralFix(issue));
      } finally {
        setLoading(false);
      }
    }
    
    fetchFix();
  }, [issue]);
  
  // Generate generic fix when API fails or context is missing
  function getGeneralFix(issue: any) {
    const issueType = issue.type || '';
    const message = issue.message || issue.description || '';
    
    if (message.toLowerCase().includes('alt') || message.toLowerCase().includes('image')) {
      return `This appears to be related to image accessibility. Make sure all images have appropriate alt text:

\`\`\`html
<img src="image.jpg" alt="Descriptive text that explains the image content">
\`\`\`

For decorative images that don't convey information, use an empty alt attribute:

\`\`\`html
<img src="decorative.jpg" alt="">
\`\`\``;
    } else if (message.toLowerCase().includes('contrast')) {
      return `This is a color contrast issue. Ensure text has sufficient contrast with its background:

- Normal text (less than 18pt): minimum contrast ratio of 4.5:1
- Large text (18pt and larger): minimum contrast ratio of 3:1

Consider using a color contrast checker tool to verify your colors.`;
    } else if (message.toLowerCase().includes('label') || message.toLowerCase().includes('input')) {
      return `This is related to form accessibility. Ensure all form controls have proper labels:

\`\`\`html
<label for="name">Name:</label>
<input type="text" id="name" name="name">
\`\`\`

Or use the label as a wrapper:

\`\`\`html
<label>
  Name:
  <input type="text" name="name">
</label>
\`\`\``;
    }
    
    // General recommendation based on issue type
    return `General recommendation for ${issueType} issues:
    
${issueType === 'error'
  ? 'This is a critical accessibility issue that should be fixed immediately.'
  : issueType === 'warning'
  ? 'This is a potential accessibility concern that may affect some users.'
  : 'This is a minor accessibility issue that could be improved.'}

Review the WCAG guidelines for more information on how to address this specific issue.`;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-slate-700 p-4">
          <h3 className="text-lg font-medium text-slate-100">Fix Suggestion</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-4">
            <h4 className="text-md font-medium text-teal-400 mb-1">Issue</h4>
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-slate-200">{issue.message || issue.description}</p>
              <p className="text-sm text-slate-400 mt-1">Element: <span className="font-mono">{issue.selector || issue.element || 'N/A'}</span></p>
            </div>
          </div>
          
          {(issue.context || issue.html) && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-teal-400 mb-1">HTML Context</h4>
              <pre className="bg-slate-900 p-3 rounded text-slate-300 font-mono text-sm overflow-auto max-h-32">
                {issue.context || issue.html}
              </pre>
            </div>
          )}
          
          <div className="mb-4">
            <h4 className="text-md font-medium text-teal-400 mb-1">Fix Suggestion</h4>
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <div className="animate-spin h-6 w-6 border-2 border-teal-500 rounded-full border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-700 p-3 rounded text-red-300">
                {error}
                {fixSuggestion && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-1">General Recommendation:</h5>
                    <pre className="whitespace-pre-wrap text-slate-300">{fixSuggestion}</pre>
                  </div>
                )}
              </div>
            ) : (
              <pre className="bg-slate-900 p-3 rounded text-slate-300 font-mono text-sm overflow-auto max-h-64 whitespace-pre-wrap">
                {fixSuggestion}
              </pre>
            )}
          </div>
        </div>
        
        <div className="border-t border-slate-700 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
