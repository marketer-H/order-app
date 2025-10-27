import { useState } from 'react'
import './App.css'
import { AppProvider } from './contexts/AppContext'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'

function App() {
  const [currentPage, setCurrentPage] = useState('order')

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  return (
    <AppProvider>
      <div className="app">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="main-content">
          {currentPage === 'order' && <OrderPage />}
          {currentPage === 'admin' && <AdminPage />}
        </main>
      </div>
    </AppProvider>
  )
}

export default App
