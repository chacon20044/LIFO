"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"
import { Dumbbell, Apple, Home, LogOut, LogIn } from "lucide-react"

export default function Header() {
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-icon">💪</div>
            <span className="logo-text">Lifo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link href="/" className="nav-link">
              <Home className="nav-icon" />
              Home
            </Link>
            <Link href="/exercises" className="nav-link">
              <Dumbbell className="nav-icon" />
              Exercises
            </Link>
            <Link href="/diets" className="nav-link">
              <Apple className="nav-icon" />
              Diets
            </Link>
          </nav>

          {/* User Section */}
          <div className="user-section">
            {user ? (
              <div className="user-info">
                <div className="user-avatar">
                  <img
                    src={user?.user_metadata?.avatar_url || "/placeholder.svg?height=40&width=40"}
                    alt="Profile"
                    className="avatar-image"
                  />
                </div>
                <div className="user-details">
                  <span className="user-email">{user.email}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    <LogOut className="btn-icon" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={handleLogin} className="login-btn">
                <LogIn className="btn-icon" />
                Sign In with Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            <Link href="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <Home className="nav-icon" />
              Home
            </Link>
            <Link href="/exercises" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <Dumbbell className="nav-icon" />
              Exercises
            </Link>
            <Link href="/diets" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <Apple className="nav-icon" />
              Diets
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}