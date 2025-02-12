"use client"

import { useState } from "react"
import { Search, Clock, MapPin, ChevronDown } from "lucide-react"

const propertyTypes = ["Apartment", "House", "Studio", "Villa", "Duplex"]
const durationTypes = ["Rental", "Short-let", "Long-term", "Monthly"]
const locations = ["Lagos Island", "Lagos Mainland", "Victoria Island", "Lekki", "Ikeja", "Ikoyi"]

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState({
    property: false,
    duration: false,
    location: false,
  })

  const [formData, setFormData] = useState({
    propertyType: "",
    durationType: "",
    location: "",
  })

  const toggleDropdown = (field) => {
    setIsOpen((prev) => ({
      property: false,
      duration: false,
      location: false,
      [field]: !prev[field],
    }))
  }

  const handleSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setIsOpen((prev) => ({
      ...prev,
      [field]: false,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Search criteria:", formData)
    // TODO: Implement search functionality
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[46.875rem] h-auto mx-auto">
      <div className="md:bg-white rounded-md  md:max-h-[6rem] shadow-lg flex md:flex-row flex-col items-center px-2 md:gap-0 gap-2">
        {/* Property Type*/}
        <div className="relative flex-1 min-w-[200px] w-full min-h-[3.5rem] bg-white items-center rounded-md">
          <button
            type="button"
            onClick={() => toggleDropdown("property")}
            className="w-full flex items-center gap-2 pl-6 py-4 hover:bg-gray-50 text-left"
          >
            <Search className="w-5 h-5 text-gray-400" />
            <span className={`text-center ${formData.propertyType ? "text-gray-900" : "text-gray-500"}`}>
              {formData.propertyType || "Apartments or Houses"}
            </span>
          </button>
          {isOpen.property && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg py-2 z-50">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect("propertyType", type)}
                  className="w-full px-4 py-2 text-left text-black hover:bg-gray-400"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-px h-8 bg-gray-200 hidden md:flex" />

        {/* Duration Type */}
        <div className="relative flex-1 min-w-[200px] w-full min-h-[3.5rem] bg-white rounded-md">
          <button
            type="button"
            onClick={() => toggleDropdown("duration")}
            className="w-full flex items-center gap-2 pl-6 py-4 hover:bg-gray-50 rounded-full text-left"
          >
            <Clock className="w-5 h-5 text-gray-400" />
            <span className={formData.durationType ? "text-gray-900" : "text-gray-500"}>
              {formData.durationType || "Rental or Short-let"}
            </span>
          </button>
          {isOpen.duration && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg py-2 z-50">
              {durationTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelect("durationType", type)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-200 hidden md:flex" />

        {/* Location */}
        <div className="relative flex-1 min-w-[200px]  w-full min-h-[3.5rem] bg-white rounded-md">
          <button
            type="button"
            onClick={() => toggleDropdown("location")}
            className="w-full flex items-center gap-2 px-6 py-4 hover:bg-gray-50 rounded-full text-left"
          >
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className={formData.location ? "text-gray-900" : "text-gray-500"}>
              {formData.location || "Location"}
            </span>
             <ChevronDown
              className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${isOpen.location ? "rotate-180" : ""}`}
            />
          </button>
          {isOpen.location && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg py-2 z-50">
              {locations.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => handleSelect("location", location)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="md:ml-2 bg-[#3730E1] md:w-12 md:h-12 hover:bg-[#2820D9] text-white p-4 md:rounded-full transition-colors w-full flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          <span className="md:hidden">Search Now</span>
        </button>
      </div>
    </form>
  )
}

