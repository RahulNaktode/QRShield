import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.jsx'
import About from './pages/About.jsx'
import ScanHistory from './pages/ScanHistory.jsx'
import LiveScan from './pages/LiveScan.jsx'
import UrlAbdImg from './pages/UrlAbdImg.jsx'

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
  <Routes>
    <Route path='/' element={<LiveScan />}/>
    <Route path='/about' element={<About />} />
    <Route path='/scanhistory' element={<ScanHistory />} />
    <Route path='/urls' element={<UrlAbdImg />} />
  </Routes>
  </BrowserRouter>
)
