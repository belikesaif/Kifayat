"use client"

import { useKifayat } from "@/components/kifayat-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowRight, Calendar, Check, Clock, Lightbulb, Zap } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function Strategy() {
  const { user } = useKifayat()
  const [selectedAppliance, setSelectedAppliance] = useState<string | null>(null)

  // Get high-consumption appliances
  const highConsumptionAppliances =
    user?.appliances
      .filter((a) => (a.wattage * a.hoursPerDay) / 1000 > 2)
      .sort((a, b) => b.wattage * b.hoursPerDay - a.wattage * a.hoursPerDay) || []

  // Time slots with rates
  const timeSlots = [
    { id: 1, time: "12 AM - 6 AM", rate: 33, label: "Off-Peak", color: "bg-green-100 text-green-800" },
    { id: 2, time: "6 AM - 12 PM", rate: 38, label: "Standard", color: "bg-blue-100 text-blue-800" },
    { id: 3, time: "12 PM - 6 PM", rate: 43, label: "Standard", color: "bg-blue-100 text-blue-800" },
    { id: 4, time: "6 PM - 10 PM", rate: 49, label: "Peak", color: "bg-red-100 text-red-800" },
    { id: 5, time: "10 PM - 12 AM", rate: 38, label: "Standard", color: "bg-blue-100 text-blue-800" },
  ]

  // Optimization strategies
  const strategies = [
    {
      id: 1,
      title: "Shift AC Usage to Off-Peak Hours",
      description: "Run your air conditioners during off-peak hours (12 AM - 6 AM) when electricity rates are lowest.",
      savings: 2500,
      icon: Clock,
      appliances: ["Air Conditioner"],
      difficulty: "Medium",
    },
    {
      id: 2,
      title: "Optimize Refrigerator Settings",
      description: "Set your refrigerator temperature to 3-4°C and freezer to -18°C for optimal efficiency.",
      savings: 800,
      icon: Zap,
      appliances: ["Refrigerator"],
      difficulty: "Easy",
    },
    {
      id: 3,
      title: "Schedule Laundry for Off-Peak Hours",
      description: "Run washing machines and dryers during off-peak hours to save on electricity costs.",
      savings: 1200,
      icon: Calendar,
      appliances: ["Washing Machine", "Dryer"],
      difficulty: "Easy",
    },
    {
      id: 4,
      title: "Replace Incandescent Bulbs with LEDs",
      description: "LED bulbs use 80% less energy than traditional incandescent bulbs.",
      savings: 1000,
      icon: Lightbulb,
      appliances: ["Lighting"],
      difficulty: "Easy",
    },
  ]

  return (
    <DashboardLayout title="Optimization Strategy">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Current Rate Alert */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-amber-500 mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-amber-800">Current Time is Peak Hours</h3>
                  <p className="text-amber-700 mt-1">
                    You are currently in peak hours (6 PM - 10 PM) when electricity costs 49 PKR/unit. Consider shifting
                    high-consumption activities to off-peak hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">Electricity Rate Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mr-3 relative">
                        {slot.id === 4 && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <span className="font-medium">{slot.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{slot.rate} PKR/unit</span>
                      <Badge className={slot.color}>{slot.label}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-dashed">
                <p className="text-sm text-gray-600">
                  <strong>Pro Tip:</strong> Shifting just 20% of your usage from peak to off-peak hours can save up to
                  3,000 PKR per month on your electricity bill.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Strategies */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Personalized Optimization Strategies</h2>
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="hover:border-green-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <strategy.icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-lg text-gray-800">{strategy.title}</h3>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            {strategy.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mt-1">{strategy.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-green-600 font-medium">
                            Potential Savings: {strategy.savings.toLocaleString()} PKR/month
                          </div>
                          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                            Apply Strategy <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* High Consumption Appliances */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">High Consumption Appliances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highConsumptionAppliances.length > 0 ? (
                  highConsumptionAppliances.map((appliance) => {
                    const dailyConsumption = (appliance.wattage * appliance.quantity * appliance.hoursPerDay) / 1000
                    const dailyCost = dailyConsumption * 40 // Average rate

                    return (
                      <div
                        key={appliance.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedAppliance === appliance.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() => setSelectedAppliance(appliance.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{appliance.name}</h3>
                            <p className="text-sm text-gray-500">
                              {appliance.wattage} W × {appliance.quantity} × {appliance.hoursPerDay} hours
                            </p>
                          </div>
                          {selectedAppliance === appliance.id && (
                            <div className="bg-green-100 p-1 rounded-full">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex justify-between text-sm">
                          <span>{dailyConsumption.toFixed(1)} kWh/day</span>
                          <span className="font-medium">{dailyCost.toFixed(0)} PKR/day</span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">No high consumption appliances found</p>
                )}
              </div>

              {selectedAppliance && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium mb-2">Optimization Tips</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Use during off-peak hours (12 AM - 6 AM) to save up to 30%</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Reduce usage time by 1 hour to save 500 PKR/month</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Consider upgrading to an energy-efficient model</span>
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* What-If Scenario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-700">What-If Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                If you shift your AC usage from peak hours to off-peak hours:
              </p>

              <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-1 rounded-full mr-2">
                      <Clock className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium text-red-800">Current Usage (Peak Hours)</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>4 hours × 49 PKR/unit</span>
                    <span className="font-medium">196 PKR/day</span>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-1 rounded-full mr-2">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-green-800">Optimized Usage (Off-Peak)</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>4 hours × 33 PKR/unit</span>
                    <span className="font-medium">132 PKR/day</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-1 rounded-full mr-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-blue-800">Potential Savings</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span>64 PKR/day</span>
                    <span className="font-medium">1,920 PKR/month</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Create Custom Scenario</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
