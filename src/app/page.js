"use client"

import Link from "next/link"
import { ArrowRight, Heart, Target, Users, Star, CheckCircle } from "lucide-react"
import Header from "./header/page"

export default function HomePage() {
  return (
    <div className="page-container">
      <Header />
      <main className="main">
        {/* Hero Section */}
        <section className="hero-section-main">
          <div className="container">
            <div className="hero-content">
              <div className="hero-logo">
                <img src="/logo.png" alt="Lifo Logo" className="logo-image" />
              </div>
              <h1 className="hero-title-main">Welcome to Lifo</h1>
              <h2 className="hero-subtitle-main">Life + Evolve</h2>
              <p className="hero-description-main">
                Transform your lifestyle with our comprehensive health and fitness platform. Join thousands of people on
                their journey to a healthier, happier life.
              </p>
              <div className="hero-buttons">
                <Link href="/exercises" className="btn btn-primary btn-large">
                  Start Your Journey 💪
                </Link>
                <Link href="/diets" className="btn btn-outline btn-large">
                  Explore Nutrition 🍏
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Everything You Need for a Healthy Life</h2>
              <p className="section-description">
                Our platform combines fitness tracking, nutrition guidance, and community support
              </p>
            </div>

            <div className="features-grid-main">
              <div className="feature-card-main">
                <div className="feature-icon-main">
                  <Target className="feature-icon-svg" />
                </div>
                <h3>Smart Fitness Tracking</h3>
                <p>Track your workouts, set goals, and monitor your progress with our intelligent fitness system</p>
                <ul className="feature-list">
                  <li>
                    <CheckCircle className="check-icon" /> Custom workout plans
                  </li>
                  <li>
                    <CheckCircle className="check-icon" /> Exercise library
                  </li>
                  <li>
                    <CheckCircle className="check-icon" /> Progress analytics
                  </li>
                </ul>
              </div>

              <div className="feature-card-main">
                <div className="feature-icon-main">
                  <Heart className="feature-icon-svg" />
                </div>
                <h3>Nutrition Guidance</h3>
                <p>Discover healthy recipes, track your meals, and learn about nutritional properties</p>
                <ul className="feature-list">
                  <li>
                    <CheckCircle className="check-icon" /> Recipe database
                  </li>
                  <li>
                    <CheckCircle className="check-icon" /> Meal planning
                  </li>
                  <li>
                    <CheckCircle className="check-icon" /> Nutritional insights
                  </li>
                </ul>
              </div>

              <div className="feature-card-main">
                <div className="feature-icon-main">
                  <Users className="feature-icon-svg" />
                </div>
                <h3>Community Support</h3>
                <p>Connect with like-minded individuals and share your health journey with others</p>
                <ul className="feature-list">
                  <li>
                    <CheckCircle className="check-icon" /> Share recipes
                  </li>
                  <li>
                    <CheckCircle className="check-icon" /> Community challenges
                  </li>
                  <li>
                    <CheckCircle className="check-icon" /> Support network
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Exercises</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Healthy Recipes</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">What Our Users Say</h2>
              <p className="section-description">Real stories from real people</p>
            </div>

            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "Lifo has completely transformed my approach to health and fitness. The community support is amazing!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👩‍💼</div>
                  <div>
                    <div className="author-name">Sarah Johnson</div>
                    <div className="author-title">Marketing Manager</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "The nutrition guidance helped me understand what my body really needs. I feel more energetic than
                  ever!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨‍💻</div>
                  <div>
                    <div className="author-name">Raul Ruiz</div>
                    <div className="author-title">Graphic Designer</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star-icon" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "I love how easy it is to track my workouts and see my progress. The app is beautifully designed!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👩‍🎨</div>
                  <div>
                    <div className="author-name">Emma Davis</div>
                    <div className="author-title">Graphic Designer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Start Your Health Journey?</h2>
              <p className="cta-description">
                Join thousands of people who have already transformed their lives with Lifo
              </p>
              <div className="cta-buttons">
                <Link href="/exercises" className="btn btn-primary btn-large">
                  Get Started Today
                  <ArrowRight className="btn-icon" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}