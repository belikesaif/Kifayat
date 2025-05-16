"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useKifayat } from "@/components/kifayat-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const { setUser, login } = useKifayat()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("All fields are required")
      return
    }

    // For demo purposes, we'll create a demo user
    setUser({
      name: "Demo User",
      language: "english",
      householdSize: 4,
      address: "123 Main Street",
      city: "Lahore",
      lastBill: 15000,
      monthlyIncome: 80000,
      meterNumber: "A12345678",
      appliances: [
        {
          id: "1",
          name: "Air Conditioner",
          type: "cooling",
          wattage: 1500,
          quantity: 2,
          hoursPerDay: 8,
          peakHourPercentage: 70,
          alwaysOn: false,
          usageSchedule: {
            frequency: "daily",
            customSchedule: {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            },
          },
        },
        {
          id: "2",
          name: "Refrigerator",
          type: "kitchen",
          wattage: 150,
          quantity: 1,
          hoursPerDay: 24,
          peakHourPercentage: 25,
          alwaysOn: true,
          usageSchedule: {
            frequency: "daily",
            customSchedule: {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            },
          },
        },
        {
          id: "3",
          name: "LED TV",
          type: "entertainment",
          wattage: 100,
          quantity: 1,
          hoursPerDay: 6,
          peakHourPercentage: 80,
          alwaysOn: false,
          usageSchedule: {
            frequency: "daily",
            customSchedule: {
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            },
          },
        },
        {
          id: "4",
          name: "Washing Machine",
          type: "kitchen",
          wattage: 500,
          quantity: 1,
          hoursPerDay: 2,
          peakHourPercentage: 50,
          alwaysOn: false,
          usageSchedule: {
            frequency: "weekly",
            customSchedule: {
              monday: false,
              tuesday: false,
              wednesday: true,
              thursday: false,
              friday: false,
              saturday: true,
              sunday: false,
            },
          },
        },
      ],
      onboardingComplete: true,
    })

    // Log the user in
    login()

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <CardTitle className="text-green-800">Login</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              Login
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
