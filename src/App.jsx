import { useState, useRef } from "react";

const FEATURES = [
  { id: "secrets", emoji: "🤫", label: "Hidden Secrets", sub: "What nobody tells you", color: "#FF6B6B", bg: "#FFF0F0" },
  { id: "costs", emoji: "💸", label: "Real Costs", sub: "Daily budget breakdown", color: "#FF9F43", bg: "#FFF5E6" },
  { id: "food", emoji: "🍽️", label: "Local Food", sub: "Where locals actually eat", color: "#00B894", bg: "#E6FFF8" },
  { id: "traps", emoji: "🚫", label: "Tourist Traps", sub: "Places & scams to avoid", color: "#E17055", bg: "#FFF0EE" },
  { id: "survival", emoji: "🧠", label: "Survival Tips", sub: "Culture, safety & packing", color: "#6C5CE7", bg: "#F0EEFF" },
  { id: "itinerary", emoji: "🗓️", label: "AI Itinerary", sub: "Your perfect day-by-day plan", color: "#00CEC9", bg: "#E6FFFE" },
];

const POPULAR = [
  { name: "Japan", flag: "🇯🇵", tag: "Cherry Blossoms & Ramen" },
  { name: "Italy", flag: "🇮🇹", tag: "Pizza, Art & Chaos" },
  { name: "Thailand", flag: "🇹🇭", tag: "Beaches & Street Food" },
  { name: "Morocco", flag: "🇲🇦", tag: "Souks & Sahara" },
  { name: "Turkey", flag: "🇹🇷", tag: "History & Hospitality" },
  { name: "Indonesia", flag: "🇮🇩", tag: "Temples & Waterfalls" },
];

const BUDGET_LEVELS = [
  { id: "budget", emoji: "🎒", label: "Backpacker", color: "#00B894" },
  { id: "mid", emoji: "🧳", label: "Mid-Range", color: "#FF9F43" },
  { id: "luxury", emoji: "💎", label: "Luxury", color: "#A29BFE" },
];

