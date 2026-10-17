const WORDS = [
  { w: "typescript", left: "7%", top: "16%", c: "", d: "6s", dl: "0s" },
  { w: "fastapi", left: "auto", right: "8%", top: "22%", c: "c-cyan", d: "7.5s", dl: "-2s" },
  { w: "docker", left: "11%", top: "60%", c: "c-cyan", d: "8s", dl: "-4s" },
  { w: "postgresql", left: "auto", right: "10%", top: "56%", c: "", d: "6.8s", dl: "-1s" },
  { w: "react", left: "21%", top: "6%", c: "c-white", d: "7.2s", dl: "-3s" },
  { w: "security", left: "auto", right: "21%", top: "8%", c: "", d: "8.4s", dl: "-5s" },
  { w: "redis", left: "15%", top: "84%", c: "", d: "7.8s", dl: "-2.5s" },
  { w: "ship it", left: "auto", right: "16%", top: "82%", c: "c-cyan", d: "6.4s", dl: "-0.8s" },
];

export default function OrbitWords() {
  return (
    <div className="orbit-words" aria-hidden="true">
      {WORDS.map((item) => (
        <span
          key={item.w}
          className={`orbit-word ${item.c}`}
          style={{
            left: item.left,
            right: item.right,
            top: item.top,
            animationDuration: item.d,
            animationDelay: item.dl,
          }}
        >
          {item.w}
        </span>
      ))}
    </div>
  );
}
