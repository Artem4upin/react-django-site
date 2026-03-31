import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import AccountPage from './pages/AccountPage/AccountPage'
import CartPage from './pages/CartPage/CartPage'
import ManagerPage from './pages/ManagerPage/ManagerPage'
import CatalogPage from './pages/CatalogPage/CatalogPage'
import {api} from './api/'
import { AuthContext } from './hooks/AuthContext'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import ProductPage from './pages/ProductPage/ProductPage'
import AboutPage from './pages/AboutPage/AboutPage'
import FaqPage from './pages/FaqPage/FaqPage'
import CreateProductPage from './pages/CreateProductPage/CreateProductPage'
import RoleManagementPage from './pages/RoleManagmentPage/RoleManagementPage'
import NavigationBar from "./components/NavigationBar/NavigationBar.tsx";

function App() {
  const [user, setUser] = useState(null)

   useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await api.get('auth/check-auth/')
          if (response.data.isAuthenticated) {
            setUser(response.data.user)
          } else {
            setUser(null)
          }
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.removeItem('token')
            setUser(null)
          }
        } 
      }
      checkAuth()
    }, [])


  return (
    <AuthContext.Provider
    value={{ user, setUser }} >
      <Router>
        <Header />
        <main className="main-content">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/catalog' element={<CatalogPage />} />
          <Route path='/product/:id' element={<ProductPage />} />
          <Route path='/create-product' element={<CreateProductPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='/manager-page' element={<ManagerPage />} />
          <Route path="/role-management" element={<RoleManagementPage />} />
          <Route path='/faq' element={<FaqPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </main>

        <Footer />
        <NavigationBar />
      </Router>
    </AuthContext.Provider>
  );
}

export default App