import Divider from "@mui/material/Divider";
import { useState } from "react";

function OldCard({ cover, gameName, cardId }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="container"
      style={{
        marginTop: "2rem",
        maxWidth: "300px", // Set consistent card width
        minHeight: "450px", // Set consistent card height
      }}
    >
      <div
        className="card"
        style={{
          boxShadow: "1px 4px 20px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          height: "100%", // Ensure card takes full height
        }}
      >
        <img
          src={cover}
          className="card-img-top"
          alt={`Cover of ${gameName}`}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover", // Maintain image aspect ratio
          }}
        />
        <div
          className="card-body d-flex flex-column"
          style={{ flexGrow: 1, overflow: "hidden" }}
        >
          <h5 className="card-title">{gameName}</h5>
          <Divider sx={{ backgroundColor: "#424242" }} />

          {/* Accordion section */}
          <div className="accordion" id={`accordion-${cardId}`}>
            <div className="accordion-item" style={{ border: "none" }}>
              <h2 className="accordion-header" style={{ border: "none" }}>
                <button
                  className={`accordion-button ${isOpen ? "" : "collapsed"}`}
                  type="button"
                  onClick={toggleAccordion}
                  aria-expanded={isOpen}
                  aria-controls={`collapse-${cardId}`}
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  More Details
                </button>
              </h2>
              <div
                id={`collapse-${cardId}`}
                className={`accordion-collapse collapse ${
                  isOpen ? "show" : ""
                }`}
              >
                <div
                  className="accordion-body"
                  style={{
                    padding: "1rem",
                    maxHeight: "100px",
                    overflowY: "auto",
                  }}
                >
                  <strong>Game Description:</strong> Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. This is the game's details, and
                  you can customize this content as needed.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <a href={`/games/${gameName}`} className="btn btn-primary w-100">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OldCard;
