import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import AuditForm from './pages/AuditForm'
import AuditResults from './pages/AuditResults'

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/audit" element={<AuditForm />} />
        <Route path="/audit/:shareId" element={<AuditResults />} />
      </Routes>
    </>
  )
}
