"use client"

import { useKifayat } from "@/components/kifayat-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AirVent, Download, Fan, Lightbulb, MonitorSmartphone, Tv, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Reports() {
  const { user, currentConsumption, projectedBill } = useKifayat()
  const [timeframe, setTimeframe] = useState("month")

  // Calculate appliance type distribution
  const calculateApplianceDistribution = () => {
    const typeMap: Record<string, { consumption: number; count: number }> = {
      cooling: { consumption: 0, count: 0 },
      kitchen: { consumption: 0, count: 0 },
      entertainment: { consumption: 0, count: 0 },
      lighting: { consumption: 0, count: 0 },
      electronics: { consumption: 0, count: 0 },
      other: { consumption: 0, count: 0 },
    }

    user?.appliances.forEach((appliance) => {
      const dailyConsumption = (appliance.wattage * appliance.quantity * appliance.hoursPerDay) / 1000
      if (typeMap[appliance.type]) {
        typeMap[appliance.type].consumption += dailyConsumption
        typeMap[appliance.type].count += appliance.quantity
      } else {
        typeMap.other.consumption += dailyConsumption
        typeMap.other.count += appliance.quantity
      }
    })

    return Object.entries(typeMap).map(([type, data]) => ({
      type,
      consumption: data.consumption,
      count: data.count,
      percentage: data.consumption > 0 ? Math.round((data.consumption / currentConsumption) * 100) : 0,
    }))
  }

  const applianceDistribution = calculateApplianceDistribution()

  // Time of day usage data
  const timeOfDayData = [
    { time: "12 AM - 6 AM", usage: 15, cost: 33 },
    { time: "6 AM - 12 PM", usage: 25, cost: 38 },
    { time: "12 PM - 6 PM", usage: 30, cost: 43 },
    { time: "6 PM - 12 AM", usage: 30, cost: 49 },
  ]

  // Monthly trend data
  const monthlyTrendData = [
    { month: "Jan", units: 320, bill: 18500 },
    { month: "Feb", units: 340, bill: 19200 },
    { month: "Mar", units: 310, bill: 17800 },
    { month: "Apr", units: 290, bill: 16500 },
    { month: "May", units: 270, bill: 15000 },
    { month: "Jun", units: currentConsumption, bill: projectedBill },
  ]

  // Get icon for appliance type
  const getApplianceTypeIcon = (type: string) => {
    switch (type) {
      case "cooling":
        return AirVent
      case "kitchen":
        return Utensils
      case "entertainment":
        return Tv
      case "lighting":
        return Lightbulb
      case "electronics":
        return MonitorSmartphone
      default:
        return Fan
    }
  }

  return (
    <DashboardLayout title="Usage Reports">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-800">Usage Analysis</h2>
          <p className="text-gray-500">Detailed breakdown of your electricity consumption</p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appliance Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">Consumption by Appliance Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applianceDistribution
                .filter((item) => item.percentage > 0)
                .sort((a, b) => b.percentage - a.percentage)
                .map((item) => {
                  const ApplianceIcon = getApplianceTypeIcon(item.type)
                  return (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-green-100 p-2 rounded-full mr-3">
                            <ApplianceIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium capitalize">{item.type}</span>
                        </div>
                        <div className="text-sm text-gray-500">{item.consumption.toFixed(1)} kWh/day</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          {item.count} {item.count === 1 ? "appliance" : "appliances"}
                        </span>
                        <span>{item.percentage}% of total</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Time of Day Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-700">Time of Day Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeOfDayData.map((timeSlot, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{timeSlot.time}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{timeSlot.usage}% of usage</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                        {timeSlot.cost} PKR/unit
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        timeSlot.cost >= 45
                          ? "bg-red-500"
                          : timeSlot.cost >= 40
                            ? "bg-orange-500"
                            : timeSlot.cost >= 35
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      }`}
                      style={{ width: `${timeSlot.usage}%` }}
                    ></div>
                  </div>
                  {timeSlot.cost >= 45 && (
                    <p className="text-xs text-red-600">Peak hours - consider shifting usage to off-peak times</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">Monthly Consumption Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {monthlyTrendData.map((month, index) => (
              <div key={index} className="text-center">
                <div className="relative pt-5">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-medium">
                    {month.units.toFixed(0)} units
                  </div>
                  <div
                    className={`mx-auto w-full max-w-[40px] rounded-t-md ${
                      month.month === "Jun" ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ height: `${(month.units / 400) * 150}px` }}
                  ></div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium">{month.month}</div>
                  <div className="text-xs text-gray-500">{month.bill.toLocaleString()} PKR</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Average Monthly Consumption</div>
                <div className="text-xl font-bold mt-1">
                  {(monthlyTrendData.reduce((sum, month) => sum + month.units, 0) / monthlyTrendData.length).toFixed(0)}{" "}
                  units
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Average Monthly Bill</div>
                <div className="text-xl font-bold mt-1">
                  {Math.round(
                    monthlyTrendData.reduce((sum, month) => sum + month.bill, 0) / monthlyTrendData.length,
                  ).toLocaleString()}{" "}
                  PKR
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Trend</div>
                <div className="text-xl font-bold mt-1 text-green-600">Decreasing</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
