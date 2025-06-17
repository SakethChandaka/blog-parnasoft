import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat'
})

export const metadata: Metadata = {
  title: 'Parnasoft Blog - Insights & Innovation',
  description: 'Discover the latest insights, trends, and innovations in technology from the Parnasoft team.',
  keywords: 'technology, blog, insights, innovation, development, parnasoft',
  authors: [{ name: 'Parnasoft Technologies' }],
  openGraph: {
    title: 'Parnasoft Blog - Insights & Innovation',
    description: 'Discover the latest insights, trends, and innovations in technology from the Parnasoft team.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.className} ${montserrat.variable} antialiased bg-white min-h-screen`}>
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_4px_1px_-1px_#00d8e8] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[white] rounded-lg flex items-center justify-center">
                  <img src="blue-dark.png" alt="#" />
                </div>
                <span className="font-bold text-[#1e3a4b] text-xl">Parnasoft Blog</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-20 mb-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#1e3a4b] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-[#1e3a4b] rounded-lg flex items-center justify-center">
                    <img src="blue-white.png" alt="#" />
                  </div>
                  <span className="font-bold text-xl">Parnasoft Blog</span>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  Sharing insights, innovations, and expertise in technology to help businesses and developers stay ahead of the curve.
                </p>
                <div className="flex space-x-4">
                  <a href="https://www.linkedin.com/company/parnasoft-technologies-pvt-ltd" target="_blank" className="text-gray-400 hover:text-[#00d8e8] transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-[#00d8e8]">Quick Links</h3>
                <ul className="space-y-2">
                  <li className="link-res"><a href="#" className="text-md">Main Hub</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-[#00d8e8]">Categories</h3>
                <ul className="space-y-2">
                  <li className="link-res"><a href="#Cloud Computing" className="">Technology</a></li>
                  <li className="link-res"><a href="#Backend" className="">Development</a></li>
                  <li className="link-res"><a href="#Architecture" className="">Design</a></li>
                  <li className="link-res"><a href="#AI & Technology" className="">Innovation</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Parnasoft Technologies. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}