"use client";

// Deterministic pseudo-random generator.
// The same seed always produces the same value.
function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Round values so server and client serialize them identically.
function round(value: number, decimals = 4): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

type StarLayerProps = {
  count: number;
  seedOffset: number;
  size: [number, number];
  opacity: [number, number];
  className?: string;
};

function StarLayer({
  count,
  seedOffset,
  size,
  opacity,
  className,
}: StarLayerProps) {
  const stars = Array.from({ length: count }, (_, i) => {
    const s = seedOffset + i;

    const top = round(seeded(s * 12.9898) * 100);
    const left = round(seeded(s * 78.233) * 100);

    const sz = round(
      size[0] +
        seeded(s * 37.719) * (size[1] - size[0])
    );

    const op = round(
      opacity[0] +
        seeded(s * 4.271) * (opacity[1] - opacity[0])
    );

    const delay = round(seeded(s * 91.345) * 6);

    const duration = round(
      2.5 + seeded(s * 15.61) * 3.5
    );

    return (
      <span
        key={s}
        className="absolute rounded-full animate-twinkle"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${sz}px`,
          height: `${sz}px`,
          backgroundColor: "var(--cosmic-star)",
          opacity: op,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          ...(sz > 1.6
            ? {
                boxShadow:
                  "0 0 6px 1px var(--cosmic-star)",
              }
            : {}),
        }}
      />
    );
  });

  return (
    <div
      className={`absolute inset-0 ${className ?? ""}`}
    >
      {stars}
    </div>
  );
}

export default function Starfield() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Nebula glows */}

      <div
        className="absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full blur-[110px] animate-glow-pulse"
        style={{
          backgroundColor: "var(--cosmic-nebula-1)",
        }}
      />

      <div
        className="absolute -right-24 top-1/4 h-[26rem] w-[26rem] rounded-full blur-[100px] animate-float-slow"
        style={{
          backgroundColor: "var(--cosmic-nebula-2)",
        }}
      />

      <div
        className="absolute bottom-[-10rem] left-1/4 h-[30rem] w-[30rem] rounded-full blur-[120px] animate-float-slow"
        style={{
          backgroundColor: "var(--cosmic-nebula-3)",
          animationDelay: "-3s",
        }}
      />

      {/* Star layers */}

      <StarLayer
        count={70}
        seedOffset={1}
        size={[0.6, 1.2]}
        opacity={[0.2, 0.5]}
      />

      <StarLayer
        count={45}
        seedOffset={500}
        size={[1, 1.8]}
        opacity={[0.35, 0.75]}
      />

      <StarLayer
        count={22}
        seedOffset={1200}
        size={[1.6, 2.4]}
        opacity={[0.5, 0.95]}
      />

      {/* Shooting stars */}

      <div
        className="absolute right-[15%] top-[12%] h-px w-24 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--cosmic-star), transparent)",
          animation:
            "shootingStar 7s ease-in infinite",
          animationDelay: "1.5s",
        }}
      />

      <div
        className="absolute right-[35%] top-[38%] h-px w-16 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--cosmic-star), transparent)",
          animation:
            "shootingStar 9s ease-in infinite",
          animationDelay: "5s",
        }}
      />
    </div>
  );
}
