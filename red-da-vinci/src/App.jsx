import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-4 overflow-hidden">
      {/* Fondo Ilustración Da Vinci al 100% de presencia */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none"
        style={{ backgroundImage: `url('/lo1.jpg')` }}
      ></div>

      {/* Capa de Contenido Ultra Translúcida */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
        
        {/* Encabezado Superior Ajustado */}
        <header className="flex flex-col items-center text-center py-3 bg-black/20 backdrop-blur-sm border-b border-[#f3e5ab]/20 rounded-xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-[#f3e5ab] drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
            RED DA VINCI
          </h1>
          <p className="text-sm md:text-lg text-white mt-1 font-light tracking-wide">
            Cooperativa de Arte Universal Tokenizada
          </p>
          <div className="mt-2 inline-flex items-center gap-3 bg-black/40 px-5 py-1 rounded-full border border-[#f3e5ab]/30 backdrop-blur-md">
            <span className="text-xs text-gray-200">Pozo Cooperativo (5%): </span>
            <span className="text-sm font-mono font-bold text-[#4ade80]">$45,280 USDT</span>
            <span className="text-xs text-gray-300 border-l border-white/20 pl-3">Sorteo: 12d 04h</span>
          </div>
        </header>

        {/* Panel Central con Botones Ajustados al Texto */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-4 items-center">
          
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-3 items-start">
            <button className="bg-black/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 hover:border-[#f3e5ab] text-left transition shadow-md w-fit hover:bg-black/30">
              <h3 className="text-base font-bold text-[#f3e5ab]">👤 Perfil / Wallet</h3>
              <p className="text-[11px] text-gray-200">Gestiona tu identidad y fondos</p>
            </button>
            <button className="bg-black/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 hover:border-[#f3e5ab] text-left transition shadow-md w-fit hover:bg-black/30">
              <h3 className="text-base font-bold text-[#f3e5ab]">📜 Mis Tokens</h3>
              <p className="text-[11px] text-gray-200">Obras adquiridas y dividendos</p>
            </button>
            <button className="bg-black/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 hover:border-[#f3e5ab] text-left transition shadow-md w-fit hover:bg-black/30">
              <h3 className="text-base font-bold text-[#f3e5ab]">📑 Contratos & Réplicas</h3>
              <p className="text-[11px] text-gray-200">Exhibiciones físicas e itinerancia</p>
            </button>
          </div>

          {/* Centro Minimalista despejado */}
          <div className="flex flex-col items-center text-center p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/15 shadow-xl mx-auto max-w-xs">
            <span className="text-[11px] uppercase tracking-widest text-[#f3e5ab] font-bold">Artista Destacado</span>
            <p className="text-[10px] text-gray-300">Publicado hace 2 horas</p>
            <div className="my-3 px-4 py-2 border border-dashed border-[#f3e5ab]/40 rounded-lg bg-black/30">
              <p className="italic text-xs text-white">[ Espacio de Exhibición de Obra ]</p>
              <p className="text-[11px] text-[#4ade80] font-semibold mt-1">Estado: 60% Tokenizado</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-black/40 text-white text-[11px] px-3 py-1.5 rounded-lg border border-white/30 hover:bg-black">
                Ver Réplicas
              </button>
              <button className="bg-[#f3e5ab] text-black font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-white transition">
                Comprar Token
              </button>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex flex-col gap-3 items-end">
            <button className="bg-black/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 hover:border-[#f3e5ab] text-right transition shadow-md w-fit hover:bg-black/30">
              <h3 className="text-base font-bold text-[#f3e5ab]">🖼️ Galería / Mercado</h3>
              <p className="text-[11px] text-gray-200">Catálogo global de obras</p>
            </button>
            <button className="bg-black/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 hover:border-[#f3e5ab] text-right transition shadow-md w-fit hover:bg-black/30">
              <h3 className="text-base font-bold text-[#f3e5ab]">👥 Grupos & Colectivos</h3>
              <p className="text-[11px] text-gray-200">Debates y proyectos en red</p>
            </button>
            <button className="bg-black/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 hover:border-[#f3e5ab] text-right transition shadow-md w-fit hover:bg-black/30">
              <h3 className="text-base font-bold text-[#f3e5ab]">🏛️ Votación Cooperativa</h3>
              <p className="text-[11px] text-gray-200">Decisiones comunitarias</p>
            </button>
          </div>
        </main>

        {/* Navegación Inferior Compacta */}
        <footer className="flex justify-around items-center py-2.5 bg-black/30 backdrop-blur-md border-t border-[#f3e5ab]/20 rounded-xl">
          <button className="text-xs font-semibold text-[#f3e5ab]">🏠 Feed</button>
          <button className="text-xs font-semibold text-white hover:text-[#f3e5ab]">🔍 Explorar</button>
          <button className="bg-[#f3e5ab] text-black font-bold px-4 py-1.5 rounded-full text-xs shadow-md hover:bg-white transition">
            ➕ Tokenizar Obra
          </button>
          <button className="text-xs font-semibold text-white hover:text-[#f3e5ab]">💬 Mensajes</button>
        </footer>
      </div>
    </div>
  );
}

export default App;
