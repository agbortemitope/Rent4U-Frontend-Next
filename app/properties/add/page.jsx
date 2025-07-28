"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { createProperty, uploadPropertyImages } from "../../lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { Select } from "../../components/ui/select"
import { Plus, X, Upload } from "lucide-react"
import toast from "react-hot-toast"

const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
  { value: "villa", label: "Villa" },
  { value: "duplex", label: "Duplex" },
  { value: "bungalow", label: "Bungalow" }
]

const amenitiesList = [
  "WiFi", "Air Conditioning", "Parking", "Swimming Pool", "Gym", 
  "Security", "Generator", "Water Supply", "Furnished", "Kitchen Appliances"
]

export default function AddProperty() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    rental_duration: "",
    available_from: "",
    contact_phone: "",
    contact_email: ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files)
    const newVideos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))
    setVideos(prev => [...prev, ...newVideos])
  }

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const removeVideo = (id) => {
    setVideos(prev => prev.filter(vid => vid.id !== id))
  }

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user || userProfile?.user_type !== 'owner') {
      toast.error('Only property owners can add properties')
      return
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    setLoading(true)

    try {
      // Create property record
      const propertyData = {
        ...formData,
        owner_id: user.id,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        square_feet: parseInt(formData.square_feet),
        status: 'pending',
        amenities: selectedAmenities
      }

      const { data: property, error: propertyError } = await createProperty(propertyData)
      
      if (propertyError) throw propertyError

      // Upload images
      if (images.length > 0) {
        const imageFiles = images.map((img, index) => ({
          file: img.file,
          is_primary: index === 0
        }))
        
        const { error: imageError } = await uploadPropertyImages(property.id, imageFiles)
        if (imageError) throw imageError
      }

      // Upload videos (if any)
      if (videos.length > 0) {
        // TODO: Implement video upload
        console.log('Videos to upload:', videos)
      }

      toast.success('Property submitted for review!')
      router.push('/dashboard')

    } catch (error) {
      console.error('Error creating property:', error)
      toast.error('Failed to create property. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user || userProfile?.user_type !== 'owner') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600">Only property owners can add properties.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add New Property</CardTitle>
            <p className="text-gray-600">Fill in the details below to list your property</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Property Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Luxury 3-bedroom apartment"
                  required
                />
                
                <Select
                  placeholder="Property Type"
                  options={propertyTypes}
                  value={formData.property_type}
                  onChange={(option) => setFormData(prev => ({ ...prev, property_type: option.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your property..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Victoria Island, Lagos"
                  required
                />
                
                <Input
                  label="Price (₦)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Monthly rent amount"
                  required
                />
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
                
                <Input
                  label="Bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
                
                <Input
                  label="Square Feet"
                  name="square_feet"
                  type="number"
                  value={formData.square_feet}
                  onChange={handleInputChange}
                  placeholder="Property size"
                />
              </div>

              {/* Rental Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Rental Duration"
                  name="rental_duration"
                  value={formData.rental_duration}
                  onChange={handleInputChange}
                  placeholder="e.g., Monthly, Yearly"
                  required
                />
                
                <Input
                  label="Available From"
                  name="available_from"
                  type="date"
                  value={formData.available_from}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Contact Phone"
                  name="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  placeholder="Phone number for inquiries"
                  required
                />
                
                <Input
                  label="Contact Email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="Email for inquiries"
                  required
                />
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-[#3730E1] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Property Images *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">Click to upload images</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.preview}
                          alt="Property"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Property Videos (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600">Click to upload videos</p>
                    <p className="text-sm text-gray-500">MP4, MOV up to 50MB each</p>
                  </label>
                </div>
                
                {videos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {videos.map((video) => (
                      <div key={video.id} className="relative">
                        <video
                          src={video.preview}
                          className="w-full h-32 object-cover rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={() => removeVideo(video.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Submitting...' : 'Submit for Review'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}