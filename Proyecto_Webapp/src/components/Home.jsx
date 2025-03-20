import { useNavigate } from 'react-router-dom';
import "../styles/Home.css";
import "animate.css";

function Home() {
  const navigate = useNavigate();

  const handleVerMasClick = () => {
    navigate('/productos');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-text">
        <h1 className="animate__animated animate__fadeInLeft">¡Bienvenido a la tienda de NFTs!</h1>
          <p>
            En nuestra tienda encontrarás una amplia variedad de NFTs para
            coleccionar. ¡No te quedes sin el tuyo!
          </p>
          <button className="btn btn-primary m-0" onClick={handleVerMasClick}>Ver más</button>
        </div>
        <div className="home-image">
          <img src="header-right.png" alt="NFTs" />
        </div>
      </div>
    </div>
  );
}

export default Home;
