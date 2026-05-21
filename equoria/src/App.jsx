import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {showCrisisBar && <CrisisBar />}
      {page === "landing"   && <LandingPage   onNavigate={setPage} />}
      {page === "login"     && <AuthPage       mode="login"    onNavigate={setPage} />}
      {page === "register"  && <AuthPage       mode="register" onNavigate={setPage} />}
      {page === "dashboard" && <DashboardPage  onNavigate={setPage} />}
      {page === "profile"   && <ProfilePage    onNavigate={setPage} />}
    </>
  )
}

export default App
