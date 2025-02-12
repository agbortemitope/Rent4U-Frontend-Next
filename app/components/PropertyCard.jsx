import { Heart, Car, Bath, Sun, Wifi } from "lucide-react"
import Image from "next/image"

export function PropertyCard({ property }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative">
        <Image
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          width={400}
          height={300}
          className="w-full h-[250px] object-cover"
        />
        <span className="absolute top-4 right-4 bg-[#82C341] text-white px-4 py-1 rounded-full text-sm font-medium">
          {property.status}
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <p className="text-[#3730E1] font-medium">
            NGN {property.price.toLocaleString()}
            {property.period}
          </p>
          <h3 className="text-xl font-semibold">{property.title}</h3>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            <span>{property.bedrooms}</span>
          </div> |
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms}</span>
          </div> |
          <div className="flex items-center gap-1">
            <Sun className="w-4 h-4" />
            <span>{property.features}</span>
          </div> 
          {property.hasWifi && (
            <div className="flex items-center gap-1">
             | <Wifi className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Image
              src={property.owner.avatar || "/placeholder.svg"}
              alt={property.owner.name}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-medium">{property.owner.name}</p>
              <p className="text-sm text-gray-600">{property.owner.role}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

