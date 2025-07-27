import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "./contexts/AuthContext"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Rent4U",
  description: "Your one-stop solution for property rentals",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AuthProvider>
          <main className="w-full">{children}</main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  )
}

