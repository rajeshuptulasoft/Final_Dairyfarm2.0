import React from "react";
import "../css/AboutFarmAnimation.css";

// Reusable Cloud Component
const Cloud = ({ top, delay, duration, scale, opacity }) => (
  <div 
    className="afa-cloud" 
    style={{ 
      top, 
      animationDelay: delay, 
      animationDuration: duration, 
      transform: `scale(${scale})`,
      opacity 
    }}
  >
    <div className="afa-cloud-shape"></div>
  </div>
);

// Reusable Bird Component
const Bird = ({ top, delay, duration, scale }) => (
  <div 
    className="afa-bird-wrapper" 
    style={{ top, animationDelay: delay, animationDuration: duration, transform: `scale(${scale})` }}
  >
    <div className="afa-bird"></div>
  </div>
);

// Reusable Butterfly Component
const Butterfly = ({ top, left, delay }) => (
  <div className="afa-butterfly" style={{ top, left, animationDelay: delay }}>
    <div className="afa-butterfly-wing left"></div>
    <div className="afa-butterfly-wing right"></div>
  </div>
);

// Reusable CSS Cow Component
const Cow = ({ direction, bottom, speed, delay, scale, isGrazing, zIndex, colorClass = "default" }) => {
  const wrapperClass = direction === "right" ? "afa-cow-move-right" : "afa-cow-move-left";
  const actionClass = isGrazing ? "afa-cow-grazing" : "afa-cow-walking";
  
  return (
    <div 
      className={`afa-cow-wrapper ${wrapperClass}`} 
      style={{ 
        bottom, 
        animationDuration: speed, 
        animationDelay: delay, 
        zIndex 
      }}
    >
      <div 
        className={`afa-cow ${actionClass} afa-cow-${colorClass}`} 
        style={{ transform: `scale(${scale}) ${direction === "left" ? "scaleX(-1)" : ""}` }}
      >
        <div className="afa-cow-shadow"></div>
        <div className="afa-cow-inner">
          {/* Legs */}
          <div className="afa-leg afa-leg-back-left"></div>
          <div className="afa-leg afa-leg-back-right"></div>
          <div className="afa-leg afa-leg-front-left"></div>
          <div className="afa-leg afa-leg-front-right"></div>
          
          {/* Body & Tail */}
          <div className="afa-tail"></div>
          <div className="afa-body">
            <div className="afa-spot afa-spot-1"></div>
            <div className="afa-spot afa-spot-2"></div>
            <div className="afa-spot afa-spot-3"></div>
          </div>
          
          {/* Head & Face */}
          <div className="afa-head-wrapper">
            <div className="afa-head">
              <div className="afa-ear afa-ear-left"></div>
              <div className="afa-ear afa-ear-right"></div>
              <div className="afa-horn afa-horn-left"></div>
              <div className="afa-horn afa-horn-right"></div>
              <div className="afa-eye"></div>
              <div className="afa-snout"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Farm Scene Component
const FarmScene = () => {
  return (
    <div className="afa-scene-window">
      {/* Sky & Sun */}
      <div className="afa-sky"></div>
      <div className="afa-sun"></div>
      
      {/* Clouds */}
      <Cloud top="15%" delay="0s" duration="40s" scale={1} opacity={0.8} />
      <Cloud top="25%" delay="-15s" duration="55s" scale={0.7} opacity={0.6} />
      <Cloud top="8%" delay="-25s" duration="45s" scale={1.2} opacity={0.9} />
      
      {/* Birds */}
      <Bird top="20%" delay="0s" duration="25s" scale={1} />
      <Bird top="15%" delay="-12s" duration="30s" scale={0.7} />
      <Bird top="28%" delay="-5s" duration="22s" scale={0.85} />

      {/* Distant Hills */}
      <div className="afa-hill afa-hill-back-left"></div>
      <div className="afa-hill afa-hill-back-right"></div>
      <div className="afa-hill afa-hill-front"></div>

      {/* Ground & Grass */}
      <div className="afa-ground"></div>
      
      {/* Particles */}
      <div className="afa-particles">
        <div className="afa-particle p1"></div>
        <div className="afa-particle p2"></div>
        <div className="afa-particle p3"></div>
        <div className="afa-particle p4"></div>
      </div>

      {/* Cows (Different depths, directions, and actions) */}
      <Cow direction="right" bottom="28%" speed="35s" delay="0s" scale={0.5} isGrazing={false} zIndex={5} colorClass="brown" />
      <Cow direction="left" bottom="22%" speed="28s" delay="-10s" scale={0.65} isGrazing={false} zIndex={6} colorClass="default" />
      <Cow direction="right" bottom="12%" speed="45s" delay="-22s" scale={0.85} isGrazing={true} zIndex={7} colorClass="default" />
      <Cow direction="left" bottom="5%" speed="20s" delay="-5s" scale={1} isGrazing={false} zIndex={8} colorClass="brown" />

      {/* Foreground Details (Fence, Butterflies, Grass Blades) */}
      <div className="afa-foreground">
        <div className="afa-fence">
          <div className="afa-fence-rail"></div>
          <div className="afa-fence-rail top"></div>
          <div className="afa-fence-post" style={{left: "15%"}}></div>
          <div className="afa-fence-post" style={{left: "35%"}}></div>
          <div className="afa-fence-post" style={{left: "65%"}}></div>
          <div className="afa-fence-post" style={{left: "85%"}}></div>
        </div>
        <Butterfly top="70%" left="25%" delay="0s" />
        <Butterfly top="60%" left="75%" delay="-3s" />
        
        <div className="afa-grass-blade gb1"></div>
        <div className="afa-grass-blade gb2"></div>
        <div className="afa-grass-blade gb3"></div>
        <div className="afa-grass-blade gb4"></div>
      </div>
    </div>
  );
};

// Main Export Component
export default function AboutFarmAnimation() {
  return (
    <section className="afa-section">
      <div className="container">
        <div className="afa-layout">
          
          {/* Left Column: Animation */}
          <div className="afa-visual-column">
            <FarmScene />
          </div>

          {/* Right Column: Content */}
          <div className="afa-content-column">
            <span className="afa-eyebrow">Our Story</span>
            <h2 className="afa-heading">
              Rooted in tradition.<br />
              Driven by purity.
            </h2>
            <p className="afa-paragraph">
              For generations, our family has been committed to ethical dairy farming. 
              We believe that happy, pasture-raised cows produce the finest milk. 
              Our expansive green fields give our herd the freedom to roam naturally, 
              while our sustainable practices ensure the land stays healthy for decades to come.
            </p>
            <p className="afa-paragraph">
              Experience the difference that true care and natural grazing bring to every glass.
            </p>
            <div className="afa-actions">
              <a href="/about" className="btn btn-primary">Discover Our Journey</a>
              <a href="/products" className="btn btn-outline afa-btn-outline">View Products</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}