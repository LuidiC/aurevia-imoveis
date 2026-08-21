export function HeroPropertyVisual() {
  // Composição temporária isolada para futura substituição por uma fotografia real.
  return (
    <figure className="relative isolate min-h-72 overflow-hidden rounded-lg border border-white/15 bg-accent text-accent-foreground shadow-soft sm:min-h-88 lg:min-h-[25rem]">
      <svg
        aria-labelledby="hero-visual-title hero-visual-description"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        viewBox="0 0 680 500"
      >
        <title id="hero-visual-title">Composição gráfica de uma residência</title>
        <desc id="hero-visual-description">
          Ilustração temporária que será substituída por uma fotografia real de
          imóvel.
        </desc>
        <rect fill="#E3ECE8" height="500" width="680" />
        <circle cx="574" cy="98" fill="#D1E0DA" r="158" />
        <circle cx="92" cy="430" fill="#EDF3F0" r="190" />
        <path
          d="M98 407h484M154 401V254l191-142 181 142v147M221 210v-74h83v37M240 401V288h111v113M409 282h67v71h-67z"
          stroke="#53786D"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="10"
        />
        <path
          d="m125 272 220-165 216 165"
          stroke="#35584C"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="18"
        />
        <path
          d="M68 407h544"
          stroke="#35584C"
          strokeLinecap="round"
          strokeWidth="12"
        />
      </svg>
    </figure>
  );
}
