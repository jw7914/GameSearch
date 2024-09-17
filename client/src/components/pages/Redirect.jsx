import React from "react";
import { useLocation, Navigate } from "react-router-dom";

const Redirect = ({ element }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const genre = params.get("genre");
  const search = params.get("query");

  // Redirect to home page if `/search` is missing `search_term` or `/genre` is missing `genre`
  if (
    (location.pathname === "/search" && !search) ||
    (location.pathname === "/genre" && !genre)
  ) {
    return <Navigate to="/" replace />;
  }

  // Return the element if the conditions are met
  return element;
};

export default Redirect;
