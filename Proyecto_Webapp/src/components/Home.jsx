import "../styles/Home.css";

function MainInfo() {
  return (
    <div className="container mainInfo">
      <div className="row">
        <div className="col-md-6 col-sm-12 pb-30">
          <div className="header-left">
            <h1>¡Bienvenido a la tienda de NFTs!</h1>
            <p>
              En nuestra tienda encontrarás una amplia variedad de NFTs para
              coleccionar. ¡No te quedes sin el tuyo!
            </p>
            <button className="btn">Ver más</button>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="header-right">
            <img src="../../../header-right.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainInfo;