export default function TrueTrip() {
  const [screen, setScreen] = useState("home");
  const [destination, setDestination] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeFeature, setActiveFeature] = useState(null);
  const [aiContent, setAiContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState("mid");
  const [days, setDays] = useState(5);
  const [interests, setInterests] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const INTEREST_OPTIONS = ["🏛️ History", "🍜 Food", "🏖️ Beach", "🎭 Culture", "🛍️ Shopping", "🥾 Hiking", "📸 Photography", "🎵 Nightlife"];

  const fetchFeature = async (feature, dest) => {
    if (aiContent[feature]) return;
    setLoading(true);
    setError("");
    const prompts = {
      secrets: `Give me 6 hidden secrets and real honest tips about traveling to ${dest} that most travel blogs don't tell you. Include cultural surprises, common mistakes tourists make, and genuine insider knowledge. Format as JSON: {"tips": [{"title": "tip title", "desc": "description", "emoji": "relevant emoji"}]}`,
      costs: `Give realistic daily cost breakdown for ${dest} for ${budget} level travel. Include accommodation, food, transport, activities. Format as JSON: {"currency": "local currency", "daily_total": "X-Y USD", "breakdown": [{"category": "name", "emoji": "emoji", "budget": "X USD", "mid": "X USD", "luxury": "X USD", "tip": "money saving tip"}]}`,
      food: `Give 6 authentic local food spots and dishes to try in ${dest} that locals actually eat. Avoid tourist traps. Format as JSON: {"dishes": [{"name": "dish name", "where": "type of place", "price": "approximate price", "emoji": "food emoji", "tip": "ordering tip"}]}`,
      traps: `List 6 real tourist traps, scams and overpriced places to avoid in ${dest}. Be honest and specific. Format as JSON: {"traps": [{"name": "trap name", "warning": "what to watch out for", "alternative": "better option", "emoji": "warning emoji"}]}`,
      survival: `Give essential survival tips for ${dest} including culture rules, safety advice, what to pack, best apps to use, and key phrases. Format as JSON: {"tips": [{"category": "category name", "emoji": "emoji", "advice": "practical advice"}]}`,
      itinerary: `Create a ${days}-day itinerary for ${dest} for someone interested in ${interests.length > 0 ? interests.join(", ") : "general sightseeing"} with a ${budget} budget. Be specific with real places. Format as JSON: {"days": [{"day": 1, "theme": "day theme", "emoji": "emoji", "morning": "activity", "afternoon": "activity", "evening": "activity", "tip": "insider tip", "cost": "estimated daily cost"}]}`
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompts[feature] + " Return ONLY valid JSON, no markdown, no backticks."
        })
      });
      const data = await res.json();
      const raw = data.content[0].text.trim().replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);
      setAiContent(prev => ({ ...prev, [feature]: parsed }));
    } catch (e) {
      setError("Couldn't load this section. Please try again!");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    setDestination(searchInput.trim());
    setAiContent({});
    setActiveFeature(null);
    setScreen("destination");
  };

  const handleFeature = (featureId) => {
    setActiveFeature(featureId);
    setScreen("feature");
    fetchFeature(featureId, destination);
  };

  const toggleInterest = (interest) => {
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  const feat = FEATURES.find(f => f.id === activeFeature);
  const content = aiContent[activeFeature];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFF", fontFamily: "'Nunito', sans-serif", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Righteous&display=swap');
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .btn { border:none; cursor:pointer; transition:all 0.2s; }
        .btn:hover { transform:translateY(-2px); filter:brightness(1.05); }
        .btn:active { transform:scale(0.97); }
        .card { transition:all 0.25s; }
        .card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.12) !important; }
        .shimmer { background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:12px; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #FF6B6B 0%, #FF9F43 50%, #FECA57 100%)", padding: "16px 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(255,107,107,0.3)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => { setScreen("home"); setDestination(""); setSearchInput(""); }} style={{ cursor: "pointer" }}>
            <div style={{ fontFamily: "Righteous", fontSize: 26, color: "white", textShadow: "2px 2px 0 rgba(0,0,0,0.15)", lineHeight: 1 }}>
              🌍 TrueTrip
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, letterSpacing: 1 }}>
              Real travel. Real talk.
            </div>
          </div>
          {destination && (
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 20, padding: "6px 16px", color: "white", fontWeight: 800, fontSize: 14 }}>
              📍 {destination}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 16px" }}>

        {/* HOME SCREEN */}
        {screen === "home" && (
          <div style={{ animation: "slideUp 0.5s ease" }}>
            {/* Hero */}
            <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
              <div style={{ fontSize: 72, animation: "float 3s ease-in-out infinite", display: "inline-block", filter: "drop-shadow(3px 6px 12px rgba(0,0,0,0.15))" }}>✈️</div>
              <h1 style={{ fontFamily: "Righteous", fontSize: "clamp(28px,7vw,52px)", margin: "16px 0 8px", background: "linear-gradient(135deg, #FF6B6B, #FF9F43, #FECA57)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Travel Smart
              </h1>
              <p style={{ fontSize: 17, color: "#636E72", fontWeight: 600, margin: "0 0 32px", lineHeight: 1.5 }}>
                Real tips. Honest costs. Local secrets.<br/>
                <span style={{ color: "#FF6B6B" }}>No tourist traps.</span> No fake reviews.
              </p>

              {/* Search */}
              <div style={{ background: "white", borderRadius: 24, padding: "8px 8px 8px 20px", display: "flex", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "2px solid #FFE8D6", marginBottom: 32 }}>
                <input ref={inputRef} value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder="Where are you going? 🌍" style={{ flex: 1, border: "none", outline: "none", fontSize: 16, fontFamily: "Nunito", fontWeight: 700, color: "#2D3436", background: "transparent" }} />
                <button onClick={handleSearch} className="btn"
                  style={{ background: "linear-gradient(135deg, #FF6B6B, #FF9F43)", color: "white", borderRadius: 16, padding: "14px 24px", fontFamily: "Nunito", fontWeight: 800, fontSize: 15, boxShadow: "0 4px 16px rgba(255,107,107,0.4)" }}>
                  Explore ✨
                </button>
              </div>

              {/* Popular destinations */}
              <div style={{ textAlign: "left", marginBottom: 32 }}>
                <h3 style={{ fontFamily: "Righteous", fontSize: 20, color: "#2D3436", marginBottom: 14 }}>🔥 Popular Right Now</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {POPULAR.map(p => (
                    <button key={p.name} onClick={() => { setSearchInput(p.name); setDestination(p.name); setAiContent({}); setActiveFeature(null); setScreen("destination"); }} className="btn card"
                      style={{ background: "white", borderRadius: 18, padding: "16px", textAlign: "left", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "2px solid #F0F0F0" }}>
                      <div style={{ fontSize: 32, marginBottom: 6 }}>{p.flag}</div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#2D3436", marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#B2BEC3", fontWeight: 600 }}>{p.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features preview */}
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontFamily: "Righteous", fontSize: 20, color: "#2D3436", marginBottom: 14 }}>💡 What You'll Discover</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {FEATURES.map(f => (
                    <div key={f.id} style={{ background: f.bg, borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, border: `2px solid ${f.color}25` }}>
                      <div style={{ fontSize: 28, flexShrink: 0 }}>{f.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#2D3436" }}>{f.label}</div>
                        <div style={{ fontSize: 12, color: "#636E72", fontWeight: 600 }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DESTINATION SCREEN */}
        {screen === "destination" && (
          <div style={{ animation: "slideUp 0.4s ease", paddingTop: 24 }}>
            {/* Destination header */}
            <div style={{ background: "linear-gradient(135deg, #FF6B6B20, #FECA5720)", borderRadius: 24, padding: "28px 24px", marginBottom: 24, textAlign: "center", border: "2px solid #FF9F4330" }}>
              <div style={{ fontSize: 64, marginBottom: 8, animation: "float 3s ease-in-out infinite", display: "inline-block" }}>
                {POPULAR.find(p => p.name.toLowerCase() === destination.toLowerCase())?.flag || "🌍"}
              </div>
              <h2 style={{ fontFamily: "Righteous", fontSize: "clamp(24px,6vw,40px)", color: "#2D3436", margin: "8px 0 4px" }}>{destination}</h2>
              <p style={{ color: "#636E72", fontWeight: 700, fontSize: 14, margin: "0 0 20px" }}>Powered by AI — Real info, honest advice ✨</p>

              {/* Budget selector */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                {BUDGET_LEVELS.map(b => (
                  <button key={b.id} onClick={() => setBudget(b.id)} className="btn"
                    style={{ background: budget === b.id ? b.color : "white", color: budget === b.id ? "white" : "#636E72", borderRadius: 16, padding: "8px 16px", fontFamily: "Nunito", fontWeight: 800, fontSize: 13, border: `2px solid ${b.color}40`, boxShadow: budget === b.id ? `0 4px 12px ${b.color}40` : "none" }}>
                    {b.emoji} {b.label}
                  </button>
                ))}
              </div>

              {/* Days selector */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <span style={{ fontWeight: 700, color: "#636E72", fontSize: 14 }}>📅 Days:</span>
                {[3, 5, 7, 10, 14].map(d => (
                  <button key={d} onClick={() => setDays(d)} className="btn"
                    style={{ background: days === d ? "#FF6B6B" : "white", color: days === d ? "white" : "#636E72", borderRadius: 12, padding: "6px 14px", fontFamily: "Nunito", fontWeight: 800, fontSize: 14, border: "2px solid #FF6B6B40" }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature grid */}
            <h3 style={{ fontFamily: "Righteous", fontSize: 20, color: "#2D3436", marginBottom: 14 }}>
              🗺️ Explore {destination}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {FEATURES.map(f => (
                <button key={f.id} onClick={() => handleFeature(f.id)} className="btn card"
                  style={{ background: f.bg, borderRadius: 20, padding: "20px 16px", textAlign: "center", border: `2px solid ${f.color}30`, boxShadow: `0 6px 20px ${f.color}15`, position: "relative", overflow: "hidden" }}>
                  {aiContent[f.id] && <div style={{ position: "absolute", top: 10, right: 10, background: "#00B894", borderRadius: 10, width: 10, height: 10 }} />}
                  <div style={{ fontSize: 40, marginBottom: 8 }}>{f.emoji}</div>
                  <div style={{ fontWeight: 900, fontSize: 15, color: "#2D3436", marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: "#636E72", fontWeight: 600 }}>{f.sub}</div>
                  <div style={{ marginTop: 10, background: f.color, color: "white", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 800, display: "inline-block" }}>
                    {aiContent[f.id] ? "View ✓" : "Ask AI →"}
                  </div>
                </button>
              ))}
            </div>

            {/* Interests for itinerary */}
            <div style={{ background: "white", borderRadius: 20, padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", marginBottom: 16, border: "2px solid #F0F0F0" }}>
              <h4 style={{ fontWeight: 900, fontSize: 16, color: "#2D3436", margin: "0 0 12px" }}>🎯 Your Interests (for itinerary)</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {INTEREST_OPTIONS.map(i => (
                  <button key={i} onClick={() => toggleInterest(i)} className="btn"
                    style={{ background: interests.includes(i) ? "#FF6B6B" : "#F8F9FA", color: interests.includes(i) ? "white" : "#636E72", borderRadius: 20, padding: "8px 14px", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, border: interests.includes(i) ? "2px solid #FF6B6B" : "2px solid #E0E0E0" }}>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* New search */}
            <div style={{ background: "white", borderRadius: 20, padding: "8px 8px 8px 16px", display: "flex", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "2px solid #F0F0F0" }}>
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search another destination..." style={{ flex: 1, border: "none", outline: "none", fontSize: 15, fontFamily: "Nunito", fontWeight: 700, color: "#2D3436" }} />
              <button onClick={handleSearch} className="btn"
                style={{ background: "linear-gradient(135deg,#FF6B6B,#FF9F43)", color: "white", borderRadius: 14, padding: "12px 20px", fontFamily: "Nunito", fontWeight: 800, fontSize: 14 }}>
                Go ✨
              </button>
            </div>
          </div>
        )}

        {/* FEATURE DETAIL SCREEN */}
        {screen === "feature" && feat && (
          <div style={{ animation: "slideUp 0.4s ease", paddingTop: 20 }}>
            {/* Feature header */}
            <div style={{ background: `linear-gradient(135deg, ${feat.color}20, ${feat.color}10)`, borderRadius: 24, padding: "24px", marginBottom: 20, textAlign: "center", border: `2px solid ${feat.color}30` }}>
              <div style={{ fontSize: 56, marginBottom: 8 }}>{feat.emoji}</div>
              <h2 style={{ fontFamily: "Righteous", fontSize: 26, color: "#2D3436", margin: "0 0 4px" }}>{feat.label}</h2>
              <p style={{ color: feat.color, fontWeight: 700, fontSize: 14, margin: 0 }}>{destination} — AI Powered ✨</p>
            </div>

            {/* Loading state */}
            {loading && !content && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} className="shimmer" style={{ height: 90, animationDelay: `${i*0.1}s` }} />
                ))}
                <div style={{ textAlign: "center", padding: "16px", color: feat.color, fontWeight: 800, animation: "pulse 1.5s infinite" }}>
                  🤖 AI is researching {destination}...
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: "#FFE8E8", borderRadius: 16, padding: "20px", textAlign: "center", color: "#FF6B6B", fontWeight: 700, marginBottom: 16 }}>
                😅 {error}
                <br/>
                <button onClick={() => fetchFeature(activeFeature, destination)} className="btn"
                  style={{ marginTop: 10, background: "#FF6B6B", color: "white", borderRadius: 12, padding: "8px 20px", fontFamily: "Nunito", fontWeight: 800 }}>
                  Try Again
                </button>
              </div>
            )}

            {/* SECRETS */}
            {activeFeature === "secrets" && content?.tips && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {content.tips.map((tip, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 18, padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "2px solid #FF6B6B15", animation: `slideUp 0.4s ease ${i*0.08}s both` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ fontSize: 28, flexShrink: 0 }}>{tip.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 15, color: "#2D3436", marginBottom: 4 }}>{tip.title}</div>
                        <div style={{ fontSize: 14, color: "#636E72", lineHeight: 1.6 }}>{tip.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* COSTS */}
            {activeFeature === "costs" && content?.breakdown && (
              <div>
                <div style={{ background: "linear-gradient(135deg,#FF9F43,#FECA57)", borderRadius: 20, padding: "20px", marginBottom: 16, textAlign: "center" }}>
                  <div style={{ fontWeight: 900, fontSize: 14, color: "white", marginBottom: 4 }}>ESTIMATED DAILY COST</div>
                  <div style={{ fontFamily: "Righteous", fontSize: 36, color: "white" }}>{content.daily_total}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 700 }}>{BUDGET_LEVELS.find(b=>b.id===budget)?.label} traveler</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {content.breakdown.map((item, i) => (
                    <div key={i} style={{ background: "white", borderRadius: 16, padding: "16px 18px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", animation: `slideUp 0.4s ease ${i*0.08}s both` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontSize: 24 }}>{item.emoji}</span>
                          <span style={{ fontWeight: 800, fontSize: 15, color: "#2D3436" }}>{item.category}</span>
                        </div>
                        <span style={{ fontWeight: 900, fontSize: 15, color: "#FF9F43" }}>{item[budget]}</span>
                      </div>
                      {item.tip && <div style={{ fontSize: 12, color: "#00B894", fontWeight: 700, background: "#E6FFF8", borderRadius: 8, padding: "6px 10px" }}>💡 {item.tip}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FOOD */}
            {activeFeature === "food" && content?.dishes && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {content.dishes.map((dish, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 18, padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "2px solid #00B89415", animation: `slideUp 0.4s ease ${i*0.08}s both` }}>
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{ fontSize: 40, flexShrink: 0 }}>{dish.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <div style={{ fontWeight: 900, fontSize: 16, color: "#2D3436" }}>{dish.name}</div>
                          <div style={{ background: "#E6FFF8", color: "#00B894", borderRadius: 10, padding: "3px 10px", fontSize: 12, fontWeight: 800 }}>{dish.price}</div>
                        </div>
                        <div style={{ fontSize: 13, color: "#636E72", marginBottom: 6 }}>📍 {dish.where}</div>
                        <div style={{ fontSize: 12, color: "#FF9F43", fontWeight: 700 }}>💡 {dish.tip}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TRAPS */}
            {activeFeature === "traps" && content?.traps && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {content.traps.map((trap, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 18, padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "2px solid #E1705520", animation: `slideUp 0.4s ease ${i*0.08}s both` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ fontSize: 28, flexShrink: 0 }}>{trap.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 15, color: "#E17055", marginBottom: 4 }}>⚠️ {trap.name}</div>
                        <div style={{ fontSize: 14, color: "#636E72", marginBottom: 8, lineHeight: 1.6 }}>{trap.warning}</div>
                        <div style={{ background: "#E6FFF8", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "#00B894", fontWeight: 700 }}>✅ Instead: {trap.alternative}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SURVIVAL */}
            {activeFeature === "survival" && content?.tips && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {content.tips.map((tip, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 18, padding: "18px 20px", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "2px solid #6C5CE720", animation: `slideUp 0.4s ease ${i*0.08}s both` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ fontSize: 28, flexShrink: 0 }}>{tip.emoji}</div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 14, color: "#6C5CE7", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{tip.category}</div>
                        <div style={{ fontSize: 14, color: "#2D3436", lineHeight: 1.7 }}>{tip.advice}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ITINERARY */}
            {activeFeature === "itinerary" && content?.days && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {content.days.map((day, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.08)", animation: `slideUp 0.4s ease ${i*0.1}s both` }}>
                    <div style={{ background: `linear-gradient(135deg, #00CEC9, #00B894)`, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontFamily: "Righteous", fontSize: 18, color: "white" }}>Day {day.day}</div>
                      <div style={{ fontSize: 20 }}>{day.emoji}</div>
                      <div style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 14 }}>{day.theme}</div>
                      {day.cost && <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "3px 10px", color: "white", fontSize: 12, fontWeight: 800 }}>~{day.cost}</div>}
                    </div>
                    <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {[["🌅 Morning", day.morning], ["☀️ Afternoon", day.afternoon], ["🌙 Evening", day.evening]].map(([time, act]) => act && (
                        <div key={time} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ fontWeight: 800, fontSize: 13, color: "#636E72", minWidth: 90, flexShrink: 0 }}>{time}</div>
                          <div style={{ fontSize: 14, color: "#2D3436", lineHeight: 1.5 }}>{act}</div>
                        </div>
                      ))}
                      {day.tip && (
                        <div style={{ background: "#FFF5E6", borderRadius: 10, padding: "10px 14px", marginTop: 4, fontSize: 13, color: "#FF9F43", fontWeight: 700 }}>
                          💡 Local tip: {day.tip}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Back to destination */}
            {content && (
              <button onClick={() => setScreen("destination")} className="btn"
                style={{ width: "100%", marginTop: 20, background: "linear-gradient(135deg,#FF6B6B,#FF9F43)", color: "white", borderRadius: 20, padding: "16px", fontFamily: "Nunito", fontWeight: 900, fontSize: 16, boxShadow: "0 8px 24px rgba(255,107,107,0.35)" }}>
                ← Back to {destination}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", padding: "10px 20px 16px", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", display: "flex", justifyContent: "space-around", zIndex: 100 }}>
        {[
          { icon: "🏠", label: "Home", action: () => { setScreen("home"); setDestination(""); setSearchInput(""); }},
          { icon: "🗺️", label: "Explore", action: () => destination ? setScreen("destination") : setScreen("home") },
          { icon: "💸", label: "Costs", action: () => { if(destination){ handleFeature("costs"); } }},
          { icon: "🗓️", label: "Plan", action: () => { if(destination){ handleFeature("itinerary"); } }},
        ].map((nav, i) => (
          <button key={i} onClick={nav.action} className="btn"
            style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ fontSize: 22 }}>{nav.icon}</div>
            <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 11, color: "#B2BEC3" }}>{nav.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
