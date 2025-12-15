import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { SignatureCreator } from './pages/SignatureCreator'
import { DocSigner } from './pages/DocSigner'
import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'

function App() {

  return (
    <>
      
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={ <Home /> } />
          <Route path='signature' element={ <SignatureCreator /> } />
          <Route path='sign-document' element={ <DocSigner /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
