"use client"

import type React from "react"

import { useState } from "react"
import { useKifayat } from "@/components/kifayat-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Bell, Globe, Lock, Save, User } from "lucide-react"

export default function Settings() {
  const { user, updateUser } = useKifayat()
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: "user@example.com",
    language: user?.language || "english",
    householdSize: user?.householdSize || 4,
    address: user?.address || "",
    city: user?.city || "",
    meterNumber: user?.meterNumber || "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    peakHourAlerts: true,
    billPredictions: true,
    savingsTips: true,
    weeklyReports: false,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    updateUser({
      name: profileData.name,
      language: profileData.language as "english" | "urdu",
      householdSize: Number(profileData.householdSize),
      address: profileData.address,
      city: profileData.city,
      meterNumber: profileData.meterNumber,
    })
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: checked }))
  }

  return (
    <DashboardLayout title="Settings">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" value={profileData.email} onChange={handleProfileChange} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={profileData.address} onChange={handleProfileChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select value={profileData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Karachi",
                        "Lahore",
                        "Islamabad",
                        "Rawalpindi",
                        "Faisalabad",
                        "Multan",
                        "Peshawar",
                        "Quetta",
                      ].map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="householdSize">Household Size</Label>
                  <Select
                    value={String(profileData.householdSize)}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="meterNumber">Meter Number</Label>
                <Input
                  id="meterNumber"
                  name="meterNumber"
                  value={profileData.meterNumber}
                  onChange={handleProfileChange}
                />
              </div>

              <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-600" />
                Language Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <RadioGroup
                    value={profileData.language}
                    onValueChange={(value) => handleSelectChange("language", value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="english" id="english-setting" />
                      <Label htmlFor="english-setting">English</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urdu" id="urdu-setting" />
                      <Label htmlFor="urdu-setting">اردو</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Language
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Bell className="h-5 w-5 mr-2 text-green-600" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="peak-alerts">Peak Hour Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified during high-cost hours</p>
                </div>
                <Switch
                  id="peak-alerts"
                  checked={notificationSettings.peakHourAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("peakHourAlerts", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="bill-predictions">Bill Predictions</Label>
                  <p className="text-sm text-gray-500">Weekly updates on projected bill</p>
                </div>
                <Switch
                  id="bill-predictions"
                  checked={notificationSettings.billPredictions}
                  onCheckedChange={(checked) => handleNotificationChange("billPredictions", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="savings-tips">Savings Tips</Label>
                  <p className="text-sm text-gray-500">Personalized recommendations</p>
                </div>
                <Switch
                  id="savings-tips"
                  checked={notificationSettings.savingsTips}
                  onCheckedChange={(checked) => handleNotificationChange("savingsTips", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Detailed usage analysis</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)}
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Save Notification Settings</Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lock className="h-5 w-5 mr-2 text-green-600" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">Update Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
