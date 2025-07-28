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

// File upload functions
export const uploadPropertyImages = async (propertyId, imageFiles) => {
  try {
    const uploadPromises = imageFiles.map(async ({ file, is_primary }, index) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${propertyId}/${Date.now()}_${index}.${fileExt}`
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)

      // Save image record to database
      const { error: dbError } = await supabase
        .from('property_images')
        .insert([
          {
            property_id: propertyId,
            image_url: publicUrl,
            is_primary: is_primary || false
          }
        ])

      if (dbError) throw dbError

      return publicUrl
    })

    await Promise.all(uploadPromises)
    return { error: null }
  } catch (error) {
    console.error('Error uploading images:', error)
    return { error }
  }
}

// Enhanced property search with filters
export const searchProperties = async (searchParams) => {
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

  // Apply search filters
  if (searchParams.location) {
    query = query.ilike('location', `%${searchParams.location}%`)
  }
  
  if (searchParams.property_type) {
    query = query.eq('property_type', searchParams.property_type)
  }
  
  if (searchParams.min_price) {
    query = query.gte('price', searchParams.min_price)
  }
  
  if (searchParams.max_price) {
    query = query.lte('price', searchParams.max_price)
  }
  
  if (searchParams.bedrooms) {
    query = query.eq('bedrooms', searchParams.bedrooms)
  }
  
  if (searchParams.bathrooms) {
    query = query.eq('bathrooms', searchParams.bathrooms)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

// Location-based recommendations
export const getLocationBasedProperties = async (userLocation, limit = 10) => {
  // In a real app, you would use PostGIS or similar for geo-queries
  // For now, we'll do a simple location-based search
  const { data, error } = await supabase
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
    .ilike('location', `%${userLocation}%`)
    .limit(limit)
    .order('created_at', { ascending: false })

  return { data, error }
}

// Booking status updates
export const updateBookingStatus = async (bookingId, status, notes = null) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      status,
      notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select()
    .single()

  return { data, error }
}

// Wallet balance update (this would typically be handled by database triggers)
export const updateWalletBalance = async (userId, amount, type = 'credit') => {
  const { data: wallet, error: walletError } = await getWallet(userId)
  if (walletError) throw walletError

  const newBalance = type === 'credit' 
    ? wallet.balance + amount 
    : wallet.balance - amount

  const { data, error } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('user_id', userId)
    .select()
    .single()

  return { data, error }
}