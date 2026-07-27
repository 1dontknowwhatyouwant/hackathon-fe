export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-cyan-950/30 backdrop-blur">
        <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-cyan-400">
          LIKELION HACKATHON
        </p>
        <h2 className="mt-5 text-slate-300 font-semibold tracking-[0.2em] text-cyan-400">TEAM 입을래?</h2>
        <p className="mt-5 leading-7 text-slate-300">
          Next.js, TypeScript, Tailwind CSS, Axios, Zustand
        </p>
      </section>
    </main>
  );
}
