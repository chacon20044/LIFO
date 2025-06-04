"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DietsHeader() {
  const pathname = usePathname()

  const navItems = [
    { href: "/diets", label: "Register", icon: "📝" },
    { href: "/diets/browse", label: "Your Foods", icon: "🍽️" },
    { href: "/diets/properties", label: "Properties", icon: "🏷️" },
    { href: "/diets/browse2", label: "Browse", icon: "🔍" },
  ]

  return (
    <nav className="sub-nav">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={`sub-nav-link ${pathname === item.href ? "active" : ""}`}>
          <span className="sub-nav-icon">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
