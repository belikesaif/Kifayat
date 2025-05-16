"use client"

import { useState } from "react"
import { useKifayat } from "@/components/kifayat-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calculator, Calendar, Check, Info, Sun } from "lucide-react"

export default function SolarAnalysis() {
  const { user, currentConsumption, projectedBill } = useKifayat()
  const [solarCapacity, setSolarCapacity] = useState(5) // in kW
  const [solarCostPerKw, setSolarCostPerKw] = useState(150000) // in PKR
  const [solarEfficiency, setSolarEfficiency] = useState(80) // in percentage
  const [financingOption, setFinancingOption] = useState("cash")
  const [loanTerm, setLoanTerm] = useState(5) // in years
  const [interestRate, setInterestRate] = useState(10) // in percentage

  // Calculate solar generation
  const dailySolarGeneration = solarCapacity * 5 * (solarEfficiency / 100) // 5 hours of peak sun per day
  const monthlySolarGeneration = dailySolarGeneration * 30

  // Calculate solar coverage
  const solarCoveragePercentage = Math.min((monthlySolarGeneration / (currentConsumption * 30)) * 100, 100)

  // Calculate costs
  const totalSolarCost = solarCapacity * solarCostPerKw
  const monthlyBillWithSolar = projectedBill * (1 - solarCoveragePercentage / 100)
  const monthlySavings = projectedBill - monthlyBillWithSolar

  // Calculate ROI
  const simplePaybackPeriod = totalSolarCost / (monthlySavings * 12) // in years

  // Calculate financing
  const calculateMonthlyPayment = () => {
    if (financingOption === "cash") return 0

    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    return (
      (totalSolarCost * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    )
  }

  const monthlyPayment = calculateMonthlyPayment()
  const netMonthlySavings = monthlySavings - monthlyPayment

  // Calculate environmental impact
  const annualCO2Reduction = monthlySolarGeneration * 12 * 0.5 // 0.5 kg CO2 per kWh

  return (
    <DashboardLayout title="Solar Energy Analysis">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Solar System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Solar System Capacity: {solarCapacity} kW</Label>
                    <span className="text-sm text-gray-500">
                      Recommended: {Math.ceil((currentConsumption * 30) / (5 * 30 * 0.8))} kW
                    </span>
                  </div>
                  <Slider
                    value={[solarCapacity]}
                    min={1}
                    max={15}
                    step={0.5}
                    onValueChange={(value) => setSolarCapacity(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 kW</span>
                    <span>15 kW</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="solarCostPerKw">Cost per kW (PKR)</Label>
                    <Input
                      id="solarCostPerKw"
                      type="number"
                      value={solarCostPerKw}
                      onChange={(e) => setSolarCostPerKw(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="solarEfficiency">System Efficiency (%)</Label>
                    <Input
                      id="solarEfficiency"
                      type="number"
                      min={50}
                      max={100}
                      value={solarEfficiency}
                      onChange={(e) => setSolarEfficiency(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Financing Option</Label>
                  <Select value={financingOption} onValueChange={setFinancingOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select financing option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash Purchase</SelectItem>
                      <SelectItem value="loan">Bank Loan</SelectItem>
                      <SelectItem value="lease">Solar Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {financingOption !== "cash" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                      <Select value={String(loanTerm)} onValueChange={(value) => setLoanTerm(Number(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan term" />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 5, 7, 10, 15].map((term) => (
                            <SelectItem key={term} value={String(term)}>
                              {term} years
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        min={1}
                        max={20}
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Detailed ROI
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Financial Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary">
                <TabsList className="mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Breakdown</TabsTrigger>
                  <TabsTrigger value="longterm">Long-term ROI</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">System Cost</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">System Size:</span>
                          <span className="font-medium">{solarCapacity} kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cost per kW:</span>
                          <span className="font-medium">{solarCostPerKw.toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total System Cost:</span>
                          <span className="font-medium">{totalSolarCost.toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Financing Method:</span>
                          <span className="font-medium capitalize">{financingOption}</span>
                        </div>
                        {financingOption !== "cash" && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Monthly Payment:</span>
                              <span className="font-medium">{Math.round(monthlyPayment).toLocaleString()} PKR</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Loan Term:</span>
                              <span className="font-medium">{loanTerm} years</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Savings & ROI</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Generation:</span>
                          <span className="font-medium">{monthlySolarGeneration.toFixed(1)} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Coverage of Usage:</span>
                          <span className="font-medium">{solarCoveragePercentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Bill Savings:</span>
                          <span className="font-medium">{Math.round(monthlySavings).toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Net Monthly Savings:</span>
                          <span className={`font-medium ${netMonthlySavings < 0 ? "text-red-600" : "text-green-600"}`}>
                            {Math.round(netMonthlySavings).toLocaleString()} PKR
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Simple Payback Period:</span>
                          <span className="font-medium">{simplePaybackPeriod.toFixed(1)} years</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-3">25-Year Financial Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="text-amber-800 font-medium">Total Investment</div>
                        <div className="text-2xl font-bold mt-1">{totalSolarCost.toLocaleString()} PKR</div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="text-green-800 font-medium">Total Savings</div>
                        <div className="text-2xl font-bold mt-1">
                          {Math.round(monthlySavings * 12 * 25).toLocaleString()} PKR
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="text-blue-800 font-medium">Net Benefit</div>
                        <div className="text-2xl font-bold mt-1">
                          {Math.round(monthlySavings * 12 * 25 - totalSolarCost).toLocaleString()} PKR
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="monthly">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium mb-3">Monthly Cash Flow</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Monthly Bill:</span>
                          <span className="font-medium">{Math.round(projectedBill).toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Bill with Solar:</span>
                          <span className="font-medium">{Math.round(monthlyBillWithSolar).toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monthly Savings:</span>
                          <span className="font-medium text-green-600">
                            {Math.round(monthlySavings).toLocaleString()} PKR
                          </span>
                        </div>

                        {financingOption !== "cash" && (
                          <>
                            <div className="border-t my-2 pt-2"></div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Monthly Loan Payment:</span>
                              <span className="font-medium text-red-600">
                                -{Math.round(monthlyPayment).toLocaleString()} PKR
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Net Monthly Cash Flow:</span>
                              <span
                                className={`font-medium ${netMonthlySavings < 0 ? "text-red-600" : "text-green-600"}`}
                              >
                                {netMonthlySavings > 0 ? "+" : ""}
                                {Math.round(netMonthlySavings).toLocaleString()} PKR
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium mb-3">Monthly Energy Production</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Daily Production:</span>
                          <span className="font-medium">{dailySolarGeneration.toFixed(1)} kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monthly Production:</span>
                          <span className="font-medium">{monthlySolarGeneration.toFixed(1)} kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monthly Consumption:</span>
                          <span className="font-medium">{(currentConsumption * 30).toFixed(1)} kWh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Solar Coverage:</span>
                          <span className="font-medium">{solarCoveragePercentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium mb-3">Financial Impact</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Bill as % of Income:</span>
                          <span className="font-medium">
                            {user?.monthlyIncome ? ((projectedBill / user.monthlyIncome) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Bill with Solar as % of Income:</span>
                          <span className="font-medium">
                            {user?.monthlyIncome ? ((monthlyBillWithSolar / user.monthlyIncome) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Monthly Savings as % of Income:</span>
                          <span className="font-medium text-green-600">
                            {user?.monthlyIncome ? ((monthlySavings / user.monthlyIncome) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="longterm">
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium mb-3">Long-term ROI Analysis</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Simple Payback Period:</span>
                          <span className="font-medium">{simplePaybackPeriod.toFixed(1)} years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Annual Return on Investment:</span>
                          <span className="font-medium">
                            {(((monthlySavings * 12) / totalSolarCost) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">25-Year Savings:</span>
                          <span className="font-medium">
                            {Math.round(monthlySavings * 12 * 25).toLocaleString()} PKR
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">25-Year Net Benefit:</span>
                          <span className="font-medium">
                            {Math.round(monthlySavings * 12 * 25 - totalSolarCost).toLocaleString()} PKR
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium mb-3">Comparison with Other Investments</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Solar ROI (25 years):</span>
                          <span className="font-medium">
                            {(((monthlySavings * 12 * 25) / totalSolarCost) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Bank Deposit (3% annual):</span>
                          <span className="font-medium">{(3 * 25).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Stock Market (avg. 8% annual):</span>
                          <span className="font-medium">{(8 * 25).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Real Estate (avg. 5% annual):</span>
                          <span className="font-medium">{(5 * 25).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="font-medium mb-3">System Lifetime Value</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">System Lifetime:</span>
                          <span className="font-medium">25+ years</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Lifetime Energy Production:</span>
                          <span className="font-medium">
                            {Math.round(monthlySolarGeneration * 12 * 25).toLocaleString()} kWh
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cost per kWh (Lifetime):</span>
                          <span className="font-medium">
                            {(totalSolarCost / (monthlySolarGeneration * 12 * 25)).toFixed(2)} PKR
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Grid Electricity Cost (Current):</span>
                          <span className="font-medium">~40 PKR/kWh</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-3">
                      <Sun className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="font-medium">{solarCapacity} kW System</span>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {solarCoveragePercentage.toFixed(0)}% Coverage
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">System Cost:</span>
                    <span className="font-medium">{totalSolarCost.toLocaleString()} PKR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Savings:</span>
                    <span className="font-medium text-green-600">
                      {Math.round(monthlySavings).toLocaleString()} PKR
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payback Period:</span>
                    <span className="font-medium">{simplePaybackPeriod.toFixed(1)} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">25-Year Savings:</span>
                    <span className="font-medium">{Math.round(monthlySavings * 12 * 25).toLocaleString()} PKR</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">CO₂ Reduction</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(annualCO2Reduction).toLocaleString()} kg per year
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Equivalent to Planting</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(annualCO2Reduction / 20).toLocaleString()} trees per year
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Reduced Coal Consumption</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(monthlySolarGeneration * 12 * 0.4).toLocaleString()} kg per year
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Info className="h-4 w-4 mr-2" />
                  Get Detailed Quote
                </Button>

                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Site Assessment
                </Button>

                <Button className="w-full" variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Explore Financing Options
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
