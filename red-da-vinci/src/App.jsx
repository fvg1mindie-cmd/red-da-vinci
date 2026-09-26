import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState('artist');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balanceUSDT, setBalanceUSDT] = useState(250.00);
  const [tokensRDV, setTokensRDV] = useState(120);

  // Perfil del Usuario Actual (Dinámico)
  const [currentUser, setCurrentUser] = useState({
    name: 'Diego Da Vinci',
    username: 'diego_art',
    bio: 'Artista digital y gestor cultural Web3.',
    portfolioUrl: 'https://reddavinci.com/diego_art',
    rank: '#4 Global',
    curated: true,
    poolEligible: true,
  });

  // Estado del Formulario de Registro
  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    bio: '',
    portfolioUrl: '',
    roleRequested: 'artist'
  });

  const [artists, setArtists] = useState([
    { id: 1, name: 'Leonardo V.', rank: '#1', curated: true, APY: '14%', isSubscribed: true },
    { id: 2, name: 'Elena Rostova', rank: '#2', curated: true, APY: '11%', isSubscribed: false },
    { id: 3, name: 'Colectivo Sombra', rank: '#8', curated: false, APY: 'Pendiente', isSubscribed: false },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      artistName: 'Leonardo V.',
      rank: '#1 Global',
      curated: true,
      time: 'Hace 2 horas',
      content: 'Estudio de iluminación para la nueva obra. Rendimiento estimado para inversores: 14% anual por alquileres e itinerancia física.',
      workLinked: { id: 101, title: 'Gioconda Sintética #1', type: 'fractional', tokenPrice: 5.00, APY: '14% Anual', isTokenized: true }
    }
  ]);

  const [myTokens] = useState([
    { id: 1, title: 'El Hombre de Vitruvio 2.0', quantity: 80, valueUSDT: 160, dividendsUSDT: 12.50 },
  ]);

  const [newPostContent, setNewPostContent] = useState('');
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [wantsToTokenize, setWantsToTokenize] = useState(false);
  const [tokenTypeSelection, setTokenTypeSelection] = useState('fractional');
  const [newWorkPrice, setNewWorkPrice] = useState(10);

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
    setWalletAddress(walletConnected ? '' : '0x71C...39A2');
  };

  const handleToggleSubscribe = (id) => {
    setArtists(artists.map(a => a.id === id ? { ...a, isSubscribed: !a.isSubscribed } : a));
  };

  const handleBuyToken = (work) => {
    if (!work.isTokenized) {
      alert('Esta obra es solo de exhibición. El artista aún no ha sido aprobado por el Comité Curador para tokenizar.');
      return;
    }
    const cost = work.type === 'fractional' ? work.tokenPrice : work.uniquePrice;
    if (balanceUSDT >= cost) {
      setBalanceUSDT(prev => prev - cost);
      if (work.type === 'unique') {
        alert(`¡Compraste el TOKEN ÚNICO de "${work.title}" por $${cost} USDT!`);
      } else {
        setTokensRDV(prev => prev + 1);
        alert(`¡Compraste 1 token cooperativo de "${work.title}" por $${cost} USDT!`);
      }
    } else {
      alert('Saldo insuficiente en USDT.');
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent) return;

    if (wantsToTokenize && !currentUser.curated) {
      alert('⚠️ Para tokenizar tus obras y vender participaciones, debes solicitar la revisión del Comité Curador.');
      return;
    }

    let linked = null;
    if (newWorkTitle) {
      linked = {
        id: Date.now(),
        title: newWorkTitle,
        type: wantsToTokenize ? tokenTypeSelection : 'showcase',
        tokenPrice: wantsToTokenize && tokenTypeSelection === 'fractional' ? Number(newWorkPrice) : 0,
        uniquePrice: wantsToTokenize && tokenTypeSelection === 'unique' ? Number(newWorkPrice) : 0,
        APY: wantsToTokenize ? '10% Est.' : 'N/A',
        isTokenized: wantsToTokenize && currentUser.curated
      };
    }

    setPosts([{
      id: Date.now(),
      artistName: currentUser.name,
      rank: currentUser.rank,
      curated: currentUser.curated,
      time: 'Justo ahora',
      content: newPostContent,
      workLinked: linked
    }, ...posts]);

    setNewPostContent('');
    setNewWorkTitle('');
    setWantsToTokenize(false);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.username) {
      alert('Por favor completa al menos el nombre y nombre de usuario.');
      return;
    }

    const isArtist = registerForm.roleRequested === 'artist';

    setCurrentUser({
      name: registerForm.name,
      username: registerForm.username,
      bio: registerForm.bio || 'Nuevo miembro de la Red Da Vinci.',
      portfolioUrl: registerForm.portfolioUrl || '',
      rank: isArtist ? 'Comunidad' : 'N/A',
      curated: false, 
      poolEligible: false,
    });

    setUserRole(registerForm.roleRequested);
    setActiveTab('home');
    alert(`¡Bienvenido ${registerForm.name}! Perfil creado con éxito.`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-3 md:p-4 overflow-x-hidden">
      <div className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none" style={{ backgroundImage: `url('/lo1.jpg')` }}></div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
        
        {/* Encabezado */}
        <header className="flex flex-col items-center text-center py-2 px-5 bg-black/20 backdrop-blur-md border border-[#f3e5ab]/30 rounded-xl w-fit mx-auto shadow-lg">
          <div className="flex items-center gap-3 mb-0.5">
            <h1 className="text-xl md:text-3xl font-bold tracking-widest text-[#f3e5ab]">RED DA VINCI</h1>
            <button 
              onClick={() => setUserRole(userRole === 'artist' ? 'buyer' : 'artist')}
              className="bg-black/30 border border-[#f3e5ab]/50 text-[#f3e5ab] text-[10px] px-2 py-0.5 rounded-full font-sans font-bold hover:bg-[#f3e5ab] hover:text-black transition cursor-pointer"
            >
              Modo: {userRole === 'artist' ? '🎨 Artista' : '💎 Comprador'}
            </button>
          </div>
          <p className="text-[11px] text-white font-light">Red Social Libre y Cooperativa de Arte Tokenizado</p>
          <div className="mt-1 inline-flex items-center gap-2 bg-black/30 px-3 py-0.5 rounded-full border border-[#f3e5ab]/30 text-[10px]">
            <span className="text-gray-200">Pozo Cooperativo (5%):</span>
            <span className="font-mono font-bold text-[#4ade80]">$45,280 USDT</span>
            <span className="text-gray-300 border-l border-white/20 pl-2">Sorteo: 12d 04h</span>
          </div>
        </header>

        {/* Layout Principal */}
        <main className="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto py-3 items-start">
          
          {/* Panel Izquierdo */}
          <div className="flex flex-col gap-2 items-start">
            <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30 w-fit">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-[#f3e5ab] text-black font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#f3e5ab]">{currentUser.name}</h4>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${currentUser.curated ? 'bg-green-950/60 text-green-300 border-green-500/40' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                    {currentUser.curated ? '✓ Artista Curado' : '🌐 Perfil Libre'}
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-white/10 text-[10px] space-y-1 text-gray-200">
                <p>Ranking: <b className="text-[#f3e5ab]">{currentUser.rank}</b></p>
                <p>Apto Pozo: <b className={currentUser.poolEligible ? "text-green-400" : "text-gray-400"}>{currentUser.poolEligible ? "SI" : "Requiere Curaduría"}</b></p>
              </div>
            </div>

            <button onClick={() => setActiveTab('register')} className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-xs font-bold w-fit hover:bg-black/40 transition cursor-pointer">
              ✏️ Crear / Editar Perfil
            </button>
            <button onClick={() => setActiveTab('wallet')} className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs w-fit hover:bg-black/40 cursor-pointer">
              <h3 className="font-bold text-[#f3e5ab]">👤 Perfil & Wallet Web3</h3>
              <p className="text-[10px] text-gray-200">Saldo: ${balanceUSDT.toFixed(2)} USDT</p>
            </button>
            <button onClick={() => setActiveTab('tokens')} className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs w-fit hover:bg-black/40 cursor-pointer">
              <h3 className="font-bold text-[#f3e5ab]">📜 Mis Tokens & Dividendos</h3>
              <p className="text-[10px] text-gray-200">Tokens poseídos: {tokensRDV}</p>
            </button>
          </div>

          {/* Feed Central */}
          <div className="md:col-span-2 flex flex-col gap-3">
            {userRole === 'artist' && (
              <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30">
                <h3 className="text-[11px] uppercase font-bold text-[#f3e5ab] mb-1">Publicar en la Comunidad</h3>
                <form onSubmit={handleCreatePost} className="space-y-2 text-xs">
                  <textarea 
                    rows="2" 
                    value={newPostContent} 
                    onChange={(e) => setNewPostContent(e.target.value)} 
                    placeholder="Comparte tu arte con la comunidad..." 
                    className="w-full bg-black/30 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-[#f3e5ab]"
                  />
                  <div className="flex flex-col gap-2 bg-black/20 p-2 rounded border border-dashed border-white/20 text-[11px]">
                    <input type="text" placeholder="Nombre de la obra (opcional)" value={newWorkTitle} onChange={(e) => setNewWorkTitle(e.target.value)} className="w-full bg-black/30 border border-white/20 p-1 rounded text-white" />
                    
                    {newWorkTitle && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <label className="flex items-center gap-1 text-[10px] text-[#f3e5ab] cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={wantsToTokenize} 
                            onChange={(e) => setWantsToTokenize(e.target.checked)} 
                          />
                          ¿Tokenizar obra?
                        </label>
                        
                        {wantsToTokenize && (
                          <>
                            <select value={tokenTypeSelection} onChange={(e) => setTokenTypeSelection(e.target.value)} className="bg-black border border-white/20 text-[#f3e5ab] p-1 rounded text-[10px]">
                              <option value="fractional">Colectiva (%)</option>
                              <option value="unique">Token Único (100%)</option>
                            </select>
                            <input type="number" placeholder="Precio USDT" value={newWorkPrice} onChange={(e) => setNewWorkPrice(e.target.value)} className="w-20 bg-black/30 border border-white/20 p-1 rounded text-white" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-xs hover:bg-white transition cursor-pointer">Publicar Obra</button>
                  </div>
                </form>
              </div>
            )}

            {/* Publicaciones */}
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {posts.map((post) => (
                <div key={post.id} className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#f3e5ab]">{post.artistName}</span>
                      <span className={`text-[9px] px-1 rounded border ${post.curated ? 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                        {post.curated ? `Curado ${post.rank}` : 'Comunidad'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-300">{post.time}</span>
                  </div>
                  <p className="text-gray-100 my-2">{post.content}</p>

                  {post.workLinked && (
                    <div className="p-2 bg-black/30 rounded border border-[#f3e5ab]/40 flex justify-between items-center my-2">
                      <div>
                        <p className="font-bold text-white">{post.workLinked.title}</p>
                        {post.workLinked.isTokenized ? (
                          <p className="text-[10px] text-[#4ade80]">Rendimiento Est: {post.workLinked.APY}</p>
                        ) : (
                          <p className="text-[10px] text-gray-400">Exhibición libre (No tokenizada)</p>
                        )}
                      </div>
                      {post.workLinked.isTokenized ? (
                        <button onClick={() => handleBuyToken(post.workLinked)} className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-[10px] hover:bg-white transition cursor-pointer">
                          {post.workLinked.type === 'fractional' ? `Comprar Token ($${post.workLinked.tokenPrice} USDT)` : `Adquirir Obra ($${post.workLinked.uniquePrice} USDT)`}
                        </button>
                      ) : (
                        <span className="text-[9px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">Solo Muestra</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="flex flex-col gap-2 items-end">
            <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs w-fit">
              <h3 className="font-bold text-[#f3e5ab] mb-2 uppercase text-[11px]">🏆 Top Ranking Curado</h3>
              <div className="space-y-2">
                {artists.map((artist) => (
                  <div key={artist.id} className="flex justify-between items-center gap-4 border-b border-white/10 pb-1">
                    <div>
                      <p className="font-bold text-white">{artist.rank} {artist.name}</p>
                      <p className="text-[9px] text-[#4ade80]">{artist.curated ? `APY Est: ${artist.APY}` : 'No Curado'}</p>
                    </div>
                    <button onClick={() => handleToggleSubscribe(artist.id)} className="bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-2 py-0.5 rounded text-[10px] hover:bg-[#f3e5ab] hover:text-black transition cursor-pointer">
                      {artist.isSubscribed ? 'Suscrito ✓' : '+ Seguir'}
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
            <div className="bg-[#121212]/90 border border-[#f3e5ab]/40 rounded-xl p-5 max-w-md w-full text-white relative">
              <button onClick={() => setActiveTab('home')} className="absolute top-2 right-3 text-gray-400 hover:text-white cursor-pointer">✕</button>
              
              {activeTab === 'register' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2 text-sm">📝 Crear Perfil</h3>
                  <form onSubmit={handleRegisterSubmit} className="space-y-2 text-xs">
                    <div>
                      <label className="text-gray-300 text-[10px] block mb-0.5">Tipo de Perfil:</label>
                      <select 
                        value={registerForm.roleRequested} 
                        onChange={(e) => setRegisterForm({...registerForm, roleRequested: e.target.value})}
                        className="w-full bg-black border border-white/20 p-1.5 rounded text-white text-xs"
                      >
                        <option value="artist">🎨 Artista</option>
                        <option value="buyer">💎 Comprador / Inversor</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-[10px] block mb-0.5">Nombre Completo:</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Leonardo" 
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-[10px] block mb-0.5">Usuario (@):</label>
                      <input 
                        type="text" 
                        placeholder="Ej: leo_art" 
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white"
                      />
                    </div>
                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2 rounded text-xs hover:bg-white transition cursor-pointer mt-2">
                      Registrarse
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'wallet' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">👤 Mi Billetera Web3</h3>
                  <p className="text-xs text-gray-300">Saldo actual: <b className="text-[#4ade80]">${balanceUSDT.toFixed(2)} USDT</b></p>
                  <button onClick={handleConnectWallet} className="mt-3 w-full bg-[#f3e5ab] text-black font-bold py-1.5 rounded text-xs hover:bg-white transition cursor-pointer">
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

        <footer className="text-center py-2 bg-black/20 border-t border-[#f3e5ab]/20 text-[10px] text-gray-300 rounded-xl">
          Red Da Vinci © 2026 - Cooperativa de Arte Universal Tokenizada
        </footer>
      </div>
    </div>
  );
}

export default App;
