import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from './supabaseClient';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState('artist');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balanceUSDT, setBalanceUSDT] = useState(250.00); // Simulado hasta definir blockchain/DeFi

  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    username: '',
    bio: '',
    roleRequested: 'artist'
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  // Visibilidad de contraseñas
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [artists, setArtists] = useState([]);
  const [posts, setPosts] = useState([]);
  const [myTokens, setMyTokens] = useState([]);
  const [myWorks, setMyWorks] = useState([]);

  const [newPostContent, setNewPostContent] = useState('');
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [wantsToTokenize, setWantsToTokenize] = useState(false);
  const [tokenTypeSelection, setTokenTypeSelection] = useState('fractional'); // 'unique' | 'fractional' | 'showcase'
  const [newWorkPrice, setNewWorkPrice] = useState(10);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user.id, session.user);
      else setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        loadProfile(newSession.user.id, newSession.user);
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Recordar email
  useEffect(() => {
    const savedEmail = localStorage.getItem('reddavinci_remembered_email');
    if (savedEmail) {
      setLoginForm(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Carga perfil. Si no existe, lo crea automáticamente con los datos del metadata
  const loadProfile = async (userId, authUser = null) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setCurrentUser(data);
      setUserRole(data.role || 'artist');
      setAuthLoading(false);
      return;
    }

    // Fallback: crear perfil si no existe
    if (authUser || session?.user) {
      const user = authUser || session.user;
      const meta = user.user_metadata || {};
      const newProfile = {
        id: userId,
        name: meta.name || user.email?.split('@')[0] || 'Artista',
        username: meta.username || user.email?.split('@')[0] || 'artista',
        bio: meta.bio || 'Artista de la Red Da Vinci.',
        role: meta.role || 'artist',
        curated: false
      };

      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (!createError && created) {
        setCurrentUser(created);
        setUserRole(created.role);
      } else {
        console.error('Error creando perfil:', createError);
        // Usamos los datos temporales para no bloquear la UI
        setCurrentUser(newProfile);
        setUserRole(newProfile.role);
      }
    } else {
      console.error('Error cargando perfil:', error);
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    loadPosts();
    loadArtists();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadMyTokens(currentUser.id);
      loadMyWorks(currentUser.id);
    }
  }, [currentUser]);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(name, username, curated), works(*)')
      .order('created_at', { ascending: false });
    if (!error) setPosts(data || []);
    else console.error(error);
  };

  const loadArtists = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'artist')
      .eq('curated', true)
      .order('created_at', { ascending: false });
    if (!error) setArtists(data || []);
    else console.error(error);
  };

  const loadMyTokens = async (userId) => {
    const { data, error } = await supabase
      .from('token_holdings')
      .select('*, works(title, price, token_type)')
      .eq('owner_id', userId);
    if (!error) setMyTokens(data || []);
    else console.error(error);
  };

  const loadMyWorks = async (userId) => {
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .eq('artist_id', userId)
      .order('created_at', { ascending: false });
    if (!error) setMyWorks(data || []);
    else console.error(error);
  };

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
    setWalletAddress(walletConnected ? '' : '0x71C...39A2');
  };

  const handleBuyToken = async (work) => {
    if (!currentUser) { alert('⚠️ Debes iniciar sesión para comprar tokens.'); return; }
    if (!work.is_tokenized) { alert('Esta obra es solo de exhibición.'); return; }

    const cost = Number(work.price) || 0;
    if (balanceUSDT < cost) { alert('Saldo insuficiente en USDT.'); return; }

    const { error } = await supabase.from('token_holdings').insert({
      owner_id: currentUser.id,
      work_id: work.id,
      quantity: 1
    });

    if (error) {
      alert('Ocurrió un error al comprar el token.');
      console.error(error);
      return;
    }

    setBalanceUSDT(prev => prev - cost);
    loadMyTokens(currentUser.id);

    if (work.token_type === 'unique') {
      alert(`¡Compraste el TOKEN ÚNICO (NFT) de "${work.title}"!`);
    } else {
      alert(`¡Compraste 1 token cooperativo de "${work.title}"!`);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert('⚠️ Debes iniciar sesión para publicar.'); return; }
    if (!newPostContent && !newWorkTitle) {
      alert('Escribí al menos un texto o el nombre de la obra.');
      return;
    }

    if (wantsToTokenize && !currentUser.curated) {
      alert('⚠️ Para tokenizar obras, tu perfil debe ser verificado por el Comité Curador.\nPor ahora se publicará como exhibición.');
      // Continuamos pero forzamos showcase
    }

    let workId = null;
    const finalTokenType = wantsToTokenize && currentUser.curated ? tokenTypeSelection : 'showcase';
    const finalIsTokenized = wantsToTokenize && currentUser.curated;

    if (newWorkTitle) {
      const { data: workData, error: workError } = await supabase
        .from('works')
        .insert({
          artist_id: currentUser.id,
          title: newWorkTitle,
          token_type: finalTokenType,
          price: finalIsTokenized ? Number(newWorkPrice) : 0,
          is_tokenized: finalIsTokenized
        })
        .select()
        .single();

      if (workError) {
        alert('Error al guardar la obra: ' + workError.message);
        console.error(workError);
        return;
      }
      workId = workData.id;
    }

    if (newPostContent || workId) {
      const { error: postError } = await supabase.from('posts').insert({
        author_id: currentUser.id,
        content: newPostContent || `Nueva obra: ${newWorkTitle}`,
        work_id: workId
      });

      if (postError) {
        alert('Error al publicar: ' + postError.message);
        console.error(postError);
        return;
      }
    }

    // Limpiar formulario
    setNewPostContent('');
    setNewWorkTitle('');
    setWantsToTokenize(false);
    setTokenTypeSelection('fractional');
    setNewWorkPrice(10);

    loadPosts();
    loadMyWorks(currentUser.id);
    alert('¡Obra cargada con éxito en tu perfil y publicada en la Red!');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden.');
      return;
    }
    if (!registerForm.email || !registerForm.password || !registerForm.name || !registerForm.username) {
      alert('⚠️ Por favor completa todos los campos obligatorios.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: registerForm.email,
      password: registerForm.password,
      options: {
        data: {
          name: registerForm.name,
          username: registerForm.username,
          bio: registerForm.bio || 'Artista de la Red Da Vinci.',
          role: registerForm.roleRequested
        }
      }
    });

    if (error) {
      alert('Error al crear la cuenta: ' + error.message);
      return;
    }

    setActiveTab('home');
    alert(
      data.session
        ? `¡Cuenta creada con éxito, ${registerForm.name}! Ya puedes cargar tus obras.`
        : `¡Cuenta creada! Revisá tu correo (${registerForm.email}) para confirmar antes de iniciar sesión.`
    );
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      alert('Ingresa tus credenciales.');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    });

    if (error) {
      alert('Error al iniciar sesión: ' + error.message);
      return;
    }

    // Recordar o olvidar email
    if (rememberMe) {
      localStorage.setItem('reddavinci_remembered_email', loginForm.email);
    } else {
      localStorage.removeItem('reddavinci_remembered_email');
    }

    // Después del login vamos directo al muro personal
    setActiveTab('profile');
    alert('¡Bienvenido a tu muro!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveTab('home');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f3e5ab] flex items-center justify-center font-serif">
        Cargando Red Da Vinci...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-serif relative overflow-x-hidden"
         style={{
           backgroundColor: '#0a0a0a',
           backgroundImage: `
             linear-gradient(rgba(10,10,10,0.82), rgba(10,10,10,0.88)),
             url('https://upload.wikimedia.org/wikipedia/commons/2/22/Da_Vinci_Vitruve_Luc_Viatour.jpg')
           `,
           backgroundSize: 'cover',
           backgroundPosition: 'center top',
           backgroundAttachment: 'fixed',
           backgroundRepeat: 'no-repeat'
         }}>
      
      {/* Overlay extra para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-3 py-4 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#f3e5ab] tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(243,229,171,0.35)]">
            RED DA VINCI
          </h1>
          <p className="text-sm text-[#e8d9a0]/80 mt-1.5 tracking-wide">Cooperativa de Arte Universal Tokenizada</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-[#f3e5ab]/50 px-4 py-1.5 rounded-full text-xs shadow-lg">
            <span className="text-[#f3e5ab]">Modo:</span>
            <span className="font-bold text-[#f3e5ab]">🎨 Artista</span>
          </div>
        </header>

        {/* ===================== VISTA DE PERFIL (MURO PERSONAL) ===================== */}
        {activeTab === 'profile' && currentUser ? (
          <main className="my-auto py-4 max-w-3xl mx-auto w-full bg-black/70 backdrop-blur-md p-5 md:p-7 rounded-2xl border border-[#f3e5ab]/40 shadow-2xl">
            
            {/* Cabecera del perfil */}
            <div className="flex items-center gap-4 border-b border-white/20 pb-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#f3e5ab] text-black font-bold text-2xl md:text-3xl flex items-center justify-center shadow-lg">
                {currentUser.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#f3e5ab]">{currentUser.name}</h2>
                <p className="text-sm text-gray-300">@{currentUser.username}</p>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full mt-1.5 inline-block border ${
                  currentUser.curated 
                    ? 'bg-green-950/60 text-green-300 border-green-500/40' 
                    : 'bg-amber-950/40 text-amber-200 border-amber-500/30'
                }`}>
                  {currentUser.curated ? '✓ Artista Verificado' : '🌐 Perfil Libre / En revisión'}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-[11px] bg-red-950/40 border border-red-500/40 text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                Salir
              </button>
            </div>

            {/* Biografía */}
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-[#f3e5ab] font-bold mb-1.5">Biografía</h3>
              <p className="text-gray-200 text-sm bg-black/40 p-3.5 rounded-xl border border-white/10 leading-relaxed">
                {currentUser.bio || 'Sin biografía todavía.'}
              </p>
            </div>

            {/* ========== FORMULARIO DE PUBLICACIÓN (en el muro) ========== */}
            <div className="mt-6 bg-black/50 border border-[#f3e5ab]/30 rounded-xl p-4">
              <h3 className="text-sm font-bold text-[#f3e5ab] mb-3 flex items-center gap-2">
                🖼️ Publicar nueva obra en tu muro
              </h3>
              
              <form onSubmit={handleCreatePost} className="space-y-3 text-sm">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Texto / descripción (opcional)</label>
                  <textarea
                    rows="2"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Contá algo sobre esta obra o dejá un mensaje..."
                    className="w-full bg-black/40 border border-white/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#f3e5ab] text-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Nombre de la obra *</label>
                  <input
                    type="text"
                    value={newWorkTitle}
                    onChange={(e) => setNewWorkTitle(e.target.value)}
                    placeholder="Ej: El Sueño de Vitruvio"
                    className="w-full bg-black/40 border border-white/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#f3e5ab]"
                    required
                  />
                </div>

                {/* Elección de tipo de token */}
                <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                  <p className="text-[11px] text-[#f3e5ab] font-bold mb-2">¿Cómo querés publicar esta obra?</p>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tokenType"
                        checked={!wantsToTokenize}
                        onChange={() => setWantsToTokenize(false)}
                        className="accent-[#f3e5ab]"
                      />
                      <span className="text-sm">Solo exhibición (sin tokenizar)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tokenType"
                        checked={wantsToTokenize && tokenTypeSelection === 'unique'}
                        onChange={() => { setWantsToTokenize(true); setTokenTypeSelection('unique'); }}
                        className="accent-[#f3e5ab]"
                      />
                      <span className="text-sm">NFT único (1 sola pieza)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tokenType"
                        checked={wantsToTokenize && tokenTypeSelection === 'fractional'}
                        onChange={() => { setWantsToTokenize(true); setTokenTypeSelection('fractional'); }}
                        className="accent-[#f3e5ab]"
                      />
                      <span className="text-sm">Tokens fraccionados (cooperativa)</span>
                    </label>
                  </div>

                  {wantsToTokenize && (
                    <div className="mt-3">
                      <label className="text-[11px] text-gray-400 block mb-1">
                        Precio {tokenTypeSelection === 'unique' ? 'del NFT' : 'por token'} (USDT)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={newWorkPrice}
                        onChange={(e) => setNewWorkPrice(e.target.value)}
                        className="w-32 bg-black/40 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-[#f3e5ab]"
                      />
                      {!currentUser.curated && (
                        <p className="text-[10px] text-amber-300 mt-1.5">
                          ⚠️ Tu perfil aún no está verificado. La obra se publicará como exhibición hasta que el Comité te apruebe.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f3e5ab] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-white transition shadow-lg"
                >
                  Publicar en mi muro
                </button>
              </form>
            </div>

            {/* Mis obras */}
            <div className="mt-7">
              <h3 className="text-xs uppercase tracking-wider text-[#f3e5ab] font-bold mb-3">
                🖼️ Mis obras publicadas ({myWorks.length})
              </h3>

              {myWorks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {myWorks.map((work) => (
                    <div key={work.id} className="bg-black/50 p-3.5 rounded-xl border border-[#f3e5ab]/25 flex flex-col justify-between">
                      <div>
                        <p className="font-bold text-white text-sm">{work.title}</p>
                        <p className="text-[10px] mt-1 text-gray-400">
                          {work.is_tokenized 
                            ? (work.token_type === 'unique' ? 'NFT Único' : 'Tokens fraccionados') 
                            : 'Solo exhibición'}
                        </p>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${
                          work.is_tokenized 
                            ? 'bg-green-950/50 text-green-300 border-green-500/30' 
                            : 'bg-gray-800 text-gray-400 border-gray-600'
                        }`}>
                          {work.is_tokenized ? `$${work.price} USDT` : 'Exhibición'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400">Todavía no publicaste ninguna obra.</p>
                  <p className="text-xs text-gray-500 mt-1">Usá el formulario de arriba para subir tu primera pieza.</p>
                </div>
              )}
            </div>

            {/* Volver al feed */}
            <div className="mt-6 flex justify-between items-center">
              <button 
                onClick={() => setActiveTab('home')} 
                className="bg-[#f3e5ab]/15 border border-[#f3e5ab]/50 text-[#f3e5ab] px-4 py-2 rounded-xl text-xs hover:bg-[#f3e5ab] hover:text-black transition font-bold"
              >
                ← Ver el feed de la Red
              </button>
            </div>
          </main>
        ) : (
          /* ===================== VISTA HOME + SIDEBARS ===================== */
          <main className="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto py-3 items-start">

            {/* Columna izquierda */}
            <div className="flex flex-col gap-2 items-start">
              <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30 w-full max-w-[220px]">
                {currentUser ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#f3e5ab] text-black font-bold flex items-center justify-center text-sm">
                        {currentUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#f3e5ab]">{currentUser.name}</h4>
                        <p className="text-[9px] text-gray-300">@{currentUser.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button 
                        onClick={() => setActiveTab('profile')} 
                        className="flex-1 bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-2 py-1.5 rounded text-[10px] hover:bg-[#f3e5ab] hover:text-black transition font-bold"
                      >
                        👤 Mi Muro
                      </button>
                      <button 
                        onClick={handleLogout} 
                        className="bg-red-950/40 border border-red-500/40 text-red-300 px-2 py-1.5 rounded text-[10px] hover:bg-red-600 hover:text-white transition"
                      >
                        Salir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-xs text-[#f3e5ab] mb-1.5">¡Bienvenido!</h4>
                    <div className="flex gap-2">
                      <button onClick={() => setActiveTab('login')} className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-xs hover:bg-white transition">Iniciar Sesión</button>
                      <button onClick={() => setActiveTab('register')} className="bg-black/30 border border-[#f3e5ab]/50 text-[#f3e5ab] px-3 py-1 rounded text-xs hover:bg-[#f3e5ab] hover:text-black transition">Registrarse</button>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setActiveTab('wallet')} className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs w-full max-w-[220px] hover:bg-black/50">
                <h3 className="font-bold text-[#f3e5ab]">👤 Wallet Web3</h3>
                <p className="text-[10px] text-gray-200">Saldo: ${balanceUSDT.toFixed(2)} USDT</p>
              </button>
              
              <button onClick={() => setActiveTab('tokens')} className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs w-full max-w-[220px] hover:bg-black/50">
                <h3 className="font-bold text-[#f3e5ab]">📜 Mis Tokens ({myTokens.length})</h3>
              </button>
            </div>

            {/* Columna central - Feed */}
            <div className="md:col-span-2 flex flex-col gap-3">
              {/* Publicar rápido (solo si está logueado) */}
              {currentUser && userRole === 'artist' && (
                <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30">
                  <h3 className="text-[11px] uppercase font-bold text-[#f3e5ab] mb-2">Publicar rápido</h3>
                  <form onSubmit={handleCreatePost} className="space-y-2 text-xs">
                    <textarea
                      rows="2"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="¿Qué obra estás creando hoy?"
                      className="w-full bg-black/30 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-[#f3e5ab]"
                    />
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nombre de la obra" 
                        value={newWorkTitle} 
                        onChange={(e) => setNewWorkTitle(e.target.value)} 
                        className="flex-1 bg-black/30 border border-white/20 p-1.5 rounded text-white" 
                      />
                      <button type="submit" className="bg-[#f3e5ab] text-black font-bold px-3 py-1.5 rounded text-xs hover:bg-white transition">
                        Publicar
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Para elegir NFT o tokens fraccionados, andá a <button type="button" onClick={() => setActiveTab('profile')} className="underline text-[#f3e5ab]">tu muro</button>.
                    </p>
                  </form>
                </div>
              )}

              {/* Lista de posts */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {posts.length > 0 ? posts.map((post) => (
                  <div key={post.id} className="bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#f3e5ab]/80 text-black font-bold flex items-center justify-center text-xs">
                          {post.profiles?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#f3e5ab]">{post.profiles?.name || 'Artista'}</p>
                          <p className="text-[10px] text-gray-400">@{post.profiles?.username}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(post.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-100 my-2 text-sm">{post.content}</p>

                    {post.works && (
                      <div className="p-2.5 bg-black/40 rounded-lg border border-[#f3e5ab]/30 flex justify-between items-center my-2">
                        <div>
                          <p className="font-bold text-white text-sm">{post.works.title}</p>
                          {post.works.is_tokenized ? (
                            <p className="text-[10px] text-[#4ade80]">
                              {post.works.token_type === 'unique' ? 'NFT Único' : 'Tokens fraccionados'} • Financiación activa
                            </p>
                          ) : (
                            <p className="text-[10px] text-gray-400">Exhibición pública</p>
                          )}
                        </div>
                        {post.works.is_tokenized ? (
                          <button 
                            onClick={() => handleBuyToken(post.works)} 
                            className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-[10px] hover:bg-white transition"
                          >
                            {post.works.token_type === 'unique' ? 'Adquirir NFT' : 'Comprar Token'}
                          </button>
                        ) : (
                          <span className="text-[9px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">No Tokenizado</span>
                        )}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-12 bg-black/40 backdrop-blur-md rounded-2xl border border-[#f3e5ab]/20 shadow-inner">
                    <p className="text-[#f3e5ab]/70 text-base tracking-wide">Aún no hay publicaciones en la Red.</p>
                    <p className="text-xs text-gray-400 mt-2">Sé el primero en compartir una obra.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha - Artistas verificados */}
            <div className="flex flex-col gap-2 items-end">
              <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs w-full max-w-[220px]">
                <h3 className="font-bold text-[#f3e5ab] mb-2 uppercase text-[11px]">🏆 Artistas Verificados</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {artists.length > 0 ? artists.map((artist) => (
                    <div key={artist.id} className="flex justify-between items-center gap-2 border-b border-white/10 pb-1.5">
                      <div>
                        <p className="font-bold text-white text-[11px]">{artist.name}</p>
                        <p className="text-[9px] text-gray-400">@{artist.username}</p>
                      </div>
                      <span className="text-[9px] bg-green-950/60 text-green-300 border border-green-500/40 px-1.5 py-0.5 rounded-full">✓</span>
                    </div>
                  )) : (
                    <p className="text-gray-400 text-[11px]">Todavía no hay artistas verificados.</p>
                  )}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ===================== MODALES (login / register / wallet / tokens) ===================== */}
        {activeTab !== 'home' && activeTab !== 'profile' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] border border-[#f3e5ab]/40 rounded-2xl p-5 w-full max-w-md relative shadow-2xl">
              <button 
                onClick={() => setActiveTab('home')} 
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>

              {activeTab === 'register' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] text-lg mb-4">Crear cuenta de Artista</h3>
                  <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                    <input type="text" placeholder="Nombre completo" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" required />
                    <input type="text" placeholder="Username (sin @)" value={registerForm.username} onChange={e => setRegisterForm({...registerForm, username: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" required />
                    <input type="email" placeholder="Email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" required />
                    <div className="relative">
                      <input type={showRegPassword ? 'text' : 'password'} placeholder="Contraseña" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white pr-10" required />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <div className="relative">
                      <input type={showRegConfirm ? 'text' : 'password'} placeholder="Confirmar contraseña" value={registerForm.confirmPassword} onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white pr-10" required />
                      <button type="button" onClick={() => setShowRegConfirm(!showRegConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        {showRegConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    <textarea placeholder="Biografía corta (opcional)" value={registerForm.bio} onChange={e => setRegisterForm({...registerForm, bio: e.target.value})} rows="2" className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" />
                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-white transition mt-2">
                      Crear cuenta
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'login' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] text-lg mb-4">Iniciar Sesión</h3>
                  <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                    <input type="email" placeholder="Email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" required />
                    <div className="relative">
                      <input type={showLoginPassword ? 'text' : 'password'} placeholder="Contraseña" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white pr-10" required />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="accent-[#f3e5ab] w-3.5 h-3.5"
                      />
                      <span className="text-[11px] text-gray-300">Recordar mi cuenta</span>
                    </label>

                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-white transition mt-1">
                      Ingresar
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'wallet' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">👤 Wallet Web3</h3>
                  <p className="text-xs text-gray-300">Saldo actual: <b className="text-[#4ade80]">${balanceUSDT.toFixed(2)} USDT</b></p>
                  <button onClick={handleConnectWallet} className="mt-3 w-full bg-[#f3e5ab] text-black font-bold py-2 rounded-xl text-xs hover:bg-white transition">
                    {walletConnected ? 'Desconectar Wallet' : 'Conectar Metamask'}
                  </button>
                  {walletConnected && <p className="text-[10px] text-gray-400 mt-2">Conectada: {walletAddress}</p>}
                </div>
              )}

              {activeTab === 'tokens' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">📜 Mis Tokens</h3>
                  <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                    {myTokens.length > 0 ? myTokens.map(t => (
                      <div key={t.id} className="p-2.5 bg-black/50 border border-white/10 rounded-lg flex justify-between">
                        <span>{t.works?.title || 'Obra'}</span>
                        <span className="text-[#4ade80]">${((t.works?.price || 0) * t.quantity).toFixed(2)} USDT</span>
                      </div>
                    )) : (
                      <p className="text-gray-400 text-[11px]">Todavía no tenés tokens comprados.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="text-center py-3 mt-auto bg-black/30 border-t border-[#f3e5ab]/20 text-[10px] text-gray-300 rounded-xl">
          Red Da Vinci © 2026 · Cooperativa de Arte Universal Tokenizada
        </footer>
      </div>
    </div>
  );
}

export default App;
