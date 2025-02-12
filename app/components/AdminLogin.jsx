"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"
import Input from "./Input"
import Button from "./Button"

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // TODO: Implement actual login logic here
    console.log("Login attempt:", formData)
    // Redirect to admin dashboard on successful login
    // router.push('/admin/dashboard')
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-[48.75rem] p-2 shadow-none">
        <CardHeader className="space-y-2">
          <CardTitle className="!text-3xl md:!text-5xl font-bold text-center text-black">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-center">
          <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-[38.25rem]">
            <div className="space-y-2">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                className="h-[2.875rem] md:h-[3.75rem] text-black md:text-[1.25rem] w-full pl-8"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative max-w-[38.25rem]">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="h-[2.875rem] md:h-[3.75rem] md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-[2.875rem] md:h-[3.75rem] text-white md:text-[1.25rem] font-bold bg-[#2A27B5] hover:bg-[#2820D9]">
              Next
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

