"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserBookings, getWallet, getUserTransactions } from '../../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../Card'
import { Calendar, MapPin, CreditCard, Star, Clock, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function UserDashboard() {
  const { user, userProfile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
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
      
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await getUserBookings(user.id)
      if (bookingsError) throw bookingsError
      setBookings(bookingsData || [])

      // Fetch wallet
      const { data: walletData, error: walletError } = await getWallet(user.id)
      if (walletError && walletError.code !== 'PGRST116') {
        console.error('Wallet error:', walletError)
      }
      setWallet(walletData)

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await getUserTransactions(user.id)
      if (transactionsError) throw transactionsError
      setTransactions(transactionsData || [])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getVerificationStatusIcon = () => {
    switch (userProfile?.verification_status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getVerificationStatusText = () => {
    switch (userProfile?.verification_status) {
      case 'verified':
        return 'Verified'
      case 'rejected':
        return 'Rejected'
      default:
        return 'Pending Verification'
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userProfile?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">Manage your rentals and account from here</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'bookings', label: 'My Bookings' },
            { id: 'wallet', label: 'Wallet' },
            { id: 'profile', label: 'Profile' }
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
                  <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{wallet?.balance?.toLocaleString() || '0'}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verification Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getVerificationStatusIcon()}
                    <p className="text-sm font-medium">{getVerificationStatusText()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Rentals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-[#3730E1]" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600">Start exploring properties to make your first booking!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <img
                          src={booking.properties?.property_images?.find(img => img.is_primary)?.image_url || 
                               "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=300"}
                          alt={booking.properties?.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.properties?.title}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.properties?.location}
                          </p>
                          <p className="text-[#3730E1] font-medium">
                            ₦{booking.total_amount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(booking.check_in_date), 'MMM dd, yyyy')} - 
                            {format(new Date(booking.check_out_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
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

      {/* Wallet Tab */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Wallet</h2>
            <button className="bg-[#3730E1] hover:bg-[#2820D9] text-white px-4 py-2 rounded-lg">
              Add Funds
            </button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Current Balance</p>
                <p className="text-4xl font-bold text-[#3730E1]">
                  ₦{wallet?.balance?.toLocaleString() || '0'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No transactions yet</p>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(transaction.created_at), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <p className="text-gray-900">{userProfile?.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <p className="text-gray-900">{userProfile?.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{userProfile?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <p className="text-gray-900">{userProfile?.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <p className="text-gray-900">{userProfile?.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <p className="text-gray-900">{userProfile?.occupation}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Status</label>
                  <div className="flex items-center gap-2">
                    {getVerificationStatusIcon()}
                    <span className="text-gray-900">{getVerificationStatusText()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-[#3730E1] hover:bg-[#2820D9] text-white px-4 py-2 rounded-lg">
                  Edit Profile
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}