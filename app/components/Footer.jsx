import Link from "next/link"
import { Instagram, Twitter, Youtube, Facebook, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Social */}
          <div className="space-y-6">
            <Link href="/" className="text-[#3730E1] text-3xl font-bold">
              Rent4U
            </Link>
            <div className="flex space-x-4">
              <Link href="#" className="text-[#3730E1] hover:text-[#2820D9]">
                <Instagram className="w-6 h-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-[#3730E1] hover:text-[#2820D9]">
                <Twitter className="w-6 h-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-[#3730E1] hover:text-[#2820D9]">
                <Youtube className="w-6 h-6" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="#" className="text-[#3730E1] hover:text-[#2820D9]">
                <Facebook className="w-6 h-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-[#3730E1] hover:text-[#2820D9]">
                <Linkedin className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3730E1]">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#3730E1]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#3730E1]">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#3730E1]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Featured Locations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3730E1]">Featured Locations</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/locations/lagos-island" className="text-gray-600 hover:text-[#3730E1]">
                  Lagos Island
                </Link>
              </li>
              <li>
                <Link href="/locations/lagos-mainland" className="text-gray-600 hover:text-[#3730E1]">
                  Lagos Mainland
                </Link>
              </li>
              <li>
                <Link href="/locations/abuja" className="text-gray-600 hover:text-[#3730E1]">
                  Abuja
                </Link>
              </li>
              <li>
                <Link href="/locations/port-harcourt" className="text-gray-600 hover:text-[#3730E1]">
                  Port Harcourt
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#3730E1]">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#3730E1]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#3730E1]">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">Copyright © 2020 Minimumlivingcost. All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}

