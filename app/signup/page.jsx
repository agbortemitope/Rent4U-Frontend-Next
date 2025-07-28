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
import { useAuth } from "../contexts/AuthContext"


export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [signupAs, setSignupAs] = useState("")
  const router = useRouter()
  const { signInWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    occupation: "",
    email: "",
    password: "",
  })
  const [passwordMatchError, setPasswordMatchError] = useState(false)

  const handleNextStep = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const validatePasswords = () => {
    return formData.password === formData.confirmPassword
  }

  const handleFinalSubmit = (e) => {
    e.preventDefault()
    if (!validatePasswords()) {
      setPasswordMatchError(true)
      return
    }
    setPasswordMatchError(false)
    handleSubmit(e)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log("Login attempt:", formData)
    router.push("/verify")
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      signInWithGoogle()
    } else {
      // TODO: Implement other social logins
      console.log(`${provider} login clicked`)
    }
  }

  const RenterForm = () => {
    return (
      <form onSubmit={handleNextStep} className="flex flex-col gap-5 md:gap-10">
        <Input
          id="first_name"
          name="first_name"
          type="text"
          placeholder="First Name"
          required
          className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
          value={formData.first_name}
          onChange={handleInputChange}
        />
        <Input
          id="last_name"
          name="last_name"
          type="text"
          placeholder="Last Name"
          required
          className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
          value={formData.last_name}
          onChange={handleInputChange}
        />
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Phone Number"
          required
          className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
          value={formData.phone}
          onChange={handleInputChange}
        />
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
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="Location"
          required
          className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
          value={formData.location}
          onChange={handleInputChange}
        />
        <Input
          id="occupation"
          name="occupation"
          type="text"
          placeholder="Occupation"
          required
          className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
          value={formData.occupation}
          onChange={handleInputChange}
        />
        <Button type="submit" className="w-full h-[2.875rem] md:h-[3.75rem] text-white text-base md:text-[1.25rem] font-bold bg-[#2A27B5] hover:bg-[#2820D9]">
          Next
        </Button>
      </form>
    )
  }
  const OwnerForm = () => {
    return (
      <form onSubmit={handleNextStep} className="flex flex-col gap-5 md:gap-10">
        <Input
          id="first_name"
          name="first_name"
          type="text"
          placeholder="First Name"
          required
          className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
          value={formData.first_name}
          onChange={handleInputChange}
        />
        <Input
          id="last_name"
          name="last_name"
          type="text"
          placeholder="Last Name"
          required
          className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
          value={formData.last_name}
          onChange={handleInputChange}
        />
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Phone Number"
          required
          className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
          value={formData.phone}
          onChange={handleInputChange}
        />
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
       
        <Button type="submit" className="w-full h-[2.875rem] md:h-[3.75rem] text-white text-base md:text-[1.25rem] font-bold bg-[#2A27B5] hover:bg-[#2820D9]">
          Next
        </Button>
      </form>
    )
  }

  const SignupComponent = () => {


    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4 py-10">
        <Card className="w-full max-w-[38.25rem] shadow-none flex flex-col gap-14">
          {
            step === 1 ? <div className="text-center mb-1  text-black text-lg md:text-[2rem]">
              <h1 className="text-3xl md:text-5xl leading-snug font-bold text-center text-black mb-4">Create a Renters Account</h1>

              or <Link href="/login" className="text-blue-600 hover:text-blue-800">login</Link> if you already have one.
     </div> :
              <div className="text-center mb-1 text-black text-[2rem]">
                <h1 className="text-3xl md:text-5xl leading-snug font-bold text-center text-black mb-4">Create a Password</h1>
              </div>}
          {step === 1 ? signupAs === "renter" ?  RenterForm() : OwnerForm() : (
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5 md:gap-10">
              <div className="flex flex-col gap-5 md:gap-10">
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
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="h-[2.875rem] md:h-[3.75rem] text-base md:text-[1.25rem] pr-10 max-w-[38.25rem] pl-8 text-black"
                    value={formData.confirmPassword}
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
                {
      passwordMatchError && (
        <p className="text-red-500 text-sm">Passwords do not match</p>
      )
    }
              </div >
    <div className="flex gap-4">
      <Button
        type="submit"
        className="w-full h-[2.875rem] md:h-[3.75rem] text-white text-base md:text-[1.25rem] font-bold bg-[#2A27B5] hover:bg-[#2820D9]"
      >
        Confirm
      </Button>
    </div>
            </form >
          )
}
        </Card >
      </div >
    )
  }


return (
  <>
    {!signupAs ? <main className="min-h-screen flex flex-col gap-20 items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl md:text-5xl font-medium">Register as a:</h1>
      <div className="w-full max-w-4xl flex flex-col items-center gap-12">
        <div className="grid grid-cols-2 gap-16">
          <IconButton onClick={() => setSignupAs("renter")} icon={RentSignIcon} label="Renter" />
          <IconButton onClick={() => setSignupAs("owner")} icon={HouseSearchIcon} label="Owner" />
        </div>
      </div>
      <div className="md:text-xl font-medium">
        <Link href="/login" className="text-[#3730E1]"> login</Link> if you already have an account.</div>
    </main> : SignupComponent()}
  </>
)
}

