"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabaseClient"
import Header from "../header/page"
import DietsHeader from "./diets-header/page"

export default function Diets() {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState("")
  const [nombre_alimento, setnombrealimento] = useState("")
  const [descripcion, setdescripcion] = useState("")
  const [tipo_alimento, settipo_alimento] = useState("")
  const [imagen, setimagen] = useState("")
  const [properties, setProperties] = useState([])
  const [property, setProperty] = useState("")
  const fileInputRef = useRef(null)

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
    const fetchProperties = async () => {
      const { data, error } = await supabase.from("PROPERTIES").select("property")
      if (!error) setProperties(data)
    }
    fetchProperties()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setMessage("Se requiere iniciar sesión para registrar alimento")
      return
    }

    let imagePath = ""
    if (imagen) {
      const fileExt = imagen.name.split(".").pop()
      const fileName = `${Date.now()}_${user.id}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage.from("imagenesalimentos").upload(fileName, imagen)

      if (uploadError) {
        setMessage("Error al subir la imagen: " + uploadError.message)
        return
      }
      imagePath = data.path
    }

    const { error } = await supabase.from("ALIMENTO").insert([
      {
        nombre_alimento,
        descripcion_alimento: descripcion,
        imagen_alimento: imagePath,
        tipo_alimento,
        id_usuario: user.id,
        property,
      },
    ])

    if (error) {
      alert("Error al guardar: " + error.message)
    } else {
      alert("¡Alimento guardado!")
      setnombrealimento("")
      setdescripcion("")
      settipo_alimento("")
      setimagen("")
      setProperty("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="page-container">
      <Header />
      <main className="main">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Diet Registration</h1>
            <p className="page-description">Register your foods and share them with the community</p>
          </div>

          <DietsHeader />

          <div className="form-container">
            <form onSubmit={handleSubmit} className="diet-form">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  Food Name
                </label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Enter food name"
                  value={nombre_alimento}
                  className="form-input"
                  onChange={(e) => setnombrealimento(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion" className="form-label">
                  Description
                </label>
                <textarea
                  id="descripcion"
                  placeholder="Describe the food"
                  className="form-textarea"
                  value={descripcion}
                  onChange={(e) => setdescripcion(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tipo" className="form-label">
                    Meal Type
                  </label>
                  <select
                    id="tipo"
                    value={tipo_alimento}
                    onChange={(e) => settipo_alimento(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Select meal type</option>
                    <option value="Desayuno">Breakfast</option>
                    <option value="Comida">Lunch</option>
                    <option value="Cena">Dinner</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="property" className="form-label">
                    Property
                  </label>
                  <select
                    id="property"
                    value={property}
                    onChange={(e) => setProperty(e.target.value)}
                    className="form-select"
                    required
                  >
                    <option value="">Select property</option>
                    {properties.map((prop) => (
                      <option key={prop.property} value={prop.property}>
                        {prop.property}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imagen" className="form-label">
                  Food Image
                </label>
                <input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  className="form-file"
                  onChange={(e) => setimagen(e.target.files[0])}
                  ref={fileInputRef}
                />
              </div>

              <button type="submit" className="submit-btn">
                Save Food
              </button>

              {message && <div className="form-message">{message}</div>}
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}