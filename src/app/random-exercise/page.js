"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Shuffle, RefreshCw, Plus, Filter } from "lucide-react"
import { getAllExercises, getBodyPartList, getEquipmentList, getTargetList } from "@/app/lib/api"


export default function RandomExercisePage() {
  const [currentExercise, setCurrentExercise] = useState(null)
  const [filterBodyPart, setFilterBodyPart] = useState("")
  const [filterEquipment, setFilterEquipment] = useState("")
  const [filterTarget, setFilterTarget] = useState("")
  const [exerciseHistory, setExerciseHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [bodyParts, setBodyParts] = useState([])
  const [equipment, setEquipment] = useState([])
  const [targets, setTargets] = useState([])
  const [exercisePool, setExercisePool] = useState([])

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("exerciseHistory") || "[]")
    setExerciseHistory(history)

    const fetchData = async () => {
      try {
        const [bodyPartsData, equipmentData, targetsData, allExercises] = await Promise.all([
          getBodyPartList(),
          getEquipmentList(),
          getTargetList(),
          getAllExercises(),
        ])

        setBodyParts(bodyPartsData)
        setEquipment(equipmentData)
        setTargets(targetsData)
        setExercisePool(allExercises)

        generateRandomExercise(allExercises)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const generateRandomExercise = (pool = exercisePool) => {
    setLoading(true)

    let filteredExercises = pool

    if (filterBodyPart) {
      filteredExercises = filteredExercises.filter((ex) => ex.bodyPart === filterBodyPart)
    }
    if (filterEquipment) {
      filteredExercises = filteredExercises.filter((ex) => ex.equipment === filterEquipment)
    }
    if (filterTarget) {
      filteredExercises = filteredExercises.filter((ex) => ex.target === filterTarget)
    }

    const recentIds = exerciseHistory.slice(-3).map((ex) => ex.id)
    const nonRecentExercises = filteredExercises.filter((ex) => !recentIds.includes(ex.id))
    const availableExercises = nonRecentExercises.length > 0 ? nonRecentExercises : filteredExercises

    if (availableExercises.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableExercises.length)
      const selectedExercise = availableExercises[randomIndex]

      setTimeout(() => {
        setCurrentExercise(selectedExercise)

        const newHistory = [selectedExercise, ...exerciseHistory].slice(0, 10)
        setExerciseHistory(newHistory)
        localStorage.setItem("exerciseHistory", JSON.stringify(newHistory))

        setLoading(false)
      }, 800)
    } else {
      setCurrentExercise(null)
      setLoading(false)
    }
  }

  const addToWorkout = () => {
    if (!currentExercise) return

    const savedWorkouts = JSON.parse(localStorage.getItem("workoutPlan") || "[]")
    const isAlreadyAdded = savedWorkouts.some((item) => item.id === currentExercise.id)

    if (!isAlreadyAdded) {
      savedWorkouts.push({
        ...currentExercise,
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

  const clearFilters = () => {
    setFilterBodyPart("")
    setFilterEquipment("")
    setFilterTarget("")
  }

  return (
    <div className="random-exercise-container">
      {/* Header */}
      <header className="random-exercise-header">
        <div className="container">
          <div className="header-content">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Shuffle className="logo-icon" />
              <h1>Random Exercise Generator</h1>
            </div>
            <Link href="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container" style={{ maxWidth: "1000px" }}>
          {/* Filters */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Filter className="icon" />
                Exercise Filters (Optional)
              </h3>
              <p className="card-description">Narrow down the random selection by choosing specific criteria</p>
            </div>
            <div className="card-content">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <select value={filterBodyPart} onChange={(e) => setFilterBodyPart(e.target.value)} className="select">
                  <option value="">Any Body Part</option>
                  {bodyParts.map((part) => (
                    <option key={part} value={part}>
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </option>
                  ))}
                </select>

                <select value={filterEquipment} onChange={(e) => setFilterEquipment(e.target.value)} className="select">
                  <option value="">Any Equipment</option>
                  {equipment.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq.charAt(0).toUpperCase() + eq.slice(1)}
                    </option>
                  ))}
                </select>

                <select value={filterTarget} onChange={(e) => setFilterTarget(e.target.value)} className="select">
                  <option value="">Any Target Muscle</option>
                  {targets.map((target) => (
                    <option key={target} value={target}>
                      {target.charAt(0).toUpperCase() + target.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {(filterBodyPart || filterEquipment || filterTarget) && (
                <div className="active-filters">
                  <div className="filter-badges">
                    {filterBodyPart && <span className="badge badge-secondary">Body: {filterBodyPart}</span>}
                    {filterEquipment && <span className="badge badge-secondary">Equipment: {filterEquipment}</span>}
                    {filterTarget && <span className="badge badge-secondary">Target: {filterTarget}</span>}
                  </div>
                  <button onClick={clearFilters} className="btn btn-outline">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Random Exercise Display */}
          <div className="card">
            <div className="card-header" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Today's Random Exercise</h3>
              <p className="card-description">Discover something new for your workout routine</p>
            </div>
            <div className="card-content">
              {loading ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <div className="spinner" style={{ margin: "0 auto 1rem" }}></div>
                  <p style={{ fontSize: "1.125rem" }}>Generating your random exercise...</p>
                </div>
              ) : currentExercise ? (
                <div className="exercise-preview">
                  {/* Exercise Image and Info */}
                  <div>
                    <div className="exercise-preview-image">
                      <img src={currentExercise.gifUrl || "/placeholder.svg"} alt={currentExercise.name} />
                    </div>

                    <div className="exercise-preview-info">
                      <h3>{currentExercise.name}</h3>

                      <div className="exercise-preview-section">
                        <h4>Target Muscles</h4>
                        <div className="badge-group">
                          <span className="badge" style={{ background: "#e0e7ff", color: "#3730a3" }}>
                            {currentExercise.target}
                          </span>
                          {currentExercise.secondaryMuscles?.map((muscle) => (
                            <span key={muscle} className="badge badge-outline">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="exercise-preview-section">
                        <h4>Equipment & Body Part</h4>
                        <div className="badge-group">
                          <span className="badge badge-outline">{currentExercise.equipment}</span>
                          <span className="badge badge-outline">{currentExercise.bodyPart}</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button onClick={addToWorkout} className="btn btn-primary" style={{ flex: 1 }}>
                          <Plus className="icon" />
                          Add to Plan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  <div>
                    <div className="quick-instructions">
                      <h4 style={{ fontWeight: "600", marginBottom: "0.75rem" }}>Quick Instructions</h4>
                      <div style={{ marginBottom: "1.5rem" }}>
                        {currentExercise.instructions?.slice(0, 3).map((instruction, index) => (
                          <div key={index} className="instruction-step">
                            <span className="step-circle">{index + 1}</span>
                            <p>{instruction}</p>
                          </div>
                        )) || <p>No instructions available.</p>}
                        {currentExercise.instructions?.length > 3 && (
                          <p style={{ fontSize: "0.875rem", color: "#6b7280", fontStyle: "italic" }}>
                            +{currentExercise.instructions.length - 3} more steps...
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="daily-tip">
                      <h5>💡 Daily Tip</h5>
                      <p>
                        Focus on proper form over speed. Quality repetitions are more effective than rushed movements.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>No exercises found</h3>
                  <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
                    Try adjusting your filters or clearing them completely
                  </p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <button onClick={() => generateRandomExercise()} className="generate-button btn" disabled={loading}>
              <RefreshCw className={`icon ${loading ? "loading-icon" : ""}`} />
              Generate New Exercise
            </button>
          </div>

          {/* Exercise History */}
          {exerciseHistory.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Random Exercises</h3>
                <p className="card-description">Your last few randomly generated exercises</p>
              </div>
              <div className="card-content">
                <div className="exercise-history-grid">
                  {exerciseHistory.slice(0, 6).map((exercise, index) => (
                    <div key={`${exercise.id}-${index}`} className="history-item">
                      <div className="history-item-content">
                        <div className="history-item-image">
                          <img src={exercise.gifUrl || "/placeholder.svg"} alt={exercise.name} />
                        </div>
                        <div className="history-item-info">
                          <h4 className="history-item-name">{exercise.name}</h4>
                          <div className="history-item-badges">
                            <span className="badge badge-outline">{exercise.target}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
