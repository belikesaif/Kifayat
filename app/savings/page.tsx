"use client"

import { useState } from "react"
import { useKifayat } from "@/components/kifayat-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Award,
  BadgeCheck,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Lightbulb,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

export default function Savings() {
  const { user, projectedBill, savingsGoal, setSavingsGoal } = useKifayat()
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState(savingsGoal)

  // Calculate savings
  const previousBill = user?.lastBill || 0
  const currentSavings = Math.max(0, previousBill - projectedBill)
  const savingsPercentage = previousBill > 0 ? Math.round((currentSavings / previousBill) * 100) : 0
  const goalProgress = savingsGoal > 0 ? Math.min(Math.round((currentSavings / savingsGoal) * 100), 100) : 0

  // Achievements
  const achievements = [
    {
      id: 1,
      title: "Energy Saver",
      description: "Reduced consumption by 10%",
      icon: Lightbulb,
      completed: savingsPercentage >= 10,
    },
    {
      id: 2,
      title: "Peak Shifter",
      description: "Moved 50% of peak usage to off-peak",
      icon: Clock,
      completed: false,
    },
    {
      id: 3,
      title: "Bill Buster",
      description: "Saved 5,000 PKR in a month",
      icon: DollarSign,
      completed: currentSavings >= 5000,
    },
    {
      id: 4,
      title: "Efficiency Expert",
      description: "Optimized all major appliances",
      icon: Zap,
      completed: false,
    },
    {
      id: 5,
      title: "Conservation Champion",
      description: "Maintained savings for 3 consecutive months",
      icon: Award,
      completed: false,
    },
  ]

  const handleSaveGoal = () => {
    setSavingsGoal(newGoal)
    setIsEditingGoal(false)
  }

  // Monthly comparison data
  const monthlyData = [
    { month: "Jan", amount: 18500 },
    { month: "Feb", amount: 19200 },
    { month: "Mar", amount: 17800 },
    { month: "Apr", amount: 16500 },
    { month: "May", amount: 15000 },
    { month: "Jun", amount: projectedBill },
  ]

  return (
    <DashboardLayout title="Savings Tracker">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Savings Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Current Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {currentSavings.toLocaleString()} <span className="text-lg font-normal text-gray-500">PKR</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {savingsPercentage > 0
                ? `You're saving ${savingsPercentage}% compared to last month`
                : "No savings yet compared to last month"}
            </p>
            {projectedBill > (user?.lastBill || 0) ? (
              <div className="flex items-center text-red-500">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {(user?.lastBill || 0) > 0
                    ? Math.round(((projectedBill - (user?.lastBill || 0)) / (user?.lastBill || 1)) * 100)
                    : 0}
                  %
                </span>
              </div>
            ) : (
              <div className="flex items-center text-green-500">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">
                  {(user?.lastBill || 0) > 0
                    ? Math.round((((user?.lastBill || 0) - projectedBill) / (user?.lastBill || 1)) * 100)
                    : 0}
                  %
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Goal Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-700">Savings Goal</CardTitle>
              {!isEditingGoal && (
                <Button variant="ghost" size="sm" className="h-8 text-green-600" onClick={() => setIsEditingGoal(true)}>
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingGoal ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="savingsGoal">Monthly Savings Target (PKR)</Label>
                  <Input
                    id="savingsGoal"
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(Number(e.target.value))}
                  />
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleSaveGoal}>
                  Save Goal
                </Button>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold">
                  {savingsGoal.toLocaleString()} <span className="text-lg font-normal text-gray-500">PKR</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{goalProgress}%</span>
                  </div>
                  <Progress value={goalProgress} className="h-2" />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Annual Projection Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">Annual Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(currentSavings * 12).toLocaleString()} <span className="text-lg font-normal text-gray-500">PKR</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Estimated yearly savings at current rate</p>
            <div className="flex items-center mt-2 text-green-600">
              <Target className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {Math.round((currentSavings * 12) / 1000)} thousand PKR per year
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg text-gray-700">Monthly Bill Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {monthlyData.map((month) => (
              <div key={month.month} className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    month.month === "Jun" ? "bg-green-500" : "bg-blue-500"
                  }`}
                  style={{ height: `${(month.amount / 20000) * 100}%` }}
                />
                <div className="mt-2 text-xs font-medium">{month.month}</div>
                <div className="text-xs text-gray-500">{month.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`border ${
                achievement.completed ? "border-green-200 bg-green-50" : "border-gray-200 opacity-60"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-4 ${achievement.completed ? "bg-green-100" : "bg-gray-100"}`}>
                    <achievement.icon
                      className={`h-5 w-5 ${achievement.completed ? "text-green-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-800">{achievement.title}</h3>
                      {achievement.completed && <BadgeCheck className="h-4 w-4 ml-2 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips for Increasing Savings */}
      <Card className="mt-6 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-green-800 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
            Tips to Increase Your Savings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start">
              <Calendar className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
              <span className="text-sm">Schedule heavy appliance usage during off-peak hours (11 PM - 5 AM)</span>
            </li>
            <li className="flex items-start">
              <BarChart3 className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
              <span className="text-sm">Monitor your daily consumption and stay below 10 units per day</span>
            </li>
            <li className="flex items-start">
              <Zap className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
              <span className="text-sm">Unplug devices when not in use to eliminate phantom power consumption</span>
            </li>
            <li className="flex items-start">
              <Clock className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
              <span className="text-sm">Set timers for air conditioners to automatically turn off after 2 hours</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
