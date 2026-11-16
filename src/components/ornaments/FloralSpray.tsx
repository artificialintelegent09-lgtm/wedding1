import { Berry, Bud, FloralSvg, Leaf, Rose, Vine } from "./botanical";

/** A symmetrical horizontal floral crown: used above titles and in the closing. */
export function FloralSpray({ className }: { className?: string }) {
  // Build the left half, mirror it for the right half.
  const half = (
    <>
      <Vine d="M300 118C250 112 206 92 168 70S88 36 24 44" />
      <Vine d="M300 124C240 134 196 150 150 150S70 132 30 104" width={1.1} />
      <Leaf x={252} y={106} rotate={-26} length={52} tone="olive" />
      <Leaf x={236} y={132} rotate={30} length={50} tone="olive" />
      <Leaf x={196} y={86} rotate={-44} length={46} tone="gold" />
      <Leaf x={186} y={142} rotate={22} length={46} tone="gold" />
      <Leaf x={140} y={58} rotate={-30} length={42} tone="gold" />
      <Leaf x={118} y={148} rotate={14} length={40} tone="olive" />
      <Leaf x={74} y={40} rotate={-10} length={38} tone="gold" />
      <Leaf x={72} y={128} rotate={26} length={36} tone="gold" />
      <Vine d="M158 70C150 40 154 22 170 8" width={0.8} />
      <Berry x={170} y={8} r={3.8} />
      <Berry x={160} y={22} r={2.8} />
      <Vine d="M104 142C98 164 100 176 110 188" width={0.8} />
      <Berry x={110} y={190} r={3.6} />
      <Bud x={30} y={46} rotate={-96} scale={0.8} tone="blush" />
      <Bud x={34} y={106} rotate={-60} scale={0.8} tone="wine" />
      <Rose x={214} y={112} rotate={14} scale={0.78} tone="blush" />
      <Rose x={152} y={96} rotate={-20} scale={0.9} tone="wine" />
      <Rose x={94} y={80} rotate={32} scale={0.62} tone="ivory" />
    </>
  );

  return (
    <FloralSvg viewBox="0 0 600 200" className={className}>
      <g>{half}</g>
      <g transform="translate(600 0) scale(-1 1)">{half}</g>
      <Rose x={300} y={108} rotate={0} scale={1.28} tone="wine" />
      <Rose x={300} y={108} rotate={36} scale={0.5} tone="ivory" />
    </FloralSvg>
  );
}
