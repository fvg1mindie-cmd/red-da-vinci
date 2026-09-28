import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from './supabaseClient';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState('artist');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balanceUSDT, setBalanceUSDT] = useState(250.00);

  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [registerForm, setRegisterForm] = useState({
    email: '', password: '', confirmPassword: '', name: '', username: '', bio: '', roleRequested: 'artist'
  });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [artists, setArtists] = useState([]);
  const [posts, setPosts] = useState([]);
  const [myTokens, setMyTokens] = useState([]);
  const [myWorks, setMyWorks] = useState([]);
  const [stories, setStories] = useState([]);

  // Publish form
  const [newPostContent, setNewPostContent] = useState('');
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [wantsToTokenize, setWantsToTokenize] = useState(false);
  const [tokenTypeSelection, setTokenTypeSelection] = useState('fractional');
  const [newWorkPrice, setNewWorkPrice] = useState(10);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Stories
  const [storyFile, setStoryFile] = useState(null);
  const [storyPreview, setStoryPreview] = useState(null);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [viewingStories, setViewingStories] = useState(null);
  const [showAddStory, setShowAddStory] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadProfile(session.user.id, session.user);
      else setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) loadProfile(newSession.user.id, newSession.user);
      else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem('reddavinci_remembered_email');
    if (savedEmail) {
      setLoginForm(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const loadProfile = async (userId, authUser = null) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) {
      setCurrentUser(data);
      setUserRole(data.role || 'artist');
      setAuthLoading(false);
      return;
    }
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
      const { data: created, error: createError } = await supabase.from('profiles').insert(newProfile).select().single();
      if (!createError && created) {
        setCurrentUser(created);
        setUserRole(created.role);
      } else {
        setCurrentUser(newProfile);
        setUserRole(newProfile.role);
      }
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    loadPosts();
    loadArtists();
    loadStories();
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
  };

  const loadArtists = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'artist')
      .eq('curated', true)
      .order('created_at', { ascending: false });
    setArtists(data || []);
  };

  const loadMyTokens = async (userId) => {
    const { data } = await supabase
      .from('token_holdings')
      .select('*, works(title, price, token_type, image_url)')
      .eq('owner_id', userId);
    setMyTokens(data || []);
  };

  const loadMyWorks = async (userId) => {
    const { data } = await supabase
      .from('works')
      .select('*')
      .eq('artist_id', userId)
      .order('created_at', { ascending: false });
    setMyWorks(data || []);
  };

  const loadStories = async () => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('procesos')
      .select('*, profiles(name, username)')
      .gte('created_at', twentyFourHoursAgo)
      .order('created_at', { ascending: false });
    if (!error) setStories(data || []);
    else console.log('Stories table may not exist yet:', error?.message);
  };

  const storiesByUser = React.useMemo(() => {
    const map = {};
    stories.forEach(s => {
      if (!map[s.user_id]) {
        map[s.user_id] = {
          user_id: s.user_id,
          name: s.profiles?.name || 'Artista',
          username: s.profiles?.username || '',
          stories: []
        };
      }
      map[s.user_id].stories.push(s);
    });
    return Object.values(map);
  }, [stories]);

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Solo se permiten imágenes o videos.');
      return;
    }
    const maxSize = file.type.startsWith('video/') ? 30 * 1024 * 1024 : 8 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(file.type.startsWith('video/') ? 'Máximo 30 MB para video.' : 'Máximo 8 MB para imagen.');
      return;
    }
    setSelectedMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setSelectedMedia(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
  };

  const handleStoryFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Solo imágenes o videos cortos.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) { alert('Máximo 15 MB.'); return; }
    setStoryFile(file);
    setStoryPreview(URL.createObjectURL(file));
  };

  const clearStoryFile = () => {
    setStoryFile(null);
    if (storyPreview) URL.revokeObjectURL(storyPreview);
    setStoryPreview(null);
  };

  const handleCreateStory = async () => {
    if (!currentUser || !storyFile) return;
    setUploadingStory(true);
    try {
      const fileExt = storyFile.name.split('.').pop();
      const fileName = `procesos/${currentUser.id}/${Date.now()}.${fileExt}`;
      const mediaType = storyFile.type.startsWith('video/') ? 'video' : 'image';

      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(fileName, storyFile, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('artworks').getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('procesos').insert({
        user_id: currentUser.id,
        media_url: urlData.publicUrl,
        media_type: mediaType
      });

      if (insertError) throw insertError;

      clearStoryFile();
      setShowAddStory(false);
      loadStories();
      alert('¡Publicado! Se eliminará automáticamente en 24 horas.');
    } catch (err) {
      console.error(err);
      alert('Error al publicar: ' + (err.message || 'Revisá que exista la tabla "procesos" y el bucket "artworks".'));
    } finally {
      setUploadingStory(false);
    }
  };

  const openUserStories = (userStoriesGroup) => {
    setViewingStories({
      userId: userStoriesGroup.user_id,
      name: userStoriesGroup.name,
      stories: userStoriesGroup.stories,
      index: 0
    });
  };

  const nextStory = () => {
    if (!viewingStories) return;
    if (viewingStories.index < viewingStories.stories.length - 1) {
      setViewingStories({ ...viewingStories, index: viewingStories.index + 1 });
    } else {
      setViewingStories(null);
    }
  };

  const prevStory = () => {
    if (!viewingStories) return;
    if (viewingStories.index > 0) {
      setViewingStories({ ...viewingStories, index: viewingStories.index - 1 });
    }
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
      owner_id: currentUser.id, work_id: work.id, quantity: 1
    });
    if (error) { alert('Error al comprar el token.'); return; }
    setBalanceUSDT(prev => prev - cost);
    loadMyTokens(currentUser.id);
    alert(work.token_type === 'unique' ? `¡Compraste el NFT de "${work.title}"!` : `¡Compraste 1 token de "${work.title}"!`);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert('⚠️ Debes iniciar sesión.'); return; }
    if (!newPostContent.trim() && !newWorkTitle.trim() && !selectedMedia) {
      alert('Escribí algo, poné un título o subí una imagen/video.');
      return;
    }

    let workId = null;
    let mediaUrl = null;
    const finalTokenType = wantsToTokenize && currentUser.curated ? tokenTypeSelection : 'showcase';
    const finalIsTokenized = wantsToTokenize && currentUser.curated;

    if (selectedMedia) {
      setUploadingMedia(true);
      const fileExt = selectedMedia.name.split('.').pop();
      const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('artworks').upload(fileName, selectedMedia);
      if (uploadError) {
        setUploadingMedia(false);
        alert('Error al subir archivo: ' + uploadError.message);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('artworks').getPublicUrl(fileName);
      mediaUrl = publicUrlData.publicUrl;
      setUploadingMedia(false);
    }

    if (newWorkTitle.trim() || mediaUrl) {
      const payload = {
        artist_id: currentUser.id,
        title: newWorkTitle.trim() || 'Sin título',
        token_type: finalTokenType,
        price: finalIsTokenized ? Number(newWorkPrice) : 0,
        is_tokenized: finalIsTokenized
      };
      if (mediaUrl) payload.image_url = mediaUrl;

      const { data: workData, error: workError } = await supabase.from('works').insert(payload).select().single();
      if (workError) { alert('Error al guardar obra: ' + workError.message); return; }
      workId = workData.id;
    }

    if (newPostContent.trim() || workId) {
      const { error: postError } = await supabase.from('posts').insert({
        author_id: currentUser.id,
        content: newPostContent.trim() || (newWorkTitle.trim() ? `Nueva obra: ${newWorkTitle.trim()}` : 'Nueva publicación'),
        work_id: workId
      });
      if (postError) { alert('Error al publicar: ' + postError.message); return; }
    }

    setNewPostContent('');
    setNewWorkTitle('');
    setWantsToTokenize(false);
    setTokenTypeSelection('fractional');
    setNewWorkPrice(10);
    clearMedia();
    loadPosts();
    loadMyWorks(currentUser.id);
    alert('¡Publicado con éxito!');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) { alert('Las contraseñas no coinciden.'); return; }
    if (!registerForm.email || !registerForm.password || !registerForm.name || !registerForm.username) {
      alert('Completá todos los campos obligatorios.'); return;
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
    if (error) { alert('Error: ' + error.message); return; }
    setActiveTab('home');
    alert(data.session ? `¡Cuenta creada, ${registerForm.name}!` : `Revisá tu correo para confirmar.`);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { alert('Ingresá tus credenciales.'); return; }
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email, password: loginForm.password
    });
    if (error) { alert('Error: ' + error.message); return; }
    if (rememberMe) localStorage.setItem('reddavinci_remembered_email', loginForm.email);
    else localStorage.removeItem('reddavinci_remembered_email');
    setActiveTab('profile');
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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-3 md:p-4 overflow-x-hidden">
      <div className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none"
           style={{ backgroundImage: `url('/lo1.jpg')` }} />

      <div className="relative z-10 max-w-6xl mx-auto w-full min-h-screen flex flex-col drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">

        <header className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f3e5ab] tracking-[0.15em] drop-shadow-lg">
            RED DA VINCI
          </h1>
          <p className="text-xs text-[#e8d9a0]/80 mt-1">Cooperativa de Arte Universal Tokenizada</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-black/50 border border-[#f3e5ab]/40 px-3 py-1 rounded-full text-[11px]">
            <span className="text-[#f3e5ab]">Modo:</span>
            <span className="font-bold text-[#f3e5ab]">🎨 Artista</span>
          </div>
        </header>

        {viewingStories && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 flex gap-1 p-2 z-20">
              {viewingStories.stories.map((_, i) => (
                <div key={i} className={`flex-1 h-0.5 rounded ${i <= viewingStories.index ? 'bg-white' : 'bg-white/30'}`} />
              ))}
            </div>
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
              <span className="text-white font-bold text-sm drop-shadow">{viewingStories.name}</span>
              <button onClick={() => setViewingStories(null)} className="text-white bg-black/40 rounded-full p-1.5">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center relative" onClick={nextStory}>
              {viewingStories.stories[viewingStories.index]?.media_type === 'video' ? (
                <video src={viewingStories.stories[viewingStories.index].media_url} className="max-h-full max-w-full" autoPlay controls />
              ) : (
                <img src={viewingStories.stories[viewingStories.index]?.media_url} alt="En el taller" className="max-h-full max-w-full object-contain" />
              )}
              <button onClick={(e) => { e.stopPropagation(); prevStory(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white">
                <ChevronLeft size={24} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextStory(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full text-white">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {showAddStory && (
          <div className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#111] border border-[#f3e5ab]/40 rounded-2xl p-5 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#f3e5ab] font-bold">En el taller</h3>
                <button onClick={() => { setShowAddStory(false); clearStoryFile(); }}><X size={20} className="text-gray-400" /></button>
              </div>
              <input type="file" accept="image/*,video/*" capture="environment" onChange={handleStoryFileChange}
                     className="w-full text-xs text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#f3e5ab] file:text-black file:font-bold file:text-xs" />
              {storyPreview && (
                <div className="mt-3 relative">
                  {storyFile?.type.startsWith('video/') ? (
                    <video src={storyPreview} className="w-full max-h-60 rounded-lg" controls />
                  ) : (
                    <img src={storyPreview} alt="Preview" className="w-full max-h-60 object-contain rounded-lg" />
                  )}
                  <button onClick={clearStoryFile} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Quitar</button>
                </div>
              )}
              <button onClick={handleCreateStory} disabled={!storyFile || uploadingStory}
                      className="mt-4 w-full bg-[#f3e5ab] text-black font-bold py-2.5 rounded-xl disabled:opacity-50">
                {uploadingStory ? 'Publicando...' : 'Publicar (24h)'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && currentUser ? (
          <main className="my-auto py-4 max-w-3xl mx-auto w-full bg-black/70 backdrop-blur-md p-5 md:p-7 rounded-2xl border border-[#f3e5ab]/40 shadow-2xl">
            <div className="flex items-center gap-4 border-b border-white/20 pb-5">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#f3e5ab] text-black font-bold text-2xl md:text-3xl flex items-center justify-center shadow-lg">
                {currentUser.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-[#f3e5ab]">{currentUser.name}</h2>
                <p className="text-sm text-gray-300">@{currentUser.username}</p>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full mt-1.5 inline-block border ${
                  currentUser.curated ? 'bg-green-950/60 text-green-300 border-green-500/40' : 'bg-amber-950/40 text-amber-200 border-amber-500/30'
                }`}>
                  {currentUser.curated ? '✓ Artista Verificado' : '🌐 Perfil Libre / En revisión'}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setShowAddStory(true)} title="Subí una foto o video corto de cómo estás trabajando. Se borra automáticamente a las 24 horas." className="text-[11px] bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-3 py-1.5 rounded-lg hover:bg-[#f3e5ab] hover:text-black transition font-bold">
                  + En el taller
                </button>
                <button onClick={handleLogout} className="text-[11px] bg-red-950/40 border border-red-500/40 text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition">
                  Salir
                </button>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-[#f3e5ab] font-bold mb-1.5">Biografía</h3>
              <p className="text-gray-200 text-sm bg-black/40 p-3.5 rounded-xl border border-white/10 leading-relaxed">
                {currentUser.bio || 'Sin biografía todavía.'}
              </p>
            </div>

            {/* Formulario publicar obra */}
            <div className="mt-6 bg-black/50 border border-[#f3e5ab]/30 rounded-xl p-4">
              <h3 className="text-sm font-bold text-[#f3e5ab] mb-3">🖼️ Publicar en tu muro</h3>
              <form onSubmit={handleCreatePost} className="space-y-4 text-sm">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1.5">¿Qué querés compartir?</label>
                  <textarea
                    rows="5"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Escribí lo que quieras... texto, ideas, proceso, lo que surja."
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3.5 text-white text-sm leading-relaxed focus:outline-none focus:border-[#f3e5ab] resize-y min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1.5">Título de la obra (opcional)</label>
                  <input
                    type="text"
                    value={newWorkTitle}
                    onChange={(e) => setNewWorkTitle(e.target.value)}
                    placeholder="Ej: El Sueño de Vitruvio"
                    className="w-full bg-black/40 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-[#f3e5ab]"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1.5">Imagen o video (opcional)</label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    onChange={handleMediaChange}
                    className="w-full text-xs text-gray-300 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#f3e5ab] file:text-black file:font-bold file:text-xs"
                  />
                  {mediaPreview && (
                    <div className="relative mt-3">
                      {selectedMedia?.type.startsWith('video/') ? (
                        <video src={mediaPreview} controls className="w-full max-h-72 object-contain rounded-xl border border-[#f3e5ab]/30" />
                      ) : (
                        <img src={mediaPreview} alt="Preview" className="w-full max-h-72 object-contain rounded-xl border border-[#f3e5ab]/30" />
                      )}
                      <button type="button" onClick={clearMedia} className="absolute top-2 right-2 bg-red-600/90 text-white text-xs px-2.5 py-1 rounded-lg">Quitar</button>
                    </div>
                  )}
                </div>
                <div className="bg-black/30 rounded-xl p-3.5 border border-white/10">
                  <p className="text-[11px] text-[#f3e5ab] font-bold mb-2">Tipo de publicación</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" checked={!wantsToTokenize} onChange={() => setWantsToTokenize(false)} className="accent-[#f3e5ab]" />
                      <span className="text-sm">Solo exhibición</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" checked={wantsToTokenize && tokenTypeSelection === 'unique'} onChange={() => { setWantsToTokenize(true); setTokenTypeSelection('unique'); }} className="accent-[#f3e5ab]" />
                      <span className="text-sm">NFT único</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" checked={wantsToTokenize && tokenTypeSelection === 'fractional'} onChange={() => { setWantsToTokenize(true); setTokenTypeSelection('fractional'); }} className="accent-[#f3e5ab]" />
                      <span className="text-sm">Tokens fraccionados</span>
                    </label>
                  </div>
                  {wantsToTokenize && (
                    <div className="mt-3">
                      <label className="text-[11px] text-gray-400 block mb-1">Precio (USDT)</label>
                      <input type="number" min="1" step="0.01" value={newWorkPrice} onChange={(e) => setNewWorkPrice(e.target.value)}
                        className="w-32 bg-black/40 border border-white/20 rounded-lg p-2 text-white" />
                      {!currentUser.curated && <p className="text-[10px] text-amber-300 mt-1">⚠️ Perfil no verificado → se publicará como exhibición.</p>}
                    </div>
                  )}
                </div>
                <button type="submit" disabled={uploadingMedia}
                  className="w-full bg-[#f3e5ab] text-black font-bold py-3 rounded-xl text-sm hover:bg-white transition disabled:opacity-60">
                  {uploadingMedia ? 'Subiendo...' : 'Publicar'}
                </button>
              </form>
            </div>

            <div className="mt-7">
              <h3 className="text-xs uppercase tracking-wider text-[#f3e5ab] font-bold mb-3">🖼️ Mis obras ({myWorks.length})</h3>
              {myWorks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {myWorks.map((work) => (
                    <div key={work.id} className="bg-black/50 p-3.5 rounded-xl border border-[#f3e5ab]/25 overflow-hidden">
                      {work.image_url && (
                        work.image_url.match(/\.(mp4|webm|mov|ogg)(\?|$)/i) ? (
                          <video src={work.image_url} className="w-full h-36 object-cover rounded-lg mb-2" muted />
                        ) : (
                          <img src={work.image_url} alt={work.title} className="w-full h-36 object-cover rounded-lg mb-2" />
                        )
                      )}
                      <p className="font-bold text-white text-sm">{work.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {work.is_tokenized ? (work.token_type === 'unique' ? 'NFT Único' : 'Tokens fraccionados') : 'Solo exhibición'}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded border mt-2 inline-block ${work.is_tokenized ? 'bg-green-950/50 text-green-300 border-green-500/30' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                        {work.is_tokenized ? `$${work.price} USDT` : 'Exhibición'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-black/40 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400">Todavía no publicaste ninguna obra.</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button onClick={() => setActiveTab('home')} className="bg-[#f3e5ab]/15 border border-[#f3e5ab]/50 text-[#f3e5ab] px-4 py-2 rounded-xl text-xs hover:bg-[#f3e5ab] hover:text-black transition font-bold">
                ← Ver el feed de la Red
              </button>
            </div>
          </main>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto py-3 items-start">
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
                      <button onClick={() => setActiveTab('profile')} className="flex-1 bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-2 py-1.5 rounded text-[10px] hover:bg-[#f3e5ab] hover:text-black transition font-bold">
                        👤 Mi Muro
                      </button>
                      <button onClick={handleLogout} className="bg-red-950/40 border border-red-500/40 text-red-300 px-2 py-1.5 rounded text-[10px] hover:bg-red-600 hover:text-white transition">
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
              <button onClick={() => setActiveTab('wallet')} className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs w-full max-w-[220px]">
                <h3 className="font-bold text-[#f3e5ab]">👤 Wallet Web3</h3>
                <p className="text-[10px] text-gray-200">Saldo: ${balanceUSDT.toFixed(2)} USDT</p>
              </button>
              <button onClick={() => setActiveTab('tokens')} className="bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 hover:border-[#f3e5ab] text-left transition text-xs w-full max-w-[220px]">
                <h3 className="font-bold text-[#f3e5ab]">📜 Mis Tokens ({myTokens.length})</h3>
              </button>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/20 overflow-x-auto">
                <div className="flex gap-3 items-center">
                  {currentUser && (
                    <button onClick={() => setShowAddStory(true)} title="Subí una foto o video corto de cómo estás trabajando. Se borra automáticamente a las 24 horas." className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#f3e5ab] flex items-center justify-center bg-black/50">
                        <Plus size={22} className="text-[#f3e5ab]" />
                      </div>
                      <span className="text-[9px] text-gray-300">En el taller</span>
                    </button>
                  )}
                  {storiesByUser.map((group) => (
                    <button key={group.user_id} onClick={() => openUserStories(group)} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="w-14 h-14 rounded-full border-2 border-[#f3e5ab] p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-600">
                        <div className="w-full h-full rounded-full bg-[#f3e5ab] text-black font-bold flex items-center justify-center text-lg">
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-300 max-w-[56px] truncate">{group.name.split(' ')[0]}</span>
                    </button>
                  ))}
                  {storiesByUser.length === 0 && !currentUser && (
                    <p className="text-xs text-gray-500 py-2">No hay procesos activos.</p>
                  )}
                </div>
              </div>

              {currentUser && (
                <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-[#f3e5ab]/30">
                  <form onSubmit={handleCreatePost} className="space-y-2 text-xs">
                    <textarea
                      rows="3"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="¿Qué querés compartir hoy?"
                      className="w-full bg-black/30 border border-white/20 rounded-lg p-2.5 text-white text-sm focus:outline-none focus:border-[#f3e5ab] resize-y"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Título (opcional)"
                        value={newWorkTitle}
                        onChange={(e) => setNewWorkTitle(e.target.value)}
                        className="flex-1 bg-black/30 border border-white/20 p-2 rounded-lg text-white"
                      />
                      <button type="submit" className="bg-[#f3e5ab] text-black font-bold px-3 py-2 rounded-lg text-xs hover:bg-white transition">
                        Publicar
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Para imagen/video + NFT andá a{' '}
                      <button type="button" onClick={() => setActiveTab('profile')} className="underline text-[#f3e5ab]">
                        tu muro
                      </button>
                      .
                    </p>
                  </form>
                </div>
              )}

              <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
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
                      <div className="p-2.5 bg-black/40 rounded-lg border border-[#f3e5ab]/30 my-2">
                        {post.works.image_url && (
                          post.works.image_url.match(/\.(mp4|webm|mov|ogg)(\?|$)/i) ? (
                            <video src={post.works.image_url} controls className="w-full max-h-64 rounded-lg mb-2" />
                          ) : (
                            <img src={post.works.image_url} alt={post.works.title} className="w-full max-h-64 object-contain rounded-lg mb-2" />
                          )
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white text-sm">{post.works.title}</p>
                            <p className="text-[10px] text-gray-400">
                              {post.works.is_tokenized ? (post.works.token_type === 'unique' ? 'NFT Único' : 'Tokens fraccionados') : 'Exhibición pública'}
                            </p>
                          </div>
                          {post.works.is_tokenized ? (
                            <button onClick={() => handleBuyToken(post.works)} className="bg-[#f3e5ab] text-black font-bold px-3 py-1 rounded text-[10px] hover:bg-white transition">
                              {post.works.token_type === 'unique' ? 'Adquirir NFT' : 'Comprar Token'}
                            </button>
                          ) : (
                            <span className="text-[9px] bg-gray-800 text-gray-400 px-2 py-1 rounded">No Tokenizado</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-12 bg-black/40 backdrop-blur-md rounded-2xl border border-[#f3e5ab]/20">
                    <p className="text-[#f3e5ab]/70 text-base">Aún no hay publicaciones en la Red.</p>
                    <p className="text-xs text-gray-400 mt-2">Sé el primero en compartir una obra.</p>
                  </div>
                )}
              </div>
            </div>

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

        {activeTab !== 'home' && activeTab !== 'profile' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f0f0f] border border-[#f3e5ab]/40 rounded-2xl p-5 w-full max-w-md relative shadow-2xl">
              <button onClick={() => setActiveTab('home')} className="absolute top-3 right-4 text-gray-400 hover:text-white text-lg">✕</button>

              {activeTab === 'register' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] text-lg mb-4">Crear cuenta de Artista</h3>
                  <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                    <input type="text" placeholder="Nombre completo" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" required />
                    <input type="text" placeholder="Username" value={registerForm.username} onChange={e => setRegisterForm({...registerForm, username: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" required />
                    <input type="email" placeholder="Email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" required />
                    <div className="relative">
                      <input type={showRegPassword ? 'text' : 'password'} placeholder="Contraseña" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white pr-10" required />
                      <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">{showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    </div>
                    <div className="relative">
                      <input type={showRegConfirm ? 'text' : 'password'} placeholder="Confirmar contraseña" value={registerForm.confirmPassword} onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})} className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white pr-10" required />
                      <button type="button" onClick={() => setShowRegConfirm(!showRegConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">{showRegConfirm ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    </div>
                    <textarea placeholder="Biografía (opcional)" value={registerForm.bio} onChange={e => setRegisterForm({...registerForm, bio: e.target.value})} rows="2" className="w-full bg-black/50 border border-white/20 p-2.5 rounded-lg text-white" />
                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-white transition">Crear cuenta</button>
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
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">{showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-[#f3e5ab] w-3.5 h-3.5" />
                      <span className="text-[11px] text-gray-300">Recordar mi cuenta</span>
                    </label>
                    <button type="submit" className="w-full bg-[#f3e5ab] text-black font-bold py-2.5 rounded-xl text-sm hover:bg-white transition">Ingresar</button>
                  </form>
                </div>
              )}

              {activeTab === 'wallet' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">👤 Wallet Web3</h3>
                  <p className="text-xs text-gray-300">Saldo: <b className="text-[#4ade80]">${balanceUSDT.toFixed(2)} USDT</b></p>
                  <button onClick={handleConnectWallet} className="mt-3 w-full bg-[#f3e5ab] text-black font-bold py-2 rounded-xl text-xs hover:bg-white transition">
                    {walletConnected ? 'Desconectar Wallet' : 'Conectar Metamask'}
                  </button>
                </div>
              )}

              {activeTab === 'tokens' && (
                <div>
                  <h3 className="font-bold text-[#f3e5ab] mb-2">📜 Mis Tokens</h3>
                  <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                    {myTokens.length > 0 ? myTokens.map(t => (
                      <div key={t.id} className="p-2.5 bg-black/50 border border-white/10 rounded-lg flex justify-between">
                        <span>{t.works?.title || 'Obra'}</span>
                        <span className="text-[#4ade80]">${((t.works?.price || 0) * t.quantity).toFixed(2)}</span>
                      </div>
                    )) : <p className="text-gray-400 text-[11px]">Todavía no tenés tokens.</p>}
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
