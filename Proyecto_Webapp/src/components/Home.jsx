import "../styles/Home.css";

function MainInfo() {
  return (
    <div className="container mainInfo">
      <div className="row">
        <div className="col-md-6 col-sm-12 pb-30">
          <div className="product_heading pt-200 ml-20 mt-20 text-left">
            <h2
              className="product_page_subtitle font-bold wow fadeInUp"
              data-wow-duration="1s"
              data-wow-delay=".7s"
            >
              NFT Marketplace <br /> Explore, Collect or Sell
            </h2>
            <div className="header-description">
              <p className="header-paragraph">
                Connect <i className="bx bx-arrow-back"></i>
                Explore <i className="bx bx-arrow-back"></i>
                Earn
              </p>
            </div>
            <div
              className="header-btn-container wow fadeInUp"
              data-wow-duration="1s"
              data-wow-delay=".7s"
            >
              <a
                href="wallet.html"
                className="btn btn-wallet btn_all_nft_product"
              >
                Add Wallet <i className="bx bx-arrow-back"></i>{" "}
              </a>
              <a href="wallet.html" className="btn btn-wallet account_btn">
                Upload Art
              </a>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div
                  className="counter_area_header wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay=".3s"
                >
                  <div className="counter-up header">
                    <div className="counter_heading">
                      <p className="count-text pt-10">Art Works</p>
                      <div className="counter_text header">
                        <span
                          className="counter-to"
                          data-to="2597"
                          data-speed="4000"
                        >
                          2597
                        </span>
                        k
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className="counter_area_header wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay=".5s"
                >
                  <div className="counter-up header">
                    <div className="counter_heading">
                      <p className="count-text pt-10">Live Auction</p>
                      <div className="counter_text header">
                        <span
                          className="counter-to"
                          data-to="997"
                          data-speed="4000"
                        >
                          997
                        </span>{" "}
                        Items
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div
                  className="counter_area_header wow fadeInUp"
                  data-wow-duration="1s"
                  data-wow-delay=".7s"
                >
                  <div className="counter-up header">
                    <div className="counter_heading">
                      <p className="count-text pt-10">Creators Earning</p>
                      <div className="counter_text header">
                        <span
                          className="counter-to"
                          data-to="342"
                          data-speed="4000"
                        >
                          342
                        </span>
                        M USD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div
            className="header-right wow fadeInRight"
            data-wow-duration="1s"
            data-wow-delay=".8s"
          >
            <img
              src="../../../header-right.png"
              alt=""
              className="responsive-fluid"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainInfo;
