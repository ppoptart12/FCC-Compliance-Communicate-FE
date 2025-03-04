import { CameraIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileHeader() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile and AI context settings</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8 md:flex-row md:gap-16">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Image
                src="/placeholder.svg"
                alt="Profile picture"
                className="rounded-full object-cover"
                width={100}
                height={100}
              />
              <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                <CameraIcon className="h-4 w-4" />
                <span className="sr-only">Change profile picture</span>
              </Button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Sarah Johnson</h3>
              <p className="text-sm text-muted-foreground">Compliance Officer</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4 md:flex-row md:gap-16">
            <div className="space-y-1">
              <p className="text-sm font-medium">Organization</p>
              <p className="text-sm text-muted-foreground">WXYZ Broadcasting Corp</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">New York, NY</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">March 2024</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

