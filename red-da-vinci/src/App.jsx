import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balanceUSDT, setBalanceUSDT] = useState(250.00);
  const [tokensRDV, setTokensRDV] = useState(120);

  // Perfil del Usuario Actual
  const [currentUser, setCurrentUser] = useState({
    username: 'Diego_Artist',
    name: 'Diego Da Vinci',
    bio: 'Artista digital y gestor cultural Web3.',
    followers: 142,
    following: 38
  });

  // Lista de Artistas
  const [artists, setArtists] = useState([
    { id: 1, name: 'Leonardo V.', handle: '@leonardo', bio: 'Maestro del Renacimiento Digital.', followers: 1250, isSubscribed: true },
    { id: 2, name: 'Elena Rostova', handle: '@elena_art', bio: 'Explorando la luz en la era tokenizada.', followers: 890, isSubscribed: false },
    { id: 3, name: 'Colectivo Sombra', handle: '@sombra_col', bio: 'Arte urbano e itinerancia física.', followers: 450, isSubscribed: false },
  ]);

  // Feed de Publicaciones de los Artistas
  const [posts, setPosts] = useState([
    {
      id: 1,
      artistName: 'Leonardo V.',
      artistHandle: '@leonardo',
      time: 'Hace 2 horas',
      content: 'Presento el primer estudio en borrador de la Gioconda Sintética. ¿Qué opinan de los tonos de iluminación?',
      likes: 34,
      isLiked: false,
      workLinked: {
        id: 101,
        title: 'Gioconda Sintética #1',
        type: 'fractional', // 'fractional' (colectiva) o 'unique' (token único)
        progress: 65,
        tokenPrice: 5.00
      }
    },
    {
      id: 2,
      artistName: 'Elena Rostova',
      artistHandle: '@elena_art',
      time: 'Hace 5 horas',
      content: '¡Acabo de publicar esta pieza exclusiva! Disponible para compra como TOKEN ÚNICO. Quien la adquiera obtiene la propiedad 100% digital.',
      likes: 89,
      isLiked: false,
      workLinked: {
        id: 102,
        title: 'Noche de Oro Digital',
        type: 'unique',
        uniquePrice: 150.00,
        sold: false
      }
    }
  ]);

  // Publicaciones de Galería
  const [galleryWorks, setGalleryWorks] = useState([
    { id: 1, title: 'El Hombre de Vitruvio 2.0', artist: 'Leonardo V.', progress: 60, priceToken: 2, type: 'fractional' },
    { id: 2, title: 'Noche de Oro Digital', artist: 'Elena Rostova', uniquePrice: 150, sold: false, type: 'unique' },
    { id: 3, title: 'Códice Atlántico Digital', artist: 'Colectivo Sombra', progress: 85, priceToken: 2, type: 'fractional' },
  ]);

  // Módulos Auxiliares
  const [myTokens, setMyTokens] = useState([
    { id: 1, title: 'El Hombre de Vitruvio 2.0', quantity: 80, valueUSDT: 160, dividendsUSDT: 12.50 },
  ]);

  const [proposals, setProposals] = useState([
    { id: 1, title: 'Propuesta #12: Adquisición de Galería Física en Florencia', budget: '$15,000 USDT', votesFor: 140, votesAgainst: 20 },
  ]);

  const [messages, setMessages] = useState([
    { id: 1, user: 'Curador Marco', text: 'La obra Códice Atlántico ya alcanzó el 85% de tokenización.' },
  ]);

  // Formularios
  const [newPostContent, setNewPostContent] = useState('');
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [tokenTypeSelection, setTokenTypeSelection] = useState('fractional'); // 'fractional' | 'unique'
  const [newWorkPrice, setNewWorkPrice] = useState(10);
  const [newMessage, setNewMessage] = useState('');

  // Acciones Web3 / Social
  const handleConnectWallet = () => {
    if (!walletConnected) {
      setWalletConnected(true);
      setWalletAddress('0x71C...39A2');
    } else {
      setWalletConnected(false);
      setWalletAddress('');
    }
  };

  const handleToggleSubscribe = (artistId) => {
    setArtists(artists.map(a => {
      if (a.id === artistId) {
        const nextSub = !a.isSubscribed;
        return {
          ...a,
          isSubscribed: nextSub,
          followers: nextSub ? a.followers + 1 : a.followers - 1
        };
      }
      return a;
    }));
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const handleBuyFractionalToken = (work) => {
    if (balanceUSDT >= work.priceToken) {
      setBalanceUSDT(balanceUSDT - work.priceToken);
      setTokensRDV(tokensRDV + 1);
      alert(`¡Has comprado 1 token cooperativo de "${work.title}" por $${work.priceToken} USDT!`);
    } else {
      alert('Saldo insuficiente en USDT.');
    }
  };

  const handleBuyUniqueToken = (work) => {
    if (balanceUSDT >= work.uniquePrice) {
      setBalanceUSDT(balanceUSDT - work.uniquePrice);
      
      // Marcar vendida
      setGalleryWorks(galleryWorks.map(g => g.id === work.id ? { ...g, sold: true } : g));
      
      setMyTokens([...myTokens, {
        id: Date.now(),
        title: `${work.title} (Token Único Exclusivo)`,
        quantity: 1,
        valueUSDT: work.uniquePrice,
        dividendsUSDT: 0
      }]);

      alert(`¡Felicidades! Adquiriste el TOKEN ÚNICO de "${work.title}" por $${work.uniquePrice} USDT.`);
    } else {
      alert('Saldo insuficiente en USDT para adquirir esta obra de Token Único.');
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostContent) return;

    let linkedWork = null;
    if (newWorkTitle) {
      if (tokenTypeSelection === 'fractional') {
        linkedWork = {
          id: Date.now(),
          title: newWorkTitle,
          type: 'fractional',
          progress: 0,
          tokenPrice: Number(newWorkPrice)
        };
      } else {
        linkedWork = {
          id: Date.now(),
          title: newWorkTitle,
          type: 'unique',
          uniquePrice: Number(newWorkPrice),
          sold: false
        };
      }

      // Añadir a Galería global
      setGalleryWorks([{
        id: linkedWork.id,
        title: linkedWork.title,
        artist: currentUser.name,
        type: linkedWork.type,
        progress: 0,
        priceToken: linkedWork.tokenPrice || 0,
        uniquePrice: linkedWork.uniquePrice || 0,
        sold: false
      }, ...galleryWorks]);
    }

    const newPostObj = {
      id: Date.now(),
      artistName: currentUser.name,
      artistHandle: `@${currentUser.username}`,
      time: 'Justo ahora',
      content: newPostContent,
      likes: 0,
      isLiked: false,
      workLinked: linkedWork
    };

    setPosts([newPostObj, ...posts]);
    setNewPostContent('');
    setNewWorkTitle('');
    alert('¡Publicación realizada con éxito!');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-3 md:p-4 overflow-x-hidden">
      {/* Fondo Renacentista */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none"
        style={{ backgroundImage: `url('/lo1.jpg')` }}
      ></div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
        
        {/* ENCABEZADO */}
        <header className="flex flex-col items-center text-center py-2 px-6 bg-black/40 backdrop-blur-md border border-[#f3e5ab]/30 rounded-xl w-fit mx-auto shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold tracking-widest text-[#f3e5ab] drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
            RED DA VINCI
          </h1>
          <p className="text-xs md:text-sm text-white mt-0.5 font-light tracking-wide">
            Red Social y Cooperativa de Arte Tokenizado
          </p>
          <div className="mt-1.5 inline-flex items-center gap-3 bg-black/50 px-4 py-1 rounded-full border border-[#f3e5ab]/30 backdrop-blur-md">
            <span className="text-[11px] text-gray-200">Pozo Cooperativo (5%): </span>
            <span className="text-xs font-mono font-bold text-[#4ade80]">$45,280 USDT</span>
            <span className="text-[11px] text-gray-300 border-l border-white/20 pl-3">Sorteo: 12d 04h</span>
          </div>
        </header>

        {/* ESTRUCTURA PRINCIPAL TIPO RED SOCIAL */}
        <main className="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto py-4 items-start">
          
          {/* PANEL IZQUIERDO: Menú y Perfil de Usuario */}
          <div className="flex flex-col gap-3">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#f3e5ab] text-black font-bold flex items-center justify-center text-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#f3e5ab]">{currentUser.name}</h4>
                  <p className="text-[10px] text-gray-300">@{currentUser.username}</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-200 italic mb-2">{currentUser.bio}</p>
              <div className="flex justify-between text-[11px] text-gray-300 border-t border-white/10 pt-2">
                <span><b>{currentUser.followers}</b> Suscriptores</span>
                <span><b>{currentUser.following}</b> Siguiendo</span>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('wallet')}
              className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md hover:bg-black/50 active:scale-95"
            >
              <h3 className="text-sm font-bold text-[#f3e5ab]">👤 Mi Perfil / Wallet</h3>
              <p className="text-[10px] text-gray-300">Gestionar fondos y Web3</p>
            </button>
            <button 
              onClick={() => setActiveTab('tokens')}
              className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md hover:bg-black/50 active:scale-95"
            >
              <h3 className="text-sm font-bold text-[#f3e5ab]">📜 Mis Tokens</h3>
              <p className="text-[10px] text-gray-300">Colección y dividendos</p>
            </button>
            <button 
              onClick={() => setActiveTab('contratos')}
              className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md hover:bg-black/50 active:scale-95"
            >
              <h3 className="text-sm font-bold text-[#f3e5ab]">📑 Contratos & Réplicas</h3>
              <p className="text-[10px] text-gray-300">Exhibiciones físicas</p>
            </button>
          </div>

          {/* CENTRO: Feed Social de Publicaciones */}
          <div className="md:col-span-2 flex flex-col gap-4">
            
            {/* Creador de Publicaciones */}
            <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-[#f3e5ab]/30 shadow-xl">
              <h3 className="text-xs uppercase font-bold text-[#f3e5ab] tracking-wider mb-2">Publicar como Artista</h3>
              <form onSubmit={handleCreatePost} className="flex flex-col gap-2">
                <textarea 
                  rows="2"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="¿Qué obra o novedad quieres compartir hoy con tus suscriptores?"
                  className="w-full bg-black/60 border border-white/20 rounded-lg p-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#f3e5ab]"
                />

                {/* Adjuntar Obra / Tokenización Opcional */}
                <div className="bg-black/40 p-2 rounded-lg border border-dashed border-white/20 text-xs flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-gray-300 font-semibold">¿Adjuntar obra para venta/tokenización?</span>
                    <select 
                      value={tokenTypeSelection} 
                      onChange={(e) => setTokenTypeSelection(e.target.value)}
                      className="bg-black border border-white/20 text-[#f3e5ab] text-[10px] p-1 rounded"
                    >
                      <option value="fractional">Tokenización Colectiva (Porcentaje)</option>
                      <option value="unique">Token Único (Venta Directa 100%)</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Título de la Obra (opcional)"
                      value={newWorkTitle}
                      onChange={(e) => setNewWorkTitle(e.target.value)}
                      className="flex-1 bg-black/60 border border-white/20 p-1.5 rounded text-[11px] text-white focus:outline-none"
                    />
                    {newWorkTitle && (
                      <input 
                        type="number"
                        placeholder={tokenTypeSelection === 'fractional' ? "Precio Token USDT" : "Precio Total USDT"}
                        value={newWorkPrice}
                        onChange={(e) => setNewWorkPrice(e.target.value)}
                        className="w-28 bg-black/60 border border-white/20 p-1.5 rounded text-[11px] text-white focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-1">
                  <button 
                    type="submit" 
                    className="bg-[#f3e5ab] text-black font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-white transition shadow-md"
                  >
                    Publicar en Feed
                  </button>
                </div>
              </form>
            </div>

            {/* Muestra del Feed */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {posts.map((post) => (
                <div key={post.id} className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f3e5ab]/80 text-black font-bold flex items-center justify-center text-xs">
                        {post.artistName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#f3e5ab]">{post.artistName}</h4>
                        <p className="text-[10px] text-gray-400">{post.artistHandle} • {post.time}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-200 mb-3 leading-relaxed">{post.content}</p>

                  {/* Tarjeta de Obra Vinculada al Post */}
                  {post.workLinked && (
                    <div className="my-2 p-3 bg-black/60 rounded-xl border border-[#f3e5ab]/40">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">{post.workLinked.title}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${post.workLinked.type === 'unique' ? 'bg-purple-900/80 text-purple-200 border border-purple-400' : 'bg-green-900/80 text-green-200 border border-green-400'}`}>
                          {post.workLinked.type === 'unique' ? '💎 TOKEN ÚNICO' : '🤝 COOPERATIVA'}
                        </span>
                      </div>

                      {post.workLinked.type === 'fractional' ? (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[11px] text-[#4ade80]">Avance: {post.workLinked.progress}% Tokenizado</span>
                          <button 
                            onClick={() => handleBuyFractionalToken(post.workLinked)}
                            className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded-lg text-[10px] hover:bg-white transition"
                          >
                            Comprar Token (${post.workLinked.tokenPrice} USDT)
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[11px] text-purple-300">Precio Completo: ${post.workLinked.uniquePrice} USDT</span>
                          {post.workLinked.sold ? (
                            <span className="text-[10px] text-gray-400 font-bold bg-white/10 px-2 py-1 rounded">VENDIDA</span>
                          ) : (
                            <button 
                              onClick={() => handleBuyUniqueToken(post.workLinked)}
                              className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition"
                            >
                              Adquirir Obra Única
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 border-t border-white/10 pt-2 text-[11px]">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 ${post.isLiked ? 'text-red-400 font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      ❤️ {post.likes} Me gusta
                    </button>
                    <button className="text-gray-400 hover:text-white">💬 Comentar</button>
                    <button className="text-gray-400 hover:text-white">🔄 Compartir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL DERECHO: Artistas Destacados & Suscripciones */}
          <div className="flex flex-col gap-3">
            <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <h3 className="text-xs uppercase font-bold text-[#f3e5ab] tracking-wider mb-3">Artistas en la Red</h3>
              <div className="space-y-3">
                {artists.map((artist) => (
                  <div key={artist.id} className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                    <div>
                      <p className="font-bold text-white">{artist.name}</p>
                      <p className="text-[10px] text-gray-400">{artist.followers} suscriptores</p>
                    </div>
                    <button 
                      onClick={() => handleToggleSubscribe(artist.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition ${
                        artist.isSubscribed 
                          ? 'bg-black/60 border border-white/30 text-gray-300' 
                          : 'bg-[#f3e5ab] text-black hover:bg-white'
                      }`}
                    >
                      {artist.isSubscribed ? 'Suscrito' : '+ Suscribirse'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('galeria')}
              className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md hover:bg-black/50 active:scale-95"
            >
              <h3 className="text-sm font-bold text-[#f3e5ab]">🖼️ Galería / Mercado</h3>
              <p className="text-[10px] text-gray-300">Catálogo global de obras</p>
            </button>
            <button 
              onClick={() => setActiveTab('grupos')}
              className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md hover:bg-black/50 active:scale-95"
            >
              <h3 className="text-sm font-bold text-[#f3e5ab]">👥 Grupos & Colectivos</h3>
              <p className="text-[10px] text-gray-300">Debates y proyectos</p>
            </button>
            <button 
              onClick={() => setActiveTab('votacion')}
              className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition shadow-md hover:bg-black/50 active:scale-95"
            >
              <h3 className="text-sm font-bold text-[#f3e5ab]">🏛️ Votación Cooperativa</h3>
              <p className="text-[10px] text-gray-300">Decisiones comunitarias</p>
            </button>
          </div>
        </main>

        {/* MODALES FLOTANTES CENTRALES */}
        {activeTab !== 'home' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#121212]/95 border border-[#f3e5ab]/40 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl relative">
              <button 
                onClick={() => setActiveTab('home')}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>

              {/* Wallet / Perfil */}
              {activeTab === 'wallet' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">👤 Perfil & Billetera Web3</h2>
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
                    <button onClick={handleConnectWallet} className="flex-1 bg-[#f3e5ab] text-black font-bold py-2 rounded-xl text-xs hover:bg-white transition">
                      {walletConnected ? "Desconectar" : "Conectar Metamask"}
                    </button>
                    {walletConnected && (
                      <button onClick={() => setBalanceUSDT(balanceUSDT + 100)} className="bg-black/60 border border-[#f3e5ab]/40 text-[#f3e5ab] px-3 py-2 rounded-xl text-xs font-bold">
                        + $100 USDT
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Mis Tokens */}
              {activeTab === 'tokens' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">📜 Mis Tokens & Obras</h2>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {myTokens.map((item) => (
                      <div key={item.id} className="bg-black/50 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-white">{item.title}</p>
                          <p className="text-gray-400">{item.quantity} Token(s) | Valor: ${item.valueUSDT} USDT</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Galería Mercado */}
              {activeTab === 'galeria' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">🖼️ Galería / Mercado Global</h2>
                  <div className="space-y-2 max-h-60 overflow-y-auto text-xs pr-1">
                    {galleryWorks.map((work) => (
                      <div key={work.id} className="p-3 bg-black/40 rounded-lg border border-white/10 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{work.title}</p>
                          <p className="text-gray-400">Artista: {work.artist}</p>
                          <span className={`text-[9px] font-bold ${work.type === 'unique' ? 'text-purple-300' : 'text-[#4ade80]'}`}>
                            {work.type === 'unique' ? '💎 Token Único' : '🤝 Tokenización Colectiva'}
                          </span>
                        </div>
                        {work.type === 'fractional' ? (
                          <button onClick={() => handleBuyFractionalToken(work)} className="bg-[#f3e5ab] text-black font-bold px-3 py-1.5 rounded-lg text-[11px]">
                            Comprar (${work.priceToken} USDT)
                          </button>
                        ) : (
                          work.sold ? (
                            <span className="text-gray-400 font-bold">VENDIDO</span>
                          ) : (
                            <button onClick={() => handleBuyUniqueToken(work)} className="bg-purple-600 text-white font-bold px-3 py-1.5 rounded-lg text-[11px]">
                              Comprar ($ {work.uniquePrice} USDT)
                            </button>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Votación */}
              {activeTab === 'votacion' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">🏛️ Votación Cooperativa</h2>
                  <div className="space-y-3 max-h-60 overflow-y-auto text-xs">
                    {proposals.map((prop) => (
                      <div key={prop.id} className="p-3 bg-black/40 rounded-lg border border-white/10">
                        <p className="font-bold text-white">{prop.title}</p>
                        <p className="text-gray-400">Presupuesto: {prop.budget}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grupos */}
              {activeTab === 'grupos' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">👥 Grupos & Colectivos</h2>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs mb-3">
                    {messages.map((m) => (
                      <div key={m.id} className="p-2 bg-black/40 rounded border border-white/10">
                        <span className="font-bold text-[#f3e5ab]">{m.user}: </span>
                        <span className="text-gray-200">{m.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contratos */}
              {activeTab === 'contratos' && (
                <div>
                  <h2 className="text-xl font-bold text-[#f3e5ab] mb-2">📑 Contratos & Réplicas</h2>
                  <p className="text-xs text-gray-300">Gestión de exhibiciones físicas e itinerancia de replicas impresas.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PIE DE PÁGINA */}
        <footer className="flex justify-around items-center py-2 bg-black/40 backdrop-blur-md border border-[#f3e5ab]/20 rounded-xl mt-2">
          <button onClick={() => setActiveTab('home')} className="text-xs font-semibold text-[#f3e5ab]">🏠 Feed Principal</button>
          <button onClick={() => setActiveTab('galeria')} className="text-xs font-semibold text-white hover:text-[#f3e5ab]">🔍 Explorar Mercado</button>
          <button onClick={() => setActiveTab('grupos')} className="text-xs font-semibold text-white hover:text-[#f3e5ab]">💬 Mensajes & Grupos</button>
        </footer>
      </div>
    </div>
  );
}

export default App;
