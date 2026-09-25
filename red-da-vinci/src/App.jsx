import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-serif relative flex flex-col justify-between p-4 overflow-hidden">
      {/* Fondo de Da Vinci a plena visibilidad */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-85 pointer-events-none"
        style={{ backgroundImage: `url('/lo1.jpg')` }}
      ></div>

      {/* Capa de Contenido Transparente */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        
        {/* Encabezado Superior */}
        <header className="text-center py-4 bg-black/40 backdrop-blur-sm border-b border-[#f3e5ab]/30 rounded-xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-[#f3e5ab] drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)]">
            RED DA VINCI
          </h1>
          <p className="text-lg md:text-xl text-white mt-1 font-light tracking-wide">
            Cooperativa de Arte Universal Tokenizada
          </p>
          <div className="mt-3 inline-block bg-black/60 px-6 py-2 rounded-full border border-[#f3e5ab]/40">
            <span className="text-sm text-gray-200">Pozo Cooperativo Acumulado (5%): </span>
            <span className="text-lg font-mono font-bold text-[#4ade80]">$45,280 USDT</span>
            <span className="text-sm text-gray-300 ml-4">Próximo Sorteo: 12d 04h</span>
          </div>
        </header>

        {/* Panel Central con Botones Transparentes */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto py-6">
          
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-4">
            <button className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-lg">
              <h3 className="text-lg font-bold text-[#f3e5ab]">👤 Perfil / Wallet</h3>
              <p className="text-xs text-gray-200 mt-1">Gestiona tu identidad y fondos</p>
            </button>
            <button className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-lg">
              <h3 className="text-lg font-bold text-[#f3e5ab]">📜 Mis Tokens</h3>
              <p className="text-xs text-gray-200 mt-1">Obras adquiridas y dividendos</p>
            </button>
            <button className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-lg">
              <h3 className="text-lg font-bold text-[#f3e5ab]">📑 Contratos & Réplicas</h3>
              <p className="text-xs text-gray-200 mt-1">Exhibiciones físicas e itinerancia</p>
            </button>
          </div>

          {/* Centro Libre para apreciar la Obra */}
          <div className="flex flex-col items-center justify-end text-center p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl">
            <span className="text-xs uppercase tracking-widest text-[#f3e5ab] font-bold">Artista Destacado</span>
            <p className="text-xs text-gray-200 mt-1">Publicado hace 2 horas</p>
            <div className="my-6 p-4 border border-dashed border-[#f3e5ab]/60 rounded-lg bg-black/40">
              <p className="italic text-sm text-white">[ Espacio de Exhibición de Obra ]</p>
              <p className="text-xs text-[#4ade80] font-semibold mt-2">Estado: 60% Tokenizado</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-black/60 text-white text-xs px-4 py-2 rounded-lg border border-white/40 hover:bg-black">
                Ver Réplicas
              </button>
              <button className="bg-[#f3e5ab] text-black font-bold text-xs px-4 py-2 rounded-lg hover:bg-white transition">
                Comprar Token
              </button>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex flex-col gap-4">
            <button className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-lg">
              <h3 className="text-lg font-bold text-[#f3e5ab]">🖼️ Galería / Mercado</h3>
              <p className="text-xs text-gray-200 mt-1">Catálogo global de obras</p>
            </button>
            <button className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-lg">
              <h3 className="text-lg font-bold text-[#f3e5ab]">👥 Grupos & Colectivos</h3>
              <p className="text-xs text-gray-200 mt-1">Debates y proyectos en red</p>
            </button>
            <button className="bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-lg">
              <h3 className="text-lg font-bold text-[#f3e5ab]">🏛️ Votación Cooperativa</h3>
              <p className="text-xs text-gray-200 mt-1">Decisiones comunitarias</p>
            </button>
          </div>
        </main>

        {/* Navegación Inferior Transparente */}
        <footer className="flex justify-around items-center py-3 bg-black/50 backdrop-blur-md border-t border-[#f3e5ab]/30 rounded-xl">
          <button className="text-sm font-semibold text-[#f3e5ab]">🏠 Feed</button>
          <button className="text-sm font-semibold text-white hover:text-[#f3e5ab]">🔍 Explorar</button>
          <button className="bg-[#f3e5ab] text-black font-bold px-4 py-2 rounded-full text-sm shadow-md hover:bg-white transition">
            ➕ Tokenizar Obra
          </button>
          <button className="text-sm font-semibold text-white hover:text-[#f3e5ab]">💬 Mensajes</button>
        </footer>
      </div>
    </div>
  );
}

export default App;
