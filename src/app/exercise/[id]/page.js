"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, RotateCcw, Plus, Volume2 } from "lucide-react"
import { getExerciseById } from "@/app/lib/api"

export default function ExerciseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [exercise, setExercise] = useState(null)
  const [completedSteps, setCompletedSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(12)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true)
      try {
        const data = await getExerciseById(params.id)
        setExercise(data)
      } catch (error) {
        console.error("Error fetching exercise:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercise()
  }, [params.id])

  const toggleStepCompletion = (stepIndex) => {
    setCompletedSteps((prev) => (prev.includes(stepIndex) ? prev.filter((i) => i !== stepIndex) : [...prev, stepIndex]))
  }

  const speakInstruction = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const addToWorkout = () => {
    const savedWorkouts = JSON.parse(localStorage.getItem("workoutPlan") || "[]")
    const isAlreadyAdded = savedWorkouts.some((item) => item.id === exercise.id)

    if (!isAlreadyAdded) {
      savedWorkouts.push({
        ...exercise,
        sets: Number.parseInt(sets),
        reps: Number.parseInt(reps),
        duration: null,
      })
      localStorage.setItem("workoutPlan", JSON.stringify(savedWorkouts))
      alert("Exercise added to your workout plan!")
    } else {
      alert("Exercise is already in your workout plan!")
    }
  }

  const nextStep = () => {
    if (currentStep < (exercise.instructions?.length || 1) - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetSteps = () => {
    setCurrentStep(0)
    setCompletedSteps([])
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading exercise details...</p>
        </div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <h2>Exercise not found</h2>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
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
            <button onClick={() => router.back()} className="btn btn-outline">
              <ArrowLeft className="icon" />
              Back
            </button>
            <h1>{exercise.name}</h1>
            <div></div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="exercise-detail-grid">
            {/* Exercise Image and Basic Info */}
            <div>
              <div className="card">
                <div className="card-content">
                  <div className="exercise-detail-image">
                    <img src={exercise.gifUrl || "/placeholder.svg"} alt={exercise.name} />
                  </div>

                  <div className="exercise-detail-info">
                    <div className="info-section">
                      <h3>Target Muscles</h3>
                      <div className="badge-group">
                        <span className="badge badge-default">{exercise.target}</span>
                        {exercise.secondaryMuscles?.map((muscle) => (
                          <span key={muscle} className="badge badge-outline">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>Equipment & Body Part</h3>
                      <div className="badge-group">
                        <span className="badge badge-outline">{exercise.equipment}</span>
                        <span className="badge badge-outline">{exercise.bodyPart}</span>
                      </div>
                    </div>

                    <div className="sets-reps-inputs">
                      <div className="input-group">
                        <label htmlFor="sets">Sets</label>
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
                      <div className="input-group">
                        <label htmlFor="reps">Reps</label>
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

                    <button onClick={addToWorkout} className="btn btn-primary full-width">
                      <Plus className="icon" />
                      Add to My Workout Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    Step-by-Step Instructions
                    <button onClick={resetSteps} className="btn btn-outline btn-small">
                      <RotateCcw className="icon" />
                    </button>
                  </h3>
                  <p className="card-description">Follow these instructions carefully for proper form</p>
                </div>
                <div className="card-content">
                  {/* Step Navigator */}
                  <div className="step-navigator">
                    <div className="step-info">
                      <span>
                        Step {currentStep + 1} of {exercise.instructions?.length || 0}
                      </span>
                      <div className="step-controls">
                        <button onClick={prevStep} disabled={currentStep === 0} className="btn btn-outline btn-small">
                          Previous
                        </button>
                        <button
                          onClick={nextStep}
                          disabled={currentStep === (exercise.instructions?.length || 1) - 1}
                          className="btn btn-outline btn-small"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                    <div className="current-step">
                      <div className="step-content">
                        <p>{exercise.instructions?.[currentStep] || "No instructions available."}</p>
                        <button
                          onClick={() => speakInstruction(exercise.instructions?.[currentStep] || "")}
                          className="btn btn-outline btn-small"
                        >
                          <Volume2 className="icon" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* All Instructions with Checkboxes */}
                  <div className="all-instructions">
                    <h4>Complete Instructions</h4>
                    {exercise.instructions?.map((instruction, index) => (
                      <div key={index} className="instruction-item">
                        <input
                          type="checkbox"
                          id={`step-${index}`}
                          checked={completedSteps.includes(index)}
                          onChange={() => toggleStepCompletion(index)}
                          className="checkbox"
                        />
                        <div className="instruction-content">
                          <label
                            htmlFor={`step-${index}`}
                            className={`instruction-text ${completedSteps.includes(index) ? "completed" : ""}`}
                          >
                            <span className="step-number">Step {index + 1}:</span> {instruction}
                          </label>
                        </div>
                        <button onClick={() => speakInstruction(instruction)} className="btn btn-outline btn-small">
                          <Volume2 className="icon" />
                        </button>
                      </div>
                    )) || <p>No instructions available.</p>}
                  </div>

                  <div className="progress-section">
                    <p>
                      <strong>Progress:</strong> {completedSteps.length} of {exercise.instructions?.length || 0} steps
                      completed
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(completedSteps.length / (exercise.instructions?.length || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}