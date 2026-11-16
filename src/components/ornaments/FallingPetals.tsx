/**
 * A few CSS-only petals drifting down. Transform/opacity only, positions are
 * fixed so server and client markup match. Hidden for reduced-motion users.
 */
const PETALS = [
  { left: "6%", size: 14, delay: "0s", duration: "17s", drift: "60px" },
  { left: "17%", size: 10, delay: "5s", duration: "21s", drift: "-40px" },
  { left: "29%", size: 16, delay: "11s", duration: "19s", drift: "50px" },
  { left: "42%", size: 9, delay: "2s", duration: "23s", drift: "-70px" },
  { left: "55%", size: 13, delay: "8s", duration: "18s", drift: "40px" },
  { left: "68%", size: 11, delay: "14s", duration: "22s", drift: "-50px" },
  { left: "79%", size: 15, delay: "3s", duration: "20s", drift: "70px" },
  { left: "91%", size: 10, delay: "9s", duration: "24s", drift: "-30px" },
];

export function FallingPetals({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden ${className}`}
    >
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block will-change-transform"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.25,
            borderRadius: "100% 0 100% 0",
            background: i % 3 === 0 ? "linear-gradient(135deg,#f3cdc6,#d9908f)" : "linear-gradient(135deg,#a53a54,#6d1a31)",
            opacity: 0,
            animation: `petal-fall ${p.duration} linear ${p.delay} infinite`,
            ["--drift" as string]: p.drift,
          }}
        />
      ))}
    </div>
  );
}
