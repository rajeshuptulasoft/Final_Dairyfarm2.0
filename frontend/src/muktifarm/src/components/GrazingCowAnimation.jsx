import "../css/animation.css";

/**
 * Original CSS-only farm scene:
 * sky → sun → clouds → birds → distant hills → field → grass → cows.
 * All movement (grazing head, tail swish, cloud drift, bird flap,
 * grass sway, sun pulse, dust particles) is driven by keyframes in
 * animation.css — no libraries, no images.
 */
export default function GrazingCowAnimation({ caption = "Our Farm at Sunrise" }) {
  return (
    <div className="farm-scene" aria-label="Animated dairy farm scene">
      <div className="farm-sun" />
      <div className="sun-overlay" />

      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />

      <div className="bird bird-1" />
      <div className="bird bird-2" />
      <div className="bird bird-3" />

      <div className="hill hill-back" />
      <div className="hill" />
      <div className="field" />

      <Cow className="cow" />
      <Cow className="cow cow-2" />

      <div className="grass" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <span className="blade" key={i} />
        ))}
      </div>

      <div className="particles" aria-hidden="true">
        <span className="particle" />
        <span className="particle" />
        <span className="particle" />
        <span className="particle" />
        <span className="particle" />
        <span className="particle" />
      </div>

      {caption && <div className="scene-caption">🌿 {caption}</div>}
    </div>
  );
}

function Cow({ className }) {
  return (
    <div className={className}>
      <div className="cow-tail" />
      <div className="cow-body" />
      <div className="cow-leg l1" />
      <div className="cow-leg l2" />
      <div className="cow-leg l3" />
      <div className="cow-leg l4" />
      <div className="cow-head">
        <div className="cow-horn" />
      </div>
    </div>
  );
}
