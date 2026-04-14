import { Route, Routes } from 'react-router-dom'
import './App.css'
import Mainlayout from './Layout/Mainlayout'
import Appointment from './Feature/Appointments/'
import Main from './Home/Main'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route path='/' element={<Main />} />
          <Route path="/Appointments/*" element={<Appointment />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
