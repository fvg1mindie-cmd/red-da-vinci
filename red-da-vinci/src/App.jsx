import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balanceUSDT, setBalanceUSDT] = useState(250.00);
  const [tokensRDV, setTokensRDV] = useState(120);

  // Estados de los módulos
  const [myTokens, setMyTokens] = useState([
    { id: 1, title: 'El Hombre de Vitruvio 2.0', quantity: 80, valueUSDT: 160, dividendsUSDT: 12.50 },
    { id: 2, title: 'Códice Atlántico Digital', quantity: 40, valueUSDT: 80, dividendsUSDT: 6.20 },
  ]);

  const [galleryWorks, setGalleryWorks] = useState([
    { id: 1, title: 'El Hombre de Vitruvio 2.0', artist: 'Colectivo Renacimiento', progress: 60, priceToken: 2 },
    { id: 2, title: 'Códice Atlántico Digital', artist: 'Red Da Vinci Studio', progress: 85, priceToken: 2 },
    { id: 3, title: 'La Gioconda Sintética', artist: 'Elena Rostova', progress: 30, priceToken: 5 },
  ]);

  const [proposals, setProposals] = useState([
    { id: 1, title: 'Propuesta #12: Adquisición de Galería Física en Florencia', budget: '$15,000 USDT', votesFor: 140, votesAgainst: 20 },
    { id: 2, title: 'Propuesta #13: Financiar Réplicas Itinerantes en Latinoamárica', budget: '$8,500 USDT', votesFor: 95, votesAgainst: 5 },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, user: 'Curador Marco', text: 'La obra Códice Atlántico ya alcanzó el 85% de tokenización.' },
    { id: 2, user: 'Colectivo Arte', text: 'Reunión de votación iniciada para la propuesta #12.' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPercentage, setNewPercentage] = useState(50);

  const handleConnectWallet = () => {
    if (!walletConnected) {
      setWalletConnected(true);
      setWalletAddress('0x71C...39A2');
    } else {
      setWalletConnected(false);
      setWalletAddress('');
    }
  };

  const handleClaimDividends = () => {
    const totalDividends = myTokens.reduce((acc, curr) => acc + curr.dividendsUSDT, 0);
    if (totalDividends > 0) {
      setBalanceUSDT(balanceUSDT + totalDividends);
      setMyTokens(myTokens.map(t => ({ ...t, dividendsUSDT: 0 })));
      alert(`¡Has retirado $${totalDividends.toFixed(2)} USDT de dividendos a tu balance!`);
    } else {
      alert('No tienes dividendos acumulados para retirar.');
    }
  };

  const handleBuyToken = (work) => {
    if (balanceUSDT >= work.priceToken) {
      setBalanceUSDT(balanceUSDT - work.priceToken);
      setTokensRDV(tokensRDV + 1);
      alert(`¡Has comprado 1 token de "${work.title}"!`);
    } else {
      alert('Saldo insuficiente en USDT.');
    }
  };

  const handleCreateWork = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const newWork = {
      id: galleryWorks.length + 1,
      title: newTitle,
      artist: 'Mi Perfil Artista',
      progress: 0,
      priceToken: 2
    };
    setGalleryWorks([newWork, ...galleryWorks]);
    setNewTitle('');
    alert('¡Obra publicada exitosamente en la galería!');
    setActiveTab('galeria');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage) return;
    setMessages([...messages, { id: messages.length + 1, user: 'Tú', text: newMessage }]);
    setNewMessage('');
  };

  const handleVote = (id, type) => {
    setProposals(proposals.map(p => {
      if (p.id === id) {
        return {
          ...p,
          votesFor: type === 'for' ? p.votesFor + 1 : p.votesFor,
          votesAgainst: type === 'against' ? p.votesAgainst + 1 : p.votesAgainst
        };
      }
      return p;
    }));
    alert('¡Tu voto ha sido registrado en la blockchain!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-4 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none"
        style={{ backgroundImage: `url('/lo1.jpg')` }}
      ></div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
        {/* Encabezado */}
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

        {/* Rejilla Principal */}
        <main className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-4 items-center">
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

          <div className="flex flex-col items-center text-center p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl mx-auto max-w-xs">
            <span className="text-[11px] uppercase tracking-widest text-[#f3e5ab] font-bold">Artista Destacado</span>
            <p className="text-[10px] text-gray-300">Publicado hace 2 horas</p>
            <div className="my-3 px-4 py-2 border border-dashed border-[#f3e5ab]/40 rounded-lg bg-black/40">
              <p className="italic text-xs text-white">[ Espacio de Exhibición de Obra ]</p>
              <p className="text-[11px] text-[#4ade80] font-semibold mt-1">Estado: 60% Tokenizado</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('contratos')}
                className="bg-black/50 text-white text-[11px] px-3 py-1.5 rounded-lg border border-white/30 hover:bg-black"
              >
                Ver Réplicas
              </button>
              <button 
                onClick={() => handleBuyToken(galleryWorks[0])}
                className="bg-[#f3e5ab] text-black font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-white transition"
              >
                Comprar Token
              </button>
            </div>
          </div>

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

        {/* Modales Interactivos */}
        {activeTab !== 'home' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#121212]/90 border border-[#f3e5ab]/40 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl relative">
              <button 
                onClick={() => setActiveTab('home')}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>

              {/* 1. Wallet */}
              {activeTab === 'wallet' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">👤 Perfil & Billetera Web3</h2>
                  <p className="text-xs text-gray-300 mb-4">Gestiona tu identidad, saldo en USDT y participación.</p>
                  
                  <div className="bg-black/50 p-4 rounded-xl border border-white/10 mb-4 text-xs space-y-2">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-400">Estado:</span>
                      <span className={walletConnected ? "text-[#4ade80] font-bold" : "text-yellow-400"}>
                        {walletConnected ? "Conectado" : "Desconectado"}
                      </span>
                    </div>
                    {walletConnected && (
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <span className="text-gray-400">Dirección:</span>
                        <span className="font-mono text-[#f3e5ab]">{walletAddress}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-gray-400">Saldo USDT:</span>
                      <span className="font-mono text-[#4ade80] font-bold">${balanceUSDT.toFixed(2)} USDT</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Tokens RDV:</span>
                      <span className="font-mono text-[#f3e5ab] font-bold">{tokensRDV} RDV</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleConnectWallet}
                      className="flex-1 bg-[#f3e5ab] text-black font-bold py-2 rounded-xl hover:bg-white transition text-xs"
                    >
                      {walletConnected ? "Desconectar" : "Conectar Metamask"}
                    </button>
                    {walletConnected && (
                      <button 
                        onClick={() => setBalanceUSDT(balanceUSDT + 100)}
                        className="bg-black/60 border border-[#f3e5ab]/40 text-[#f3e5ab] px-3 py-2 rounded-xl hover:bg-black transition text-xs font-bold"
                      >
                        + $100 USDT
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 2. Mis Tokens */}
              {activeTab === 'tokens' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">📜 Mis Tokens & Dividendos</h2>
                  <p className="text-xs text-gray-300 mb-4">Portafolio de obras tokenizadas de las que eres copropietario.</p>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {myTokens.map((item) => (
                      <div key={item.id} className="bg-black/50 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white text-sm">{item.title}</p>
                          <p className="text-gray-400 mt-0.5">{item.quantity} Tokens | Valor: ${item.valueUSDT} USDT</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#4ade80] font-mono font-bold">+${item.dividendsUSDT.toFixed(2)} USDT</p>
                          <p className="text-[10px] text-gray-400">Dividendo pendiente</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] text-gray-400">Total Dividendos:</p>
                      <p className="text-base font-mono font-bold text-[#4ade80]">
                        ${myTokens.reduce((acc, curr) => acc + curr.dividendsUSDT, 0).toFixed(2)} USDT
                      </p>
                    </div>
                    <button 
                      onClick={handleClaimDividends}
                      className="bg-[#f3e5ab] text-black font-bold px-4 py-2 rounded-xl hover:bg-white transition text-xs"
                    >
                      Cobrar Dividendos
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Galería */}
              {activeTab === 'galeria' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">🖼️ Galería / Mercado</h2>
                  <p className="text-xs text-gray-300 mb-3">Obras en proceso de tokenización colectiva.</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto text-xs pr-1">
                    {galleryWorks.map((work) => (
                      <div key={work.id} className="p-3 bg-black/40 rounded-lg border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{work.title}</p>
                          <p className="text-gray-400">{work.artist}</p>
                          <p className="text-[#4ade80] font-mono text-[10px] mt-0.5">{work.progress}% Tokenizado</p>
                        </div>
                        <button 
                          onClick={() => handleBuyToken(work)}
                          className="bg-[#f3e5ab] text-black font-bold px-3 py-1.5 rounded-lg hover:bg-white text-[11px]"
                        >
                          Comprar (${work.priceToken} USDT)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Tokenizar */}
              {activeTab === 'tokenizar' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">➕ Tokenizar Nueva Obra</h2>
                  <form onSubmit={handleCreateWork} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-gray-300 mb-1">Título de la Obra</label>
                      <input 
                        type="text" 
                        required 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ej. La Gioconda Universal" 
                        className="w-full bg-black/50 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#f3e5ab]" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">Porcentaje a Cooperativizar (%)</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={newPercentage}
                        onChange={(e) => setNewPercentage(e.target.value)}
                        className="w-full bg-black/50 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#f3e5ab]" 
                      />
                    </div>
                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2 rounded-xl hover:bg-white transition mt-2">
                      Publicar Obra en Galería
                    </button>
                  </form>
                </div>
              )}

              {/* 5. Votación */}
              {activeTab === 'votacion' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">🏛️ Votación Cooperativa</h2>
                  <p className="text-xs text-gray-300 mb-3">Decisiones comunitarias sobre el Pozo Cooperativo.</p>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {proposals.map((prop) => (
                      <div key={prop.id} className="p-3 bg-black/40 rounded-lg border border-white/10 text-xs">
                        <p className="font-bold text-white">{prop.title}</p>
                        <p className="text-gray-400 mt-0.5">Presupuesto: {prop.budget}</p>
                        <div className="flex gap-2 mt-2 items-center">
                          <button 
                            onClick={() => handleVote(prop.id, 'for')}
                            className="bg-green-600/80 hover:bg-green-600 text-white font-bold px-3 py-1 rounded text-[11px]"
                          >
                            A Favor ({prop.votesFor})
                          </button>
                          <button 
                            onClick={() => handleVote(prop.id, 'against')}
                            className="bg-red-600/80 hover:bg-red-600 text-white font-bold px-3 py-1 rounded text-[11px]"
                          >
                            En Contra ({prop.votesAgainst})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Grupos / Mensajes */}
              {activeTab === 'grupos' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">👥 Grupos & Colectivos</h2>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs mb-3">
                    {messages.map((m) => (
                      <div key={m.id} className="p-2 bg-black/40 rounded border border-white/10">
                        <span className="font-bold text-[#f3e5ab]">{m.user}: </span>
                        <span className="text-gray-200">{m.text}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2 text-xs">
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Escribe un mensaje en el foro..." 
                      className="flex-1 bg-black/50 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#f3e5ab]"
                    />
                    <button type="submit" className="bg-[#f3e5ab] text-black font-bold px-3 rounded-lg hover:bg-white">Enviar</button>
                  </form>
                </div>
              )}

              {/* 7. Contratos */}
              {activeTab === 'contratos' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">📑 Contratos & Réplicas</h2>
                  <p className="text-xs text-gray-300 mb-3">Gestión de exhibiciones físicas e itinerancia de replicas impresas.</p>
                  <div className="p-3 bg-black/40 rounded-lg border border-white/10 text-xs space-y-2">
                    <p className="font-bold text-white">Contrato #RDV-2026-A1</p>
                    <p className="text-gray-400">Exhibición itinerante autorizada en Galería Central.</p>
                    <p className="text-[#4ade80] font-mono">Estado: Activo - 5 réplicas físicas distribuidas</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
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
