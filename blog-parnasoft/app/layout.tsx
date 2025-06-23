'use client'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useState } from 'react'
import { usePathname } from 'next/navigation';


const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat'
})

// Navigation component that uses auth context
function Navigation() {
  const { user, logout, loading } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname();
  
  // Default to anonymous if no user or still loading
  const userType = user?.userType || 'anonymous'

  const handleLogout = async () => {
    await logout()
    window.location.href = '/' // Redirect to home page
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const closeUserMenu = () => {
    setIsUserMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-[0_4px_1px_-1px_#00d8e8] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[white] rounded-lg flex items-center justify-center">
              <img src="/blue-dark.png" alt="Parnasoft" />
            </div>
            <span className="font-bold text-sm md:text-lg lg:text-xl text-[#1e3a4b]">Parnasoft Blog</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Login Button - Only visible for anonymous users */}
            {userType === 'anonymous' && !loading && pathname !== '/login'&& (
              <a
                href="/login"
                className="inline-flex items-center px-2 py-2 bg-gradient-to-r from-[#00d8e8] to-[#00c4d4] text-white text-xs md:text-sm lg:text-base font-semibold rounded-lg hover:from-[#00c4d4] hover:to-[#00b8c8] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </a>
            )}

            {/* Desktop: Admin Button - Only visible for admin users on md+ screens */}
            {(userType === 'admin' || userType === 'super_admin') && (
              <a
                href="/admin"
                className={`hidden md:inline-flex items-center px-2 py-2 text-white text-xs md:text-sm lg:text-base font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  userType === 'super_admin' 
                    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#6d28d9]' 
                    : 'bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#e08912]'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {userType === 'super_admin' ? 'Super Admin Panel' : 'Admin Panel'}
              </a>
            )}

            {/* User Menu - Only visible for authenticated users */}
            {userType !== 'anonymous' && user && (
              <div className="relative">
                {/* Desktop User Info + Logout Button */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      userType === 'super_admin' 
                        ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]' 
                        : userType === 'admin'
                        ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                        : 'bg-gradient-to-r from-[#00d8e8] to-[#00c4d4]'
                    }`}>
                      <span className="text-white text-xs md:text-sm lg:text-base font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs md:text-sm lg:text-base">
                      <p className="text-sm font-semibold text-[#1e3a4b]">{user.name || user.email}</p>
                      <p className="hidden lg:block text-xs text-gray-600 capitalize">
                        {userType === 'super_admin' ? 'Super Admin' : userType}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 bg-gray-500 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-all duration-200"
                    title="Sign Out"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>

                {/* Mobile User Menu Button */}
                <div className="md:hidden">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 px-2 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      userType === 'super_admin' 
                        ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]' 
                        : userType === 'admin'
                        ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                        : 'bg-gradient-to-r from-[#00d8e8] to-[#00c4d4]'
                    }`}>
                      <span className="text-white text-sm font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Mobile Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40 bg-tansparent bg-opacity-25" 
                        onClick={closeUserMenu}
                      ></div>
                      
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              userType === 'super_admin' 
                                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]' 
                                : userType === 'admin'
                                ? 'bg-gradient-to-r from-[#ef4444] to-[#dc2626]'
                                : 'bg-gradient-to-r from-[#00d8e8] to-[#00c4d4]'
                            }`}>
                              <span className="text-white text-lg font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-[#1e3a4b]">{user.name || user.email}</p>
                              <p className="text-sm text-gray-600 capitalize">
                                {userType === 'super_admin' ? 'Super Admin' : userType}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {/* Admin Panel Link - Only for admin users */}
                          {(userType === 'admin' || userType === 'super_admin') && (
                            <a
                              href="/admin"
                              onClick={closeUserMenu}
                              className={`flex items-center px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors ${
                                userType === 'super_admin' 
                                  ? 'text-[#8b5cf6]' 
                                  : 'text-[#ff6b35]'
                              }`}
                            >
                              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {userType === 'super_admin' ? 'Super Admin Panel' : 'Admin Panel'}
                            </a>
                          )}

                          {/* Logout Button */}
                          <button
                            onClick={() => {
                              closeUserMenu()
                              handleLogout()
                            }}
                            className="flex items-center w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* User Type Indicator (for development) */}
            {process.env.NODE_ENV === 'development' && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
                {userType} {user && `(${user.email})`}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/png" href="/blue-white.png" />
        <title>Parnasoft Blog</title>
      </head>
      <body className={`${montserrat.className} ${montserrat.variable} antialiased bg-white min-h-screen`}>
        <AuthProvider>
          {/* Navigation */}
          <Navigation />

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
                      <img src="/blue-white.png" alt="Parnasoft" />
                    </div>
                    <span className="font-bold text-xl">Parnasoft Blog</span>
                  </div>
                  <p className="text-white mb-6 max-w-md font-semibold text-sm">
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
                  <h3 className="font-semibold text-lg mb-4 text-[#00d8e8]">QUICK LINKS</h3>
                  <ul className="space-y-2">
                    <li className="link-res font-semibold text-sm"><a href="https://parnasoft.com" target="_blank" className="text-md">Main Hub</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-[#00d8e8]">CATEGORIES</h3>
                  <ul className="space-y-2">
                    <li className="link-res font-semibold text-sm"><a href="#Cloud Computing" className="">Technology</a></li>
                    <li className="link-res font-semibold text-sm"><a href="#Backend" className="">Development</a></li>
                    <li className="link-res font-semibold text-sm"><a href="#Architecture" className="">Design</a></li>
                    <li className="link-res font-semibold text-sm"><a href="#AI & Technology" className="">Innovation</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400 font-semibold text-sm">
                <p>&copy; 2025 Parnasoft Technologies. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}