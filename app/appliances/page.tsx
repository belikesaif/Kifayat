"use client"

import { useState } from "react"
import { useKifayat } from "@/components/kifayat-provider"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AirVent,
  Edit,
  Fan,
  Lightbulb,
  MonitorSmartphone,
  MoreVertical,
  Plus,
  Trash,
  Tv,
  Utensils,
  Zap,
  Clock,
  Calendar,
  BarChart3,
  ArrowRight,
  Info,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function Appliances() {
  const { user, addAppliance, removeAppliance, updateAppliance, electricityRates, calculateApplianceCost } =
    useKifayat()
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedApplianceId, setSelectedApplianceId] = useState<string | null>(null)
  const [newAppliance, setNewAppliance] = useState({
    id: "",
    name: "",
    type: "",
    wattage: 0,
    quantity: 1,
    hoursPerDay: 0,
    peakHourPercentage: 30,
    alwaysOn: false,
    usageSchedule: {
      frequency: "daily" as const,
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
  })
  const [editingAppliance, setEditingAppliance] = useState<null | {
    id: string
    name: string
    type: string
    wattage: number
    quantity: number
    hoursPerDay: number
    peakHourPercentage: number
    alwaysOn: boolean
    usageSchedule: {
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
  }>(null)

  const applianceTypes = [
    { value: "cooling", label: "Cooling", icon: AirVent },
    { value: "kitchen", label: "Kitchen", icon: Utensils },
    { value: "entertainment", label: "Entertainment", icon: Tv },
    { value: "lighting", label: "Lighting", icon: Lightbulb },
    { value: "electronics", label: "Electronics", icon: MonitorSmartphone },
    { value: "other", label: "Other", icon: Fan },
  ]

  const handleAddAppliance = () => {
    if (!newAppliance.name || !newAppliance.type || newAppliance.wattage <= 0) {
      return
    }

    addAppliance({
      ...newAppliance,
      id: Date.now().toString(),
    })

    setNewAppliance({
      id: "",
      name: "",
      type: "",
      wattage: 0,
      quantity: 1,
      hoursPerDay: 0,
      peakHourPercentage: 30,
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
    })

    setIsAddDialogOpen(false)
  }

  const handleEditAppliance = () => {
    if (!editingAppliance) return

    updateAppliance(editingAppliance.id, editingAppliance)
    setIsEditDialogOpen(false)
  }

  const startEdit = (appliance: any) => {
    setEditingAppliance(appliance)
    setIsEditDialogOpen(true)
  }

  const getApplianceIcon = (type: string) => {
    const applianceType = applianceTypes.find((t) => t.value === type)
    if (!applianceType) return Zap
    return applianceType.icon
  }

  const handleSelectAppliance = (id: string) => {
    setSelectedApplianceId(id === selectedApplianceId ? null : id)
  }

  const selectedAppliance = user?.appliances.find((a) => a.id === selectedApplianceId)

  return (
    <DashboardLayout title="Appliance Management">
      <Tabs defaultValue="appliances" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appliances">My Appliances</TabsTrigger>
          <TabsTrigger value="analysis">Energy Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="appliances">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Your Appliances</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" /> Add Appliance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Appliance</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Appliance Name</Label>
                          <Input
                            id="name"
                            placeholder="e.g. Air Conditioner"
                            value={newAppliance.name}
                            onChange={(e) => setNewAppliance({ ...newAppliance, name: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="type">Appliance Type</Label>
                          <Select
                            value={newAppliance.type}
                            onValueChange={(value) => setNewAppliance({ ...newAppliance, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {applianceTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center">
                                    <type.icon className="h-4 w-4 mr-2" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="wattage">Power Rating (Watts)</Label>
                          <Input
                            id="wattage"
                            type="number"
                            placeholder="e.g. 1500"
                            value={newAppliance.wattage || ""}
                            onChange={(e) => setNewAppliance({ ...newAppliance, wattage: Number(e.target.value) })}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1 text-xs"
                            onClick={() => {
                              // In a real app, this would call Gemini API to get typical wattage
                              const typicalWattages: Record<string, number> = {
                                cooling: 1500,
                                kitchen: 1200,
                                entertainment: 100,
                                lighting: 60,
                                electronics: 80,
                                other: 500,
                              }
                              if (newAppliance.type) {
                                setNewAppliance({
                                  ...newAppliance,
                                  wattage: typicalWattages[newAppliance.type] || 0,
                                })
                              }
                            }}
                          >
                            <Info className="h-3 w-3 mr-1" /> Lookup typical wattage
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            placeholder="e.g. 1"
                            value={newAppliance.quantity || ""}
                            onChange={(e) => setNewAppliance({ ...newAppliance, quantity: Number(e.target.value) })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="hoursPerDay">Hours Used Per Day</Label>
                          <Input
                            id="hoursPerDay"
                            type="number"
                            placeholder="e.g. 8"
                            value={newAppliance.hoursPerDay || ""}
                            onChange={(e) => setNewAppliance({ ...newAppliance, hoursPerDay: Number(e.target.value) })}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="alwaysOn">Always On</Label>
                            <Switch
                              id="alwaysOn"
                              checked={newAppliance.alwaysOn}
                              onCheckedChange={(checked) => {
                                setNewAppliance({
                                  ...newAppliance,
                                  alwaysOn: checked,
                                  hoursPerDay: checked ? 24 : newAppliance.hoursPerDay,
                                })
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            For appliances that run continuously like refrigerators
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Peak Hour Usage ({newAppliance.peakHourPercentage}%)</Label>
                        <Slider
                          value={[newAppliance.peakHourPercentage]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => setNewAppliance({ ...newAppliance, peakHourPercentage: value[0] })}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0% (All Off-Peak)</span>
                          <span>100% (All Peak)</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Percentage of usage during peak hours (6 PM - 10 PM)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Usage Frequency</Label>
                        <Select
                          value={newAppliance.usageSchedule.frequency}
                          onValueChange={(value: "daily" | "weekly" | "custom") =>
                            setNewAppliance({
                              ...newAppliance,
                              usageSchedule: {
                                ...newAppliance.usageSchedule,
                                frequency: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="custom">Custom Schedule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newAppliance.usageSchedule.frequency === "custom" && (
                        <div className="space-y-2 border rounded-md p-3">
                          <Label className="mb-2 block">Custom Schedule</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(newAppliance.usageSchedule.customSchedule || {}).map(([day, isActive]) => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`day-${day}`}
                                  checked={isActive}
                                  onCheckedChange={(checked) => {
                                    setNewAppliance({
                                      ...newAppliance,
                                      usageSchedule: {
                                        ...newAppliance.usageSchedule,
                                        customSchedule: {
                                          ...newAppliance.usageSchedule.customSchedule,
                                          [day]: !!checked,
                                        },
                                      },
                                    })
                                  }}
                                />
                                <Label htmlFor={`day-${day}`} className="capitalize">
                                  {day}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button className="w-full bg-green-600 hover:bg-green-700 mt-4" onClick={handleAddAppliance}>
                        Add Appliance
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {user?.appliances.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium text-gray-700">No appliances added yet</h3>
                  <p className="mt-2 text-gray-500">
                    Add your appliances to get personalized energy-saving recommendations
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Appliance</TableHead>
                        <TableHead>Power Rating</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Hours/Day</TableHead>
                        <TableHead>Peak Usage</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Monthly Cost</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user?.appliances.map((appliance) => {
                        const ApplianceIcon = getApplianceIcon(appliance.type)
                        const costDetails = calculateApplianceCost(appliance)

                        return (
                          <TableRow
                            key={appliance.id}
                            className={selectedApplianceId === appliance.id ? "bg-green-50" : ""}
                            onClick={() => handleSelectAppliance(appliance.id)}
                          >
                            <TableCell>
                              <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                  <ApplianceIcon className="h-4 w-4 text-green-600" />
                                </div>
                                <span>{appliance.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{appliance.wattage} W</TableCell>
                            <TableCell>{appliance.quantity}</TableCell>
                            <TableCell>{appliance.hoursPerDay}</TableCell>
                            <TableCell>{appliance.peakHourPercentage}%</TableCell>
                            <TableCell className="capitalize">{appliance.usageSchedule.frequency}</TableCell>
                            <TableCell>{Math.round(costDetails.monthlyCost).toLocaleString()} PKR</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => startEdit(appliance)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => removeAppliance(appliance.id)}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {selectedAppliance ? (
                <ApplianceAnalysis appliance={selectedAppliance} />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">Select an appliance for detailed analysis</h3>
                    <p className="text-gray-500 mt-2">
                      Click on any appliance from your list to see detailed energy usage analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appliance List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {user?.appliances.map((appliance) => {
                      const ApplianceIcon = getApplianceIcon(appliance.type)
                      return (
                        <div
                          key={appliance.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedApplianceId === appliance.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                          onClick={() => handleSelectAppliance(appliance.id)}
                        >
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <ApplianceIcon className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium">{appliance.name}</div>
                              <div className="text-xs text-gray-500">
                                {appliance.wattage}W • {appliance.hoursPerDay} hrs/day
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {(!user?.appliances || user.appliances.length === 0) && (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No appliances added yet</p>
                        <Button
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            setIsAddDialogOpen(true)
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Appliance
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 mb-3"
                    onClick={() => router.push("/strategy")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Load Shifting Strategy
                  </Button>

                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 mb-3"
                    onClick={() => router.push("/solar-analysis")}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Solar Analysis
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => router.push("/reports")}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Full Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Appliance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Appliance</DialogTitle>
          </DialogHeader>
          {editingAppliance && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Appliance Name</Label>
                  <Input
                    id="edit-name"
                    value={editingAppliance.name}
                    onChange={(e) => setEditingAppliance({ ...editingAppliance, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type">Appliance Type</Label>
                  <Select
                    value={editingAppliance.type}
                    onValueChange={(value) => setEditingAppliance({ ...editingAppliance, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {applianceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <type.icon className="h-4 w-4 mr-2" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-wattage">Power Rating (Watts)</Label>
                  <Input
                    id="edit-wattage"
                    type="number"
                    value={editingAppliance.wattage || ""}
                    onChange={(e) => setEditingAppliance({ ...editingAppliance, wattage: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-quantity">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={editingAppliance.quantity || ""}
                    onChange={(e) => setEditingAppliance({ ...editingAppliance, quantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-hoursPerDay">Hours Used Per Day</Label>
                  <Input
                    id="edit-hoursPerDay"
                    type="number"
                    value={editingAppliance.hoursPerDay || ""}
                    onChange={(e) => setEditingAppliance({ ...editingAppliance, hoursPerDay: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="edit-alwaysOn">Always On</Label>
                    <Switch
                      id="edit-alwaysOn"
                      checked={editingAppliance.alwaysOn}
                      onCheckedChange={(checked) => {
                        setEditingAppliance({
                          ...editingAppliance,
                          alwaysOn: checked,
                          hoursPerDay: checked ? 24 : editingAppliance.hoursPerDay,
                        })
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">For appliances that run continuously like refrigerators</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Peak Hour Usage ({editingAppliance.peakHourPercentage}%)</Label>
                <Slider
                  value={[editingAppliance.peakHourPercentage]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => setEditingAppliance({ ...editingAppliance, peakHourPercentage: value[0] })}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0% (All Off-Peak)</span>
                  <span>100% (All Peak)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Percentage of usage during peak hours (6 PM - 10 PM)</p>
              </div>

              <div className="space-y-2">
                <Label>Usage Frequency</Label>
                <Select
                  value={editingAppliance.usageSchedule.frequency}
                  onValueChange={(value: "daily" | "weekly" | "custom") =>
                    setEditingAppliance({
                      ...editingAppliance,
                      usageSchedule: {
                        ...editingAppliance.usageSchedule,
                        frequency: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingAppliance.usageSchedule.frequency === "custom" && (
                <div className="space-y-2 border rounded-md p-3">
                  <Label className="mb-2 block">Custom Schedule</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(editingAppliance.usageSchedule.customSchedule || {}).map(([day, isActive]) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-day-${day}`}
                          checked={isActive}
                          onCheckedChange={(checked) => {
                            setEditingAppliance({
                              ...editingAppliance,
                              usageSchedule: {
                                ...editingAppliance.usageSchedule,
                                customSchedule: {
                                  ...editingAppliance.usageSchedule.customSchedule,
                                  [day]: !!checked,
                                },
                              },
                            })
                          }}
                        />
                        <Label htmlFor={`edit-day-${day}`} className="capitalize">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full bg-green-600 hover:bg-green-700 mt-4" onClick={handleEditAppliance}>
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

function ApplianceAnalysis({ appliance }: { appliance: any }) {
  const { calculateApplianceCost, electricityRates, user } = useKifayat()
  const costDetails = calculateApplianceCost(appliance)

  // Calculate frequency text
  const getFrequencyText = () => {
    if (appliance.usageSchedule.frequency === "daily") {
      return "Daily"
    } else if (appliance.usageSchedule.frequency === "weekly") {
      return "Once a week"
    } else if (appliance.usageSchedule.frequency === "custom") {
      const activeDays = Object.values(appliance.usageSchedule.customSchedule || {}).filter(Boolean).length
      return `${activeDays} days per week`
    }
    return ""
  }

  // Calculate monthly usage in kWh
  const monthlyUsage = costDetails.dailyConsumption * 30

  // Calculate percentage of monthly bill
  const billPercentage = user?.lastBill ? (costDetails.monthlyCost / user.lastBill) * 100 : 0

  // Calculate percentage of monthly income
  const incomePercentage = user?.monthlyIncome ? (costDetails.monthlyCost / user.monthlyIncome) * 100 : 0

  // Calculate potential savings by shifting to off-peak
  const potentialSavings = costDetails.peakConsumption * 30 * (electricityRates.peak - electricityRates.offPeak)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{appliance.name} - Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Usage Profile</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Power Rating:</span>
                  <span className="font-medium">{appliance.wattage} Watts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{appliance.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours Per Day:</span>
                  <span className="font-medium">{appliance.hoursPerDay} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage Frequency:</span>
                  <span className="font-medium">{getFrequencyText()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Hour Usage:</span>
                  <span className="font-medium">{appliance.peakHourPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Always On:</span>
                  <span className="font-medium">{appliance.alwaysOn ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Energy Consumption</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Consumption:</span>
                  <span className="font-medium">{costDetails.dailyConsumption.toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Hour Consumption:</span>
                  <span className="font-medium">{costDetails.peakConsumption.toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Off-Peak Consumption:</span>
                  <span className="font-medium">{costDetails.offPeakConsumption.toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Consumption:</span>
                  <span className="font-medium">{monthlyUsage.toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Cost:</span>
                  <span className="font-medium">{Math.round(costDetails.monthlyCost).toLocaleString()} PKR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">% of Monthly Bill:</span>
                  <span className="font-medium">{billPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-3">Cost Breakdown</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-red-100 text-red-600">
                    Peak ({electricityRates.peak} PKR/kWh)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-red-600">
                    {Math.round(costDetails.peakCost * 30).toLocaleString()} PKR/month
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${appliance.peakHourPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                ></div>
              </div>

              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-green-100 text-green-600">
                    Off-Peak ({electricityRates.offPeak} PKR/kWh)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {Math.round(costDetails.offPeakCost * 30).toLocaleString()} PKR/month
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${100 - appliance.peakHourPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-green-800">Optimization Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appliance.peakHourPercentage > 20 && (
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Shift Usage to Off-Peak Hours
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Moving usage from peak hours (6 PM - 10 PM) to off-peak hours could save you up to{" "}
                  {Math.round(potentialSavings).toLocaleString()} PKR per month.
                </p>
                <Button className="mt-3 bg-green-600 hover:bg-green-700">
                  Create Shifting Schedule <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {appliance.type === "cooling" && (
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Temperature Settings
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Setting your air conditioner to 26°C instead of 22°C can reduce energy consumption by up to 20%,
                  saving approximately {Math.round(costDetails.monthlyCost * 0.2).toLocaleString()} PKR per month.
                </p>
              </div>
            )}

            {appliance.wattage > 1000 && (
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Consider Energy Efficient Alternative
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Upgrading to an energy-efficient model could reduce consumption by 30-40%, with an estimated payback
                  period of 2-3 years.
                </p>
              </div>
            )}

            {appliance.type === "lighting" && (
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Switch to LED Lighting
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Replacing conventional bulbs with LEDs can reduce lighting energy consumption by up to 80%.
                </p>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Optimize Usage Schedule
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Based on your household profile, the optimal time to use this appliance is between 11 PM and 5 AM when
                electricity rates are lowest. This could save you approximately{" "}
                {Math.round(costDetails.monthlyCost * 0.3).toLocaleString()} PKR per month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Percentage of Monthly Bill</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${Math.min(billPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                This appliance accounts for {billPercentage.toFixed(1)}% of your monthly electricity bill.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Percentage of Monthly Income</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${Math.min(incomePercentage * 10, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                The cost of running this appliance is {incomePercentage.toFixed(2)}% of your monthly household income.
              </p>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Annual Cost Projection</h3>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(costDetails.monthlyCost * 12).toLocaleString()}{" "}
                <span className="text-base font-normal">PKR/year</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                By implementing the recommended optimizations, you could save up to{" "}
                {Math.round(costDetails.monthlyCost * 0.4 * 12).toLocaleString()} PKR annually.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
