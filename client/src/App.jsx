import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; 

function App() {
  return (
    <AuthProvider>  
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Register />} /> {/*Redirect Testing */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;