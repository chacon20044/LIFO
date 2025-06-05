"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, Dumbbell, Trash2, Play, ArrowLeft } from "lucide-react"
import { supabase } from "../../lib/supabaseClient"
import Header from "../../header/page"

export default function SavedPlansPage() {
  const [user, setUser] = useState(null)
  const [savedPlans, setSavedPlans] = useState([])
  const [loading, setLoading] = useState(true)

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
    if (user) {
      fetchSavedPlans()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchSavedPlans = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching workout plans:", error)
        alert("Error loading workout plans: " + error.message)
      } else {
        setSavedPlans(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while loading workout plans")
    } finally {
      setLoading(false)
    }
  }

  const deletePlan = async (planId) => {
    if (!confirm("Are you sure you want to delete this workout plan?")) {
      return
    }

    try {
      const { error } = await supabase.from("workout_plans").delete().eq("id", planId)

      if (error) {
        console.error("Error deleting workout plan:", error)
        alert("Error deleting workout plan: " + error.message)
      } else {
        setSavedPlans((prev) => prev.filter((plan) => plan.id !== planId))
        alert("Workout plan deleted successfully!")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while deleting the workout plan")
    }
  }

  const loadPlanToWorkout = (plan) => {
    localStorage.setItem("workoutPlan", JSON.stringify(plan.exercises))
    localStorage.setItem("workoutPlanName", plan.name)
    localStorage.setItem("workoutPlanDescription", plan.description)
    alert("Workout plan loaded! Go to 'My Workouts' to see it.")
  }

  const calculateTotalTime = (exercises) => {
    return exercises.reduce((total, exercise) => {
      const exerciseTime = exercise.sets * exercise.reps * 0.75 + exercise.sets * 0.5
      return total + exerciseTime
    }, 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return (
      <div className="page-container">
        <Header />
        <main className="main">
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">🔒</div>
              <h3>Sign In Required</h3>
              <p>Please sign in to view your saved workout plans</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header />

      {/* Page Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <Link href="/exercises" className="btn btn-outline">
                <ArrowLeft className="icon" />
                Back to Exercises
              </Link>
            </div>
            <div>
              <h1>Saved Workout Plans</h1>
              <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                {savedPlans.length} saved plan{savedPlans.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <Link href="/workout-plan" className="btn btn-primary">
                <Dumbbell className="icon" />
                Create New Plan
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="loading-content">
                <div className="spinner"></div>
                <p>Loading your workout plans...</p>
              </div>
            </div>
          ) : savedPlans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Saved Workout Plans</h3>
              <p>You haven't saved any workout plans yet. Create your first one!</p>
              <Link href="/workout-plan" className="btn btn-primary">
                <Dumbbell className="icon" />
                Create Your First Plan
              </Link>
            </div>
          ) : (
            <div className="saved-plans-grid">
              {savedPlans.map((plan) => (
                <div key={plan.id} className="saved-plan-card">
                  <div className="plan-header">
                    <div className="plan-info">
                      <h3 className="plan-name">{plan.name}</h3>
                      <p className="plan-description">{plan.description}</p>
                      <div className="plan-meta">
                        <span className="meta-item">
                          <Calendar className="meta-icon" />
                          {formatDate(plan.created_at)}
                        </span>
                        <span className="meta-item">
                          <Dumbbell className="meta-icon" />
                          {plan.exercises.length} exercises
                        </span>
                        <span className="meta-item">
                          <Clock className="meta-icon" />
                          {Math.round(calculateTotalTime(plan.exercises))}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="plan-exercises">
                    <h4>Exercises:</h4>
                    <div className="exercise-list-preview">
                      {plan.exercises.slice(0, 3).map((exercise, index) => (
                        <div key={index} className="exercise-preview-item">
                          <span className="exercise-name">{exercise.name}</span>
                          <span className="exercise-sets">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                      ))}
                      {plan.exercises.length > 3 && (
                        <div className="exercise-preview-item more-exercises">
                          <span>+{plan.exercises.length - 3} more exercises</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="plan-actions">
                    <button onClick={() => loadPlanToWorkout(plan)} className="btn btn-primary">
                      <Play className="icon" />
                      Load Plan
                    </button>
                    <button onClick={() => deletePlan(plan.id)} className="btn btn-outline delete-plan-btn">
                      <Trash2 className="icon" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}