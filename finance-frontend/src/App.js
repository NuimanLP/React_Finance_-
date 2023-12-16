import './App.css';
import React, { useState } from 'react';
import axios from 'axios'
import LoginScreen from './LoginScreen';
import FinanceScreen from './FinanceScreen';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLoginSuccess = () => {console.log("Login Success!!!")
  setIsAuthenticated(true);}
return (
    <div className="App">
      <header className="App-header">
        {!isAuthenticated &&
          <LoginScreen onLoginSuccess={handleLoginSuccess}/>
        }
        {isAuthenticated &&
          <FinanceScreen/>
        }
      </header>
</div>
); }
export default App;