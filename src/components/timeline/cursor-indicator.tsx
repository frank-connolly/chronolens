'use client';

interface CursorIndicatorProps {
  top: number;
}

export default function CursorIndicator({ top }: CursorIndicatorProps) {
  // The additional 32px accounts for the 8 (2rem) of padding on the parent container
  const adjustedTop = top + 32;

  return (
    <div
      className="pointer-events-none absolute left-0 right-0"
      style={{
        transform: `translateY(${adjustedTop}px)`,
        zIndex: 1,
      }}
    >
      <div className="relative">
        {/* Line */}
        <div className="absolute w-full h-px bg-accent/50 -translate-y-1/2"></div>
      </div>
    </div>
  );
}
