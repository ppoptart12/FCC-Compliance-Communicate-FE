"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { PersonalInfo } from "@/components/profile/tabs/personal-info"
import { ComplianceContext } from "@/components/profile/tabs/compliance-context"
import { AIPreferences } from "@/components/profile/tabs/ai-preferences"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProfileTabs() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("personal")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="personal">Personal Info</TabsTrigger>
        <TabsTrigger value="context">Compliance Context</TabsTrigger>
        <TabsTrigger value="preferences">AI Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="space-y-6">
        <PersonalInfo />
      </TabsContent>
      <TabsContent value="context" className="space-y-6">
        <ComplianceContext />
      </TabsContent>
      <TabsContent value="preferences" className="space-y-6">
        <AIPreferences />
      </TabsContent>
    </Tabs>
  )
}

