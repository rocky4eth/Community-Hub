export function ApeAvatar({ emoji, size = 40 }: { emoji: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center bg-surface-2"
      style={{
        width: size,
        height: size,
        boxShadow: "0 0 0 1.5px var(--gold), 0 0 0 3px var(--background)",
        fontSize: size * 0.55,
      }}
    >
      <span>{emoji}</span>
    </div>
  );
}
