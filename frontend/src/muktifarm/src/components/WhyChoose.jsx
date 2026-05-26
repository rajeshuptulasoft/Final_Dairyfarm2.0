import trustedPastureImage from "../../../assets/images/Trusted transparent and premium from pasture to plate..png";

const POINTS = [
  {
    title: "Transparent sourcing",
    description: "We share how every batch is produced, from morning milking to delivery.",
    icon: "🔍"
  },
  {
    title: "Healthy herd care",
    description: "Daily nutrition, pasture rotation, and vet support keep our animals thriving.",
    icon: "🐄"
  },
  {
    title: "Freshness guaranteed",
    description: "Milk bottled and delivered within hours, never left sitting in storage.",
    icon: "🌿"
  },
];

export default function WhyChoose() {
  return (
    <section className="section why-section" style={{ position: "relative", backgroundColor: "#fbfcfb", padding: "120px 0", overflow: "hidden" }}>
      {/* Decorative background elements */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(129,199,132,0.15) 0%, rgba(255,255,255,0) 70%)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(46,125,50,0.08) 0%, rgba(255,255,255,0) 70%)", zIndex: 0 }} />

      <div className="container why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))", gap: "4rem", alignItems: "center", position: "relative", zIndex: 1 }}>
        
        <div className="why-visual" style={{ position: "relative", minHeight: "500px", borderRadius: "2rem", overflow: "hidden", boxShadow: "0 25px 50px rgba(46,125,50,0.15)", background: "#e8f5e9" }}>
          <img
            src={trustedPastureImage}
            alt="Trusted, transparent and premium from pasture to plate"
            style={{ width: "100%", height: "100%", minHeight: "500px", objectFit: "cover", display: "block" }}
          />
        </div>

        <div className="why-copy">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#e8f5e9", padding: "0.5rem 1.25rem", borderRadius: "100px", marginBottom: "1.5rem", border: "1px solid #c8e6c9" }}>
             <span style={{ fontSize: "1.2rem" }}>✨</span>
             <p className="eyebrow" style={{ margin: 0, color: "#2E7D32", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", fontSize: "0.85rem" }}>Designed for modern homes</p>
          </div>
          
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.2, color: "#1B5E20", marginBottom: "1.5rem", fontWeight: 800 }}>
            Trusted, transparent and premium from <span style={{ color: "#4CAF50", position: "relative" }}>pasture to plate.<svg style={{position: "absolute", bottom: "-5px", left: 0, width: "100%", height: "8px", color: "#81C784"}} viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00035 6.64563C47.8863 1.93605 113.882 -0.835474 198.001 6.64563" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></span>
          </h2>
          
          <p style={{ fontSize: "1.1rem", color: "#5b6b5e", lineHeight: 1.7, marginBottom: "3rem" }}>
            Our entire farm and kitchen system is built to deliver dairy that feels fresh, safe, and indulgent every day. Experience the difference of true farm-to-table quality.
          </p>
          
          <div className="why-list" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {POINTS.map((item) => (
              <article key={item.title} className="why-card" style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", background: "white", borderRadius: "1.25rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #f0f7f1", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", cursor: "default" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 25px rgba(46,125,50,0.1)"; e.currentTarget.style.borderColor = "#c8e6c9"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)"; e.currentTarget.style.borderColor = "#f0f7f1"; }}>
                <div style={{ fontSize: "2rem", background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "1rem", flexShrink: 0, color: "#2E7D32", boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5)" }}>
                  {item.icon}
                </div>
                <div>
                  <strong style={{ fontSize: "1.25rem", color: "#1B1B1B", display: "block", marginBottom: "0.5rem", fontWeight: 700 }}>{item.title}</strong>
                  <p style={{ margin: 0, color: "#5b6b5e", lineHeight: 1.6, fontSize: "0.95rem" }}>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
