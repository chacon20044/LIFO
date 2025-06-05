"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Dumbbell, Target, Calendar, Shuffle, BookOpen, Home } from "lucide-react"

export default function ExercisesHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/exercises", label: "Browse Exercises", icon: Dumbbell },
    { href: "/workout-plan", label: "My Workouts", icon: Calendar },
    { href: "/exercises/saved-plans", label: "Saved Plans", icon: BookOpen },
    { href: "/muscle-explorer", label: "Muscle Explorer", icon: Target },
    { href: "/equipment-mode", label: "Equipment Mode", icon: Dumbbell },
    { href: "/random-exercise", label: "Random Exercise", icon: Shuffle },
  ]

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Dumbbell className="logo-icon" />
            <h1>FitnessPro</h1>
          </div>
          <nav className="nav">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}>
                  <Icon className="nav-icon" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
