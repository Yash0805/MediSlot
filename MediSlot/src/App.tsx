import { Route, Routes } from 'react-router-dom'
import './App.css'
import Mainlayout from './Layout/Mainlayout'
import Appointment from './Feature/Appointments/'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route path="/Appointments/*" element={<Appointment />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
