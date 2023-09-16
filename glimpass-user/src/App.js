import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ShopList from './components/ShopList';
import Navigation from './components/Navigation';
import ThanksComponent from './components/Thanks';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router basename='/glimpass-user'>
      <div>

        <Routes>    
        <Route path="/glimpass-user" element={<Login />} index />
          <Route path="/" element={<Login />} index />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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