import { useState } from "react";

export default function Confirm() {
  const [showManual, setShowManual] = useState(false);

  const handleClose = () => {
    window.close();
    // If the tab is still open after a short delay, the browser blocked it
    setTimeout(() => setShowManual(true), 300);
  };

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-icon">✓</div>
        <h1 className="confirm-title">Action Completed</h1>
        <p className="confirm-text">
          Your task has been completed successfully.
        </p>
        {showManual ? (
          <p className="confirm-hint">Please close this tab manually to return to the app.</p>
        ) : (
          <>
            <p className="confirm-hint">You can now close this tab.</p>
            <button className="confirm-close-btn" onClick={handleClose}>
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
