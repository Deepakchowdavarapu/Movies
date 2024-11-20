import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Home/Home'
import Nav from './Nav/Nav'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Nav/>
    <Home />
  </StrictMode>,
)
