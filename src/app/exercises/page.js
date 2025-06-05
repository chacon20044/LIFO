"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dumbbell, Target, Calendar, Shuffle } from "lucide-react"
import { getAllExercises, getBodyPartList, getEquipmentList, getTargetList } from "@/app/lib/api"

export default function HomePage() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const exercisesData = await getAllExercises()
        setExercises(exercisesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Dumbbell className="loading-icon" />
          <p>Loading exercises...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link href="/" className="logo flex items-center gap-2 cursor-pointer hover:text-blue-500 transition-colors">
              <Dumbbell className="logo-icon" />
              <h1>FitnessPro</h1>
            </Link>
            <nav className="nav">
              <Link href="/workout-plan" className="nav-link">
                My Workouts
              </Link>
              <Link href="/exercises/saved-plans" className="nav-link">
                Saved Plans
              </Link>
              <Link href="/muscle-explorer" className="nav-link">
                Muscle Explorer
              </Link>
              <Link href="/equipment-mode" className="nav-link">
                Equipment Mode
              </Link>
              <Link href="/random-exercise" className="nav-link">
                Random Exercise
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* Hero Section */}
          <div className="hero">
            <h2>Discover Your Perfect Workout</h2>
            <p>Search through thousands of exercises and build your custom workout plan</p>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <Link href="/muscle-explorer" className="action-card">
              <Target className="action-icon" />
              <h3>Muscle Explorer</h3>
              <p>Target specific muscles</p>
            </Link>

            <Link href="/workout-plan" className="action-card">
              <Calendar className="action-icon" />
              <h3>My Workout Plan</h3>
              <p>Build custom workouts</p>
            </Link>

            <Link href="/equipment-mode" className="action-card">
              <Dumbbell className="action-icon" />
              <h3>Equipment Mode</h3>
              <p>Filter by available equipment</p>
            </Link>

            <Link href="/random-exercise" className="action-card">
              <Shuffle className="action-icon" />
              <h3>Random Exercise</h3>
              <p>Get a surprise workout</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
