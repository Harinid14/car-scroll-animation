"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const carRef = useRef(null);
  const greenRevealRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);
  const stat4Ref = useRef(null);
  const stepRef = useRef(0);
  const isAnimating = useRef(false);

  const BAND_HEIGHT = 280;
  const GREEN = "#4ade80";

  useEffect(() => {
    gsap.set(carRef.current, { x: "-400px" });
    gsap.set(greenRevealRef.current, { width: "0%" });
    gsap.set(
      [stat1Ref.current, stat2Ref.current, stat3Ref.current, stat4Ref.current],
      { opacity: 0, y: 40, scale: 0.88 }
    );

    // Entrance — fast
    gsap.timeline({ delay: 0.2 })
      .to(carRef.current, { x: "-60px", duration: 0.6, ease: "power3.out" })
      .to(greenRevealRef.current, { width: "4%", duration: 0.6, ease: "power3.out" }, "<");

    // Spacebar steps — on step 4 car drives completely off screen right
    const carStops   = ["5vw",  "22vw", "38vw", "110vw"];
    const greenStops = ["13%",  "31%",  "47%",  "100%"];

    const handleKey = (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (isAnimating.current || stepRef.current >= 4) return;
      isAnimating.current = true;

      const next = stepRef.current + 1;
      stepRef.current = next;

      const tl = gsap.timeline({
        onComplete: () => { isAnimating.current = false; },
      });

      tl.to(carRef.current, { x: carStops[next - 1], duration: 0.45, ease: "power2.inOut" });
      tl.to(greenRevealRef.current, { width: greenStops[next - 1], duration: 0.45, ease: "power2.inOut" }, "<");

      const cards = [stat1Ref, stat2Ref, stat3Ref, stat4Ref];
      tl.to(cards[next - 1].current, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.7)" }, "-=0.45");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div style={{ background: "#c8c8c8", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* ── STAT CARDS ──────────────────────────────────────────── */}
      <div ref={stat1Ref} style={{ position: "fixed", top: "7%", right: "27%", zIndex: 30 }}>
        <StatCard value="58%" label="Increase in pick up point use" bg="#c8e64c" textColor="#111" />
      </div>
      <div ref={stat2Ref} style={{ position: "fixed", bottom: "9%", left: "37%", zIndex: 30 }}>
        <StatCard value="23%" label="Decreased in customer phone calls" bg="#7ec8e3" textColor="#111" />
      </div>
      <div ref={stat3Ref} style={{ position: "fixed", top: "7%", right: "1%", zIndex: 30 }}>
        <StatCard value="27%" label="Increase in pick up point use" bg="#2a2a2a" textColor="#fff" />
      </div>
      <div ref={stat4Ref} style={{ position: "fixed", bottom: "9%", right: "3%", zIndex: 30 }}>
        <StatCard value="40%" label="Decreased in customer phone calls" bg="#f4873a" textColor="#111" />
      </div>

      {/* ── MIDDLE BAND ──────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: "50%", left: 0, right: 0,
        transform: "translateY(-50%)",
        height: `${BAND_HEIGHT}px`,
        overflow: "hidden",
      }}>

        {/* Layer 1 — BLACK road — pure black so text is 100% invisible */}
        <div style={{ position: "absolute", inset: 0, background: "#000000", zIndex: 1 }} />

        {/* Layer 2 — GREEN reveal */}
        <div ref={greenRevealRef} style={{
          position: "absolute", left: 0, top: 0,
          width: "0%", height: "100%",
          background: GREEN, zIndex: 2,
        }} />

        {/*
          Layer 3 — TWO copies of headline stacked:
          
          COPY A (black text, zIndex 3) — sits above green, VISIBLE on green, hidden on black
          COPY B (dark text with clip) — only shows in the black zone
          
          Simplest trick: just use black text. On black bg = invisible. On green = visible.
          Make road darker #111 so contrast is even better.
        */}
        <div style={{
          position: "absolute",
          left: 0, top: "50%",
          transform: "translateY(-50%)",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          paddingLeft: "2%",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          // Clip text so it doesn't overflow past green area
          width: "100%",
        }}>
          {"W E L C O M E   I T Z F I Z Z".split("").map((char, i) => (
            <span key={i} style={{
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.6rem, 7vw, 7.5rem)",
              // Pure black text = invisible on #111 black road
              // Perfectly visible on green
              color: "#000000",
              lineHeight: 1,
              whiteSpace: "pre",
              WebkitTextStroke: "1px #000000",
            }}>
              {char}
            </span>
          ))}
        </div>

        {/* Layer 4 — CAR (highest layer) */}
        <div ref={carRef} style={{
          position: "absolute",
          top: 0, left: 0,
          height: `${BAND_HEIGHT}px`,
          width: "auto",
          zIndex: 8,
        }}>
          <img
            src="/car-scroll-animation/car.png"
            alt="McLaren"
            style={{
              height: `${BAND_HEIGHT}px`,
              width: "auto",
              display: "block",
              mixBlendMode: "screen",
            }}
          />
        </div>

      </div>
    </div>
  );
}

function StatCard({ value, label, bg, textColor }) {
  return (
    <div style={{
      background: bg, color: textColor,
      borderRadius: "14px", padding: "26px 34px",
      minWidth: "240px", maxWidth: "300px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.16)",
    }}>
      <div style={{
        fontFamily: "'Arial Black', Impact, sans-serif",
        fontWeight: 900,
        fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
        lineHeight: 1, marginBottom: "8px",
      }}>{value}</div>
      <div style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "14px", lineHeight: 1.4, opacity: 0.85,
      }}>{label}</div>
    </div>
  );
}
