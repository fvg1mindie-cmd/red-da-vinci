import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#d4af37] font-serif relative flex flex-col justify-between p-4 overflow-hidden">
      {/* Fondo Ilustrado Renacentista */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: `url('/lo1.jpg')` }}
      ></div>

      {/* Capa de Contenido */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        {/* Encabezado Superior */}
        <header className="text-center py-6 bg-[#121212]/80 backdrop-blur-md border-b border-[#d4af37]/30 rounded-xl shadow-lg">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-[#d4af37] drop-shadow-md">
            RED DA VINCI
          </h1>
          <p className="text-lg md:text-xl text-[#e5c158] mt-1 font-light">
            Cooperativa de Arte Universal Tokenizada
          </p>
          <div className="mt-3 inline-block bg-[#1c1c1c]/90 px-6 py-2 rounded-full border border-[#d4af37]/40">
            <span className="text-sm text-gray-300">Pozo Cooperativo Acumulado (5%): </span>
            <span className="text-lg font-mono font-bold text-[#4ade80]">$45,280 USDT</span>
            <span className="text-sm text-gray-400 ml-4">Próximo Sorteo: 12d 04h</span>
          </div>
        </header>

        {/* Panel Central con Botones Flotantes / Interactivos */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto py-8">
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-4">
            <button className="bg-[#1c1c1c]/80 backdrop-blur-md p-4 rounded-xl border border-[#d4af37]/40 hover:border-[#d4af37] text-left shadow-lg transition">
              <h3 className="text-lg font-bold text-[#d4af37]">👤 Perfil / Wallet</h3>
              <p className="text-xs text-gray-300">Gestiona tu identidad y fondos</p>
            </button>
            <button className="bg-[#1c1c1c]/80 backdrop-blur-md p-4 rounded-xl border border-[#d4af37]/40 hover:border-[#d4af37] text-left shadow-lg transition">
              <h3 className="text-lg font-bold text-[#d4af37]">📜 Mis Tokens</h3>
              <p className="text-xs text-gray-300">Obras adquiridas y dividendos</p>
            </button>
            <button className="bg-[#1c1c1c]/80 backdrop-blur-md p-4 rounded-xl border border-[#d4af37]/40 hover:border-[#d4af37] text-left shadow-lg transition">
              <h3 className="text-lg font-bold text-[#d4af37]">📜 Contratos & Réplicas</h3>
              <p className="text-xs text-gray-300">Exhibiciones físicas e itinerancia</p>
            </button>
          </div>

          {/* Espacio Central para destacar la ilustración */}
          <div className="flex flex-col items-center justify-end text-center p-6 bg-[#121212]/60 backdrop-blur-sm rounded-xl border border-[#d4af37]/20 shadow-2xl">
            <span className="text-xs uppercase tracking-widest text-gray-400">Artista Destacado</span>
            <p className="text-sm text-gray-300 mt-1">Publicado hace 2 horas</p>
            <div className="my-6 p-4 border border-dashed border-[#d4af37]/40 rounded-lg">
              <p className="italic text-sm text-gray-300">[ Espacio de Exhibición de Obra ]</p>
              <p className="text-xs text-[#4ade80] font-semibold mt-2">Estado: 60% Tokenizado</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#2c2c2c] text-white text-xs px-4 py-2 rounded-lg border border-gray-600 hover:bg-[#3c3c3c]">
                Ver Réplicas
              </button>
              <button className="bg-[#d4af37] text-black font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#e5c158]">
                Comprar Token
              </button>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex flex-col gap-4">
            <button className="bg-[#1c1c1c]/80 backdrop-blur-md p-4 rounded-xl border border-[#d4af37]/40 hover:border-[#d4af37] text-left shadow-lg transition">
              <h3 className="text-lg font-bold text-[#d4af37]">🖼️ Galería / Mercado</h3>
              <p className="text-xs text-gray-300">Catálogo global de obras</p>
            </button>
            <button className="bg-[#1c1c1c]/80 backdrop-blur-md p-4 rounded-xl border border-[#d4af37]/40 hover:border-[#d4af37] text-left shadow-lg transition">
              <h3 className="text-lg font-bold text-[#d4af37]">👥 Grupos & Colectivos</h3>
              <p className="text-xs text-gray-300">Debates y proyectos en red</p>
            </button>
            <button className="bg-[#1c1c1c]/80 backdrop-blur-md p-4 rounded-xl border border-[#d4af37]/40 hover:border-[#d4af37] text-left shadow-lg transition">
              <h3 className="text-lg font-bold text-[#d4af37]">🏛️ Votación Cooperativa</h3>
              <p className="text-xs text-gray-300">Decisiones comunitarias</p>
            </button>
          </div>
        </main>

        {/* Barra de Navegación Inferior */}
        <footer className="flex justify-around items-center py-3 bg-[#121212]/90 backdrop-blur-md border-t border-[#d4af37]/30 rounded-xl">
          <button className="text-sm font-semibold text-[#d4af37]">🏠 Feed</button>
          <button className="text-sm font-semibold text-gray-300 hover:text-[#d4af37]">🔍 Explorar</button>
          <button className="bg-[#d4af37] text-black font-bold px-4 py-2 rounded-full text-sm shadow-md hover:bg-[#e5c158]">
            ➕ Tokenizar Obra
          </button>
          <button className="text-sm font-semibold text-gray-300 hover:text-[#d4af37]">💬 Mensajes</button>
        </footer>
      </div>
    </div>
  );
}

export default App;
