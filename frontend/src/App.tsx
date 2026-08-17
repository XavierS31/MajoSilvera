import { Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Home } from '@/pages/Home'
import { About } from '@/pages/About'
import { Services } from '@/pages/Services'
import { Packages } from '@/pages/Packages'
import { Contact } from '@/pages/Contact'
import { Booking } from '@/pages/Booking'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { AdminServiceManager } from '@/pages/AdminServiceManager'

export default function App() { const { pathname } = useLocation(); const admin = pathname.startsWith('/admin/'); return <>{!admin && <Navbar/>}<Routes><Route path="/" element={<Home/>}/><Route path="/nosotros" element={<About/>}/><Route path="/servicios" element={<Services/>}/><Route path="/paquetes" element={<Packages/>}/><Route path="/contacto" element={<Contact/>}/><Route path="/agendar" element={<Booking/>}/><Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/><Route path="/admin/services" element={<ProtectedRoute><AdminServiceManager/></ProtectedRoute>}/><Route path="*" element={<Home/>}/></Routes>{!admin && <Footer/>}</> }
