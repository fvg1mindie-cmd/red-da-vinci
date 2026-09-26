import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState('artist');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balanceUSDT, setBalanceUSDT] = useState(250.00);
  const [tokensRDV, setTokensRDV] = useState(120);

  const [currentUser, setCurrentUser] = useState(null);

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: '',
    bio: 'Artista visual explorando las fronteras del arte digital y la tokenización.',
    roleRequested: 'artist'
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const [artists] = useState([
    { id: 1, name: 'Leonardo V.', rank: '#1', curated: true, APY: '14%', isSubscribed: true },
    { id: 2, name: 'Elena Rostova', rank: '#2', curated: true, APY: '11%', isSubscribed: false },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      artistName: 'Leonardo V.',
      rank: '#1 Global',
      curated: true,
      time: 'Hace 2 horas',
      content: 'Estudio de iluminación para la nueva obra. Rendimiento estimado para inversores: 14% anual.',
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

  const handleBuyToken = (work) => {
    if (!currentUser) { alert('⚠️ Debes iniciar sesión para comprar tokens.'); return; }
    if (!work.isTokenized) { alert('Esta obra es solo de exhibición.'); return; }
    const cost = work.type === 'fractional' ? work.tokenPrice : work.uniquePrice;
    if (balanceUSDT >= cost) {
      setBalanceUSDT(prev => prev - cost);
      if (work.type === 'unique') { alert(`¡Compraste el TOKEN ÚNICO de "${work.title}"!`); }
      else { setTokensRDV(prev => prev + 1); alert(`¡Compraste 1 token cooperativo de "${work.title}"!`); }
    } else { alert('Saldo insuficiente en USDT.'); }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!currentUser) { alert('⚠️ Debes iniciar sesión para publicar.'); return; }
    if (!newPostContent) return;

    if (wantsToTokenize && !currentUser.curated) {
      alert('⚠️ Para tokenizar obras, tu perfil debe ser verificado por el Comité Curador.');
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
        isTokenized: wantsToTokenize && currentUser.curated
      };
    }

    const newPost = {
      id: Date.now(),
      artistName: currentUser.name,
      rank: currentUser.rank,
      curated: currentUser.curated,
      time: 'Justo ahora',
      content: newPostContent,
      workLinked: linked
    };

    setPosts([newPost, ...posts]);
    setCurrentUser({
      ...currentUser,
      myWorksCount: (currentUser.myWorksCount || 0) + (newWorkTitle ? 1 : 0)
    });

    setNewPostContent('');
    setNewWorkTitle('');
    setWantsToTokenize(false);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden.');
      return;
    }
    if (!registerForm.email || !registerForm.password || !registerForm.name || !registerForm.username) {
      alert('⚠️ Por favor completa todos los campos obligatorios.');
      return;
    }

    const isArtist = registerForm.roleRequested === 'artist';
    const newUser = {
      name: registerForm.name,
      username: registerForm.username,
      email: registerForm.email,
      bio: registerForm.bio,
      rank: isArtist ? 'Comunidad (En revisión)' : 'N/A',
      curated: false,
      poolEligible: false,
      myWorksCount: 0
    };

    setCurrentUser(newUser);
    setUserRole(registerForm.roleRequested);
    setActiveTab('home');
    alert(`¡Registro exitoso, ${newUser.name}!`);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if(loginForm.email && loginForm.password) {
      const loggedUser = {
        name: 'Diego Da Vinci',
        username: 'diego_art',
        email: loginForm.email,
        bio: 'Artista digital y gestor cultural Web3 comprometido con la Red.',
        rank: '#4 Global',
        curated: true,
        poolEligible: true,
        myWorksCount: 2
      };
      setCurrentUser(loggedUser);
      setUserRole('artist');
      setActiveTab('home');
      alert('Inicio de sesión exitoso.');
    } else {
      alert('Por favor ingresa credenciales.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-3 md:p-4 overflow-x-hidden">
      <div className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none" style={{ backgroundImage: `url('/lo1.jpg')` }}></div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
        
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
          <p className="text-[11px] text-white font-light">Cooperativa de Arte Universal Tokenizada</p>
        </header>

        {/* Layout Principal o Sección de Perfil */}
        {activeTab === 'profile' && currentUser ? (
          <main className="my-auto py-6 max-w-2xl mx-auto w-full bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-[#f3e5ab]/40">
            <div className="flex items-center gap-4 border-b border-white/20 pb-4">
              <div className="w-16 h-16 rounded-full bg-[#f3e5ab] text-black font-bold text-2xl flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#f3e5ab]">{currentUser.name}</h2>
                <p className="text-sm text-gray-300">@{currentUser.username}</p>
                <span className="text-[10px] bg-green-950/60 text-green-300 border border-green-500/40 px-2 py-0.5 rounded-full mt-1 inline-block">
                  {currentUser.curated ? '✓ Artista Verificado' : '🌐 Perfil Público / En revisión'}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <h3 className="text-xs uppercase text-[#f3e5ab] font-bold">Biografía del Artista</h3>
                <p className="text-gray-200 mt-1 bg-black/30 p-3 rounded-xl border border-white/10">{currentUser.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block">Ranking Global</span>
                  <b className="text-[#f3e5ab] text-sm">{currentUser.rank}</b>
                </div>
                <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block">Obras Registradas</span>
                  <b className="text-green-400 text-sm">{currentUser.myWorksCount || 0} Obras</b>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={() => setActiveTab('home')} className="bg-[#f3e5ab] text-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-white transition cursor-pointer">
                ← Volver al Inicio
              </button>
            </div>
          </main>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto py-3 items-start">
            
            <div className="flex flex-col gap-2 items-start">
              <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30 w-fit">
                {currentUser ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#f3e5ab] text-black font-bold flex items-center justify-center text-xs">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#f3e5ab]">{currentUser.name}</h4>
                        <p className="text-[9px] text-gray-300">@{currentUser.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => setActiveTab('profile')} className="bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-2 py-1 rounded text-[10px] hover:bg-[#f3e5ab] hover:text-black transition cursor-pointer">
                        👤 Ver Mi Perfil
                      </button>
                      <button onClick={handleLogout} className="bg-red-950/40 border border-red-500/40 text-red-300 px-2 py-1 rounded text-[10px] hover:bg-red-600 hover:text-white transition cursor-pointer">
                        Salir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-xs text-[#f3e5ab] mb-1.5">¡Bienvenido!</h4>
                    <div className="flex gap-2">
                      <button onClick={() => setActiveTab('login')} className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-xs hover:bg-white transition cursor-pointer">Iniciar Sesión</button>
                      <button onClick={() => setActiveTab('register')} className="bg-black/30 border border-[#f3e5ab]/50 text-[#f3e5ab] px-3 py-1 rounded text-xs hover:bg-[#f3e5ab] hover:text-black transition cursor-pointer">Registrarse</button>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setActiveTab('wallet')} className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs w-fit hover:bg-black/40 cursor-pointer">
                <h3 className="font-bold text-[#f3e5ab]">👤 Wallet Web3</h3>
                <p className="text-[10px] text-gray-200">Saldo: ${balanceUSDT.toFixed(2)} USDT</p>
              </button>
              <button onClick={() => setActiveTab('tokens')} className="bg-black/20 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs w-fit hover:bg-black/40 cursor-pointer">
                <h3 className="font-bold text-[#f3e5ab]">📜 Mis Tokens</h3>
              </button>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              {userRole === 'artist' && (
                <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30">
                  <h3 className="text-[11px] uppercase font-bold text-[#f3e5ab] mb-1">Publicar como Artista</h3>
                  <form onSubmit={handleCreatePost} className="space-y-2 text-xs">
                    <textarea 
                      rows="2" 
                      value={newPostContent} 
                      onChange={(e) => setNewPostContent(e.target.value)} 
                      placeholder={currentUser ? "Comparte novedades con tus coleccionistas..." : "⚠️ Inicia sesión para publicar..."}
                      className="w-full bg-black/30 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-[#f3e5ab]"
                      disabled={!currentUser}
                    />
                    <div className="flex flex-col gap-2 bg-black/20 p-2 rounded border border-dashed border-white/20 text-[11px]">
                      <input type="text" placeholder="Nombre de la obra (opcional)" value={newWorkTitle} onChange={(e) => setNewWorkTitle(e.target.value)} className="w-full bg-black/30 border border-white/20 p-1 rounded text-white" disabled={!currentUser}/>
                      
                      {newWorkTitle && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="flex items-center gap-1 text-[10px] text-[#f3e5ab] cursor-pointer">
                            <input type="checkbox" checked={wantsToTokenize} onChange={(e) => setWantsToTokenize(e.target.checked)} />
                            ¿Tokenizar para venta?
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
                      <button type="submit" className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-xs hover:bg-white transition cursor-pointer disabled:opacity-50" disabled={!currentUser}>Publicar Obra</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {posts.map((post) => (
                  <div key={post.id} className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#f3e5ab]">{post.artistName}</span>
                        <span className={`text-[9px] px-1 rounded border ${post.curated ? 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                          {post.curated ? `Verificado` : 'Público'}
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
                            <p className="text-[10px] text-[#4ade80]">Financiación Habilitada</p>
                          ) : (
                            <p className="text-[10px] text-gray-400">Exhibición Pública</p>
                          )}
                        </div>
                        {post.workLinked.isTokenized ? (
                          <button onClick={() => handleBuyToken(post.workLinked)} className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-[10px] hover:bg-white transition cursor-pointer">
                            {post.workLinked.type === 'fractional' ? `Comprar Token` : `Adquirir Obra`}
                          </button>
                        ) : (
                          <span className="text-[9px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">No Tokenizado</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="bg-black/20 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs w-fit">
                <h3 className="font-bold text-[#f3e5ab] mb-2 uppercase text-[11px]">🏆 Top Ranking Curado</h3>
                <div className="space-y-2">
                  {artists.map((artist) => (
                    <div key={artist.id} className="flex justify-between items-center gap-4 border-b border-white/10 pb-1">
                      <div>
                        <p className="font-bold text-white">{artist.rank} {artist.name}</p>
                        <p className="text-[9px] text-[#4ade80]">APY Est: {artist.APY}</p>
                      </div>
                      <button className="bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-2 py-0.5 rounded text-[10px] hover:bg-[#f3e5ab] hover:text-black transition cursor-pointer">
                        {artist.isSubscribed ? 'Suscrito ✓' : '+ Seguir'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Modales */}
        {activeTab !== 'home' && activeTab !== 'profile' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="bg-[#121212]/90 border border-[#f3e5ab]/40 rounded-xl p-5 max-w-md w-full text-white relative">
              <button onClick={() => setActiveTab('home')} className="absolute top-2 right-3 text-gray-400 hover:text-white cursor-pointer">✕</button>
              
              {activeTab === 'register' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2 text-sm">📝 Registro de Usuario</h3>
                  <form onSubmit={handleRegisterSubmit} className="space-y-2 text-xs">
                    <div>
                      <label className="text-gray-300 text-[10px] block mb-0.5">Tipo de Perfil:</label>
                      <select value={registerForm.roleRequested} onChange={(e) => setRegisterForm({...registerForm, roleRequested: e.target.value})} className="w-full bg-black border border-white/20 p-1.5 rounded text-white text-xs">
                        <option value="artist">🎨 Artista</option>
                        <option value="buyer">💎 Comprador / Inversor</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-gray-300 text-[10px] block mb-0.5">Nombre Completo:</label>
                        <input type="text" placeholder="Ej: Leonardo V." value={registerForm.name} onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})} className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white" />
                      </div>
                      <div>
                        <label className="text-gray-300 text-[10px] block mb-0.5">Usuario (@):</label>
                        <input type="text" placeholder="Ej: leo_art" value={registerForm.username} onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})} className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-300 text-[10px] block mb-0.5">Correo Electrónico:</label>
                      <input type="email" placeholder="leo@florencia.com" value={registerForm.email} onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})} className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white" />
                    </div>
                    <div>
                      <label className="text-gray-300 text-[10px] block mb-0.5">Biografía Inicial:</label>
                      <textarea rows="2" placeholder="Cuéntanos sobre tu arte..." value={registerForm.bio} onChange={(e) => setRegisterForm({...registerForm, bio: e.target.value})} className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-gray-300 text-[10px] block mb-0.5">Contraseña:</label>
                        <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})} className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white" />
                      </div>
                      <div>
                        <label className="text-gray-300 text-[10px] block mb-0.5">Confirmar:</label>
                        <input type="password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})} className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white" />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2 rounded text-xs hover:bg-white transition cursor-pointer mt-2">
                      Crear Cuenta
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'login' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2 text-sm">🔑 Iniciar Sesión</h3>
                  <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="text-gray-300 text-[10px] block mb-0.5">Correo Electrónico:</label>
                      <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white" />
                    </div>
                    <div>
                      <label className="text-gray-300 text-[10px] block mb-0.5">Contraseña:</label>
                      <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({...loginForm, loginForm: e.target.value})} className="w-full bg-black/50 border border-white/20 p-1.5 rounded text-white" />
                    </div>
                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2 rounded text-xs hover:bg-white transition cursor-pointer mt-3">
                      Ingresar
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'wallet' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">👤 Wallet Web3</h3>
                  <p className="text-xs text-gray-300">Saldo actual: <b className="text-[#4ade80]">${balanceUSDT.toFixed(2)} USDT</b></p>
                  <button onClick={handleConnectWallet} className="mt-3 w-full bg-[#f3e5ab] text-black font-bold py-1.5 rounded text-xs hover:bg-white transition cursor-pointer">
                    {walletConnected ? 'Desconectar Wallet' : 'Conectar Metamask'}
                  </button>
                </div>
              )}

              {activeTab === 'tokens' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">📜 Mis Tokens</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                    {myTokens.map(t => (
                      <div key={t.id} className="p-2 bg-black/50 border border-white/10 rounded flex justify-between">
                        <span>{t.title}</span>
                        <span className="text-[#4ade80]">${t.valueUSDT} USDT</span>
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
