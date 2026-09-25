import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState('artist'); // 'artist' | 'buyer'
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balanceUSDT, setBalanceUSDT] = useState(250.00);
  const [tokensRDV, setTokensRDV] = useState(120);

  // Perfil del Usuario
  const [currentUser, setCurrentUser] = useState({
    name: 'Diego Da Vinci',
    username: 'diego_art',
    role: 'Artista Maestro',
    rank: '#4 Global',
    curated: true,
    poolEligible: true,
    followers: 142
  });

  // Lista de Artistas con Ranking y Curaduría
  const [artists, setArtists] = useState([
    { id: 1, name: 'Leonardo V.', rank: '#1', curated: true, poolEligible: true, APY: '14%', followers: 1250, isSubscribed: true },
    { id: 2, name: 'Elena Rostova', rank: '#2', curated: true, poolEligible: true, APY: '11%', followers: 890, isSubscribed: false },
    { id: 3, name: 'Colectivo Sombra', rank: '#8', curated: false, poolEligible: false, APY: '7%', followers: 450, isSubscribed: false },
  ]);

  // Feed Social de Publicaciones
  const [posts, setPosts] = useState([
    {
      id: 1,
      artistName: 'Leonardo V.',
      rank: '#1 Global',
      curated: true,
      time: 'Hace 2 horas',
      content: 'Estudio de iluminación para la nueva obra. Rendimiento estimado para inversores: 14% anual por alquileres e itinerancia física.',
      likes: 45,
      isLiked: false,
      workLinked: { id: 101, title: 'Gioconda Sintética #1', type: 'fractional', progress: 65, tokenPrice: 5.00, APY: '14% Anual' }
    },
    {
      id: 2,
      artistName: 'Elena Rostova',
      rank: '#2 Global',
      curated: true,
      time: 'Hace 4 horas',
      content: '¡Obra curada por el Comité Marco! Disponible para adquisición como TOKEN ÚNICO con el 100% de los derechos comerciales.',
      likes: 89,
      isLiked: false,
      workLinked: { id: 102, title: 'Noche de Oro Digital', type: 'unique', uniquePrice: 150.00, sold: false }
    }
  ]);

  // Galería Global
  const [galleryWorks, setGalleryWorks] = useState([
    { id: 1, title: 'El Hombre de Vitruvio 2.0', artist: 'Leonardo V.', progress: 60, priceToken: 2, type: 'fractional', APY: '12%' },
    { id: 2, title: 'Noche de Oro Digital', artist: 'Elena Rostova', uniquePrice: 150, sold: false, type: 'unique' },
  ]);

  // Módulos Auxiliares
  const [myTokens, setMyTokens] = useState([
    { id: 1, title: 'El Hombre de Vitruvio 2.0', quantity: 80, valueUSDT: 160, dividendsUSDT: 12.50 },
  ]);

  const [proposals, setProposals] = useState([
    { id: 1, title: 'Propuesta #12: Adquisición de Galería Física en Florencia', budget: '$15,000 USDT', votesFor: 140, votesAgainst: 20 },
  ]);

  // Formularios
  const [newPostContent, setNewPostContent] = useState('');
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [tokenTypeSelection, setTokenTypeSelection] = useState('fractional');
  const [newWorkPrice, setNewWorkPrice] = useState(10);

  // Funciones de Acción
  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
    setWalletAddress(walletConnected ? '' : '0x71C...39A2');
  };

  const handleToggleSubscribe = (id) => {
    setArtists(artists.map(a => a.id === id ? { ...a, isSubscribed: !a.isSubscribed } : a));
  };

  const handleBuyToken = (work) => {
    const cost = work.type === 'fractional' ? work.priceToken : work.uniquePrice;
    if (balanceUSDT >= cost) {
      setBalanceUSDT(balanceUSDT - cost);
      if (work.type === 'unique') {
        setGalleryWorks(galleryWorks.map(g => g.id === work.id ? { ...g, sold: true } : g));
        alert(`¡Compraste el TOKEN ÚNICO de "${work.title}"!`);
      } else {
        setTokensRDV(tokensRDV + 1);
        alert(`¡Compraste 1 token cooperativo de "${work.title}"!`);
      }
    } else {
      alert('Saldo insuficiente en USDT.');
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent) return;

    let linked = null;
    if (newWorkTitle) {
      linked = {
        id: Date.now(),
        title: newWorkTitle,
        type: tokenTypeSelection,
        tokenPrice: tokenTypeSelection === 'fractional' ? Number(newWorkPrice) : 0,
        uniquePrice: tokenTypeSelection === 'unique' ? Number(newWorkPrice) : 0,
        progress: 0,
        APY: '10% Est.'
      };
      setGalleryWorks([{ id: linked.id, title: linked.title, artist: currentUser.name, type: linked.type, priceToken: linked.tokenPrice, uniquePrice: linked.uniquePrice, sold: false }, ...galleryWorks]);
    }

    setPosts([{
      id: Date.now(),
      artistName: currentUser.name,
      rank: currentUser.rank,
      curated: currentUser.curated,
      time: 'Justo ahora',
      content: newPostContent,
      likes: 0,
      isLiked: false,
      workLinked: linked
    }, ...posts]);

    setNewPostContent('');
    setNewWorkTitle('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-3 md:p-4 overflow-x-hidden">
      <div className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none" style={{ backgroundImage: `url('/lo1.jpg')` }}></div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        
        {/* Encabezado */}
        <header className="flex flex-col items-center text-center py-2 px-6 bg-black/40 backdrop-blur-md border border-[#f3e5ab]/30 rounded-xl w-fit mx-auto shadow-lg">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-widest text-[#f3e5ab]">RED DA VINCI</h1>
            {/* Switch de Rol */}
            <button 
              onClick={() => setUserRole(userRole === 'artist' ? 'buyer' : 'artist')}
              className="bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] text-[10px] px-2 py-0.5 rounded-full font-sans font-bold hover:bg-[#f3e5ab] hover:text-black transition"
            >
              Modo: {userRole === 'artist' ? '🎨 Artista' : '💎 Comprador'}
            </button>
          </div>
          <p className="text-xs text-white font-light">Red Social y Cooperativa de Arte Tokenizado</p>
          <div className="mt-1 inline-flex items-center gap-2 bg-black/50 px-3 py-0.5 rounded-full border border-[#f3e5ab]/30 text-[10px]">
            <span className="text-gray-300">Pozo Cooperativo (5%):</span>
            <span className="font-mono font-bold text-[#4ade80]">$45,280 USDT</span>
            <span className="text-gray-400 border-l border-white/20 pl-2">Sorteo: 12d 04h</span>
          </div>
        </header>

        {/* Layout Principal */}
        <main className="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto py-4 items-start">
          
          {/* Panel Izquierdo */}
          <div className="flex flex-col gap-2">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-[#f3e5ab] text-black font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#f3e5ab]">{currentUser.name}</h4>
                  <span className="text-[9px] bg-green-900/80 text-green-300 border border-green-500 px-1.5 py-0.5 rounded-full">
                    {currentUser.curated ? '✓ Curado por Expertos' : 'En revisión'}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 text-[10px] space-y-1 text-gray-300">
                <p>Ranking: <b className="text-[#f3e5ab]">{currentUser.rank}</b></p>
                <p>Apto Pozo Cooperativo: <b className={currentUser.poolEligible ? "text-green-400" : "text-red-400"}>{currentUser.poolEligible ? "SI (Cumple Requisitos)" : "NO"}</b></p>
              </div>
            </div>

            <button onClick={() => setActiveTab('wallet')} className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs">
              <h3 className="font-bold text-[#f3e5ab]">👤 Perfil & Wallet Web3</h3>
              <p className="text-[10px] text-gray-300">Saldo: ${balanceUSDT.toFixed(2)} USDT</p>
            </button>
            <button onClick={() => setActiveTab('tokens')} className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs">
              <h3 className="font-bold text-[#f3e5ab]">📜 Mis Tokens & Dividendos</h3>
              <p className="text-[10px] text-gray-300">Cobro de regalías acumuladas</p>
            </button>
          </div>

          {/* Feed Central */}
          <div className="md:col-span-2 flex flex-col gap-3">
            {userRole === 'artist' && (
              <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30">
                <h3 className="text-[11px] uppercase font-bold text-[#f3e5ab] mb-1">Publicar como Artista</h3>
                <form onSubmit={handleCreatePost} className="space-y-2 text-xs">
                  <textarea 
                    rows="2" 
                    value={newPostContent} 
                    onChange={(e) => setNewPostContent(e.target.value)} 
                    placeholder="Comparte novedades con tus coleccionistas..." 
                    className="w-full bg-black/60 border border-white/20 rounded p-2 text-white focus:outline-none"
                  />
                  <div className="flex gap-2 items-center bg-black/40 p-2 rounded border border-dashed border-white/20 text-[11px]">
                    <input type="text" placeholder="Obra vinculada (opcional)" value={newWorkTitle} onChange={(e) => setNewWorkTitle(e.target.value)} className="flex-1 bg-black/60 border border-white/20 p-1 rounded" />
                    {newWorkTitle && (
                      <>
                        <select value={tokenTypeSelection} onChange={(e) => setTokenTypeSelection(e.target.value)} className="bg-black border border-white/20 text-[#f3e5ab] p-1 rounded text-[10px]">
                          <option value="fractional">Colectiva (%)</option>
                          <option value="unique">Token Único (100%)</option>
                        </select>
                        <input type="number" placeholder="Precio USDT" value={newWorkPrice} onChange={(e) => setNewWorkPrice(e.target.value)} className="w-20 bg-black/60 border border-white/20 p-1 rounded" />
                      </>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-xs hover:bg-white">Publicar</button>
                  </div>
                </form>
              </div>
            )}

            {/* Publicaciones */}
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {posts.map((post) => (
                <div key={post.id} className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#f3e5ab]">{post.artistName}</span>
                      <span className="text-[9px] bg-yellow-900/60 text-yellow-300 border border-yellow-500/40 px-1 rounded">{post.rank}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{post.time}</span>
                  </div>
                  <p className="text-gray-200 my-2">{post.content}</p>

                  {post.workLinked && (
                    <div className="p-2 bg-black/60 rounded border border-[#f3e5ab]/40 flex justify-between items-center my-2">
                      <div>
                        <p className="font-bold text-white">{post.workLinked.title}</p>
                        <p className="text-[10px] text-[#4ade80]">Rendimiento Est: {post.workLinked.APY}</p>
                      </div>
                      <button onClick={() => handleBuyToken(post.workLinked)} className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-[10px] hover:bg-white">
                        {post.workLinked.type === 'fractional' ? `Comprar Token ($${post.workLinked.tokenPrice} USDT)` : `Adquirir Obra ($${post.workLinked.uniquePrice} USDT)`}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Panel Derecho: Ranking */}
          <div className="flex flex-col gap-2">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs">
              <h3 className="font-bold text-[#f3e5ab] mb-2 uppercase text-[11px]">🏆 Top Ranking Curado</h3>
              <div className="space-y-2">
                {artists.map((artist) => (
                  <div key={artist.id} className="flex justify-between items-center border-b border-white/10 pb-1">
                    <div>
                      <p className="font-bold text-white">{artist.rank} {artist.name}</p>
                      <p className="text-[9px] text-[#4ade80]">APY Est: {artist.APY}</p>
                    </div>
                    <button onClick={() => handleToggleSubscribe(artist.id)} className="bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-2 py-0.5 rounded text-[10px]">
                      {artist.isSubscribed ? 'Suscrito' : '+ Seguir'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Modales */}
        {activeTab !== 'home' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#121212] border border-[#f3e5ab]/40 rounded-xl p-5 max-w-md w-full text-white relative">
              <button onClick={() => setActiveTab('home')} className="absolute top-2 right-3 text-gray-400 hover:text-white">✕</button>
              
              {activeTab === 'wallet' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">👤 Mi Billetera Web3</h3>
                  <p className="text-xs text-gray-300">Saldo: <b className="text-[#4ade80]">${balanceUSDT.toFixed(2)} USDT</b></p>
                  <button onClick={handleConnectWallet} className="mt-3 w-full bg-[#f3e5ab] text-black font-bold py-1.5 rounded text-xs">
                    {walletConnected ? 'Desconectar Wallet' : 'Conectar Metamask'}
                  </button>
                </div>
              )}

              {activeTab === 'tokens' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">📜 Mis Tokens & Dividendos</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                    {myTokens.map(t => (
                      <div key={t.id} className="p-2 bg-black/50 border border-white/10 rounded flex justify-between">
                        <span>{t.title}</span>
                        <span className="text-[#4ade80]">+${t.dividendsUSDT} USDT</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="text-center py-2 bg-black/40 border-t border-[#f3e5ab]/20 text-[10px] text-gray-400">
          Red Da Vinci © 2026 - Cooperativa de Arte Universal Tokenizada
        </footer>
      </div>
    </div>
  );
}

export default App;
