"use client"

import { useState } from "react"
import Link from "next/link"
import { RentSignIcon } from "../components/icons/rent-sign"
import { HouseSearchIcon } from "../components/icons/house-search"
import { IconButton } from "../components/ui/icon-button"
import { Eye, EyeOff, Facebook, FacebookIcon, LucideFacebook } from "lucide-react"
import Button from "../components/Button"
import Input from "../components/Input"
import { Card } from "../components/Card"
import { useRouter } from "next/navigation"

const SocialIconButton = ({ fb, onClick, children }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 ${fb && "bg-blue-600 relative"} flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
  >{children}</button>
)

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginAs, setLoginAs] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement login logic
    router.push("/")
    console.log("Login attempt:", formData)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSocialLogin = (provider) => {
    // TODO: Implement social login
    console.log(`${provider} login clicked`)
  }
  const LoginComponent = () => {

    return (<div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <Card className="w-full  max-w-[38.25rem] shadow-none flex flex-col gap-14">

        <div className="text-center mb-1 text-black md:text-[2rem]">
          <h1 className="text-3xl md:text-5xl leading-snug font-bold text-center text-black mb-4">Login to your Account</h1>
          or <Link href="/signup" className="  text-blue-600 hover:text-blue-800"> register
          </Link> if you don’t have one.
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
            className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
            value={formData.email}
            onChange={handleInputChange}
          />
          <div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                required
                className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] text-white font-bold bg-[#2A27B5] hover:bg-[#2820D9]">
            Login
          </Button>
        </form>

        <div className="">
          <div className=" flex justify-center md:text-2xl">
            <span className="px-2 text-black">or continue with:</span>
          </div>
          <div className="mt-10 flex justify-center gap-[4.5rem]">
            <SocialIconButton onClick={() => handleSocialLogin("google")}>
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </SocialIconButton>
            <SocialIconButton fb onClick={() => handleSocialLogin("facebook")}>
              <svg className="w-full h-full absolute -bottom-1" fill="#F5F5F5" viewBox="0 0 24 24">
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
              </svg>
            </SocialIconButton>
            <SocialIconButton onClick={() => handleSocialLogin("apple")}>
              <svg className="w-full h-full" fill="black" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </SocialIconButton>
          </div>
        </div>

      </Card>
    </div>)
  }
  return (
    <>
      {!loginAs ?
        <main className="min-h-screen flex flex-col gap-20 items-center justify-center bg-gray-100 px-4">
          <h1 className="text-3xl md:text-5xl font-medium">Login as a:</h1>
          <div className="w-full max-w-4xl flex flex-col items-center gap-12">
            <div className="grid grid-cols-2 gap-16">
              <IconButton onClick={() => setLoginAs("renter")} icon={RentSignIcon} label="Renter" />
              <IconButton onClick={() => setLoginAs("owner")} icon={HouseSearchIcon} label="Owner" />
            </div>
          </div>
          <div className="md:text-xl font-medium">
            <Link href="/signup" className="text-[#3730E1]"> register</Link> if you don't have an account.</div>
        </main> : LoginComponent()
      }
    </>)
}

