export default function WorkoutVideoCard({ exercise }) {
  return (
    <article className="my-workout-page__video-card">
      <div className="my-workout-page__video-frame">
        <video
          className="my-workout-page__video"
          src={exercise.video}
          controls
          preload="metadata"
        />
      </div>

      <h3 className="my-workout-page__video-title">{exercise.title}</h3>
      <p className="my-workout-page__video-meta">{exercise.meta}</p>
    </article>
  );
}
