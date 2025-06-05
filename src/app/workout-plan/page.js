"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Edit, Plus, Play, Save, Download } from "lucide-react"
import { supabase } from "../lib/supabaseClient"


export default function WorkoutPlanPage() {
  const [workoutPlan, setWorkoutPlan] = useState([])
  const [planName, setPlanName] = useState("My Workout Plan")
  const [planDescription, setPlanDescription] = useState("")
  const [editingExercise, setEditingExercise] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [user, setUser] = useState(null)

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

  useEffect(() => {
    const savedPlan = JSON.parse(localStorage.getItem("workoutPlan") || "[]")
    const savedPlanName = localStorage.getItem("workoutPlanName") || "My Workout Plan"
    const savedPlanDescription = localStorage.getItem("workoutPlanDescription") || ""

    setWorkoutPlan(savedPlan)
    setPlanName(savedPlanName)
    setPlanDescription(savedPlanDescription)
  }, [])

  const removeExercise = (exerciseId) => {
    const updatedPlan = workoutPlan.filter((exercise) => exercise.id !== exerciseId)
    setWorkoutPlan(updatedPlan)
    localStorage.setItem("workoutPlan", JSON.stringify(updatedPlan))
  }

  const updateExercise = (exerciseId, updates) => {
    const updatedPlan = workoutPlan.map((exercise) =>
      exercise.id === exerciseId ? { ...exercise, ...updates } : exercise,
    )
    setWorkoutPlan(updatedPlan)
    localStorage.setItem("workoutPlan", JSON.stringify(updatedPlan))
    setEditingExercise(null)
    setShowEditModal(false)
  }

  const savePlanDetails = async () => {
    if (!user) {
      alert("Please sign in to save your workout plan")
      return
    }

    try {
      const { data, error } = await supabase.from("workout_plans").insert([
        {
          user_id: user.id,
          name: planName,
          description: planDescription,
          exercises: workoutPlan,
        },
      ])

      if (error) {
        console.error("Error saving workout plan:", error)
        alert("Error saving workout plan: " + error.message)
      } else {
        alert("Workout plan saved successfully!")
        // Clear the current plan after saving
        setWorkoutPlan([])
        localStorage.removeItem("workoutPlan")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while saving the workout plan")
    }
  }

  const exportPlan = () => {
    const planData = {
      name: planName,
      description: planDescription,
      exercises: workoutPlan,
      createdAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(planData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${planName.replace(/\s+/g, "_")}_workout_plan.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const calculateTotalTime = () => {
    return workoutPlan.reduce((total, exercise) => {
      const exerciseTime = exercise.sets * exercise.reps * 0.75 + exercise.sets * 0.5
      return total + exerciseTime
    }, 0)
  }

  const openEditModal = (exercise) => {
    setEditingExercise(exercise)
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setEditingExercise(null)
    setShowEditModal(false)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>My Workout Plan</h1>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>{workoutPlan.length} exercises</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href="/" className="btn btn-outline">
                <Plus className="icon" />
                Add Exercises
              </Link>
              <button onClick={savePlanDetails} className="btn btn-primary">
                <Save className="icon" />
                Save Plan
              </button>
              <button onClick={exportPlan} className="btn btn-outline">
                <Download className="icon" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* Plan Details */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Workout Plan Details</h3>
            </div>
            <div className="card-content">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label
                    htmlFor="planName"
                    style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}
                  >
                    Plan Name
                  </label>
                  <input
                    id="planName"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="Enter plan name"
                    className="input"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}>
                    Estimated Duration
                  </label>
                  <input value={`${Math.round(calculateTotalTime())} minutes`} disabled className="input" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="planDescription"
                  style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}
                >
                  Description
                </label>
                <textarea
                  id="planDescription"
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  placeholder="Describe your workout plan..."
                  rows={3}
                  className="textarea"
                />
              </div>
            </div>
          </div>

          {/* Workout Summary */}
          {workoutPlan.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Workout Summary</h3>
              </div>
              <div className="card-content">
                <div className="workout-summary-grid">
                  <div className="summary-stat">
                    <div className="stat-value blue">{workoutPlan.length}</div>
                    <div className="stat-label">Exercises</div>
                  </div>
                  <div className="summary-stat">
                    <div className="stat-value green">{workoutPlan.reduce((total, ex) => total + ex.sets, 0)}</div>
                    <div className="stat-label">Total Sets</div>
                  </div>
                  <div className="summary-stat">
                    <div className="stat-value purple">
                      {workoutPlan.reduce((total, ex) => total + ex.sets * ex.reps, 0)}
                    </div>
                    <div className="stat-label">Total Reps</div>
                  </div>
                  <div className="summary-stat">
                    <div className="stat-value orange">{Math.round(calculateTotalTime())}m</div>
                    <div className="stat-label">Est. Time</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exercise List */}
          {workoutPlan.length === 0 ? (
            <div className="card">
              <div className="card-content" style={{ textAlign: "center", padding: "3rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>
                  No exercises in your plan yet
                </h3>
                <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
                  Start building your workout by adding exercises
                </p>
                <Link href="/" className="btn btn-primary">
                  <Plus className="icon" />
                  Browse Exercises
                </Link>
              </div>
            </div>
          ) : (
            <div className="exercise-list">
              {workoutPlan.map((exercise) => (
                <div key={exercise.id} className="exercise-list-item">
                  <div className="exercise-item-content">
                    <div className="exercise-item-image">
                      <img src={exercise.gifUrl || "/placeholder.svg"} alt={exercise.name} />
                    </div>

                    <div className="exercise-item-info">
                      <div className="exercise-item-header">
                        <div className="exercise-item-details">
                          <h3>{exercise.name}</h3>
                          <div className="exercise-item-badges">
                            <span className="badge badge-outline">{exercise.bodyPart}</span>
                            <span className="badge badge-outline">{exercise.target}</span>
                            <span className="badge badge-outline">{exercise.equipment}</span>
                          </div>
                          <div className="exercise-item-stats">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.duration && ` × ${exercise.duration}s`}
                          </div>
                        </div>

                        <div className="exercise-item-actions">
                          <button onClick={() => openEditModal(exercise)} className="btn btn-outline btn-small">
                            <Edit className="icon" />
                          </button>

                          <button onClick={() => removeExercise(exercise.id)} className="btn btn-outline btn-small">
                            <Trash2 className="icon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && editingExercise && (
        <div className="modal" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Exercise</h2>
              <button onClick={closeEditModal} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <EditExerciseForm
                exercise={editingExercise}
                onSave={(updates) => updateExercise(editingExercise.id, updates)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EditExerciseForm({ exercise, onSave }) {
  const [sets, setSets] = useState(exercise.sets)
  const [reps, setReps] = useState(exercise.reps)
  const [duration, setDuration] = useState(exercise.duration || "")

  const handleSave = () => {
    onSave({
      sets: Number.parseInt(sets),
      reps: Number.parseInt(reps),
      duration: duration ? Number.parseInt(duration) : null,
    })
  }

  return (
    <div className="modal-form">
      <div className="form-row">
        <div>
          <label
            htmlFor="sets"
            style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}
          >
            Sets
          </label>
          <input
            id="sets"
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            min="1"
            max="10"
            className="input"
          />
        </div>
        <div>
          <label
            htmlFor="reps"
            style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}
          >
            Reps
          </label>
          <input
            id="reps"
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            min="1"
            max="50"
            className="input"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="duration"
          style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}
        >
          Duration (seconds, optional)
        </label>
        <input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 30"
          className="input"
        />
      </div>
      <button onClick={handleSave} className="btn btn-primary full-width">
        Save Changes
      </button>
    </div>
  )
}