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

  // Skeleton Loading Component for AdminInsights
  const SkeletonLoader = () => (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Range Selector Skeleton */}
      <div className="flex justify-end animate-slide-in">
        <div className="w-32 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-gray-300 to-gray-400 p-6 rounded-xl shadow-sm border border-gray-300 animate-pulse"
          >
            <div className="h-5 w-24 bg-white/30 rounded mb-3"></div>
            <div className="h-8 w-16 bg-white/30 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-lg shadow animate-pulse"
          >
            {/* Chart Title Skeleton */}
            <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
            
            {/* Chart Content Skeleton */}
            <div className="h-[300px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="space-y-3 w-full px-4">
                {/* Simulate chart elements */}
                {idx === 0 && ( // Line chart skeleton
                  <>
                    <div className="flex justify-between items-end h-32">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 bg-gray-300 rounded-t animate-pulse"
                          style={{ 
                            height: `${Math.random() * 80 + 20}%`
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </>
                )}
                
                {idx === 1 && ( // Pie chart skeleton
                  <div className="flex items-center justify-center h-full">
                    <div className="w-32 h-32 border-8 border-gray-300 rounded-full animate-spin" style={{ borderTopColor: '#748D92' }}></div>
                  </div>
                )}
                
                {idx === 2 && ( // Radial chart skeleton
                  <div className="flex items-center justify-center h-full">
                    <div className="relative">
                      <div className="w-40 h-40 border-4 border-gray-300 rounded-full animate-pulse"></div>
                      <div className="absolute inset-4 border-4 border-gray-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-8 border-4 border-gray-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
                
                {idx === 3 && ( // Bar chart skeleton
                  <>
                    <div className="flex justify-between items-end h-32">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 bg-gray-300 rounded-t animate-pulse"
                          style={{ 
                            height: `${Math.random() * 70 + 30}%`
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading || !insights) {
    return <SkeletonLoader />;
  }
  
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
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Range Selector */}
      <div className="flex justify-end animate-slide-in">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          {[
          { title: "Total Visitors", value: insights.totalVisitors },
          { title: "Peak Hour", value: insights.peakHour },
          { title: "Check-Ins", value: insights.checkInCount },
          { title: "Check-Outs", value: insights.checkOutCount },
          ].map((card, idx) => (
          <div
            key={idx}
            className="bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))] p-6 rounded-xl shadow-sm border border-[#124E66] transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-white animate-slide-up"
          >
            <h3 className="text-lg font-medium">{card.title}</h3>
            <p className="text-3xl font-bold animate-pulse-slow">{card.value}</p>
          </div>
        ))}
      </div>


      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
        {/* Visitor Trend Line Chart */}
        <div className="bg-white p-4 rounded-lg shadow animate-fade-in">
          <h3 className="text-lg font-medium mb-4 text-[#124E66] animate-slide-in">Visitor Trend</h3>
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
        <div className="bg-white p-4 rounded-lg shadow animate-fade-in">
          <h3 className="text-lg font-medium mb-4 text-[#124E66] animate-slide-in">Check-In vs Check-Out</h3>
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
        <div className="bg-white p-4 rounded-lg shadow animate-fade-in">
          <h3 className="text-lg font-medium mb-4 text-[#124E66] animate-slide-in">Live Monitoring</h3>
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
        <div className="bg-white p-4 rounded-lg shadow animate-fade-in">
          <h3 className="text-lg font-medium mb-4 text-[#124E66] animate-slide-in">Visitor Distribution</h3>
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

      {/* Add custom styles for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { 
              opacity: 0; 
              transform: translateY(20px);
            }
            to { 
              opacity: 1; 
              transform: translateY(0);
            }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(30px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateX(30px);
            }
            to { 
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes bounceGentle {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          
          @keyframes pulseSlow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .animate-slide-up {
            animation: slideUp 0.8s ease-out forwards;
          }
          
          .animate-slide-in {
            animation: slideIn 0.6s ease-out forwards;
          }
          
          .animate-bounce-gentle {
            animation: bounceGentle 2s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulseSlow 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default AdminInsights;
