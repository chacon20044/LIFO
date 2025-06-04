"use client"

import DietsHeader from "../diets-header/page"
import Header from "@/app/header/page"
import { supabase } from "../../lib/supabaseClient"
import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"

export default function Browse() {
  const [user, setUser] = useState(null)
  const [yourdiets, setYourDiets] = useState([])

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
    const fetchUserDiets = async () => {
      if (user) {
        const { data, error } = await supabase.from("ALIMENTO").select("*").eq("id_usuario", user.id)
        if (!error) setYourDiets(data)
      }
    }
    fetchUserDiets()
  }, [user])

  const Eliminaralimento = async (id_alimento) => {
    const { error } = await supabase.from("ALIMENTO").delete().eq("id_alimento", id_alimento)
    if (!error) {
      setYourDiets((prev) => prev.filter((a) => a.id_alimento !== id_alimento))
      alert("Food deleted successfully")
    } else {
      alert("Could not delete food")
    }
  }

  return (
    <div className="page-container">
      <Header />
      <main className="main">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Your Foods</h1>
            <p className="page-description">Manage your registered foods</p>
          </div>

          <DietsHeader />

          <div className="foods-grid">
            {yourdiets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>No foods registered yet</h3>
                <p>Start by adding your first food item</p>
              </div>
            ) : (
              yourdiets.map((alimento) => (
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
                    <p className="food-description">{alimento.descripcion_alimento}</p>
                    <div className="food-badges">
                      <span className="badge badge-outline">{alimento.tipo_alimento}</span>
                      <span className="badge badge-default">{alimento.property}</span>
                    </div>
                    <button className="delete-btn" onClick={() => Eliminaralimento(alimento.id_alimento)}>
                      <Trash2 className="btn-icon" />
                      Delete
                    </button>
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