"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { searchProperties } from "../lib/supabase"
import { PropertyCard } from "../components/PropertyCard"
import { Card, CardContent } from "../components/Card"
import { Select } from "../components/ui/select"
import Input from "../components/Input"
import Button from "../components/Button"
import { Search, Filter, MapPin } from "lucide-react"
import toast from "react-hot-toast"

const propertyTypes = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
  { value: "villa", label: "Villa" },
  { value: "duplex", label: "Duplex" }
]

const bedroomOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4+ Bedrooms" }
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || "",
    property_type: searchParams.get('type') || "",
    min_price: searchParams.get('min_price') || "",
    max_price: searchParams.get('max_price') || "",
    bedrooms: searchParams.get('bedrooms') || "",
    bathrooms: searchParams.get('bathrooms') || ""
  })

  useEffect(() => {
    handleSearch()
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const { data, error } = await searchProperties(filters)
      if (error) throw error
      setProperties(data || [])
    } catch (error) {
      console.error('Error searching properties:', error)
      toast.error('Failed to search properties')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      location: "",
      property_type: "",
      min_price: "",
      max_price: "",
      bedrooms: "",
      bathrooms: ""
    })
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Search Properties</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-[#3730E1] text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Quick Search */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3730E1]"
              />
            </div>
            <Button onClick={handleSearch} className="px-8">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select
                placeholder="Property Type"
                options={propertyTypes}
                value={filters.property_type}
                onChange={(option) => handleFilterChange('property_type', option.value)}
              />
              
              <Select
                placeholder="Bedrooms"
                options={bedroomOptions}
                value={filters.bedrooms}
                onChange={(option) => handleFilterChange('bedrooms', option.value)}
              />
              
              <Input
                placeholder="Min Price (₦)"
                type="number"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
              />
              
              <Input
                placeholder="Max Price (₦)"
                type="number"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
              />
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleSearch}>Apply Filters</Button>
              <Button variant="secondary" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3730E1]"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
              </p>
            </div>

            {properties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or browse all available properties.
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}