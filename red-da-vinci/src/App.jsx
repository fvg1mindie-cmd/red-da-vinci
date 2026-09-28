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

  // Publish form (Soporta múltiples archivos y vista grande)
  const [newPostContent, setNewPostContent] = useState('');
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [wantsToTokenize, setWantsToTokenize] = useState(false);
  const [tokenTypeSelection, setTokenTypeSelection] = useState('fractional');
  const [newWorkPrice, setNewWorkPrice] = useState(10);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
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

  // Selección de múltiples archivos (Fotos y Videos)
  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert(`El archivo ${file.name} no es una imagen o video válido.`);
        return false;
      }
      const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`El archivo ${file.name} supera el tamaño permitido.`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));

    setSelectedMediaFiles(prev => [...prev, ...validFiles]);
    setMediaPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeMediaItem = (index) => {
    setSelectedMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const clearAllMedia = () => {
    mediaPreviews.forEach(p => URL.revokeObjectURL(p.url));
    setSelectedMediaFiles([]);
    setMediaPreviews([]);
  };

  const handleStoryFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Solo imágenes o videos cortos.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) { alert('Máximo 20 MB.'); return; }
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
      alert('¡Publicado en el taller! Se eliminará automáticamente en 24 horas.');
    } catch (err) {
      console.error(err);
      alert('Error al publicar: ' + (err.message || 'Revisá la conexión.'));
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

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert('⚠️ Debes iniciar sesión.'); return; }
    if (!newPostContent.trim() && !newWorkTitle.trim() && selectedMediaFiles.length === 0) {
      alert('Escribí algo, poné un título o subí al menos una imagen/video.');
      return;
    }

    setUploadingMedia(true);
    try {
      let uploadedUrls = [];
      for (let file of selectedMediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${currentUser.id}/${Date.now()}_${Math.random().toString(36.substring(2))}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('artworks').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('artworks').getPublicUrl(fileName);
        uploadedUrls.push(publicUrlData.publicUrl);
      }

      let workId = null;
      const finalTokenType = wantsToTokenize && currentUser.curated ? tokenTypeSelection : 'showcase';
      const finalIsTokenized = wantsToTokenize && currentUser.curated;

      if (newWorkTitle.trim() || uploadedUrls.length > 0) {
        const payload = {
          artist_id: currentUser.id,
          title: newWorkTitle.trim() || 'Obra sin título',
          token_type: finalTokenType,
          price: finalIsTokenized ? Number(newWorkPrice) : 0,
          is_tokenized: finalIsTokenized,
          image_url: uploadedUrls[0] || null // Principal para obras
        };

        const { data: workData, error: workError } = await supabase.from('works').insert(payload).select().single();
        if (workError) throw workError;
        workId = workData.id;
      }

      if (newPostContent.trim() || workId) {
        const { error: postError } = await supabase.from('posts').insert({
          author_id: currentUser.id,
          content: newPostContent.trim() || (newWorkTitle.trim() ? `Nueva obra: ${newWorkTitle.trim()}` : 'Nueva publicación'),
          work_id: workId
        });
        if (postError) throw postError;
      }

      setNewPostContent('');
      setNewWorkTitle('');
      setWantsToTokenize(false);
      setTokenTypeSelection('fractional');
      setNewWorkPrice(10);
      clearAllMedia();
      loadPosts();
      loadMyWorks(currentUser.id);
      alert('¡Publicación realizada con éxito!');
    } catch (err) {
      console.error(err);
      alert('Error al publicar: ' + err.message);
    } finally {
      setUploadingMedia(false);
    }
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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-serif relative flex flex-col justify-between p-4 md:p-6 overflow-x-hidden">
      <div className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat opacity-95 pointer-events-none"
           style={{ backgroundImage: `url('/lo1.jpg')` }} />

      <div className="relative z-10 max-w-5xl mx-auto w-full min-h-screen flex flex-col">

        {/* Header Principal */}
        <header className="text-center mb-8 border-b border-[#f3e5ab]/20 pb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#f3e5ab] tracking-[0.2em] drop-shadow-md">
            RED DA VINCI
          </h1>
          <p className="text-sm text-[#e8d9a0]/90 mt-2 tracking-wide">Cooperativa de Arte Universal Tokenizada</p>
          <div className="mt-4 flex justify-center items-center gap-4">
            <button onClick={() => setActiveTab('home')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${activeTab === 'home' ? 'bg-[#f3e5ab] text-black border-[#f3e5ab]' : 'bg-black/50 text-[#f3e5ab] border-[#f3e5ab]/40 hover:bg-[#f3e5ab]/20'}`}>
              🎨 Explorar Feed
            </button>
            {currentUser && (
              <button onClick={() => setActiveTab('profile')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition border ${activeTab === 'profile' ? 'bg-[#f3e5ab] text-black border-[#f3e5ab]' : 'bg-black/50 text-[#f3e5ab] border-[#f3e5ab]/40 hover:bg-[#f3e5ab]/20'}`}>
                👤 Mi Biografía y Obras
              </button>
            )}
          </div>
        </header>

        {/* Visualizador de Stories / En el Taller */}
        {viewingStories && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-center items-center p-4">
            <div className="absolute top-4 left-0 right-0 h-1 bg-white/20 flex gap-1 px-4 z-20">
              {viewingStories.stories.map((_, i) => (
                <div key={i} className={`flex-1 h-1 rounded ${i <= viewingStories.index ? 'bg-[#f3e5ab]' : 'bg-white/30'}`} />
              ))}
            </div>
            <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-20">
              <span className="text-[#f3e5ab] font-bold text-base">{viewingStories.name}</span>
              <button onClick={() => setViewingStories(null)} className="text-white bg-black/60 border border-white/20 rounded-full p-2 hover:bg-white hover:text-black transition">
                <X size={22} />
              </button>
            </div>
            <div className="w-full max-w-2xl h-[75vh] flex items-center justify-center relative my-auto">
              {viewingStories.stories[viewingStories.index]?.media_type === 'video' ? (
                <video src={viewingStories.stories[viewingStories.index].media_url} className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" autoPlay controls />
              ) : (
                <img src={viewingStories.stories[viewingStories.index]?.media_url} alt="En el taller" className="max-h-full max-w-full rounded-xl object-contain shadow-2xl" />
              )}
              <button onClick={(e) => { e.stopPropagation(); prevStory(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 border border-white/20 p-3 rounded-full text-white hover:bg-[#f3e5ab] hover:text-black transition">
                <ChevronLeft size={26} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextStory(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 border border-white/20 p-3 rounded-full text-white hover:bg-[#f3e5ab] hover:text-black transition">
                <ChevronRight size={26} />
              </button>
            </div>
          </div>
        )}

        {/* Modal Subir Historia / Taller */}
        {showAddStory && (
          <div className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111] border border-[#f3e5ab]/50 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#f3e5ab] font-bold text-lg">📸 Publicar en "En el Taller"</h3>
                <button onClick={() => { setShowAddStory(false); clearStoryFile(); }}><X size={22} className="text-gray-400 hover:text-white" /></button>
              </div>
              <p className="text-xs text-gray-400 mb-4">Compartí fotos o videos efímeros de tu proceso creativo (duración 24 horas).</p>
              <input type="file" accept="image/*,video/*" onChange={handleStoryFileChange}
                     className="w-full text-xs text-gray-300 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-[#f3e5ab] file:text-black file:font-bold file:text-xs hover:file:bg-white cursor-pointer" />
              {storyPreview && (
                <div className="mt-4 relative">
                  {storyFile?.type.startsWith('video/') ? (
                    <video src={storyPreview} className="w-full max-h-72 rounded-xl object-cover border border-[#f3e5ab]/30" controls />
                  ) : (
                    <img src={storyPreview} alt="Preview" className="w-full max-h-72 rounded-xl object-contain border border-[#f3e5ab]/30" />
                  )}
                  <button onClick={clearStoryFile} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow">Quitar</button>
                </div>
              )}
              <button onClick={handleCreateStory} disabled={!storyFile || uploadingStory}
                      className="mt-6 w-full bg-[#f3e5ab] text-black font-bold py-3 rounded-xl disabled:opacity-50 hover:bg-white transition text-sm">
                {uploadingStory ? 'Subiendo al taller...' : 'Publicar Ahora'}
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA: MI PERFIL Y BIOGRAFÍA (Estética renovada sin globos apretados y con fotos grandes) */}
        {activeTab === 'profile' && currentUser ? (
          <main className="w-full max-w-4xl mx-auto bg-black/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-[#f3e5ab]/40 shadow-2xl space-y-8">
            
            {/* Cabecera de Perfil */}
            <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/20 pb-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-[#f3e5ab] to-amber-200 text-black font-bold text-4xl md:text-5xl flex items-center justify-center shadow-2xl ring-4 ring-[#f3e5ab]/30">
                {currentUser.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 text-center md:text-left space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-[#f3e5ab] tracking-wide">{currentUser.name}</h2>
                <p className="text-sm text-gray-300">@{currentUser.username}</p>
                <div>
                  <span className={`text-xs px-3 py-1 rounded-full inline-block border ${
                    currentUser.curated ? 'bg-green-950/70 text-green-300 border-green-500/50' : 'bg-amber-950/50 text-amber-200 border-amber-500/40'
                  }`}>
                    {currentUser.curated ? '✓ Artista Verificado' : '🌐 Perfil Libre / En revisión'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button onClick={() => setShowAddStory(true)} className="bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-5 py-2.5 rounded-xl hover:bg-[#f3e5ab] hover:text-black transition font-bold text-xs shadow-lg">
                  + Subir a Taller (24h)
                </button>
                <button onClick={handleLogout} className="bg-red-950/40 border border-red-500/40 text-red-300 px-5 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition text-xs font-bold">
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Sección Biografía (Diseño limpio, sin globos pequeños) */}
            <div className="space-y-3">
              <h3 className="text-sm uppercase tracking-widest text-[#f3e5ab] font-bold">Biografía Artística</h3>
              <div className="bg-black/60 p-6 rounded-2xl border border-white/15 text-gray-200 text-base md:text-lg leading-relaxed shadow-inner">
                {currentUser.bio || 'Aún no has agregado una biografía a tu perfil.'}
              </div>
            </div>

            {/* Formulario de Publicación Avanzado (Múltiples fotos/videos, formato grande) */}
            <div className="bg-black/60 border border-[#f3e5ab]/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="border-b border-[#f3e5ab]/20 pb-4">
                <h3 className="text-lg font-bold text-[#f3e5ab]">🖼️ Nueva Publicación o Galería de Obras</h3>
                <p className="text-xs text-gray-400 mt-1">Compartí tus creaciones con imágenes en gran tamaño o videos en alta resolución.</p>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="text-xs text-[#f3e5ab] block mb-2 font-bold uppercase tracking-wider">Descripción o Reflexión</label>
                  <textarea
                    rows="4"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Describí tu obra, tu inspiración o el concepto detrás de la pieza..."
                    className="w-full bg-black/70 border border-white/20 rounded-2xl p-4 text-white text-base leading-relaxed focus:outline-none focus:border-[#f3e5ab] shadow-inner resize-y min-h-[140px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#f3e5ab] block mb-2 font-bold uppercase tracking-wider">Título de la Obra (Opcional)</label>
                    <input
                      type="text"
                      value={newWorkTitle}
                      onChange={(e) => setNewWorkTitle(e.target.value)}
                      placeholder="Ej: Autorretrato en la Luz de Invierno"
                      className="w-full bg-black/70 border border-white/20 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-[#f3e5ab]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#f3e5ab] block mb-2 font-bold uppercase tracking-wider">Subir Fotos o Videos (Múltiples)</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaChange}
                      className="w-full text-xs text-gray-300 file:mr-3 file:py-3 file:px-4 file:rounded-xl file:border-0 file:bg-[#f3e5ab] file:text-black file:font-bold file:text-xs hover:file:bg-white cursor-pointer"
                    />
                  </div>
                </div>

                {/* Previews en Tamaño Grande */}
                {mediaPreviews.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#f3e5ab] font-bold">Archivos seleccionados ({mediaPreviews.length}):</span>
                      <button type="button" onClick={clearAllMedia} className="text-xs text-red-400 hover:text-red-300 underline font-bold">Eliminar todos</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mediaPreviews.map((item, idx) => (
                        <div key={idx} className="relative bg-black/80 p-3 rounded-2xl border border-[#f3e5ab]/30 shadow-lg group">
                          {item.type === 'video' ? (
                            <video src={item.url} controls className="w-full h-64 object-cover rounded-xl" />
                          ) : (
                            <img src={item.url} alt={`Preview ${idx}`} className="w-full h-64 object-contain rounded-xl bg-black/50" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeMediaItem(idx)}
                            className="absolute top-5 right-5 bg-red-600/90 text-white p-2 rounded-full hover:bg-red-700 transition shadow-lg"
                            title="Quitar archivo"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Configuración de Tokenización */}
                <div className="bg-black/50 rounded-2xl p-5 border border-white/10 space-y-4">
                  <p className="text-xs text-[#f3e5ab] font-bold uppercase tracking-wider">Opciones de Monetización / Tokenización</p>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={!wantsToTokenize} onChange={() => setWantsToTokenize(false)} className="accent-[#f3e5ab] w-4 h-4" />
                      <span className="text-sm font-medium">Solo exhibición artística</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={wantsToTokenize && tokenTypeSelection === 'unique'} onChange={() => { setWantsToTokenize(true); setTokenTypeSelection('unique'); }} className="accent-[#f3e5ab] w-4 h-4" />
                      <span className="text-sm font-medium">NFT Único</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" checked={wantsToTokenize && tokenTypeSelection === 'fractional'} onChange={() => { setWantsToTokenize(true); setTokenTypeSelection('fractional'); }} className="accent-[#f3e5ab] w-4 h-4" />
                      <span className="text-sm font-medium">Tokens Fraccionados</span>
                    </label>
                  </div>
                  {wantsToTokenize && (
                    <div className="pt-2 flex items-center gap-4">
                      <div>
                        <label className="text-xs text-gray-300 block mb-1">Precio en USDT</label>
                        <input type="number" min="1" step="0.01" value={newWorkPrice} onChange={(e) => setNewWorkPrice(e.target.value)}
                          className="w-40 bg-black/70 border border-white/20 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#f3e5ab]" />
                      </div>
                      {!currentUser.curated && (
                        <p className="text-xs text-amber-300 mt-5">⚠️ Tu perfil aún no está verificado como curado → se publicará como exhibición.</p>
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={uploadingMedia}
                  className="w-full bg-[#f3e5ab] text-black font-bold py-4 rounded-2xl text-base hover:bg-white transition shadow-xl disabled:opacity-60 tracking-wider uppercase">
                  {uploadingMedia ? 'Subiendo archivos a la red...' : 'Publicar Obra en la Red Da Vinci'}
                </button>
              </form>
            </div>

            {/* Mis Obras Publicadas (Visualización en Grande) */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-[#f3e5ab] font-bold">🖼️ Mis Obras Publicadas ({myWorks.length})</h3>
              {myWorks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myWorks.map((work) => (
                    <div key={work.id} className="bg-black/70 p-5 rounded-2xl border border-[#f3e5ab]/30 shadow-xl space-y-3">
                      {work.image_url && (
                        work.image_url.match(/\.(mp4|webm|mov|ogg)(\?|$)/i) ? (
                          <video src={work.image_url} className="w-full h-72 object-cover rounded-xl shadow-md" controls />
                        ) : (
                          <img src={work.image_url} alt={work.title} className="w-full h-72 object-contain rounded-xl bg-black/50 shadow-md" />
                        )
                      )}
                      <div>
                        <h4 className="font-bold text-white text-lg">{work.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {work.is_tokenized ? (work.token_type === 'unique' ? 'NFT Único' : 'Tokens fraccionados') : 'Solo exhibición'}
                        </p>
                      </div>
                      <div className="pt-2">
                        <span className={`text-xs px-3 py-1 rounded-full border font-bold inline-block ${work.is_tokenized ? 'bg-green-950/60 text-green-300 border-green-500/40' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                          {work.is_tokenized ? `$${work.price} USDT` : 'Exhibición'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-black/50 rounded-2xl border border-white/10">
                  <p className="text-sm text-gray-400">Todavía no publicaste ninguna obra en tu perfil.</p>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button onClick={() => setActiveTab('home')} className="bg-[#f3e5ab]/15 border border-[#f3e5ab]/50 text-[#f3e5ab] px-6 py-3 rounded-xl text-xs hover:bg-[#f3e5ab] hover:text-black transition font-bold uppercase tracking-wider">
                ← Volver al Feed Principal
              </button>
            </div>
          </main>
        ) : (
          /* PESTAÑA PRINCIPAL / FEED (Visualización inmersiva en tamaño grande para todas las obras y publicaciones) */
          <main className="grid grid-cols-1 md:grid-cols-4 gap-6 my-auto py-4 items-start">
            
            {/* Menú Lateral Izquierdo */}
            <div className="flex flex-col gap-4">
              <div className="bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-[#f3e5ab]/30 shadow-xl w-full">
                {currentUser ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#f3e5ab] text-black font-bold flex items-center justify-center text-lg shadow">
                        {currentUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#f3e5ab]">{currentUser.name}</h4>
                        <p className="text-xs text-gray-300">@{currentUser.username}</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('profile')} className="w-full bg-[#f3e5ab]/20 border border-[#f3e5ab] text-[#f3e5ab] px-3 py-2.5 rounded-xl text-xs hover:bg-[#f3e5ab] hover:text-black transition font-bold">
                      👤 Mi Perfil y Obras
                    </button>
                    <button onClick={handleLogout} className="w-full bg-red-950/40 border border-red-500/40 text-red-300 px-3 py-2 rounded-xl text-xs hover:bg-red-600 hover:text-white transition">
                      Salir
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-[#f3e5ab]">¡Bienvenido a la Red!</h4>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setActiveTab('login')} className="w-full bg-[#f3e5ab] text-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-white transition shadow">Iniciar Sesión</button>
                      <button onClick={() => setActiveTab('register')} className="w-full bg-black/40 border border-[#f3e5ab]/50 text-[#f3e5ab] px-4 py-2 rounded-xl text-xs hover:bg-[#f3e5ab] hover:text-black transition">Registrarse</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón Taller Stories */}
              {currentUser && (
                <button onClick={() => setShowAddStory(true)} className="w-full bg-gradient-to-r from-amber-900/60 to-black/80 border border-[#f3e5ab]/60 p-4 rounded-2xl hover:border-[#f3e5ab] text-left transition shadow-xl group">
                  <h3 className="font-bold text-[#f3e5ab] text-sm group-hover:underline">📸 Compartir en el Taller</h3>
                  <p className="text-xs text-gray-300 mt-1">Subí historias de tu proceso creativo por 24h.</p>
                </button>
              )}
            </div>

            {/* Columna Central: Feed con fotos/videos grandes e inmersivos (sin globos pequeños) */}
            <div className="md:col-span-3 flex flex-col gap-6">
              
              {/* Barra de Historias / En el Taller */}
              {storiesByUser.length > 0 && (
                <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-[#f3e5ab]/30 shadow-xl flex gap-4 overflow-x-auto">
                  {storiesByUser.map(group => (
                    <button key={group.user_id} onClick={() => openUserStories(group)} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                      <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-[#f3e5ab] to-amber-600 group-hover:scale-105 transition shadow-lg">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-[#f3e5ab] font-bold text-lg">
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <span className="text-xs text-gray-200 max-w-[70px] truncate">{group.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Listado de Publicaciones */}
              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map(post => (
                    <div key={post.id} className="bg-black/75 backdrop-blur-xl border border-[#f3e5ab]/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
                      
                      {/* Autor */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#f3e5ab] text-black font-bold flex items-center justify-center text-base shadow">
                            {post.profiles?.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-[#f3e5ab]">{post.profiles?.name || 'Artista'}</h4>
                            <p className="text-xs text-gray-400">@{post.profiles?.username || 'artista'}</p>
                          </div>
                        </div>
                        {post.profiles?.curated && (
                          <span className="text-[10px] bg-green-950/60 text-green-300 border border-green-500/40 px-3 py-1 rounded-full font-bold">
                            ✓ Verificado
                          </span>
                        )}
                      </div>

                      {/* Texto de la publicación (Ample, sin globos apretados) */}
                      {post.content && (
                        <p className="text-gray-100 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>
                      )}

                      {/* Multimedia de la obra en GRANDE (Protagonismo total) */}
                      {post.works?.image_url && (
                        <div className="rounded-2xl overflow-hidden border border-[#f3e5ab]/30 bg-black/90 shadow-2xl">
                          {post.works.image_url.match(/\.(mp4|webm|mov|ogg)(\?|$)/i) ? (
                            <video src={post.works.image_url} controls className="w-full max-h-[500px] object-cover" />
                          ) : (
                            <img src={post.works.image_url} alt={post.works.title || 'Obra de arte'} className="w-full max-h-[550px] object-contain mx-auto" />
                          )}
                        </div>
                      )}

                      {/* Detalles de la Obra y Botón de Adquisición */}
                      {post.works && (
                        <div className="bg-black/50 border border-white/15 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-inner">
                          <div>
                            <h5 className="font-bold text-[#f3e5ab] text-lg">{post.works.title}</h5>
                            <p className="text-xs text-gray-300 mt-1">
                              {post.works.is_tokenized ? (post.works.token_type === 'unique' ? '💎 NFT Único' : '🪙 Tokens Fraccionados') : '🎨 Obra de Exhibición'}
                            </p>
                          </div>
                          {post.works.is_tokenized && (
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                              <span className="text-lg font-bold text-green-300">${post.works.price} USDT</span>
                              <button onClick={() => alert('Función de compra disponible en el siguiente módulo.')} className="bg-[#f3e5ab] text-black font-bold px-5 py-2.5 rounded-xl hover:bg-white transition text-xs shadow-lg">
                                Adquirir Token
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-black/50 rounded-3xl border border-white/10">
                    <p className="text-base text-gray-400">No hay publicaciones en el feed todavía.</p>
                  </div>
                )}
              </div>

            </div>

          </main>
        )}

      </div>
    </div>
  );
}

export default App;
