import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"

export default function ProfilePage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <ProfileHeader />
      <ProfileTabs />
    </div>
  )
}

