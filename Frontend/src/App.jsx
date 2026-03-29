import { useState } from 'react'
import './styles/variables.css'
import './App.css'
import AppRoute from './Routes/AppRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AppRoute/>
    </>
  )
}

export default App
