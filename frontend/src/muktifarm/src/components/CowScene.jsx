import "../css/animations.css";

function Cow({ tone = "light", size = "main", pose = "graze", flip = false, className = "" }) {
  return (
    <div className={`mf-cow mf-cow-${tone} mf-cow-${size} mf-cow-${pose} ${flip ? "mf-cow-flip" : ""} ${className}`}>
      <div className="mf-cow-tail" />
      <div className="mf-cow-body">
        <span className="mf-cow-spot mf-cow-spot-one" />
        <span className="mf-cow-spot mf-cow-spot-two" />
        <span className="mf-cow-spot mf-cow-spot-three" />
      </div>
      <div className="mf-cow-neck" />
      <div className="mf-cow-head">
        <span className="mf-cow-ear mf-cow-ear-left" />
        <span className="mf-cow-ear mf-cow-ear-right" />
        <span className="mf-cow-horn mf-cow-horn-left" />
        <span className="mf-cow-horn mf-cow-horn-right" />
        <span className="mf-cow-eye" />
        <span className="mf-cow-muzzle" />
      </div>
      <span className="mf-cow-leg mf-cow-leg-one" />
      <span className="mf-cow-leg mf-cow-leg-two" />
      <span className="mf-cow-leg mf-cow-leg-three" />
      <span className="mf-cow-leg mf-cow-leg-four" />
      <span className="mf-cow-shadow" />
    </div>
  );
}

function Clouds({ count = 3, prefix = "mf" }) {
  return (
    <div className={`${prefix}-clouds`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className={`${prefix}-cloud ${prefix}-cloud-${index + 1}`} />
      ))}
    </div>
  );
}

function Birds({ count = 3, prefix = "mf" }) {
  return (
    <div className={`${prefix}-birds`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className={`${prefix}-bird ${prefix}-bird-${index + 1}`} />
      ))}
    </div>
  );
}

function Grass({ count = 34, prefix = "mf" }) {
  return (
    <div className={`${prefix}-grass`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={`${prefix}-grass-blade`}
          style={{ left: `${(index / count) * 100}%`, animationDelay: `${-(index % 9) * 0.22}s` }}
        />
      ))}
    </div>
  );
}

function Particles({ count = 16, prefix = "mf" }) {
  return (
    <div className={`${prefix}-particles`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={`${prefix}-particle`}
          style={{
            left: `${8 + ((index * 13) % 84)}%`,
            animationDelay: `${-(index % 8) * 0.7}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function CowScene({ variant }) {
  if (variant === "products") {
    return (
      <div className="mf-scene mf-products-scene" aria-hidden="true">
        <div className="mf-evening-sun" />
        <Clouds count={4} />
        <div className="mf-products-hills"><span /><span /></div>
        <div className="mf-products-fence">
          {Array.from({ length: 9 }).map((_, index) => <span key={index} className="mf-fence-post" />)}
          <i className="mf-fence-rail mf-fence-rail-top" />
          <i className="mf-fence-rail mf-fence-rail-bottom" />
        </div>
        <div className="mf-milk-can"><span /><i /></div>
        <Cow tone="cream" size="medium" pose="graze" className="mf-product-cow-one" />
        <Cow tone="dark" size="small" pose="graze" flip className="mf-product-cow-two" />
        <Cow tone="light" size="small" pose="stand" className="mf-product-cow-three" />
        <Grass count={42} />
        <Particles count={10} />
      </div>
    );
  }

  if (variant === "contact") {
    return (
      <div className="mf-scene mf-contact-scene" aria-hidden="true">
        <div className="mf-sunset-glow" />
        <Birds count={4} />
        <div className="mf-barn"><span className="mf-barn-roof" /><span className="mf-barn-wall" /><span className="mf-barn-door" /></div>
        <div className="mf-gate"><span /><span /><i /><i /></div>
        <div className="mf-tree mf-tree-left"><span /><i /></div>
        <div className="mf-tree mf-tree-right"><span /><i /></div>
        <Cow tone="cream" size="medium" pose="look" flip className="mf-contact-cow" />
        <Grass count={24} />
      </div>
    );
  }

  if (variant === "about") {
    return (
      <div className="mf-scene mf-about-scene" aria-hidden="true">
        <div className="mf-about-sun" />
        <Birds count={3} />
        <div className="mf-mist mf-mist-one" />
        <div className="mf-mist mf-mist-two" />
        <div className="mf-windmill">
          <span className="mf-windmill-tower" />
          <span className="mf-windmill-head" />
          <span className="mf-windmill-blades"><i /><i /><i /><i /></span>
        </div>
        <div className="mf-farmer"><span /><i /></div>
        <Cow tone="light" size="medium" pose="graze" className="mf-about-cow-one" />
        <Cow tone="dark" size="small" pose="stand" flip className="mf-about-cow-two" />
        <Grass count={36} />
      </div>
    );
  }

  return (
    <div className="mf-scene mf-home-scene" aria-hidden="true">
      <div className="mf-home-sun" />
      <Clouds count={3} />
      <Birds count={3} />
      <div className="mf-home-hills"><span /><span /></div>
      <div className="mf-home-farmhouse">
        <span className="mf-home-house-roof" />
        <span className="mf-home-house-wall" />
        <span className="mf-home-house-door" />
        <span className="mf-home-house-silo" />
      </div>
      <Cow tone="light" size="main" pose="stand" className="mf-home-cow-main mf-cow-walking" />
      <Cow tone="cream" size="small" pose="graze" flip className="mf-home-cow-back" />
      <Grass count={48} />
      <Particles count={18} />
      <div className="mf-wind-lines"><span /><span /><span /></div>
    </div>
  );
}
