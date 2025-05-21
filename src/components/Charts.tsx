"use client";
import React from "react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  CartesianGrid, ReferenceLine, Label
} from "recharts";

// More vibrant color scheme
const COLORS = ["#f43f5e", "#f97316", "#3b82f6"];
const CATEGORY_COLORS = ["#10b981", "#8b5cf6", "#f97316", "#ec4899"];

export const SeverityPie = ({ data }) => {
  // Don't render empty pie chart
  if (!data || data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No accessibility issues detected</p>
        </div>
      </div>
    );
  }

  // Custom label to make it more readable
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          labelLine={false}
          label={renderCustomizedLabel}
          animationBegin={0}
          animationDuration={1200}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              strokeWidth={2}
              stroke="rgba(0,0,0,0.1)"
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [`${value} issues`, name]} 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            borderRadius: '8px',
            border: '1px solid rgba(100, 116, 139, 0.5)',
            padding: '8px 12px',
            color: '#e2e8f0'
          }}
          itemStyle={{color: '#e2e8f0'}}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const IssuesBar = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No issues to display</p>
        </div>
      </div>
    );
  }
  
  // Group issues by element type with improved detection
  const getElementType = (issue) => {
    const selector = (issue.selector || issue.element || '').toLowerCase();
    const message = (issue.message || issue.description || '').toLowerCase();
    
    // Improved detection logic
    if (selector.includes('img') || message.includes('image') || message.includes('alt')) {
      return 'Images';
    }
    if (selector.includes('a') || selector.includes('link') || 
        selector.includes('nav') || message.includes('link')) {
      return 'Navigation';
    }
    if (selector.includes('button') || selector.includes('input') || 
        selector.includes('form') || selector.includes('select') || 
        selector.includes('label') || selector.includes('textarea') || 
        message.includes('form') || message.includes('input') || 
        message.includes('label')) {
      return 'Forms';
    }
    if (selector.includes('h1') || selector.includes('h2') || 
        selector.includes('h3') || selector.includes('p') || 
        selector.includes('text') || message.includes('text') ||
        message.includes('content')) {
      return 'Content';
    }
    return 'Structure';
  };
  
  const categoryData = [
    { name: "Images", value: data.filter(i => getElementType(i) === 'Images').length },
    { name: "Navigation", value: data.filter(i => getElementType(i) === 'Navigation').length },
    { name: "Forms", value: data.filter(i => getElementType(i) === 'Forms').length },
    { name: "Content", value: data.filter(i => getElementType(i) === 'Content').length },
    { name: "Structure", value: data.filter(i => getElementType(i) === 'Structure').length }
  ].filter(cat => cat.value > 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={categoryData} 
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        barGap={4}
        barSize={36}
        animationBegin={0}
        animationDuration={1200}
      >
        <XAxis 
          dataKey="name" 
          stroke="#94a3b8" 
          tickLine={false}
          axisLine={false}
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          stroke="#94a3b8" 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          formatter={(value) => [`${value} issues`, 'Count']}
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            borderRadius: '8px',
            border: '1px solid rgba(100, 116, 139, 0.5)',
            padding: '8px 12px',
            color: '#e2e8f0'
          }}
          itemStyle={{color: '#e2e8f0'}}
        />
        <Bar 
          dataKey="value" 
          radius={[4, 4, 0, 0]}
          background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
        >
          {categoryData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
              fillOpacity={0.9}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CategoryRadar = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
          <p>No category data available</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart outerRadius={90} width={730} height={250} data={data}>
        <PolarGrid stroke="rgba(148, 163, 184, 0.3)" />
        <PolarAngleAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8" }} />
        <Radar 
          name="Accessibility" 
          dataKey="score" 
          stroke="#10b981" 
          fill="#10b981" 
          fillOpacity={0.5} 
          animationBegin={0}
          animationDuration={1200}
        />
        <Tooltip 
          formatter={(value) => [`${value}%`, 'Score']}
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            borderRadius: '8px',
            border: '1px solid rgba(100, 116, 139, 0.5)',
            padding: '8px 12px',
            color: '#e2e8f0'
          }}
          itemStyle={{color: '#e2e8f0'}}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export const ScoreLine = ({ score = 0 }) => {
  // Fix negative scores
  const validScore = isNaN(score) || score < 0 ? 0 : Math.min(score, 100);
  
  // Determine color based on score
  const getScoreColor = () => {
    if (validScore >= 90) return '#10b981'; // green
    if (validScore >= 70) return '#22d3ee'; // cyan
    if (validScore >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="relative h-48 w-48 animate-fadeIn">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-5xl font-bold text-center">
          <span style={{ color: getScoreColor() }}>{validScore}</span>
          <span className="text-2xl text-slate-300">%</span>
        </div>
      </div>
      <svg className="w-full h-full" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle 
          cx="60" 
          cy="60" 
          r="54" 
          fill="none" 
          stroke="rgba(51, 65, 85, 0.6)" 
          strokeWidth="12" 
        />
        
        {/* Progress circle with animation */}
        <circle 
          cx="60" 
          cy="60" 
          r="54" 
          fill="none" 
          stroke={getScoreColor()}
          strokeWidth="12" 
          strokeLinecap="round"
          strokeDasharray={`${(validScore / 100) * 339} 339`} 
          transform="rotate(-90 60 60)"
          className="transition-all duration-1000 ease-out"
          style={{
            strokeDashoffset: 0,
            filter: `drop-shadow(0 0 6px ${getScoreColor()})`
          }}
        />
      </svg>
      <div className="mt-4 text-center text-slate-300">
        {validScore >= 90 ? "Excellent" : 
         validScore >= 70 ? "Good" :
         validScore >= 50 ? "Fair" : "Poor"}
      </div>
    </div>
  );
};

export const TrendLine = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
          <p>No trend data available yet</p>
          <p className="text-sm mt-2">Run more scans to see trends over time</p>
        </div>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart 
        data={data} 
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        animationBegin={0}
        animationDuration={1200}
      >
        <defs>
          <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorWarnings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="month" 
          stroke="#94a3b8" 
          tickLine={false}
          axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
        />
        <YAxis 
          stroke="#94a3b8" 
          tickLine={false}
          axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            borderRadius: '8px',
            border: '1px solid rgba(100, 116, 139, 0.5)',
            padding: '8px 12px',
            color: '#e2e8f0'
          }}
          itemStyle={{color: '#e2e8f0'}}
        />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="errors" 
          stroke="#f43f5e" 
          fillOpacity={1} 
          fill="url(#colorErrors)" 
          name="Errors"
          strokeWidth={2}
        />
        <Area 
          type="monotone" 
          dataKey="warnings" 
          stroke="#f97316" 
          fillOpacity={1} 
          fill="url(#colorWarnings)" 
          name="Warnings"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export const HistoricalScores = ({ data }) => {
  if (!data || data.length < 2) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Need at least 2 scans to show trends</p>
          <p className="text-sm mt-2">Scan more websites to see historical data</p>
        </div>
      </div>
    );
  }

  // Sort data chronologically
  const sortedData = [...data].sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

  // Format data for chart (still keep domain names in data for tooltip)
  const chartData = sortedData.map(scan => {
    // Extract domain from URL
    const domainMatch = scan.url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/i);
    const domain = domainMatch ? domainMatch[1] : scan.url;
    
    // Store the date for tooltip
    const date = new Date(scan.date || scan.createdAt);
    const dateStr = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
    
    return {
      name: domain,           // Keep domain name for tooltip reference
      score: scan.score || 0,
      url: scan.url,
      dateScanned: dateStr
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart 
        data={chartData} 
        margin={{ top: 5, right: 30, bottom: 20, left: 0 }}
        animationBegin={0}
        animationDuration={1600}
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
          </linearGradient>
          <filter id="shadow" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>
        <XAxis 
          dataKey="name" 
          stroke="#94a3b8" 
          tickLine={false}
          axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
          tick={false}         // Hide the tick labels
          height={20}          // Reduce height since we don't need space for labels
        />
        <YAxis 
          stroke="#94a3b8" 
          tickLine={false}
          axisLine={{ stroke: 'rgba(148, 163, 184, 0.3)' }}
          domain={[0, 100]}
          tickCount={6}
        />
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="rgba(148, 163, 184, 0.2)" 
        />
        <Tooltip 
          formatter={(value, name) => [`${value}%`, 'Accessibility Score']}
          labelFormatter={(label) => {
            // Find the corresponding data entry
            const item = chartData.find(item => item.name === label);
            return item ? `${item.url} (Scanned: ${item.dateScanned})` : label;
          }}
          contentStyle={{ 
            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
            borderRadius: '8px',
            border: '1px solid rgba(100, 116, 139, 0.5)',
            padding: '8px 12px',
            color: '#e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
          }}
          itemStyle={{color: '#e2e8f0'}}
          cursor={{ strokeDasharray: '3 3' }}  // Dashed vertical line on hover
        />
        <Area 
          type="monotone" 
          dataKey="score" 
          stroke="#10b981" 
          strokeWidth={3}
          fill="url(#scoreGradient)"
          activeDot={{ 
            r: 6, 
            strokeWidth: 2, 
            stroke: '#10b981', 
            fill: 'white',
            filter: 'url(#shadow)' 
          }}
        />
        {/* Reference lines with fixed position labels */}
        <ReferenceLine 
          y={90} 
          stroke="#10b981" 
          strokeDasharray="3 3" 
          ifOverflow="extendDomain"
        >
          <Label 
            value="Excellent" 
            position="insideRight" 
            fill="#10b981"
            fontSize={12}
          />
        </ReferenceLine>
        
        <ReferenceLine 
          y={70} 
          stroke="#22d3ee" 
          strokeDasharray="3 3" 
          ifOverflow="extendDomain"
        >
          <Label 
            value="Good" 
            position="insideRight" 
            fill="#22d3ee"
            fontSize={12}
          />
        </ReferenceLine>
        
        <ReferenceLine 
          y={50} 
          stroke="#f59e0b" 
          strokeDasharray="3 3" 
          ifOverflow="extendDomain"
        >
          <Label 
            value="Fair" 
            position="insideRight" 
            fill="#f59e0b"
            fontSize={12}
          />
        </ReferenceLine>
      </AreaChart>
    </ResponsiveContainer>
  );
};
