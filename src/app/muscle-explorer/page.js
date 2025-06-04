"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Target } from "lucide-react"
import { getTargetList, getExercisesByTarget } from "@/app/lib/api"

export default function MuscleExplorerPage() {
  const [selectedMuscle, setSelectedMuscle] = useState("")
  const [exercises, setExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [muscleGroups, setMuscleGroups] = useState([
    { name: "abs", color: "#ef4444", description: "Abdominal muscles" },
    { name: "biceps", color: "#3b82f6", description: "Front arm muscles" },
    { name: "triceps", color: "#10b981", description: "Back arm muscles" },
    { name: "pectorals", color: "#8b5cf6", description: "Chest muscles" },
    { name: "delts", color: "#f59e0b", description: "Shoulder muscles" },
    { name: "lats", color: "#6366f1", description: "Back muscles" },
    { name: "quads", color: "#ec4899", description: "Front thigh muscles" },
    { name: "hamstrings", color: "#f97316", description: "Back thigh muscles" },
    { name: "glutes", color: "#14b8a6", description: "Buttock muscles" },
    { name: "calves", color: "#06b6d4", description: "Calf muscles" },
    { name: "forearms", color: "#84cc16", description: "Lower arm muscles" },
    { name: "traps", color: "#f43f5e", description: "Upper back muscles" },
  ])

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const data = await getTargetList()
        const enhancedMuscleGroups = data.map((muscle) => {
          const existingMuscle = muscleGroups.find((m) => m.name === muscle)
          return (
            existingMuscle || {
              name: muscle,
              color: "#3b82f6",
              description: `${muscle.charAt(0).toUpperCase() + muscle.slice(1)} muscles`,
            }
          )
        })

        setMuscleGroups(enhancedMuscleGroups)
      } catch (error) {
        console.error("Error fetching targets:", error)
      }
    }

    fetchTargets()
  }, [])

  useEffect(() => {
    if (selectedMuscle) {
      setLoading(true)

      const fetchExercises = async () => {
        try {
          const data = await getExercisesByTarget(selectedMuscle)
          setExercises(data)
        } catch (error) {
          console.error("Error fetching exercises for target:", error)
          setExercises([])
        } finally {
          setLoading(false)
        }
      }

      fetchExercises()
    }
  }, [selectedMuscle])

  const filteredMuscles = muscleGroups.filter(
    (muscle) =>
      muscle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      muscle.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addToWorkout = (exercise) => {
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
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Target style={{ width: "2rem", height: "2rem", color: "#2563eb" }} />
              <h1>Muscle Explorer</h1>
            </div>
            <Link href="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
            {/* Muscle Selection */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Select Target Muscle</h3>
                  <p className="card-description">Choose a muscle group to see available exercises</p>
                </div>
                <div className="card-content">
                  <div style={{ marginBottom: "1rem" }}>
                    <input
                      placeholder="Search muscles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input"
                    />
                  </div>

                  <div className="muscle-selection">
                    {filteredMuscles.map((muscle) => (
                      <button
                        key={muscle.name}
                        onClick={() => setSelectedMuscle(muscle.name)}
                        className={`muscle-button ${selectedMuscle === muscle.name ? "selected" : ""}`}
                      >
                        <div className="muscle-info">
                          <div className="muscle-color" style={{ backgroundColor: muscle.color }}></div>
                          <div>
                            <div className="muscle-name">{muscle.name}</div>
                            <div className="muscle-description">{muscle.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Muscle Diagram Placeholder */}
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <div className="card-header">
                  <h3 className="card-title">Muscle Diagram</h3>
                </div>
                <div className="card-content">
                  <div className="muscle-diagram">
                    <div>
                      <Target style={{ width: "3rem", height: "3rem", marginBottom: "0.5rem" }} />
                      <p>Interactive muscle diagram</p>
                      <p style={{ fontSize: "0.875rem" }}>Coming soon!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Results */}
            <div>
              {!selectedMuscle ? (
                <div className="card">
                  <div className="card-content" style={{ textAlign: "center", padding: "3rem" }}>
                    <Target style={{ width: "4rem", height: "4rem", margin: "0 auto 1rem", color: "#9ca3af" }} />
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Select a Muscle Group
                    </h3>
                    <p style={{ color: "#6b7280" }}>
                      Choose a target muscle from the left panel to see available exercises
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                      {selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)} Exercises
                    </h2>
                    <p style={{ color: "#6b7280" }}>{loading ? "Loading..." : `${exercises.length} exercises found`}</p>
                  </div>

                  {loading ? (
                    <div className="exercise-grid">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="exercise-card">
                          <div className="exercise-image" style={{ background: "#e5e7eb" }}></div>
                          <div className="exercise-info">
                            <div
                              style={{
                                height: "1rem",
                                background: "#e5e7eb",
                                borderRadius: "0.25rem",
                                marginBottom: "0.5rem",
                              }}
                            ></div>
                            <div
                              style={{
                                height: "0.75rem",
                                background: "#e5e7eb",
                                borderRadius: "0.25rem",
                                width: "66%",
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : exercises.length === 0 ? (
                    <div className="card">
                      <div className="card-content" style={{ textAlign: "center", padding: "3rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                          No exercises found
                        </h3>
                        <p style={{ color: "#6b7280" }}>No exercises available for {selectedMuscle} muscle group</p>
                      </div>
                    </div>
                  ) : (
                    <div className="exercise-grid">
                      {exercises.map((exercise) => (
                        <div key={exercise.id} className="exercise-card">
                          <div className="exercise-image">
                            <img src={exercise.gifUrl || "/placeholder.svg"} alt={exercise.name} />
                          </div>

                          <div className="exercise-info">
                            <h3 className="exercise-title">{exercise.name}</h3>

                            <div className="exercise-badges">
                              <span className="badge badge-outline">{exercise.bodyPart}</span>
                              <span className="badge badge-outline">{exercise.equipment}</span>
                              <span className="badge badge-default">{exercise.target}</span>
                            </div>

                            <div className="exercise-actions">
                              <Link href={`/exercise/${exercise.id}`} className="btn btn-outline">
                                View Details
                              </Link>
                              <button onClick={() => addToWorkout(exercise)} className="btn btn-primary">
                                Add to Plan
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}