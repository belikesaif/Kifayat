"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type ApplianceUsageSchedule = {
  frequency: "daily" | "weekly" | "custom"
  customSchedule?: {
    monday: boolean
    tuesday: boolean
    wednesday: boolean
    thursday: boolean
    friday: boolean
    saturday: boolean
    sunday: boolean
  }
}

type Appliance = {
  id: string
  name: string
  type: string
  wattage: number
  quantity: number
  hoursPerDay: number
  peakHourPercentage: number
  alwaysOn: boolean
  usageSchedule: ApplianceUsageSchedule
}

type UserProfile = {
  name: string
  language: "english" | "urdu"
  householdSize: number
  address: string
  city: string
  lastBill: number
  monthlyIncome: number
  meterNumber: string
  appliances: Appliance[]
  onboardingComplete: boolean
}

type ElectricityRates = {
  peak: number
  offPeak: number
}

type KifayatContextType = {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  updateUser: (data: Partial<UserProfile>) => void
  addAppliance: (appliance: Appliance) => void
  removeAppliance: (id: string) => void
  updateAppliance: (id: string, data: Partial<Appliance>) => void
  currentConsumption: number
  projectedBill: number
  dailyUsage: { day: string; usage: number }[]
  savingsGoal: number
  setSavingsGoal: (goal: number) => void
  currentSavings: number
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  electricityRates: ElectricityRates
  peakHours: { start: number; end: number }[]
  calculateApplianceCost: (appliance: Appliance) => {
    dailyConsumption: number
    peakConsumption: number
    offPeakConsumption: number
    monthlyCost: number
    peakCost: number
    offPeakCost: number
  }
}

const defaultUser: UserProfile = {
  name: "",
  language: "english",
  householdSize: 0,
  address: "",
  city: "",
  lastBill: 0,
  monthlyIncome: 0,
  meterNumber: "",
  appliances: [],
  onboardingComplete: false,
}

const KifayatContext = createContext<KifayatContextType | undefined>(undefined)

export function KifayatProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [savingsGoal, setSavingsGoal] = useState(5000)
  const [currentSavings, setCurrentSavings] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Electricity rates in PKR per kWh
  const electricityRates = {
    peak: 49, // Peak hour rate
    offPeak: 33, // Off-peak hour rate
  }

  // Define peak hours (24-hour format)
  const peakHours = [
    { start: 18, end: 22 }, // 6 PM to 10 PM
  ]

  // Load user data from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("kifayat-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("kifayat-user", JSON.stringify(user))
    }
  }, [user])

  // Calculate current consumption based on appliances
  const currentConsumption =
    user?.appliances.reduce((total, appliance) => {
      return total + calculateApplianceConsumption(appliance)
    }, 0) || 0

  // Calculate appliance consumption
  function calculateApplianceConsumption(appliance: Appliance): number {
    // Calculate daily consumption in kWh
    const dailyConsumption = (appliance.wattage * appliance.quantity * appliance.hoursPerDay) / 1000

    // Adjust for usage frequency
    let frequencyMultiplier = 1 // Default for daily

    if (appliance.usageSchedule.frequency === "weekly") {
      frequencyMultiplier = 1 / 7 // Average over a week
    } else if (appliance.usageSchedule.frequency === "custom" && appliance.usageSchedule.customSchedule) {
      // Count active days in custom schedule
      const activeDays = Object.values(appliance.usageSchedule.customSchedule).filter(Boolean).length
      frequencyMultiplier = activeDays / 7
    }

    // Return average daily consumption
    return dailyConsumption * frequencyMultiplier
  }

  // Calculate detailed appliance cost and consumption
  function calculateApplianceCost(appliance: Appliance) {
    // Calculate daily consumption in kWh
    const dailyConsumption = (appliance.wattage * appliance.quantity * appliance.hoursPerDay) / 1000

    // Split between peak and off-peak based on peakHourPercentage
    const peakConsumption = dailyConsumption * (appliance.peakHourPercentage / 100)
    const offPeakConsumption = dailyConsumption * (1 - appliance.peakHourPercentage / 100)

    // Calculate daily costs
    const peakCost = peakConsumption * electricityRates.peak
    const offPeakCost = offPeakConsumption * electricityRates.offPeak

    // Adjust for usage frequency
    let daysPerMonth = 30 // Default

    if (appliance.usageSchedule.frequency === "weekly") {
      daysPerMonth = (30 / 7) * 1 // Once per week
    } else if (appliance.usageSchedule.frequency === "custom" && appliance.usageSchedule.customSchedule) {
      // Count active days in custom schedule
      const activeDays = Object.values(appliance.usageSchedule.customSchedule).filter(Boolean).length
      daysPerMonth = (30 / 7) * activeDays
    }

    // Calculate monthly costs
    const monthlyCost = (peakCost + offPeakCost) * daysPerMonth

    return {
      dailyConsumption,
      peakConsumption,
      offPeakConsumption,
      monthlyCost,
      peakCost,
      offPeakCost,
    }
  }

  // Calculate projected bill based on consumption
  const projectedBill = calculateProjectedBill(currentConsumption)

  // Sample daily usage data
  const dailyUsage = [
    { day: "Mon", usage: 12 },
    { day: "Tue", usage: 15 },
    { day: "Wed", usage: 10 },
    { day: "Thu", usage: 18 },
    { day: "Fri", usage: 14 },
    { day: "Sat", usage: 20 },
    { day: "Sun", usage: 16 },
  ]

  function updateUser(data: Partial<UserProfile>) {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  function addAppliance(appliance: Appliance) {
    if (user) {
      setUser({
        ...user,
        appliances: [...user.appliances, appliance],
      })
    }
  }

  function removeAppliance(id: string) {
    if (user) {
      setUser({
        ...user,
        appliances: user.appliances.filter((a) => a.id !== id),
      })
    }
  }

  function updateAppliance(id: string, data: Partial<Appliance>) {
    if (user) {
      setUser({
        ...user,
        appliances: user.appliances.map((a) => (a.id === id ? { ...a, ...data } : a)),
      })
    }
  }

  function login() {
    setIsLoggedIn(true)
  }

  function logout() {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem("kifayat-user")
  }

  return (
    <KifayatContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        addAppliance,
        removeAppliance,
        updateAppliance,
        currentConsumption,
        projectedBill,
        dailyUsage,
        savingsGoal,
        setSavingsGoal,
        currentSavings,
        isLoggedIn,
        login,
        logout,
        electricityRates,
        peakHours,
        calculateApplianceCost,
      }}
    >
      {children}
    </KifayatContext.Provider>
  )
}

export function useKifayat() {
  const context = useContext(KifayatContext)
  if (context === undefined) {
    throw new Error("useKifayat must be used within a KifayatProvider")
  }
  return context
}

// Helper function to calculate projected bill based on consumption
function calculateProjectedBill(consumption: number): number {
  // Pakistani electricity slab rates (simplified)
  if (consumption <= 100) {
    return consumption * 33
  } else if (consumption <= 200) {
    return 100 * 33 + (consumption - 100) * 38
  } else if (consumption <= 300) {
    return 100 * 33 + 100 * 38 + (consumption - 200) * 43
  } else if (consumption <= 400) {
    return 100 * 33 + 100 * 38 + 100 * 43 + (consumption - 300) * 47
  } else {
    return 100 * 33 + 100 * 38 + 100 * 43 + 100 * 47 + (consumption - 400) * 49
  }
}
