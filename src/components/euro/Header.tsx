export function Header({ subtitle }: { subtitle: string }) {
  return (
    <header className="relative flex items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 rounded-full bg-gold flex items-center justify-center text-background font-display text-lg font-bold gold-glow">
          E
        </div>
        <div>
          <h1 className="font-display text-2xl leading-none text-gold">EuroApes</h1>
          <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </div>
      <button className="font-mono text-[11px] px-3 py-1.5 rounded-full border border-border bg-surface text-foreground/80 hover:border-gold/60 transition">
        0x3f…9a2c
      </button>
    </header>
  );
}
