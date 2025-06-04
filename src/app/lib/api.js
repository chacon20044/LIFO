const API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY
const API_HOST = "exercisedb.p.rapidapi.com"

const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": API_HOST,
}

// Mock data for fallback
const mockExercises = [
  {
    id: "0001",
    name: "3/4 sit-up",
    bodyPart: "waist",
    equipment: "body weight",
    target: "abs",
    gifUrl: "/placeholder.svg?height=300&width=300",
    secondaryMuscles: ["hip flexors"],
    instructions: [
      "Lie flat on your back with your knees bent and feet flat on the ground.",
      "Place your hands behind your head with your elbows pointing outwards.",
      "Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle.",
      "Pause for a moment at the top, then slowly lower your upper body back down to the starting position.",
      "Repeat for the desired number of repetitions.",
    ],
  },
  {
    id: "0002",
    name: "Barbell Bench Press",
    bodyPart: "chest",
    equipment: "barbell",
    target: "pectorals",
    gifUrl: "/placeholder.svg?height=300&width=300",
    secondaryMuscles: ["triceps", "delts"],
    instructions: [
      "Lie on a flat bench with your feet firmly planted on the ground.",
      "Grip the barbell with hands slightly wider than shoulder-width apart.",
      "Lower the barbell to your chest in a controlled manner.",
      "Press the barbell back up to the starting position.",
      "Repeat for the desired number of repetitions.",
    ],
  },
  {
    id: "0003",
    name: "Dumbbell Bicep Curl",
    bodyPart: "upper arms",
    equipment: "dumbbell",
    target: "biceps",
    gifUrl: "/placeholder.svg?height=300&width=300",
    secondaryMuscles: ["forearms"],
    instructions: [
      "Stand with feet shoulder-width apart, holding dumbbells at your sides.",
      "Keep your elbows close to your torso.",
      "Curl the weights up by contracting your biceps.",
      "Slowly lower the weights back to the starting position.",
      "Repeat for the desired number of repetitions.",
    ],
  },
  {
    id: "0004",
    name: "Push-up",
    bodyPart: "chest",
    equipment: "body weight",
    target: "pectorals",
    gifUrl: "/placeholder.svg?height=300&width=300",
    secondaryMuscles: ["triceps", "delts"],
    instructions: [
      "Start in a plank position with hands slightly wider than shoulders.",
      "Lower your body until your chest nearly touches the floor.",
      "Push back up to the starting position.",
      "Keep your body in a straight line throughout the movement.",
      "Repeat for the desired number of repetitions.",
    ],
  },
]

const mockBodyParts = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
]
const mockEquipment = ["assisted", "band", "barbell", "body weight", "bosu ball", "cable", "dumbbell", "kettlebell"]
const mockTargets = [
  "abductors",
  "abs",
  "adductors",
  "biceps",
  "calves",
  "cardiovascular system",
  "delts",
  "forearms",
  "glutes",
]

export async function getAllExercises() {
  try {
    if (!API_KEY) {
      console.warn("API key not found, using mock data")
      return mockExercises
    }

    const response = await fetch("https://exercisedb.p.rapidapi.com/exercises?limit=100", {
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching exercises:", error)
    return mockExercises
  }
}

export async function getExerciseById(id) {
  try {
    if (!API_KEY) {
      const mockExercise = mockExercises.find((ex) => ex.id === id)
      return mockExercise || mockExercises[0]
    }

    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching exercise:", error)
    const mockExercise = mockExercises.find((ex) => ex.id === id)
    return mockExercise || mockExercises[0]
  }
}

export async function getBodyPartList() {
  try {
    if (!API_KEY) {
      return mockBodyParts
    }

    const response = await fetch("https://exercisedb.p.rapidapi.com/exercises/bodyPartList", {
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching body parts:", error)
    return mockBodyParts
  }
}

export async function getEquipmentList() {
  try {
    if (!API_KEY) {
      return mockEquipment
    }

    const response = await fetch("https://exercisedb.p.rapidapi.com/exercises/equipmentList", {
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching equipment:", error)
    return mockEquipment
  }
}

export async function getTargetList() {
  try {
    if (!API_KEY) {
      return mockTargets
    }

    const response = await fetch("https://exercisedb.p.rapidapi.com/exercises/targetList", {
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching targets:", error)
    return mockTargets
  }
}

export async function getExercisesByBodyPart(bodyPart) {
  try {
    if (!API_KEY) {
      return mockExercises.filter((ex) => ex.bodyPart === bodyPart)
    }

    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching exercises by body part:", error)
    return mockExercises.filter((ex) => ex.bodyPart === bodyPart)
  }
}

export async function getExercisesByEquipment(equipment) {
  try {
    if (!API_KEY) {
      return mockExercises.filter((ex) => ex.equipment === equipment)
    }

    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching exercises by equipment:", error)
    return mockExercises.filter((ex) => ex.equipment === equipment)
  }
}

export async function getExercisesByTarget(target) {
  try {
    if (!API_KEY) {
      return mockExercises.filter((ex) => ex.target === target)
    }

    const response = await fetch(`https://exercisedb.p.rapidapi.com/exercises/target/${target}`, {
      headers,
    })

    if (!response.ok) {
      throw new Error("API request failed")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching exercises by target:", error)
    return mockExercises.filter((ex) => ex.target === target)
  }
}
