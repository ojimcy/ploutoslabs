import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Connect from './pages/connect';
import Sign from './pages/sign';

function App() {

  return (
    <Router>
      <Routes>
        <Route index element={<Connect />} />
        <Route path='/sign' element={<Sign />} />
      </Routes>
    </Router>
  )
}

export default App
