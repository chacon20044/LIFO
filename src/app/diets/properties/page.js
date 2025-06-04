"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../lib/supabaseClient"
import DietsHeader from "../diets-header/page"
import Header from "@/app/header/page"

export default function Properties() {
  const [user, setUser] = useState(null)
  const [properties, setProperties] = useState([])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    const fetchProperties = async () => {
      const { data, error } = await supabase.from("PROPERTIES").select("*")
      if (!error) setProperties(data)
    }
    getUser()
    fetchProperties()
  }, [])

  return (
    <div className="page-container">
      <Header />
      <main className="main">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Food Properties</h1>
            <p className="page-description">Learn about different nutritional properties</p>
          </div>

          <DietsHeader />

          <div className="properties-grid">
            {properties.map((prop, idx) => (
              <div key={idx} className="property-card">
                <div className="property-image">
                  <img src={prop.imagen_property || "/placeholder.svg?height=200&width=200"} alt={prop.property} />
                </div>
                <div className="property-content">
                  <h3 className="property-title">{prop.property}</h3>
                  <p className="property-description">{prop.descripcion_propiedad}</p>
                  <div className="property-examples">
                    <strong>Examples:</strong> {prop.ejemplos_propiedad}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
