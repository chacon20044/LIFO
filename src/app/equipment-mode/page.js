"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dumbbell, X } from "lucide-react"
import { getEquipmentList, getExercisesByEquipment } from "@/app/lib/api"


export default function EquipmentModePage() {
  const [availableEquipment, setAvailableEquipment] = useState([])
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(false)
  const [allEquipment, setAllEquipment] = useState([
    { name: "body weight", icon: "🏃", description: "No equipment needed" },
    { name: "dumbbell", icon: "🏋️", description: "Adjustable weights" },
    { name: "barbell", icon: "🏋️‍♂️", description: "Long bar with weights" },
    { name: "resistance band", icon: "🎗️", description: "Elastic bands" },
    { name: "kettlebell", icon: "⚖️", description: "Ball-shaped weights" },
    { name: "cable", icon: "🔗", description: "Cable machine" },
    { name: "medicine ball", icon: "⚽", description: "Weighted ball" },
    { name: "stability ball", icon: "🏐", description: "Exercise ball" },
    { name: "rope", icon: "🪢", description: "Jump rope or battle rope" },
    { name: "assisted", icon: "🤝", description: "Machine assisted" },
    { name: "leverage machine", icon: "⚙️", description: "Leverage equipment" },
    { name: "smith machine", icon: "🏗️", description: "Guided barbell" },
  ])

  useEffect(() => {
    const fetchEquipmentList = async () => {
      try {
        const data = await getEquipmentList()
        const enhancedEquipment = data.map((eq) => {
          const existingEquipment = allEquipment.find((e) => e.name === eq)
          return (
            existingEquipment || {
              name: eq,
              icon: "🏋️",
              description: `${eq.charAt(0).toUpperCase() + eq.slice(1)} equipment`,
            }
          )
        })

        setAllEquipment(enhancedEquipment)
      } catch (error) {
        console.error("Error fetching equipment list:", error)
      }
    }

    fetchEquipmentList()
  }, [])

  useEffect(() => {
    if (availableEquipment.length > 0) {
      setLoading(true)

      const fetchExercisesForEquipment = async () => {
        try {
          const promises = availableEquipment.map((eq) => getExercisesByEquipment(eq))
          const results = await Promise.all(promises)

          const allExercises = []
          const exerciseIds = new Set()

          results.forEach((equipmentExercises) => {
            equipmentExercises.forEach((exercise) => {
              if (!exerciseIds.has(exercise.id)) {
                exerciseIds.add(exercise.id)
                allExercises.push(exercise)
              }
            })
          })

          setExercises(allExercises)
        } catch (error) {
          console.error("Error fetching exercises for equipment:", error)
          setExercises([])
        } finally {
          setLoading(false)
        }
      }

      fetchExercisesForEquipment()
    } else {
      setExercises([])
    }
  }, [availableEquipment])

  const toggleEquipment = (equipmentName) => {
    setAvailableEquipment((prev) =>
      prev.includes(equipmentName) ? prev.filter((eq) => eq !== equipmentName) : [...prev, equipmentName],
    )
  }

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
              <Dumbbell style={{ width: "2rem", height: "2rem", color: "#2563eb" }} />
              <h1>Equipment Mode</h1>
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
            {/* Equipment Selection */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Available Equipment</h3>
                  <p className="card-description">Select the equipment you have access to</p>
                </div>
                <div className="card-content">
                  <div className="equipment-selection">
                    {allEquipment.map((equipment) => (
                      <div
                        key={equipment.name}
                        className={`equipment-item ${availableEquipment.includes(equipment.name) ? "selected" : ""}`}
                        onClick={() => toggleEquipment(equipment.name)}
                      >
                        <input
                          type="checkbox"
                          checked={availableEquipment.includes(equipment.name)}
                          onChange={() => toggleEquipment(equipment.name)}
                          className="checkbox"
                        />
                        <div className="equipment-info">
                          <span className="equipment-icon">{equipment.icon}</span>
                          <div>
                            <div className="equipment-name">{equipment.name}</div>
                            <div className="equipment-description">{equipment.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {availableEquipment.length > 0 && (
                    <div className="selected-equipment">
                      <h4>Selected Equipment:</h4>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                        {availableEquipment.map((equipment) => (
                          <span key={equipment} className="badge badge-secondary">
                            {equipment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="card" style={{ marginTop: "1.5rem" }}>
                <div className="card-header">
                  <h3 className="card-title">Quick Presets</h3>
                </div>
                <div className="card-content">
                  <div className="preset-buttons">
                    <button className="btn btn-outline" onClick={() => setAvailableEquipment(["body weight"])}>
                      🏠 Home Workout (Body Weight Only)
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => setAvailableEquipment(["body weight", "dumbbell", "resistance band"])}
                    >
                      🏋️ Basic Home Gym
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => setAvailableEquipment(["barbell", "dumbbell", "cable", "smith machine"])}
                    >
                      🏢 Full Gym Access
                    </button>
                    <button className="btn btn-outline" onClick={() => setAvailableEquipment([])}>
                      <X className="icon" />
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Results */}
            <div>
              {availableEquipment.length === 0 ? (
                <div className="card">
                  <div className="card-content" style={{ textAlign: "center", padding: "3rem" }}>
                    <Dumbbell style={{ width: "4rem", height: "4rem", margin: "0 auto 1rem", color: "#9ca3af" }} />
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Select Your Equipment
                    </h3>
                    <p style={{ color: "#6b7280" }}>
                      Choose the equipment you have available to see matching exercises
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                      Available Exercises
                    </h2>
                    <p style={{ color: "#6b7280" }}>
                      {loading ? "Loading..." : `${exercises.length} exercises found for your equipment`}
                    </p>
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
                        <p style={{ color: "#6b7280" }}>No exercises available for your selected equipment</p>
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
