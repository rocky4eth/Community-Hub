export function ApeAvatar({ imageUrl, size = 40 }: { imageUrl: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center bg-surface-2"
      style={{
        width: size,
        height: size,
        boxShadow: "0 0 0 1.5px var(--gold), 0 0 0 3px var(--background)",
      }}
    >
      {imageUrl && <img src={imageUrl} alt="Ape Avatar" className="w-full h-full object-cover rounded-full" />}
    </div>
  );
}
