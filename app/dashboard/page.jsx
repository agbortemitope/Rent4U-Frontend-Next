"use client"

import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import UserDashboard from "../components/dashboard/UserDashboard"
import OwnerDashboard from "../components/dashboard/OwnerDashboard"
import AdminDashboard from "../components/dashboard/AdminDashboard"

export default function Dashboard() {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3730E1]"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Render appropriate dashboard based on user type
  switch (userProfile?.user_type) {
    case 'admin':
      return <AdminDashboard />
    case 'owner':
      return <OwnerDashboard />
    case 'renter':
    default:
      return <UserDashboard />
  }
}