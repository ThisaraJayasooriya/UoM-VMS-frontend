import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#124E66", "#5f767c"]; 

const AdminInsights = () => {
  const [insights, setInsights] = useState(null);
  const [range, setRange] = useState("day");
  const [loading, setLoading] = useState(true);

  const fetchInsights = async (selectedRange) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/insights?range=${selectedRange}`);
      const data = await res.json();
      setInsights(data);
    } catch (err) {
      console.error("Error fetching admin insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(range);
  }, [range]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  if (loading || !insights) return <div className="p-6 text-gray-500">Loading insights...</div>;

  const totalCheck = insights.checkInCount + insights.checkOutCount;
  const pieData = [
    {
      name: "Check-Ins",
      value: insights.checkInCount,
      percentage: ((insights.checkInCount / totalCheck) * 100).toFixed(1),
    },
    {
      name: "Check-Outs",
      value: insights.checkOutCount,
      percentage: ((insights.checkOutCount / totalCheck) * 100).toFixed(1),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold" style={{ color: "#124E66" }}>
           
        </h2>
          <select
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-[#124E66] focus:outline-none focus:ring-2 focus:ring-[#124E66] hover:border-[#124E66] transition"
            value={range}
            onChange={handleRangeChange}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg shadow" style={{ backgroundColor: "#D3D9D4", color: "#124E66" }}>
          <h3 className="text-lg font-medium">Total Visitors</h3>
          <p className="text-2xl font-bold">{insights.totalVisitors}</p>
        </div>
        <div className="p-4 rounded-lg shadow" style={{ backgroundColor: "#D3D9D4", color: "#124E66" }}>
          <h3 className="text-lg font-medium">Peak Hour</h3>
          <p className="text-2xl font-bold">{insights.peakHour}</p>
        </div>
        <div className="p-4 rounded-lg shadow" style={{ backgroundColor: "#D3D9D4", color: "#124E66" }}>
          <h3 className="text-lg font-medium">Check-Ins</h3>
          <p className="text-2xl font-bold">{insights.checkInCount}</p>
        </div>
        <div className="p-4 rounded-lg shadow" style={{ backgroundColor: "#D3D9D4", color: "#124E66" }}>
          <h3 className="text-lg font-medium">Check-Outs</h3>
          <p className="text-2xl font-bold">{insights.checkOutCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4" style={{ color: "#124E66" }}>Visitor Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#124E66" />
              <YAxis allowDecimals={false} stroke="#124E66" />
              <Tooltip />
              <Bar dataKey="count" fill="#748D92" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4" style={{ color: "#124E66" }}>Check-In vs Check-Out</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminInsights;
