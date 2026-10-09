import './App.css'
import Navbar from './components/Navbar/Navbar.tsx'
import Home from './pages/Home/Home.tsx'
import Session from './pages/Session/Session.tsx'
import Footer from './components/Footer/Footer.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Profile from './pages/Profile/Profile.tsx'

function App() {

  return (
    <BrowserRouter>
      <main>
        <Navbar/>

        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/session' element={<Session/>}/>
          <Route path="/profile" element={<Profile/>} />
        </Routes>
        
        <Footer/>
      </main>
    </BrowserRouter>
  )
}

export default App
