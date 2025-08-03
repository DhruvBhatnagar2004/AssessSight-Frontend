import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mb-4"></div>
      <p className="text-slate-300">Scanning website for accessibility issues...</p>
      <p className="text-sm text-slate-400 mt-2">This may take a moment depending on the complexity of the website</p>
    </div>
  );
}