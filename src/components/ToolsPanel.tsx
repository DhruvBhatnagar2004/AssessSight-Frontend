import React, { useState } from "react";

export default function ToolsPanel({ onCrawlDepthChange }: { onCrawlDepthChange?: (depth: number) => void }) {
  const [depth, setDepth] = useState(1);
  return (
    <div className="flex gap-4 items-center mt-4">
      <label className="text-sm">Crawl depth:</label>
      <input type="number" min={1} max={10} value={depth} onChange={e => {
        const val = Number(e.target.value);
        setDepth(val);
        onCrawlDepthChange?.(val);
      }} className="w-16 px-2 py-1 border rounded" />
      {/* Add more advanced settings here */}
    </div>
  );
}
