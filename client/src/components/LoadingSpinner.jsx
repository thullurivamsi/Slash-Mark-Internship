import React from "react";

function LoadingSpinner({ message = "Loading…" }) {
  return (
    <div className="loading">
      <div className="loading__spinner" />
      <span>{message}</span>
    </div>
  );
}

export default LoadingSpinner;