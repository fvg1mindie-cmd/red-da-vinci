import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [tokens, setTokens] = useState(120);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-4 overflow-hidden">
      {/* Fondo Ilustración Da Vinci */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none"
        style={{ backgroundImage: `url('/lo1.jpg')` }}
      ></div>

      {/* Capa de Contenido Translúcida */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
        
        {/* Encabezado Superior Compacto */}
        <header className="flex flex-col items-center text-center py-2 px-6 bg-black/30 backdrop-blur-md border border-[#f3e5ab]/30 rounded-xl w-fit mx-auto shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold tracking-widest text-[#f3e5ab] drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
            RED DA VINCI
          </h1>
          <p className="text-xs md:text-sm text-white mt-0.5 font-light tracking-wide">
            Cooperativa de Arte Universal Tokenizada
          </p>
          <div className="mt-1.5 inline-flex items-center gap-3 bg-black/40 px-4 py-1 rounded-full border border-[#f3e5ab]/30 backdrop-blur-md">
            <span className="text-[11px] text-gray-200">Pozo Cooperativo (5%): </span>
            <span className="text-xs font-mono font-bold text-[#4ade80]">$45,280 USDT</span>
            <span className="text-[11px] text-gray-300 border-l border-white/20 pl-3">Sorteo: 12d 04h</span>
          </div>
        </header>

        {/* Panel Central de Botones */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-4 items-center">
          
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-3 items-start">
            <button 
              onClick={() => setActiveTab('wallet')}
              className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md w-fit hover:bg-black/40 active:scale-95"
            >
              <h3 className="text-base font-bold text-[#f3e5ab]">👤 Perfil / Wallet</h3>
              <p className="text-[11px] text-gray-200">Gestiona tu identidad y fondos</p>
            </button>
            <button 
              onClick={() => setActiveTab('tokens')}
              className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md w-fit hover:bg-black/40 active:scale-95"
            >
              <h3 className="text-base font-bold text-[#f3e5ab]">📜 Mis Tokens</h3>
              <p className="text-[11px] text-gray-200">Obras adquiridas y dividendos</p>
            </button>
            <button 
              onClick={() => setActiveTab('contratos')}
              className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md w-fit hover:bg-black/40 active:scale-95"
            >
              <h3 className="text-base font-bold text-[#f3e5ab]">📑 Contratos & Réplicas</h3>
              <p className="text-[11px] text-gray-200">Exhibiciones físicas e itinerancia</p>
            </button>
          </div>

          {/* Centro Minimalista */}
          <div className="flex flex-col items-center text-center p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl mx-auto max-w-xs">
            <span className="text-[11px] uppercase tracking-widest text-[#f3e5ab] font-bold">Artista Destacado</span>
            <p className="text-[10px] text-gray-300">Publicado hace 2 horas</p>
            <div className="my-3 px-4 py-2 border border-dashed border-[#f3e5ab]/40 rounded-lg bg-black/40">
              <p className="italic text-xs text-white">[ Espacio de Exhibición de Obra ]</p>
              <p className="text-[11px] text-[#4ade80] font-semibold mt-1">Estado: 60% Tokenizado</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('replicas')}
                className="bg-black/50 text-white text-[11px] px-3 py-1.5 rounded-lg border border-white/30 hover:bg-black"
              >
                Ver Réplicas
              </button>
              <button 
                onClick={() => {
                  setTokens(tokens + 10);
                  alert('¡Has adquirido 10 Tokens de la obra!');
                }}
                className="bg-[#f3e5ab] text-black font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-white transition"
              >
                Comprar Token
              </button>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex flex-col gap-3 items-end">
            <button 
              onClick={() => setActiveTab('galeria')}
              className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-right transition shadow-md w-fit hover:bg-black/40 active:scale-95"
            >
              <h3 className="text-base font-bold text-[#f3e5ab]">🖼️ Galería / Mercado</h3>
              <p className="text-[11px] text-gray-200">Catálogo global de obras</p>
            </button>
            <button 
              onClick={() => setActiveTab('grupos')}
              className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-right transition shadow-md w-fit hover:bg-black/40 active:scale-95"
            >
              <h3 className="text-base font-bold text-[#f3e5ab]">👥 Grupos & Colectivos</h3>
              <p className="text-[11px] text-gray-200">Debates y proyectos en red</p>
            </button>
            <button 
              onClick={() => setActiveTab('votacion')}
              className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-right transition shadow-md w-fit hover:bg-black/40 active:scale-95"
            >
              <h3 className="text-base font-bold text-[#f3e5ab]">🏛️ Votación Cooperativa</h3>
              <p className="text-[11px] text-gray-200">Decisiones comunitarias</p>
            </button>
          </div>
        </main>

        {/* Ventanas Modales Flotantes */}
        {activeTab !== 'home' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#121212]/90 border border-[#f3e5ab]/40 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl relative">
              <button 
                onClick={() => setActiveTab('home')}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>

              {activeTab === 'wallet' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">👤 Perfil & Billetera Web3</h2>
                  <p className="text-xs text-gray-300 mb-4">Conecta tu wallet para gestionar tus tokens de arte y dividendos.</p>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/10 mb-4 text-sm">
                    <p>Estado: <span className={walletConnected ? "text-green-400" : "text-yellow-400"}>{walletConnected ? "Conectado" : "Desconectado"}</span></p>
                    <p className="mt-1 font-mono text-xs text-gray-400">{walletConnected ? "0x71C...39A2" : "Sin dirección asociada"}</p>
                    <p className="mt-2 font-mono text-base text-[#f3e5ab]">Tokens acumulados: {tokens} RDV</p>
                  </div>
                  <button 
                    onClick={() => setWalletConnected(!walletConnected)}
                    className="w-full bg-[#f3e5ab] text-black font-bold py-2 rounded-xl hover:bg-white transition text-xs"
                  >
                    {walletConnected ? "Desconectar Billetera" : "Conectar Metamask / Web3"}
                  </button>
                </div>
              )}

              {activeTab === 'galeria' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">🖼️ Galería Cooperativa</h2>
                  <p className="text-xs text-gray-300 mb-4">Catálogo de obras tokenizadas disponibles para inversión colectiva.</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                    <div className="p-3 bg-black/40 rounded-lg border border-white/10 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">El Hombre de Vitruvio 2.0</p>
                        <p className="text-gray-400">Colectivo Renacimiento</p>
                      </div>
                      <span className="text-[#4ade80] font-mono">60% Tokenizado</span>
                    </div>
                    <div className="p-3 bg-black/40 rounded-lg border border-white/10 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">Códice Atlántico Digital</p>
                        <p className="text-gray-400">Red Da Vinci Studio</p>
                      </div>
                      <span className="text-[#4ade80] font-mono">85% Tokenizado</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tokenizar' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">➕ Tokenizar Nueva Obra</h2>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Obra enviada a curaduría cooperativa.'); setActiveTab('home'); }} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-300 mb-1">Título de la Obra</label>
                      <input type="text" required placeholder="Ej. La Gioconda Universal" className="w-full bg-black/50 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#f3e5ab]" />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">Porcentaje a Cooperativizar (%)</label>
                      <input type="number" min="1" max="100" defaultValue="50" className="w-full bg-black/50 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#f3e5ab]" />
                    </div>
                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2 rounded-xl hover:bg-white transition mt-2">
                      Publicar para Votación
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'votacion' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">🏛️ Votación Cooperativa</h2>
                  <p className="text-xs text-gray-300 mb-3">Decisiones de gobernanza sobre el Pozo Acumulado.</p>
                  <div className="p-3 bg-black/40 rounded-lg border border-white/10 text-xs mb-3">
                    <p className="font-bold">Propuesta #12: Adquisición de Galería Física en Florencia</p>
                    <p className="text-gray-400 mt-1">Presupuesto: $15,000 USDT</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => alert('Voto a favor registrado.')} className="flex-1 bg-green-600/80 hover:bg-green-600 text-white font-bold py-1.5 rounded-lg text-xs">A Favor</button>
                    <button onClick={() => alert('Voto en contra registrado.')} className="flex-1 bg-red-600/80 hover:bg-red-600 text-white font-bold py-1.5 rounded-lg text-xs">En Contra</button>
                  </div>
                </div>
              )}

              {['tokens', 'contratos', 'grupos', 'replicas'].includes(activeTab) && (
                <div className="text-center py-6">
                  <h2 className="text-lg font-bold text-[#f3e5ab] capitalize">{activeTab}</h2>
                  <p className="text-xs text-gray-300 mt-2">Módulo en desarrollo y listo para conectar contratos inteligentes.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navegación Inferior Compacta */}
        <footer className="flex justify-around items-center py-2 bg-black/30 backdrop-blur-md border border-[#f3e5ab]/20 rounded-xl">
          <button onClick={() => setActiveTab('home')} className="text-xs font-semibold text-[#f3e5ab]">🏠 Feed</button>
          <button onClick={() => setActiveTab('galeria')} className="text-xs font-semibold text-white hover:text-[#f3e5ab]">🔍 Explorar</button>
          <button onClick={() => setActiveTab('tokenizar')} className="bg-[#f3e5ab] text-black font-bold px-4 py-1.5 rounded-full text-xs shadow-md hover:bg-white transition">
            ➕ Tokenizar Obra
          </button>
          <button onClick={() => setActiveTab('grupos')} className="text-xs font-semibold text-white hover:text-[#f3e5ab]">💬 Mensajes</button>
        </footer>
      </div>
    </div>
  );
}

export default App;
