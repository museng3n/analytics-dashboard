"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { apiClient } from "@/shared-api-config/api/client"
import ENDPOINTS from "@/shared-api-config/api/endpoints"
import { isAuthenticated } from "@/shared-api-config/utils/auth"
import { URLS } from "@/shared-api-config/api/config"

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("last_30_days")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlToken = urlParams.get('token')
    if (urlToken) {
      localStorage.setItem('triggerio_token', urlToken)
      window.history.replaceState({}, '', window.location.pathname)
    }

    if (!isAuthenticated()) {
      window.location.href = URLS.AUTH
      return
    }
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(ENDPOINTS.ANALYTICS.DASHBOARD, {
        params: { dateRange },
      })
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  // Sample data (fallback)
  const overviewData = dashboardData?.overview || {
    successRate: 94,
    executedToday: 142,
    executedTodayChange: "+15%",
    activeRules: 18,
    activeRulesPercentage: 78,
    totalRules: 23,
    totalRulesChange: "+5",
  }

  const temperatureData = dashboardData?.temperatureData || [
    { name: "Cold", value: 456, color: "#3B82F6", percentage: 36.6 },
    { name: "Warm", value: 534, color: "#F59E0B", percentage: 42.8 },
    { name: "Hot", value: 168, color: "#EF4444", percentage: 13.5 },
    { name: "Frozen", value: 89, color: "#9CA3AF", percentage: 7.1 },
  ]

  const funnelData = dashboardData?.funnelData || [
    { stage: "Contact", count: 1247, percentage: 100, color: "#7C3AED" },
    { stage: "Subscriber", count: 856, percentage: 68.6, color: "#8B5CF6" },
    { stage: "Lead", count: 645, percentage: 51.7, color: "#A78BFA" },
    { stage: "MQL", count: 423, percentage: 33.9, color: "#C4B5FD" },
    { stage: "SQL", count: 234, percentage: 18.8, color: "#DDD6FE" },
    { stage: "Customer", count: 89, percentage: 7.1, color: "#EDE9FE" },
  ]

  const emailCampaigns = dashboardData?.emailCampaigns || [
    { name: "Welcome Series", sent: 1234, opens: 28, clicks: 12, conversion: 4.2, revenue: 2450 },
    { name: "Product Launch", sent: 892, opens: 32, clicks: 18, conversion: 7.1, revenue: 5230 },
    { name: "Re-engagement", sent: 645, opens: 18, clicks: 8, conversion: 2.1, revenue: 1120 },
    { name: "Hot Lead Follow-up", sent: 423, opens: 45, clicks: 25, conversion: 12.3, revenue: 3650 },
  ]

  const socialMediaData = dashboardData?.socialMediaData || [
    { platform: "Instagram", count: 1234, percentage: 45 },
    { platform: "Facebook", count: 823, percentage: 30 },
    { platform: "Email", count: 549, percentage: 20 },
    { platform: "LinkedIn", count: 82, percentage: 3 },
    { platform: "Manual", count: 55, percentage: 2 },
  ]

  const automationRules = dashboardData?.automationRules || [
    { name: "Auto Reply", executions: 1456, success: 98.2, contactsAdded: 423 },
    { name: "Welcome Message", executions: 892, success: 99.1, contactsAdded: 278 },
    { name: "Email Follow-up", executions: 324, success: 95.4, contactsAdded: 89 },
    { name: "Hot Lead Alert", executions: 127, success: 100, contactsAdded: 45 },
  ]

  const ghlTransfersData = dashboardData?.ghlTransfersData || [
    { name: "Hot Leads", value: 89, color: "#EF4444" },
    { name: "MQLs", value: 67, color: "#F59E0B" },
    { name: "SQLs", value: 45, color: "#3B82F6" },
    { name: "Customers", value: 33, color: "#10B981" },
  ]

  const recentActivities = dashboardData?.recentActivities || [
    {
      type: "hot",
      icon: "🔥",
      message: "John Doe moved to Hot",
      detail: 'Via: Email reply to "Product Launch"',
      time: "2 min ago",
      color: "#EF4444",
    },
    {
      type: "campaign",
      icon: "📧",
      message: 'Campaign "Welcome Series" sent to 234 contacts',
      time: "15 min ago",
      color: "#7C3AED",
    },
    {
      type: "automation",
      icon: "⚡",
      message: 'Automation "Auto Reply" executed for @ahmad',
      time: "23 min ago",
      color: "#10B981",
    },
    {
      type: "transfer",
      icon: "🚀",
      message: "Sara Ali transferred to GHL successfully",
      time: "45 min ago",
      color: "#3B82F6",
    },
    {
      type: "payment",
      icon: "💰",
      message: "Payment received: $299 from Ahmed Corp",
      detail: "Plan: Professional (Annual)",
      time: "1 hour ago",
      color: "#F59E0B",
    },
  ]

  return (
    <div dir="rtl" className="min-h-screen bg-[#F3F4F6] p-6 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Analytics Dashboard</h1>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Selector */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <span className="text-sm">آخر 30 يوماً</span>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showDateDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                <button className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-t-lg">آخر 7 أيام</button>
                <button className="w-full text-right px-4 py-2 hover:bg-gray-100">آخر 30 يوماً</button>
                <button className="w-full text-right px-4 py-2 hover:bg-gray-100">آخر 90 يوماً</button>
                <button className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-b-lg">مخصص</button>
              </div>
            )}
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export
            </button>
            {showExportDropdown && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                <button className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-t-lg">CSV</button>
                <button className="w-full text-right px-4 py-2 hover:bg-gray-100">PDF</button>
                <button className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-b-lg">Excel</button>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button onClick={fetchDashboardData} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
          <span className="mr-3 text-gray-600">جاري التحميل...</span>
        </div>
      )}

      {/* Section 1: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Success Rate */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{overviewData.successRate}%</div>
          <div className="text-sm font-semibold text-gray-600 mb-1">معدل النجاح</div>
          <div className="text-xs text-gray-400">Success Rate</div>
          <div className="text-xs font-semibold text-green-600 mt-3">ممتاز</div>
        </Card>

        {/* Card 2: Executions */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h3l1.5-4.5 3 9 1.5-4.5h7.5" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{overviewData.executedToday}</div>
          <div className="text-sm font-semibold text-gray-600 mb-1">تم التنفيذ اليوم</div>
          <div className="text-xs text-gray-400">Executed Today</div>
          <div className="text-xs font-semibold text-green-600 mt-3">{overviewData.executedTodayChange} من الأمس</div>
        </Card>

        {/* Card 3: Active Rules */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{overviewData.activeRules}</div>
          <div className="text-sm font-semibold text-gray-600 mb-1">قواعد نشطة</div>
          <div className="text-xs text-gray-400">Active Rules</div>
          <div className="text-xs font-semibold text-green-600 mt-3">
            {overviewData.activeRulesPercentage}% من الإجمالي
          </div>
        </Card>

        {/* Card 4: Total Rules */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{overviewData.totalRules}</div>
          <div className="text-sm font-semibold text-gray-600 mb-1">إجمالي القواعد</div>
          <div className="text-xs text-gray-400">Total Rules</div>
          <div className="text-xs font-semibold text-[#7C3AED] mt-3">{overviewData.totalRulesChange}+ من الشهر</div>
        </Card>
      </div>

      {/* Section 2: Filters & Search */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-[350px]">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو نوع المحفز..."
              className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600">حسب:</span>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="all">All Status</option>
              <option value="active">نشط (Active)</option>
              <option value="paused">معطّل (Paused)</option>
              <option value="draft">مسودة (Draft)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Section 3: Temperature Distribution */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Temperature Distribution</h2>
            <p className="text-sm text-gray-600">توزيع حرارة جهات الاتصال</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={temperatureData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="value"
                  label={false}
                >
                  {temperatureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-4">
            {temperatureData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                </div>
                <div className="text-left">
                  <span className="font-bold text-gray-900">{item.value}</span>
                  <span className="text-gray-600 mr-2">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">7 أيام</div>
            <div className="text-sm text-gray-600">Cold → Warm Average time</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">14 يوم</div>
            <div className="text-sm text-gray-600">Warm → Hot Average time</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">25%</div>
            <div className="text-sm text-gray-600">Hot → Customer Conversion</div>
          </div>
        </div>
      </Card>

      {/* Section 4: Sales Funnel */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sales Funnel</h2>
            <p className="text-sm text-gray-600">مسار المبيعات</p>
          </div>
        </div>

        <div className="space-y-4">
          {funnelData.map((stage, index) => (
            <div key={index}>
              <div
                className="relative h-20 rounded-lg flex items-center justify-between px-6 transition-all hover:shadow-md"
                style={{
                  backgroundColor: stage.color,
                  width: `${stage.percentage}%`,
                  minWidth: "250px",
                  margin: "0 auto",
                }}
              >
                <div className="text-white">
                  <div className="font-bold text-lg">{stage.stage}</div>
                  <div className="text-sm opacity-90">
                    {stage.count} ({stage.percentage}%)
                  </div>
                </div>
              </div>
              {index < funnelData.length - 1 && (
                <div className="text-center text-sm text-gray-600 my-2">
                  ↓ -{funnelData[index].count - funnelData[index + 1].count} contacts (-
                  {(((funnelData[index].count - funnelData[index + 1].count) / funnelData[index].count) * 100).toFixed(
                    1,
                  )}
                  %)
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="font-bold text-gray-900 mb-3">Overall Conversion Rate: 7.1% (Contact → Customer)</div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Biggest drop: Contact → Subscriber (-391, -31.4%)</li>
            <li>• Second drop: Lead → MQL (-222, -34.4%)</li>
            <li>• Best retention: SQL → Customer (38.0%)</li>
          </ul>
        </div>
      </Card>

      {/* Section 5: Email Campaign Performance */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Email Campaign Performance</h2>
            <p className="text-sm text-gray-600">أداء حملات البريد الإلكتروني</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">3,194</div>
            <div className="text-sm text-gray-600">Emails Sent</div>
            <div className="text-xs text-green-600 font-semibold mt-1">+234 ↑</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">28.5%</div>
            <div className="text-sm text-gray-600">Open Rate</div>
            <div className="text-xs text-green-600 font-semibold mt-1">+3.2% ↑</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">12.3%</div>
            <div className="text-sm text-gray-600">Click Rate</div>
            <div className="text-xs text-green-600 font-semibold mt-1">+1.8% ↑</div>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Campaign Name</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Sent</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Opens</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Clicks</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Conv.</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {emailCampaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
                  <td className="py-3 px-4 text-gray-700">{campaign.sent.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`${campaign.opens >= 30 ? "text-green-600" : campaign.opens >= 20 ? "text-orange-500" : "text-red-500"} font-semibold`}
                    >
                      {campaign.opens}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`${campaign.clicks >= 15 ? "text-green-600" : campaign.clicks >= 10 ? "text-orange-500" : "text-red-500"} font-semibold`}
                    >
                      {campaign.clicks}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{campaign.conversion}%</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">${campaign.revenue.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4">3,194</td>
                <td className="py-3 px-4 text-orange-500">28.5%</td>
                <td className="py-3 px-4 text-orange-500">12.3%</td>
                <td className="py-3 px-4">5.8%</td>
                <td className="py-3 px-4">$12,450</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm">
          <div className="text-green-600 font-semibold">🏆 Best Performing: Hot Lead Follow-up (45% open rate)</div>
          <div className="text-orange-500 font-semibold">⚠️ Needs Improvement: Re-engagement (18% open rate)</div>
        </div>
      </Card>

      {/* Section 6: Social Media Engagement */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Social Media Engagement</h2>
            <p className="text-sm text-gray-600">التفاعل على وسائل التواصل</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={socialMediaData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="platform" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#7C3AED" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 text-center">
          <div className="text-2xl font-bold text-gray-900">Total Engagements: 2,743</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                💬 Comments: <span className="font-bold">567</span>
              </div>
              <div>
                🔖 Saves: <span className="font-bold">423</span>
              </div>
              <div>
                🔄 Shares: <span className="font-bold">178</span>
              </div>
              <div>
                💬 Story: <span className="font-bold">66</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                💬 Comments: <span className="font-bold">389</span>
              </div>
              <div>
                🔄 Shares: <span className="font-bold">234</span>
              </div>
              <div>
                ❤️ Reactions: <span className="font-bold">200</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 7: Automation Performance */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Automation Performance</h2>
            <p className="text-sm text-gray-600">أداء الأتمتة</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">Active Rules: 23 | Total Executions: 2,799 (Last 30 days)</p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Rule Name</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Executions</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Success</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Contacts Added</th>
              </tr>
            </thead>
            <tbody>
              {automationRules.map((rule, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{rule.name}</td>
                  <td className="py-3 px-4 text-gray-700">{rule.executions.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`${rule.success >= 95 ? "text-green-600" : rule.success >= 90 ? "text-orange-500" : "text-red-500"} font-semibold`}
                    >
                      {rule.success}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{rule.contactsAdded}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4">2,799</td>
                <td className="py-3 px-4 text-green-600">97.8%</td>
                <td className="py-3 px-4">835</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3">Milestones Achieved (This Week):</h3>
            <ul className="space-y-2 text-sm">
              <li>🎯 156 contacts reached "1 click" milestone</li>
              <li>🔥 67 contacts reached "5 clicks" milestone</li>
              <li>⭐ 23 contacts reached "10 clicks" milestone</li>
            </ul>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-3">Save Contact Categories (Last 30 days):</h3>
            <ul className="space-y-2 text-sm">
              <li>• حفظ الفيديو: 423 contacts</li>
              <li>• مشاركة المنشور: 234 contacts</li>
              <li>• متابع جديد: 178 contacts</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 8: GHL Transfers */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">GoHighLevel Transfers</h2>
            <p className="text-sm text-gray-600">التحويلات إلى GoHighLevel</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">234</div>
            <div className="text-sm text-gray-600">Transferred</div>
            <div className="text-xs text-green-600 font-semibold mt-1">+45 ↑</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">96.2%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-xs text-green-600 font-semibold mt-1">+2.1% ↑</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-xs text-green-600 font-semibold mt-1">-3 ↓</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={ghlTransfersData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                  {ghlTransfersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">Transfer Breakdown by Stage:</h3>
            {ghlTransfersData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                </div>
                <div className="text-left">
                  <span className="font-bold text-gray-900">{item.value}</span>
                  <span className="text-gray-600 mr-2">({((item.value / 234) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Failed Transfers (9 total):</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Invalid GHL location: 5</li>
            <li>• Network timeout: 3</li>
            <li>• Duplicate contact: 1</li>
          </ul>
        </div>

        <div className="text-left">
          <button className="px-4 py-2 text-[#7C3AED] hover:text-[#6D28D9] font-semibold">View Transfer Logs →</button>
        </div>
      </Card>

      {/* Section 9: Recent Activity Feed */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-600">النشاط الأخير</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-6">Real-time updates [Auto-refreshes every 30 seconds]</p>

        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: activity.color + "20" }}
                >
                  <span className="text-2xl">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{activity.message}</div>
                  {activity.detail && <div className="text-sm text-gray-600 mt-1">{activity.detail}</div>}
                  <div className="text-xs text-gray-500 mt-2">{activity.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors">
            Load More Activity →
          </button>
        </div>
      </Card>
    </div>
  )
}
