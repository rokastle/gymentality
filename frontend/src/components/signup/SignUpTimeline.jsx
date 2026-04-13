const steps = ["Club", "Membership", "Workout", "Details"];

export default function SignUpTimeline({ completedSteps = 1 }) {
  return (
    <div className="signup-timeline" aria-label="Sign up progress">
      {steps.map((step, index) => (
        <div key={step} className="signup-timeline__item">
          <span
            className={`signup-timeline__dot ${
              index < completedSteps ? "is-active" : ""
            }`}
            aria-hidden="true"
          />

          {index < steps.length - 1 && (
            <span
              className={`signup-timeline__segment ${
                index < completedSteps ? "is-active" : ""
              }`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}