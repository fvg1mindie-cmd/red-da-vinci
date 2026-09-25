import React from 'react';

export default function App() {
  return (
    <div className="relative w-full h-screen bg-neutral-950 text-amber-100 flex flex-col justify-between overflow-hidden">
      
      {/* 🏛️ ARCO SUPERIOR: Banner del Pozo Cooperativo */}
      <header className="w-full bg-amber-950/80 border-b border-amber-600/40 p-4 text-center z-20 shadow-lg">
        <h1 className="text-2xl font-serif tracking-widest text-amber-400 font-bold">RED DA VINCI</h1>
        <p className="text-xs text-amber-200/80 uppercase tracking-wider">Cooperativa de Arte Universal Tokenizada</p>
        <div className="mt-2 text-sm bg-black/40 py-1 px-4 rounded-full inline-block border border-amber-500/30">
          Pozo Cooperativo Acumulado (5%): <span className="font-bold text-green-400">$45,280 USDT</span> | Próximo Sorteo: <span className="text-amber-300">12d 04h</span>
        </div>
      </header>

      {/* 🖼️ LIENZO CENTRAL Y COLUMNAS */}
      <main className="relative flex-1 flex justify-between items-center p-6 gap-4">
        
        {/* 🔘 COLUMNA IZQUIERDA: Finanzas y Perfil */}
        <aside className="w-1/4 flex flex-col gap-4 z-10">
          <button className="bg-amber-950/60 border border-amber-600/40 hover:bg-amber-900/80 p-4 rounded-xl text-left transition shadow-md group">
            <span className="block text-lg font-bold text-amber-300 group-hover:translate-x-1 transition-transform">👤 Perfil / Wallet</span>
            <span className="text-xs text-amber-200/60">Gestiona tu identidad y fondos</span>
          </button>
          
          <button className="bg-amber-950/60 border border-amber-600/40 hover:bg-amber-900/80 p-4 rounded-xl text-left transition shadow-md group">
            <span className="block text-lg font-bold text-amber-300 group-hover:translate-x-1 transition-transform">🪙 Mis Tokens</span>
            <span className="text-xs text-amber-200/60">Obras adquiridas y dividendos</span>
          </button>

          <button className="bg-amber-950/60 border border-amber-600/40 hover:bg-amber-900/80 p-4 rounded-xl text-left transition shadow-md group">
            <span className="block text-lg font-bold text-amber-300 group-hover:translate-x-1 transition-transform">📜 Contratos & Réplicas</span>
            <span className="text-xs text-amber-200/60">Exhibiciones físicas e itinerancia</span>
          </button>
        </aside>

        {/* 🎨 CENTRO: Muro Interactivo sobre el marco histórico */}
        <section className="relative flex-1 h-full border border-amber-600/30 rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-black/60 shadow-2xl">
          
          {/* Muro / Feed interactivo pasante */}
          <div className="relative z-10 w-full h-full p-6 overflow-y-auto space-y-6">
            <div className="bg-amber-950/40 border border-amber-500/20 p-6 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-600/40 border border-amber-400 flex items-center justify-center font-bold">A1</div>
                <div>
                  <h4 className="font-bold text-amber-200">Artista Destacado</h4>
                  <p className="text-xs text-amber-400/60">Publicado hace 2 horas</p>
                </div>
              </div>
              <div className="w-full h-48 bg-black/40 rounded-lg mb-4 border border-amber-500/10 flex items-center justify-center text-amber-300/40 italic">
                [ Espacio de Exhibición de Obra ]
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Estado: <strong className="text-amber-400">60% Tokenizado</strong></span>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-amber-800/60 hover:bg-amber-700 rounded-lg text-xs">Ver Réplicas</button>
                  <button className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg text-xs">Comprar Token</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🔘 COLUMNA DERECHA: Galería y Comunidad */}
        <aside className="w-1/4 flex flex-col gap-4 z-10">
          <button className="bg-amber-950/60 border border-amber-600/40 hover:bg-amber-900/80 p-4 rounded-xl text-right transition shadow-md group">
            <span className="block text-lg font-bold text-amber-300 group-hover:-translate-x-1 transition-transform">🖼️ Galería / Mercado</span>
            <span className="text-xs text-amber-200/60">Catálogo global de obras</span>
          </button>

          <button className="bg-amber-950/60 border border-amber-600/40 hover:bg-amber-900/80 p-4 rounded-xl text-right transition shadow-md group">
            <span className="block text-lg font-bold text-amber-300 group-hover:-translate-x-1 transition-transform">👥 Grupos & Colectivos</span>
            <span className="text-xs text-amber-200/60">Debates y proyectos en red</span>
          </button>

          <button className="bg-amber-950/60 border border-amber-600/40 hover:bg-amber-900/80 p-4 rounded-xl text-right transition shadow-md group">
            <span className="block text-lg font-bold text-amber-300 group-hover:-translate-x-1 transition-transform">🏛️ Votación Cooperativa</span>
            <span className="text-xs text-amber-200/60">Decisiones comunitarias</span>
          </button>
        </aside>

      </main>

      {/* 🔽 BARRA INFERIOR: Navegación Rápida */}
      <footer className="w-full bg-amber-950/90 border-t border-amber-600/40 p-3 flex justify-around items-center z-20">
        <button className="hover:text-amber-300 font-medium transition">🏠 Feed</button>
        <button className="hover:text-amber-300 font-medium transition">🔍 Explorar</button>
        
        <button className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition">
          ➕ Tokenizar Obra
        </button>

        <button className="hover:text-amber-300 font-medium transition">💬 Mensajes</button>
      </footer>

    </div>
  );
}
