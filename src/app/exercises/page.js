"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Dumbbell, Target, Calendar, Shuffle } from "lucide-react"
import { getAllExercises, getBodyPartList, getEquipmentList, getTargetList } from "@/app/lib/api"

export default function HomePage() {
  const [exercises, setExercises] = useState([])
  const [filteredExercises, setFilteredExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBodyPart, setSelectedBodyPart] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState("")
  const [selectedTarget, setSelectedTarget] = useState("")
  const [bodyParts, setBodyParts] = useState([])
  const [equipment, setEquipment] = useState([])
  const [targets, setTargets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [exercisesData, bodyPartsData, equipmentData, targetsData] = await Promise.all([
          getAllExercises(),
          getBodyPartList(),
          getEquipmentList(),
          getTargetList(),
        ])

        setExercises(exercisesData)
        setFilteredExercises(exercisesData)
        setBodyParts(bodyPartsData)
        setEquipment(equipmentData)
        setTargets(targetsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = exercises

    if (searchTerm) {
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedBodyPart) {
      filtered = filtered.filter((exercise) => exercise.bodyPart === selectedBodyPart)
    }

    if (selectedEquipment) {
      filtered = filtered.filter((exercise) => exercise.equipment === selectedEquipment)
    }

    if (selectedTarget) {
      filtered = filtered.filter((exercise) => exercise.target === selectedTarget)
    }

    setFilteredExercises(filtered)
  }, [searchTerm, selectedBodyPart, selectedEquipment, selectedTarget, exercises])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedBodyPart("")
    setSelectedEquipment("")
    setSelectedTarget("")
  }

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
            <div className="logo">
              <Dumbbell className="logo-icon" />
              <h1>FitnessPro</h1>
            </div>
            <nav className="nav">
              <Link href="/workout-plan" className="nav-link">
                My Workouts
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

          {/* Search and Filters */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Search className="icon" />
                Search & Filter Exercises
              </h3>
            </div>
            <div className="card-content">
              <div className="filters">
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input search-input"
                />

                <select
                  value={selectedBodyPart}
                  onChange={(e) => setSelectedBodyPart(e.target.value)}
                  className="select"
                >
                  <option value="">Body Part</option>
                  {bodyParts.map((part) => (
                    <option key={part} value={part}>
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="select"
                >
                  <option value="">Equipment</option>
                  {equipment.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq.charAt(0).toUpperCase() + eq.slice(1)}
                    </option>
                  ))}
                </select>

                <select value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)} className="select">
                  <option value="">Target Muscle</option>
                  {targets.map((target) => (
                    <option key={target} value={target}>
                      {target.charAt(0).toUpperCase() + target.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedBodyPart || selectedEquipment || selectedTarget || searchTerm) && (
                <div className="active-filters">
                  <div className="filter-badges">
                    {searchTerm && <span className="badge badge-secondary">Search: {searchTerm}</span>}
                    {selectedBodyPart && <span className="badge badge-secondary">Body: {selectedBodyPart}</span>}
                    {selectedEquipment && <span className="badge badge-secondary">Equipment: {selectedEquipment}</span>}
                    {selectedTarget && <span className="badge badge-secondary">Target: {selectedTarget}</span>}
                  </div>
                  <button onClick={clearFilters} className="btn btn-outline">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
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

          {/* Exercise Results */}
          <div className="results-header">
            <h3>Exercises ({filteredExercises.length})</h3>
          </div>

          <div className="exercise-grid">
            {filteredExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>

          {filteredExercises.length === 0 && (
            <div className="no-results">
              <p>No exercises found matching your criteria.</p>
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function ExerciseCard({ exercise }) {
  const addToWorkout = () => {
    const savedWorkouts = JSON.parse(localStorage.getItem("workoutPlan") || "[]")
    const isAlreadyAdded = savedWorkouts.some((item) => item.id === exercise.id)

    if (!isAlreadyAdded) {
      savedWorkouts.push({
        ...exercise,
        sets: 3,
        reps: 12,
        duration: null,
      })
      localStorage.setItem("workoutPlan", JSON.stringify(savedWorkouts))
      alert("Exercise added to your workout plan!")
    } else {
      alert("Exercise is already in your workout plan!")
    }
  }

  return (
    <div className="exercise-card">
      <div className="exercise-image">
        <img src={exercise.gifUrl || "/placeholder.svg"} alt={exercise.name} />
      </div>
      <div className="exercise-info">
        <h3 className="exercise-title">{exercise.name}</h3>
        <div className="exercise-badges">
          <span className="badge badge-outline">{exercise.bodyPart}</span>
          <span className="badge badge-outline">{exercise.target}</span>
          <span className="badge badge-outline">{exercise.equipment}</span>
        </div>
        <div className="exercise-actions">
          <Link href={`/exercise/${exercise.id}`} className="btn btn-outline">
            View Details
          </Link>
          <button onClick={addToWorkout} className="btn btn-primary">
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  )
}