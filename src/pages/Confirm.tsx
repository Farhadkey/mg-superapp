export default function Confirm() {
  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-icon">✓</div>
        <h1 className="confirm-title">Action Completed</h1>
        <p className="confirm-text">
          Your task has been completed successfully.
        </p>
        <p className="confirm-hint">You can now close this tab and return to the app.</p>
      </div>
    </div>
  );
}
