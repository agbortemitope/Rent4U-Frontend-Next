"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../Card'
import { Plus, Home, Eye, Edit, Trash2, MapPin, Calendar, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function OwnerDashboard() {
  const { user, userProfile } = useAuth()
  const [properties, setProperties] = useState([])
  const [bookings, setBookings] = useState([])
  const [earnings, setEarnings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch owner's properties
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            image_url,
            is_primary
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (propertiesError) throw propertiesError
      setProperties(propertiesData || [])

      // Fetch bookings for owner's properties
      const propertyIds = propertiesData?.map(p => p.id) || []
      if (propertyIds.length > 0) {
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            *,
            properties (
              title,
              location
            ),
            profiles (
              first_name,
              last_name,
              phone
            )
          `)
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false })

        if (bookingsError) throw bookingsError
        setBookings(bookingsData || [])

        // Calculate earnings
        const totalEarnings = bookingsData
          ?.filter(b => b.status === 'confirmed')
          ?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0
        setEarnings(totalEarnings)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3730E1]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Property Owner Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage your properties and bookings</p>
        </div>
        <Link href="/properties/add">
          <button className="bg-[#3730E1] hover:bg-[#2820D9] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Property
          </button>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'properties', label: 'My Properties' },
            { id: 'bookings', label: 'Bookings' },
            { id: 'earnings', label: 'Earnings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-[#3730E1] text-[#3730E1]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                </div>
                <Home className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {properties.filter(p => p.status === 'approved').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">₦{earnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
            <Link href="/properties/add">
              <button className="bg-[#3730E1] hover:bg-[#2820D9] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Property
              </button>
            </Link>
          </div>
          
          {properties.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first property listing!</p>
                <Link href="/properties/add">
                  <button className="bg-[#3730E1] hover:bg-[#2820D9] text-white px-4 py-2 rounded-lg">
                    Add Property
                  </button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <img
                          src={property.property_images?.find(img => img.is_primary)?.image_url || 
                               "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=300"}
                          alt={property.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {property.location}
                          </p>
                          <p className="text-[#3730E1] font-medium">₦{property.price?.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">
                            Created {format(new Date(property.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                        </span>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:text-[#3730E1]">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-[#3730E1]">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Property Bookings</h2>
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600">Bookings will appear here once users start renting your properties.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.properties?.title}
                        </h3>
                        <p className="text-gray-600">
                          Guest: {booking.profiles?.first_name} {booking.profiles?.last_name}
                        </p>
                        <p className="text-gray-600">Phone: {booking.profiles?.phone}</p>
                        <p className="text-[#3730E1] font-medium">₦{booking.total_amount?.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(booking.check_in_date), 'MMM dd, yyyy')} - 
                          {format(new Date(booking.check_out_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBookingStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Earnings Overview</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
                <p className="text-4xl font-bold text-[#3730E1]">₦{earnings.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-2">From {bookings.filter(b => b.status === 'confirmed').length} confirmed bookings</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}