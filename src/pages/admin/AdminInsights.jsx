import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from "recharts";


// Theme colors 
const THEME_COLORS = {
  darkblue: "#212A31",
  blue: "#124E66",
  darkblue2: "#2E3944",
  blue2: "#748D92",
  blue3: "#D3D9D4",
  customgray: "#5f767c"
};

// Chart colors 
const CHART_COLORS = [THEME_COLORS.blue, "#82ca9d", "#ffc658", THEME_COLORS.blue2, THEME_COLORS.customgray];

const AdminInsights = () => {
  // Sample Data - replace with API data later
  const [visitorTrends, setVisitorTrends] = useState([
    { date: "Mon", visitors: 50 },
    { date: "Tue", visitors: 75 },
    { date: "Wed", visitors: 100 },
    { date: "Thu", visitors: 65 },
    { date: "Fri", visitors: 90 },
  ]);

  const [checkStats, setCheckStats] = useState([
    { name: "Check-In", value: 240 },
    { name: "Check-Out", value: 200 },
  ]);

  const [visitorTypes, setVisitorTypes] = useState([
    { type: "Guest", count: 100 },
    { type: "Vendor", count: 50 },
    { type: "Delivery", count: 30 },
    { type: "Interviewee", count: 20 },
  ]);

  const [liveVisitors, setLiveVisitors] = useState(27); // Simulated live count
  const [timeRange, setTimeRange] = useState("week"); // Default time range

  // Simulate live count (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => Math.max(10, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Custom tooltip styles
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-blue3 rounded-md shadow-md">
          <p className="text-blue font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Time range selector handler
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // In a real app, this would fetch new data based on the selected range
  };

  return (
    <div className="p-6 space-y-8 bg-blue3/30 min-h-screen text-darkblue2 pt-6 sm:pt-8 md:pt-10 lg:pt-12">
      {/* Time range selector - moved to top right */}
      <div className="flex justify-end">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
          {["day", "week", "month"].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-4 py-2 text-sm rounded-md transition-all ${
                timeRange === range 
                  ? "bg-blue text-white font-medium" 
                  : "text-customgray hover:bg-blue3/50"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue3/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-customgray text-sm mb-1">Total Visitors</p>
              <h3 className="text-3xl font-bold text-darkblue">345</h3>
            </div>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <p className="text-xs text-customgray mt-4">Compared to last {timeRange}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue3/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-customgray text-sm mb-1">Avg. Visit Duration</p>
              <h3 className="text-3xl font-bold text-darkblue">1.2h</h3>
            </div>
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">-5.3%</span>
          </div>
          <p className="text-xs text-customgray mt-4">Compared to last {timeRange}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue3/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-customgray text-sm mb-1">Peak Hour</p>
              <h3 className="text-3xl font-bold text-darkblue">10AM</h3>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Weekdays</span>
          </div>
          <p className="text-xs text-customgray mt-4">Based on check-in data</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue3/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-customgray text-sm mb-1">Currently Inside</p>
              <h3 className="text-3xl font-bold text-blue">{liveVisitors}</h3>
            </div>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Live
            </span>
          </div>
          <p className="text-xs text-customgray mt-4">Updated in real-time</p>
        </div>
      </div>

      {/* Rest of your existing code remains unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue3/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue">Visitor Trends</h2>
            <span className="text-xs font-medium px-3 py-1 bg-blue3/50 text-blue rounded-full">Last 5 Days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THEME_COLORS.blue} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={THEME_COLORS.blue} stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.blue3} />
                <XAxis 
                  dataKey="date" 
                  stroke={THEME_COLORS.customgray} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke={THEME_COLORS.customgray} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke={THEME_COLORS.blue} 
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: THEME_COLORS.blue }}
                  dot={{ r: 4, fill: THEME_COLORS.blue }}
                  fill="url(#visitorGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Check-In vs Check-Out */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue3/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue">Check-In vs Check-Out</h2>
            <span className="text-xs font-medium px-3 py-1 bg-blue3/50 text-blue rounded-full">Today</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={checkStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: THEME_COLORS.customgray, strokeWidth: 1 }}
                >
                  {checkStats.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? THEME_COLORS.blue : THEME_COLORS.blue2} 
                      stroke={THEME_COLORS.blue3}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Types */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue3/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue">Visitor Distribution</h2>
            <span className="text-xs font-medium px-3 py-1 bg-blue3/50 text-blue rounded-full">By Type</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorTypes} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.blue3} vertical={false} />
                <XAxis 
                  dataKey="type" 
                  stroke={THEME_COLORS.customgray}
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: THEME_COLORS.blue3 }}
                />
                <YAxis 
                  stroke={THEME_COLORS.customgray}
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: THEME_COLORS.blue3 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                >
                  {visitorTypes.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index % 2 === 0 ? THEME_COLORS.blue : THEME_COLORS.blue2} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Patterns */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue3/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue">Live Monitoring</h2>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-xs font-medium text-green-600">Active Now</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center h-56">
            <div className="text-7xl font-bold text-blue relative">
              {liveVisitors}
              <div className="text-sm font-normal text-customgray absolute bottom-0 right-0 translate-x-full pb-2">
                visitors
              </div>
            </div>
            <div className="flex items-center mt-6 text-sm text-customgray">
              <div className="mr-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>12 Scheduled</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>5 Walk-ins</span>
              </div>
            </div>
            <div className="mt-6 w-full">
              <div className="flex justify-between items-center text-xs text-customgray mb-1">
                <span>Building Capacity</span>
                <span>35%</span>
              </div>
              <div className="w-full bg-blue3/50 rounded-full h-2">
                <div className="bg-blue h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInsights;