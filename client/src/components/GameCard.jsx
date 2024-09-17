function GameCard({ cover, gameName }) {
  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div
        className="card"
        style={{ boxShadow: "1px 4px 20px rgba(0, 0, 0, 0.15)" }}
      >
        <img
          src={cover}
          className="card-img-top"
          alt={`Cover of ${gameName}`}
          style={{ width: "100%", height: "100%" }}
        />
        <div className="card-body">
          <h5 className="card-title">{gameName}</h5>{" "}
          {/* Use gameName as the title */}
          <p className="card-text">Some quick details about the game here.</p>
          <a href={`/games/${gameName}`} className="btn btn-primary">
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
