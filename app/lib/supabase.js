import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Property management functions
export const createProperty = async (propertyData) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
    .single()

  return { data, error }
}

export const getProperties = async (filters = {}) => {
  let query = supabase
    .from('properties')
    .select(`
      *,
      profiles:owner_id (
        first_name,
        last_name,
        phone
      ),
      property_images (
        image_url,
        is_primary
      )
    `)
    .eq('status', 'approved')

  // Apply filters
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters.property_type) {
    query = query.eq('property_type', filters.property_type)
  }
  if (filters.min_price) {
    query = query.gte('price', filters.min_price)
  }
  if (filters.max_price) {
    query = query.lte('price', filters.max_price)
  }
  if (filters.bedrooms) {
    query = query.eq('bedrooms', filters.bedrooms)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

export const getPropertyById = async (id) => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      profiles:owner_id (
        first_name,
        last_name,
        phone,
        email
      ),
      property_images (
        image_url,
        is_primary
      ),
      property_amenities (
        amenity
      )
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

// Booking management functions
export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single()

  return { data, error }
}

export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      properties (
        title,
        location,
        price,
        property_images (
          image_url,
          is_primary
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Wallet management functions
export const createWallet = async (userId) => {
  const { data, error } = await supabase
    .from('wallets')
    .insert([
      {
        user_id: userId,
        balance: 0
      }
    ])
    .select()
    .single()

  return { data, error }
}

export const getWallet = async (userId) => {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { data, error }
}

export const addTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select()
    .single()

  return { data, error }
}

export const getUserTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Reviews and ratings
export const createReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single()

  return { data, error }
}

export const getPropertyReviews = async (propertyId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles (
        first_name,
        last_name
      )
    `)
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Admin functions
export const getPendingProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      profiles:owner_id (
        first_name,
        last_name,
        phone,
        email
      ),
      property_images (
        image_url,
        is_primary
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const updatePropertyStatus = async (propertyId, status, adminNotes = null) => {
  const { data, error } = await supabase
    .from('properties')
    .update({ 
      status,
      admin_notes: adminNotes,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', propertyId)
    .select()
    .single()

  return { data, error }
}