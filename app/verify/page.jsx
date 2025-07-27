"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Card, CardContent } from "../components/Card"
import { IdentificationForm } from "../components/identification-form"

export default function VerifyIdentity() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [identificationMethod, setIdentificationMethod] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          console.log("Preview:", reader.result)
          setPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        alert("Please upload an image file")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) {
      
      alert("Please upload an identification document")
      return
    }
    // TODO: Implement file upload logic
    console.log("Uploading file:", selectedFile)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-none">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-medium text-center text-gray-900 mb-4">Verify Identity</h1>
            <p className="text-center text-gray-600 font-semibold">upload a verified means of identification.</p>
          </div>
          {identificationMethod ? <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input type="file" id="file-upload" className="sr-only" accept="image/*" onChange={handleFileSelect} />
              <label
                htmlFor="file-upload"
                className={`
                  relative cursor-pointer w-full h-48 flex flex-col items-center justify-center
                  border-2 border-dashed rounded-lg
                  ${preview ? "border-green-500" : "border-[#3730E1] hover:border-[#2820D9]"}
                  transition-colors duration-200
                `}
              >
                {preview ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={preview || "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200"}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-2 rounded-full bg-[#3730E1] text-white">
                      <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-[#3730E1] font-medium">Upload a picture</span>
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              className={`
                w-full h-[2.875rem] md:h-[3.75rem] py-3 px-4 rounded-lg text-white text-lg font-medium
                ${selectedFile ? "bg-[#3730E1] hover:bg-[#2820D9]" : "bg-[#3730E1] opacity-50 cursor-not-allowed"}
                transition-colors duration-200
              `}
              disabled={!selectedFile}
            >
              Continue
            </button>
            <button
              type="submit"
              className={`
                w-full py-3 px-4 h-[2.875rem] md:h-[3.75rem] rounded-lg text-[#3730E1] text-lg font-medium border-2 border-[#3730E1] hover:border-[#2820D9]}
                transition-colors duration-200
              `}
            >
              Skip
            </button>
          </form> :
            <IdentificationForm  setIdentificationMethod={setIdentificationMethod}/>
          }
        </CardContent>
      </Card>
    </div>
  )
}

