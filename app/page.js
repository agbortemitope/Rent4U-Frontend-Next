
import { Footer } from "./components/Footer"
import { PropertyCard } from "./components/PropertyCard"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"

const properties = [
 {
  id: 1,
  title: "Luxury villa in Rego Park",
  price: 750000,
  period: "/Year",
  status: "For Rent",
  image: "/public/hero.png",
  bedrooms: 4,
  bathrooms: 4,
  features: 4,
  hasWifi: true,
  owner: {
   name: "Tee Tops",
   role: "Property Owner",
   avatar: "/placeholder.svg?height=40&width=40",
  },
 },
 {
  id: 2,
  title: "Luxury villa in Rego Park",
  price: 150000,
  period: "/Monthly",
  status: "To Let",
  image: "/public/image.png",
  bedrooms: 4,
  bathrooms: 4,
  features: 4,
  hasWifi: true,
  owner: {
   name: "Tee Tops",
   role: "Property Owner",
   avatar: "/placeholder.svg?height=40&width=40",
  },
 },
 {
  id: 3,
  title: "Luxury villa in Rego Park",
  price: 750000,
  period: "/Year",
  status: "For Rent",
  image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400",
  bedrooms: 4,
  bathrooms: 4,
  features: 4,
  hasWifi: false,
  owner: {
   name: "Tee Tops",
   role: "Property Owner",
   avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40",
  },
 },
]

export default function Home() {
 return (
  <>
   <main >
    <Header />
    {/* Hero Section */}
    <section
     className="min-h-screen flex items-center justify-center bg-black relative"    >
     <div className="absolute inset-0 bg-black/10" />
     <div className="relative w-full max-w-[62rem] flex flex-col justify-center items-center h-full z-10 text-center text-white space-y-6 px-4">
      <h1 className="text-4xl md:text-6xl font-bold flex md:flex-row gap-2 flex-col">Discover Your
       <span className="text-[#3730E1]">Perfect Rental</span>
      </h1>
      <p className="text-xl md:text-2xl max-w-80 md:max-w-full mx-auto">
       Find the right fit for you in a pool of perfect fits.</p>
      <SearchBar />
     </div>
    </section>

    {/* Property Listings Section */}
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
     <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-2">
       <h2 className="text-3xl md:text-4xl font-bold">Explore Listings in Lagos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
       ))}
      </div>
      <div className="flex justify-center"> <button className="bg-[#3730E1] hover:bg-[#2820D9] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors w-fit mx-auto">
       View More
      </button></div>
     </div>
    </section>

    {/* Renting Made Simple Section */}
    <section className="py-16 px-4 md:px-6 lg:px-8">
     <div className="max-w-7xl mx-auto">
      <div className="rounded-2xl overflow-hidden grid md:grid-cols-2 gap-8 bg-white shadow-md">
       <div className="p-8 md:p-12 flex flex-col justify-center">
        <h2 className="text-[#3730E1] text-4xl md:text-5xl font-bold mb-6">Renting Made Simple</h2>
        <p className="text-gray-700 text-xl md:text-2xl leading-relaxed mb-8">
         Browse The Highest Quality Listings, Apply Online, Sign Your Lease, And Even Pay Your Rent From Any
         Device.
        </p>
        <button className="bg-[#3730E1] hover:bg-[#2820D9] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors w-fit">
         View More
        </button>
       </div>
       <div className="relative h-[400px] md:h-auto">
        <img
         src="/"
         alt="Modern living room with pool view"
         className="w-full h-full object-cover"
        />
       </div>
      </div>
     </div>
    </section>

    <section className="py-16 px-4 md:px-6 lg:px-8">
     <div className="max-w-7xl mx-auto">
      <div className="rounded-2xl overflow-hidden grid md:grid-cols-2 gap-8 bg-white shadow-md">
       <div className="relative h-[400px] md:h-auto">
        <img
         src="/"
         alt="Modern living room with pool view"
         className="w-full h-full object-cover"
        />
       </div>
       <div className="p-8 md:p-12 flex flex-col justify-center">
        <h2 className="text-[#3730E1] text-4xl md:text-5xl font-bold mb-6">Renting Made Simple</h2>
        <p className="text-gray-700 text-xl md:text-2xl leading-relaxed mb-8">
         Browse The Highest Quality Listings, Apply Online, Sign Your Lease, And Even Pay Your Rent From Any
         Device.
        </p>
        <button className="bg-[#3730E1] hover:bg-[#2820D9] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors w-fit">
         View More
        </button>
       </div>

      </div>
     </div>
    </section>



    {/* Locations Section */}
    <section className="py-16 px-4 md:px-6 lg:px-8 space-y-12">
     <div className="max-w-7xl mx-auto">
      <div className="text-left space-y-2 mb-12">
       <h2 className="text-3xl md:text-4xl font-bold">Listing in Lagos</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
       {[
        "Lagos Island",
        "Lagos Mainland",
        "Victoria Island",
        "Badagry",
        "Ikoyi",
        "Lekki",
        "Ajah",
        "Ikeja",
        "Surulere",
        "Yaba",
        "Gbagada",
        "Ikorodu",
        "Apapa",
        "Oshodi",
        "Magodo",
        "Ogudu",
       ].map((location) => (
        <button
         key={location}
         className="py-1 text-left font-semibold"
        >
         {location}
        </button>
       ))}
      </div>
     </div>
     <div className="max-w-7xl mx-auto">
      <div className="text-left space-y-2 mb-12">
       <h2 className="text-3xl md:text-4xl font-bold">Listing in Abuja</h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
       {[
        "Lagos Island",
        "Lagos Mainland",
        "Victoria Island",
        "Badagry",
        "Ikoyi",
        "Lekki",
        "Ajah",
        "Ikeja",
        "Surulere",
        "Yaba",
        "Gbagada",
        "Ikorodu",
        "Apapa",
        "Oshodi",
        "Magodo",
        "Ogudu",
       ].map((location) => (
        <button
         key={location}
         className="py-1 text-left font-semibold"

        >
         {location}
        </button>
       ))}
      </div>
     </div>
    </section>
   </main>
   <Footer />
  </>
 )
}

