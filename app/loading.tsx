export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="relative">
        <div className="w-16 h-16 border-4 border-sage-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-sage-500 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
      </div>
      <p className="mt-6 font-serif text-lg animate-pulse" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--sage-mid)" }}>
        Healing in progress...
      </p>
    </div>
  );
}
