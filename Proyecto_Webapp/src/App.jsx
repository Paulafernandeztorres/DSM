import { Routes, Route } from 'react-router-dom';
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Productos from './components/Productos';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/productos" element={<Productos />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
