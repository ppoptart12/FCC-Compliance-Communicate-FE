"use client"

import { useState } from "react"
import { CheckCircle2, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const steps = [
  {
    id: "station",
    title: "Station Information",
    fields: ["callSign", "frequency", "stationType"],
  },
  {
    id: "technical",
    title: "Technical Details",
    fields: ["power", "antenna", "coverage"],
  },
  {
    id: "compliance",
    title: "Compliance History",
    fields: ["violations", "inspections"],
  },
  {
    id: "organization",
    title: "Organization Structure",
    fields: ["ownership", "staff"],
  },
]

export function ComplianceContext() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    callSign: "",
    frequency: "",
    stationType: "",
    power: "",
    antenna: "",
    coverage: "",
    violations: "",
    inspections: "",
    ownership: "",
    staff: "",
  })

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-medium tracking-tight">Compliance Context Setup</h3>
          <p className="text-sm text-muted-foreground">
            Help us understand your organization better to provide accurate compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="hidden w-[200px] flex-col gap-1 md:flex">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted ${
                currentStep === index ? "border-primary bg-primary/5" : "border-transparent"
              }`}
            >
              {currentStep > index ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                    currentStep === index ? "border-primary text-primary" : "border-muted-foreground/30"
                  }`}
                >
                  {index + 1}
                </div>
              )}
              <span className="flex-1 text-left">{step.title}</span>
              <ChevronRight
                className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                  currentStep === index ? "text-primary" : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>Enter your {steps[currentStep].title.toLowerCase()} details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="callSign">Station Call Sign</Label>
                  <Input
                    id="callSign"
                    placeholder="WXYZ-FM"
                    value={formData.callSign}
                    onChange={(e) => updateFormData("callSign", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="98.7 MHz"
                    value={formData.frequency}
                    onChange={(e) => updateFormData("frequency", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Station Type</Label>
                  <RadioGroup
                    value={formData.stationType}
                    onValueChange={(value) => updateFormData("stationType", value)}
                  >
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial">Commercial</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="noncommercial" id="noncommercial" />
                        <Label htmlFor="noncommercial">Non-Commercial</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lpfm" id="lpfm" />
                        <Label htmlFor="lpfm">LPFM</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="power">Transmitter Power</Label>
                  <Input
                    id="power"
                    placeholder="50,000 watts"
                    value={formData.power}
                    onChange={(e) => updateFormData("power", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="antenna">Antenna Height</Label>
                  <Input
                    id="antenna"
                    placeholder="500 feet HAAT"
                    value={formData.antenna}
                    onChange={(e) => updateFormData("antenna", e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="coverage">Coverage Area Description</Label>
                  <Textarea
                    id="coverage"
                    placeholder="Describe your station's coverage area..."
                    value={formData.coverage}
                    onChange={(e) => updateFormData("coverage", e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="violations">Previous Violations</Label>
                  <Select value={formData.violations} onValueChange={(value) => updateFormData("violations", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select violation history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No previous violations</SelectItem>
                      <SelectItem value="minor">Minor violations only</SelectItem>
                      <SelectItem value="major">Major violations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspections">Last FCC Inspection</Label>
                  <Input
                    id="inspections"
                    type="date"
                    value={formData.inspections}
                    onChange={(e) => updateFormData("inspections", e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownership">Ownership Structure</Label>
                  <Select value={formData.ownership} onValueChange={(value) => updateFormData("ownership", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Station Owner</SelectItem>
                      <SelectItem value="group">Group Owner</SelectItem>
                      <SelectItem value="network">Network Affiliate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staff">Staff Size</Label>
                  <Select value={formData.staff} onValueChange={(value) => updateFormData("staff", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-10 employees)</SelectItem>
                      <SelectItem value="medium">Medium (11-50 employees)</SelectItem>
                      <SelectItem value="large">Large (50+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={previousStep} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={nextStep}>{currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

