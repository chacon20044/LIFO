"use client"

import DietsHeader from "../diets-header/page"
import Header from "@/app/header/page"
import { supabase } from "../../lib/supabaseClient"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"

export default function Browse2() {
  const [user, setUser] = useState(null)
  const [properties, setProperties] = useState([])
  const [property, setProperty] = useState("")
  const [answer, setanswer] = useState([])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from("PROPERTIES").select("property")
      if (!error) setProperties(data)
    }
    fetchProperties()
  }, [])

  const fetchByProperty = async (selectedProperty) => {
    setProperty(selectedProperty)
    if (selectedProperty) {
      const { data, error } = await supabase.from("alimento_con_email").select("*").eq("property", selectedProperty)
      if (!error) setanswer(data)
    } else {
      setanswer([])
    }
  }

  return (
    <div className="page-container">
      <Header />
      <main className="main">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Browse Community Foods</h1>
            <p className="page-description">Discover foods shared by other users</p>
          </div>

          <DietsHeader />

          <div className="search-section">
            <div className="search-controls">
              <select value={property} onChange={(e) => setProperty(e.target.value)} className="form-select">
                <option value="">Select property</option>
                {properties.map((prop) => (
                  <option key={prop.property} value={prop.property}>
                    {prop.property}
                  </option>
                ))}
              </select>
              <button onClick={() => fetchByProperty(property)} className="search-btn">
                <Search className="btn-icon" />
                Search
              </button>
            </div>
          </div>

          <div className="foods-grid">
            {answer.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No results found</h3>
                <p>Try selecting a different property</p>
              </div>
            ) : (
              answer.map((alimento) => (
                <div key={alimento.id_alimento} className="food-card">
                  <div className="food-image">
                    <img
                      src={`https://vtatvaokrxxklusjelpq.supabase.co/storage/v1/object/public/imagenesalimentos/${alimento.imagen_alimento}`}
                      alt={alimento.nombre_alimento}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                  </div>
                  <div className="food-content">
                    <h3 className="food-title">{alimento.nombre_alimento}</h3>
                    <p className="food-author">By: {alimento.email_usuario}</p>
                    <p className="food-description">{alimento.descripcion_alimento}</p>
                    <div className="food-badges">
                      <span className="badge badge-outline">{alimento.tipo_alimento}</span>
                      <span className="badge badge-default">{alimento.property}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
