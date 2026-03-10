"use client"

export function ScanLines() {
  return (
    <>
      {/* Horizontal scan line */}
      <div 
        className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--tiktok-cyan)] to-transparent opacity-30 pointer-events-none z-50"
        style={{
          animation: "scan-line 8s linear infinite",
        }}
      />
      
      {/* CRT-style scan lines overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.02]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-30"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />
    </>
  )
}
