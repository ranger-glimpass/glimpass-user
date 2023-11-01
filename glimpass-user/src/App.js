import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ShopList from "./components/ShopList";
import Navigation from "./components/Navigation";
import ThanksComponent from "./components/Thanks";
import MarketSelection from "./components/MarketSelection";
import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// 1. Import the logo image
import logo from "./assets/glimpassLogo.png"; // Replace 'path-to-your-logo.png' with the actual path to your logo image

function App() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/service-worker.js").then(
        function (registration) {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    });
  }

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    });
  }, []);
  const showAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <link rel="manifest" href="/manifest.json" />

        {/* <!-- Apple Touch Icons (at least one size is required for iOS "Add to Home Screen" feature) --> */}
        <link rel="apple-touch-icon" href={logo} />

        {/* <!-- Specify a startup image for web apps --> */}
        <link rel="apple-touch-startup-image" href={logo} />

        {/* <!-- Display standalone (full-screen) --> */}
        <meta name="apple-mobile-web-app-capable" content="yes" />

        {/* <!-- Set the status bar appearance --> */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        <Router basename="/">
          <div>
            <div style={{ position: "relative" }}>
              <Link
                to="/Login"
                style={{
                  position: "fixed",
                  top: "10px",
                  left: "10px",
                  zIndex: 1000,
                }}
              >
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

        {deferredPrompt && (
  <div className="show-add-to-screen">
    <span onClick={showAddToHomeScreen}>Install Glimpass!</span>
    <span 
      className="close-add-to-screen-icon"
      onClick={() => setDeferredPrompt(null)}
    >X</span>
  </div>
)}

        {/* {!deferredPrompt && (
  <div>
    <p>To add to Home Screen:</p>
    <ul>
      <li>Open browser menu</li>
      <li>Tap 'Add to Home Screen'</li>
    </ul>
  </div>
)} */}
      </header>
    </div>
  );
}

export default App;
