import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryView from './pages/CategoryView'
import DetailView from './pages/DetailView'
import mealsData from './data/meals.json'

export default function App() {
  const [meals, setMeals] = useState([])

  useEffect(() => {
    setMeals(mealsData.meals)
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home meals={meals} />} />
        <Route path="/category/:categoryName" element={<CategoryView meals={meals} />} />
        <Route path="/meal/:mealId" element={<DetailView meals={meals} />} />
      </Routes>
    </Router>
  )
}