import React from "react";

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-msg">
      <span>⚠ {message}</span>
      {onRetry && (
        <button className="error-msg__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;