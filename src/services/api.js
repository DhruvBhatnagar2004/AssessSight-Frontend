/**
 * API service for accessibility scanning
 */

// Get the backend URL from environment or use a fallback with dynamic port detection
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    // When running in browser
    const hostname = window.location.hostname;
    // Try the environment variable first
    if (process.env.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    }
    // If no env var, use same hostname with default port
    return `http://${hostname}:4000`;
  }
  // Server-side fallback
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
};

export async function scanWebsite(options) {
  try {
    const backendUrl = getBackendUrl();
    
    // Add auth token if available
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Include token if authenticated
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${backendUrl}/api/scan`, {
      method: 'POST',
      headers,
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error(`Scan failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during scan:', error);
    throw error;
  }
}
export async function getScanResults(id) {
  try {
    const backendUrl = getBackendUrl();
    
    // Include auth token
    const headers = {};
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${backendUrl}/api/scan/${id}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch scan results`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching scan results:', error);
    throw error;
  }
}

export async function getScanHistory() {
  try {
    // Don't fetch if no auth token
    const token = localStorage.getItem('accessToken');
    if (!token) return [];
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    const response = await fetch(`${backendUrl}/api/history`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch scan history: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return [];
  }
}

export async function getScanById(id) {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/scan/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch scan details`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching scan details:', error);
    throw error;
  }
}

export async function getFixSuggestion(html, issue) {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/api/fix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html, issue }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get fix suggestion');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting fix suggestion:', error);
    throw error;
  }
}