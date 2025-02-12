import "./globals.css"
import { Inter } from "next/font/google"

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
        <main className="w-full">{children}</main>
      </body>
    </html>
  )
}

