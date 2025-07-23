import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
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
  RadialBarChart,
  RadialBar,
} from "recharts";

const PIE_COLORS = ["#124E66", "#5f767c"];

const CustomRadialTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded p-2 shadow text-sm">
        <strong style={{ color: "#124E66" }}>{name}</strong>: {value}
      </div>
    );
  }
  return null;
};

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

  if (loading || !insights)
    return <div className="p-6 text-gray-500">Loading insights...</div>;

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

  const liveMonitoringData = [
    {
      name: "Scheduled",
      value: insights.liveMonitoring.scheduledCount,
      fill: "#2E3944",
    },
    {
      name: "Walk-Ins",
      value: insights.liveMonitoring.walkInCount,
      fill: "#124E66",
    },
    {
      name: "Total",
      value: insights.liveMonitoring.totalLiveVisitors,
      fill: "#748D92",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Range Selector */}
      <div className="flex justify-end">
        <select
          className="bg-white border border-[#748D92] text-sm text-[#124E66] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#124E66] transition"
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
        {[
          { title: "Total Visitors", value: insights.totalVisitors },
          { title: "Peak Hour", value: insights.peakHour },
          { title: "Check-Ins", value: insights.checkInCount },
          { title: "Check-Outs", value: insights.checkOutCount },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg shadow"
            style={{ backgroundColor: "#D3D9D4", color: "#124E66" }}
          >
            <h3 className="text-lg font-medium">{card.title}</h3>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visitor Trend Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-[#124E66]">Visitor Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={insights.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#124E66" />
              <YAxis allowDecimals={false} stroke="#124E66" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#748D92"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-[#124E66]">Check-In vs Check-Out</h3>
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
                formatter={(value, name, props) => [
                  `${value} (${props.payload.percentage}%)`,
                  name,
                ]}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Live Monitoring Radial Bar Chart with Fixed Tooltip */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-[#124E66]">Live Monitoring</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              barSize={15}
              data={liveMonitoringData}
            >
              <RadialBar
                minAngle={15}
                label={{ position: "insideStart", fill: "#D3D9D4", fontSize: 14 }}
                background
                clockWise
                dataKey="value"
              />
              <Legend
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ color: "#124E66" }}
              />
              <Tooltip content={<CustomRadialTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        {/* Visitor Distribution Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-[#124E66]">Visitor Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.visitorDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" stroke="#124E66" />
              <YAxis allowDecimals={false} stroke="#124E66" />
              <Tooltip />
              <Bar dataKey="count" fill="#124E66" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminInsights;
