import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles.css'
import App from './App'
import { JobsProvider } from './context/JobsContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <JobsProvider><App /></JobsProvider>
    </BrowserRouter>
  </React.StrictMode>
)