"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { getPropertyById, createBooking } from "../../lib/supabase"
import { Card, CardContent } from "../../components/Card"
import Button from "../../components/Button"
import { MapPin, Bed, Bath, Square, Calendar, Phone, Mail, Star, Heart, Share2 } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

export default function PropertyDetails() {
  const params = useParams()
  const router = useRouter()
  const { user, userProfile } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    check_in_date: "",
    check_out_date: "",
    guests: 1,
    message: ""
  })

  useEffect(() => {
    if (params.id) {
      fetchProperty()
    }
  }, [params.id])

  const fetchProperty = async () => {
    try {
      const { data, error } = await getPropertyById(params.id)
      if (error) throw error
      setProperty(data)
    } catch (error) {
      console.error('Error fetching property:', error)
      toast.error('Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to make a booking')
      router.push('/login')
      return
    }

    if (userProfile?.verification_status !== 'verified') {
      toast.error('Please verify your identity to make bookings')
      router.push('/verify')
      return
    }

    setBookingLoading(true)

    try {
      const checkIn = new Date(bookingData.check_in_date)
      const checkOut = new Date(bookingData.check_out_date)
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
      const totalAmount = property.price * days

      const booking = {
        property_id: property.id,
        user_id: user.id,
        check_in_date: bookingData.check_in_date,
        check_out_date: bookingData.check_out_date,
        guests: parseInt(bookingData.guests),
        total_amount: totalAmount,
        status: 'pending',
        message: bookingData.message
      }

      const { error } = await createBooking(booking)
      if (error) throw error

      toast.success('Booking request submitted successfully!')
      setShowBookingModal(false)
      router.push('/dashboard')

    } catch (error) {
      console.error('Error creating booking:', error)
      toast.error('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!bookingData.check_in_date || !bookingData.check_out_date || !property) return 0
    
    const checkIn = new Date(bookingData.check_in_date)
    const checkOut = new Date(bookingData.check_out_date)
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    
    return days > 0 ? property.price * days : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3730E1]"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const images = property.property_images || []
  const primaryImage = images.find(img => img.is_primary) || images[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px]">
        {primaryImage ? (
          <Image
            src={primaryImage.image_url}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Bed className="w-5 h-5" />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-5 h-5" />
                  <span>{property.bathrooms} baths</span>
                </div>
                {property.square_feet && (
                  <div className="flex items-center gap-1">
                    <Square className="w-5 h-5" />
                    <span>{property.square_feet} sq ft</span>
                  </div>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {property.amenities && property.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#3730E1] rounded-full"></div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Owner Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Owner</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#3730E1] rounded-full flex items-center justify-center text-white font-semibold">
                    {property.profiles?.first_name?.charAt(0)}{property.profiles?.last_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">
                      {property.profiles?.first_name} {property.profiles?.last_name}
                    </p>
                    <p className="text-gray-600">Property Owner</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{property.contact_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{property.contact_email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#3730E1]">
                      ₦{property.price?.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/{property.rental_duration}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full mb-4"
                >
                  Book Now
                </Button>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Property Type:</span>
                    <span className="capitalize">{property.property_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available From:</span>
                    <span>{new Date(property.available_from).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 capitalize">{property.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Book Property</h2>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.check_in_date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, check_in_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3730E1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.check_out_date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, check_out_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3730E1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookingData.guests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, guests: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3730E1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    value={bookingData.message}
                    onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3730E1]"
                    placeholder="Any special requests or questions..."
                  />
                </div>

                {calculateTotal() > 0 && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-[#3730E1]">₦{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}