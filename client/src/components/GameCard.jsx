function GameCard() {
    return (
      <div className="container" style={{ marginTop: "2rem" }}>
        <div className="card">
          <img src="https://images.igdb.com/igdb/image/upload/t_cover_big/co1uje.jpg" className="card-img-top" alt="..." style={{ width: "100%", height: "100%" }}/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </p>
            <a href="#" className="btn btn-primary">
              Go somewhere
            </a>
          </div>
        </div>
      </div>
    );
  }
  
export default GameCard;
  