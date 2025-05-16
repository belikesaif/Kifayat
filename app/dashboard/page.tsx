"use client"

import { useKifayat } from "@/components/kifayat-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ArrowDown, ArrowUp, Clock, Lightbulb, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { user, currentConsumption, projectedBill, dailyUsage } = useKifayat()
  const router = useRouter()

  // Calculate consumption percentage (assuming 500 units is max)
  const consumptionPercentage = Math.min(Math.round((currentConsumption / 500) * 100), 100)

  // Determine slab based on consumption
  const determineSlabInfo = () => {
    if (currentConsumption <= 100) {
      return { slab: "1", rate: 33, color: "text-green-600" }
    } else if (currentConsumption <= 200) {
      return { slab: "2", rate: 38, color: "text-yellow-600" }
    } else if (currentConsumption <= 300) {
      return { slab: "3", rate: 43, color: "text-orange-600" }
    } else if (currentConsumption <= 400) {
      return { slab: "4", rate: 47, color: "text-red-600" }
    } else {
      return { slab: "5", rate: 49, color: "text-red-700" }
    }
  }

  const slabInfo = determineSlabInfo()

  // Quick tips based on consumption
  const quickTips = [
    {
      id: 1,
      title: "Shift AC usage to off-peak hours",
      description: "Run your AC between 11 PM and 5 AM to save up to 30% on costs",
      icon: Clock,
      saving: 2500,
    },
    {
      id: 2,
      title: "Replace incandescent bulbs",
      description: "Switch to LED bulbs to reduce lighting costs by 80%",
      icon: Lightbulb,
      saving: 1200,
    },
    {
      id: 3,
      title: "Unplug idle devices",
      description: "Phantom power can account for 10% of your bill",
      icon: Zap,
      saving: 800,
    },
  ]

  // Calculate savings
  const previousBill = user?.lastBill || 0
  const currentSavings = Math.max(0, previousBill - projectedBill)
  const savingsPercentage = Math.round((currentSavings / (previousBill || 1)) * 100) || 0

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Consumption Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Current Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <div className="text-3xl font-bold">
                {currentConsumption.toFixed(1)} <span className="text-lg font-normal text-gray-500">units</span>
              </div>
              <div className={`flex items-center ${slabInfo.color}`}>
                <span className="text-sm font-medium">Slab {slabInfo.slab}</span>
                <span className="ml-1 text-xs">({slabInfo.rate} PKR/unit)</span>
              </div>
            </div>
            <Progress value={consumptionPercentage} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 units</span>
              <span>500 units</span>
            </div>
          </CardContent>
        </Card>

        {/* Projected Bill Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Projected Bill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <div className="text-3xl font-bold">
                {projectedBill.toLocaleString()} <span className="text-lg font-normal text-gray-500">PKR</span>
              </div>
              {projectedBill > (user?.lastBill || 0) ? (
                <div className="flex items-center text-red-500">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {Math.round(((projectedBill - (user?.lastBill || 0)) / (user?.lastBill || 1)) * 100)}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-green-500">
                  <ArrowDown className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {Math.round((((user?.lastBill || 0) - projectedBill) / (user?.lastBill || 1)) * 100)}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${projectedBill > (user?.lastBill || 0) ? "bg-red-500" : "bg-green-500"}`}
                  style={{
                    width: `${Math.min(Math.round((projectedBill / ((user?.lastBill || 1) * 1.5)) * 100), 100)}%`,
                  }}
                />
              </div>
              <span className="ml-2 text-xs text-gray-500">vs {(user?.lastBill || 0).toLocaleString()} PKR</span>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours Alert Card */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center text-amber-800">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Peak Hours Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 mb-2">Current time is in peak hours (6 PM - 10 PM)</p>
            <p className="text-sm text-amber-700 mb-4">Electricity costs 49 PKR/unit during this time</p>
            <Button
              variant="outline"
              className="w-full border-amber-500 text-amber-700 hover:bg-amber-100"
              onClick={() => router.push("/strategy")}
            >
              View Optimization Strategy
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Daily Usage Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">Daily Usage Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {dailyUsage.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-green-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${(day.usage / 20) * 100}%` }}
                />
                <div className="mt-2 text-xs font-medium">{day.day}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Savings Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTips.map((tip) => (
            <Card key={tip.id} className="border-green-100 hover:border-green-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <tip.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{tip.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                    <p className="text-sm font-medium text-green-600 mt-2">
                      Potential Savings: {tip.saving.toLocaleString()} PKR/month
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
