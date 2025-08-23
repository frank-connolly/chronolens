'use client';

interface CursorIndicatorProps {
  top: number;
}

export default function CursorIndicator({ top }: CursorIndicatorProps) {
  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-0"
      style={{
        transform: `translateY(${top}px)`,
      }}
    >
      <div className="relative">
        {/* Line */}
        <div className="absolute w-full h-px bg-accent/50"></div>
      </div>
    </div>
  );
}
