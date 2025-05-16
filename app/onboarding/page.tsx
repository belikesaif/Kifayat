"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useKifayat } from "@/components/kifayat-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

export default function Onboarding() {
  const router = useRouter()
  const { user, updateUser } = useKifayat()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    language: user?.language || "english",
    householdSize: user?.householdSize || 4,
    address: user?.address || "",
    city: user?.city || "",
    lastBill: user?.lastBill || 0,
    monthlyIncome: user?.monthlyIncome || 0,
    meterNumber: user?.meterNumber || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = () => {
    updateUser({
      ...formData,
      householdSize: Number(formData.householdSize),
      lastBill: Number(formData.lastBill),
      monthlyIncome: Number(formData.monthlyIncome),
      onboardingComplete: true,
    })

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-green-800">
              {step === 1 && "Basic Information"}
              {step === 2 && "Household Details"}
              {step === 3 && "Electricity Information"}
              {step === 4 && "Financial Information"}
            </h2>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= step ? "bg-green-600" : "bg-gray-300"}`} />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <RadioGroup
                  defaultValue={formData.language}
                  onValueChange={(value) => handleSelectChange("language", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="english" id="english" />
                    <Label htmlFor="english">English</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="urdu" id="urdu" />
                    <Label htmlFor="urdu">اردو</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="householdSize">Household Size</Label>
                <Select
                  value={String(formData.householdSize)}
                  onValueChange={(value) => handleSelectChange("householdSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select household size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size} {size === 1 ? "person" : "people"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 text-white">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={formData.city || ""} onValueChange={(value) => handleSelectChange("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"].map(
                      (city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={handleBack} className="border-green-600 text-green-600">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 text-white">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lastBill">Last Month's Electricity Bill (PKR)</Label>
                <Input
                  id="lastBill"
                  name="lastBill"
                  type="number"
                  placeholder="Enter amount in PKR"
                  value={formData.lastBill || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meterNumber">Meter Number (Optional)</Label>
                <Input
                  id="meterNumber"
                  name="meterNumber"
                  placeholder="Enter your meter number"
                  value={formData.meterNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={handleBack} className="border-green-600 text-green-600">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700 text-white">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Monthly Household Income (PKR)</Label>
                <Input
                  id="monthlyIncome"
                  name="monthlyIncome"
                  type="number"
                  placeholder="Enter amount in PKR"
                  value={formData.monthlyIncome || ""}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This helps us tailor recommendations based on your financial situation
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="outline" onClick={handleBack} className="border-green-600 text-green-600">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
                  Complete <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
