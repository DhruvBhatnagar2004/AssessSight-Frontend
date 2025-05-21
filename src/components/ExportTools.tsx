import React from "react";

export default function ExportTools({ data }: { data: any }) {
  function exportCSV() {
    const csv = [
      ["Type", "Selector", "Message"],
      ...data.issues.map((i: any) => [i.type, i.selector, i.message]),
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accessibility_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="flex gap-2 mt-4">
      <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold" onClick={exportCSV}>Export CSV</button>
      {/* PDF export can be added with jsPDF or similar */}
    </div>
  );
}
