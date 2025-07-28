"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "./ui/button"
import { DropdownMenu } from "./ui/dropdown-menu"

export default function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const { user, userProfile, signOut } = useAuth()

	const registerItems = [
		{ label: "As Renter", href: "/signup" },
		{ label: "As Owner", href: "/signup" },
	]

	const loginItems = [
		{ label: "As Renter", href: "/login" },
		{ label: "As Owner", href: "/login" },
	]

	const userMenuItems = user ? [
		{ label: "Dashboard", href: "/dashboard" },
		{ label: "Profile", href: "/profile" },
		{ label: "Sign Out", onClick: signOut },
	] : []
	return (
		<nav className="bg-white border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Mobile menu button */}
							<div className="flex md:hidden">
						<button
							type="button"
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="text-gray-700 hover:text-[#3730E1]"
						>
							<span className="sr-only">Open main menu</span>
							{isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
					{/* Logo */}
					<Link href="/" className="text-[#3730E1] text-2xl font-bold mr-auto ml-2">
						Rent4U
					</Link>

					{/* Mobile menu button */}
					<div className="flex md:hidden">
										<DropdownMenu trigger="Login" items={loginItems} />
					</div>

					{/* Desktop menu */}
					<div className="hidden md:flex md:items-center md:space-x-8">
						{user && userProfile?.user_type === 'owner' && (
							<Link href="/manage-rentals" className="text-gray-700 hover:text-[#3730E1]">
								Manage Rentals
							</Link>
						)}

						{!user && <DropdownMenu trigger="Register" items={registerItems} />}

						{user ? (
							<DropdownMenu 
								trigger={`Hi, ${userProfile?.first_name || 'User'}`} 
								items={userMenuItems} 
							/>
						) : (
							<DropdownMenu trigger="Login" items={loginItems} />
						)}

						{user && userProfile?.user_type === 'owner' && (
							<Link href="/properties/add" className="text-gray-700 hover:text-[#3730E1]">
								Add property
							</Link>
						)}
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1">
						<Link
							href="/manage-rentals"
							className="block px-3 py-2 text-gray-700 hover:text-[#3730E1] hover:bg-gray-50 rounded-md"
						>
							Manage Rentals
						</Link>

						<div className="px-3 py-2">
							<DropdownMenu trigger="Register" items={registerItems} className="relative" />
						</div>

						<div className="px-3 py-2">
							<DropdownMenu trigger="Login" items={loginItems} className="relative" />
						</div>

						<div className="px-3 py-2">
							<Button href="/add-property" className="w-full">
								Add property
							</Button>
						</div>
					</div>
				</div>
			)}
		</nav>
	)
}

