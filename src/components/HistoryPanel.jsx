import React, { useEffect, useState } from "react";

export default function HistoryPanel() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/history`)
      .then(res => res.json())
      .then(setHistory);
  }, []);
  return (
    <section className="w-full max-w-4xl mt-8">
      <h2 className="text-xl font-bold mb-4">Scan History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">URL</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((scan, idx) => (
              <tr key={idx} className="border-t border-gray-200 dark:border-gray-800">
                <td className="px-4 py-2 text-xs">{scan.url}</td>
                <td className="px-4 py-2 text-xs">{new Date(scan.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">{scan.score}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
