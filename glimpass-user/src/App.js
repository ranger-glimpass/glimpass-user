import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ShopList from './components/ShopList';
import Navigation from './components/Navigation';
import ThanksComponent from './components/Thanks';
import MarketSelection from './components/MarketSelection';

// 1. Import the logo image
import logo from './assets/glimpassLogo.png'; // Replace 'path-to-your-logo.png' with the actual path to your logo image

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router basename='/'>
          <div>
          <div style={{ position: 'relative' }}>
    <Link to="/Login" style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}>
        {/* <img src={logo} alt="Logo" style={{ width: '60px', height: 'auto' }}/> */}
    </Link>
</div>

            <Routes>
              <Route path="/glimpass-user" element={<Login />} index />
              <Route path="/" element={<Login />} index />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/register" element={<Register />} /> */}
              <Route path="/markets" element={<MarketSelection />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shops" element={<ShopList />} />
              <Route path="/navigation" element={<Navigation />} />
              <Route path="/thanks" element={<ThanksComponent />} />
            </Routes>
          </div>
        </Router>
      </header>
    </div>
  );
}

export default App;
