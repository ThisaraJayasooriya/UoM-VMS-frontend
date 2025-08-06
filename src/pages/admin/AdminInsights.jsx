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

const PIE_COLORS = ["#F59E0B", "#EF4444"];

const CustomRadialTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const { name, value } = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-4 shadow-[0_8px_32px_rgba(245,158,11,0.15)]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444]"></div>
          <div>
            <p className="font-semibold text-[#F59E0B] text-sm">{name}</p>
            <p className="text-lg font-bold text-gray-800">{value}</p>
          </div>
        </div>
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
      fill: "#3B82F6",
    },
    {
      name: "Walk-Ins",
      value: insights.liveMonitoring.walkInCount,
      fill: "#F59E0B",
    },
    {
      name: "Total",
      value: insights.liveMonitoring.totalLiveVisitors,
      fill: "#EF4444",
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Range Selector */}
      <div className="pt-10 flex justify-end animate-slide-in">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
        {/* Visitor Trend Line Chart */}
        <div className="relative bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-[0_8px_32px_rgba(18,78,102,0.12)] 
                        border border-gray-200/50 group hover:shadow-[0_12px_40px_rgba(18,78,102,0.15)] 
                        transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/5 via-transparent to-[#2D7D9A]/3 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] 
                             flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#3B82F6]">Visitor Trend</h3>
                <p className="text-sm text-gray-600">Traffic patterns over time</p>
              </div>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={insights.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#3B82F6" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#3B82F6" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(229,231,235,0.6)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(59,130,246,0.15)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1D4ED8', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] 
                          transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>

        {/* Pie Chart */}
        <div className="relative bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-[0_8px_32px_rgba(18,78,102,0.12)] 
                        border border-gray-200/50 group hover:shadow-[0_12px_40px_rgba(18,78,102,0.15)] 
                        transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/5 via-transparent to-[#2D7D9A]/3 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#EF4444] 
                             flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F59E0B]">Check-In vs Check-Out</h3>
                <p className="text-sm text-gray-600">Activity distribution</p>
              </div>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    dataKey="value"
                    labelStyle={{ fontSize: '12px', fontWeight: '600', fill: '#374151' }}
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
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(229,231,235,0.6)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(245,158,11,0.15)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    wrapperStyle={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#EF4444] 
                          transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>

        {/* Live Monitoring Radial Bar Chart */}
        <div className="relative bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-[0_8px_32px_rgba(18,78,102,0.12)] 
                        border border-gray-200/50 group hover:shadow-[0_12px_40px_rgba(18,78,102,0.15)] 
                        transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/5 via-transparent to-[#2D7D9A]/3 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5A2B] to-[#92400E] 
                             flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#8B5A2B]">Live Monitoring</h3>
                <p className="text-sm text-gray-600">Real-time visitor status</p>
              </div>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-4">
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
                    label={{ position: "insideStart", fill: "#374151", fontSize: 14, fontWeight: '600' }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ color: "#374151", fontSize: '14px', fontWeight: '500' }}
                  />
                  <Tooltip content={<CustomRadialTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5A2B] to-[#92400E] 
                          transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>

        {/* Visitor Distribution Bar Chart */}
        <div className="relative bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-[0_8px_32px_rgba(18,78,102,0.12)] 
                        border border-gray-200/50 group hover:shadow-[0_12px_40px_rgba(18,78,102,0.15)] 
                        transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/5 via-transparent to-[#2D7D9A]/3 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] 
                             flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#059669]">Visitor Distribution</h3>
                <p className="text-sm text-gray-600">Department-wise breakdown</p>
              </div>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={insights.visitorDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="_id" stroke="#059669" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#059669" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(229,231,235,0.6)',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(5,150,105,0.15)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGradient)" 
                    barSize={50} 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#059669] to-[#047857] 
                          transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
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