"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getPendingProperties, updatePropertyStatus, supabase } from '../../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../Card'
import { CheckCircle, XCircle, Eye, Users, Home, Calendar, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const { user, userProfile } = useAuth()
  const [pendingProperties, setPendingProperties] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingReviews: 0,
    totalBookings: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProperty, setSelectedProperty] = useState(null)

  useEffect(() => {
    if (user && userProfile?.user_type === 'admin') {
      fetchDashboardData()
    }
  }, [user, userProfile])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch pending properties
      const { data: pendingData, error: pendingError } = await getPendingProperties()
      if (pendingError) throw pendingError
      setPendingProperties(pendingData || [])

      // Fetch stats
      const [usersResult, propertiesResult, bookingsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('properties').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' })
      ])

      setStats({
        totalUsers: usersResult.count || 0,
        totalProperties: propertiesResult.count || 0,
        pendingReviews: pendingData?.length || 0,
        totalBookings: bookingsResult.count || 0
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handlePropertyAction = async (propertyId, action, notes = '') => {
    try {
      const status = action === 'approve' ? 'approved' : 'rejected'
      const { error } = await updatePropertyStatus(propertyId, status, notes)
      
      if (error) throw error

      toast.success(`Property ${action}d successfully`)
      fetchDashboardData() // Refresh data
      setSelectedProperty(null)
    } catch (error) {
      console.error('Error updating property:', error)
      toast.error(`Failed to ${action} property`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3730E1]"></div>
      </div>
    )
  }

  if (userProfile?.user_type !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage properties, users, and platform operations</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'pending', label: `Pending Reviews (${stats.pendingReviews})` },
            { id: 'properties', label: 'All Properties' },
            { id: 'users', label: 'Users' }
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
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>
                <Home className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Reviews Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Pending Property Reviews</h2>
          {pendingProperties.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No properties pending review at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {pendingProperties.map((property) => (
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
                          <p className="text-gray-600">{property.location}</p>
                          <p className="text-[#3730E1] font-medium">₦{property.price?.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">
                            Owner: {property.profiles?.first_name} {property.profiles?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Submitted {format(new Date(property.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProperty(property)}
                          className="p-2 text-gray-600 hover:text-[#3730E1]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePropertyAction(property.id, 'approve')}
                          className="p-2 text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePropertyAction(property.id, 'reject')}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Property Review</h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <img
                  src={selectedProperty.property_images?.find(img => img.is_primary)?.image_url || 
                       "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=600"}
                  alt={selectedProperty.title}
                  className="w-full h-64 rounded-lg object-cover"
                />
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedProperty.title}</h3>
                  <p className="text-gray-600">{selectedProperty.location}</p>
                  <p className="text-[#3730E1] font-medium text-lg">₦{selectedProperty.price?.toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedProperty.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Property Type</h4>
                    <p className="text-gray-600">{selectedProperty.property_type}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Bedrooms</h4>
                    <p className="text-gray-600">{selectedProperty.bedrooms}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Bathrooms</h4>
                    <p className="text-gray-600">{selectedProperty.bathrooms}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Square Feet</h4>
                    <p className="text-gray-600">{selectedProperty.square_feet}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Owner Information</h4>
                  <p className="text-gray-600">
                    {selectedProperty.profiles?.first_name} {selectedProperty.profiles?.last_name}
                  </p>
                  <p className="text-gray-600">{selectedProperty.profiles?.email}</p>
                  <p className="text-gray-600">{selectedProperty.profiles?.phone}</p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => handlePropertyAction(selectedProperty.id, 'approve')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handlePropertyAction(selectedProperty.id, 'reject')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}