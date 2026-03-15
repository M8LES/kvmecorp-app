const ARTISTS = {
  goten: { name: 'GOTEN', color: '#E2583E', tag: 'TRAP . DRILL', genre: 'TRAP', bio: 'Noeud rouge du reseau. Energie brute, production incandescente.', location: 'Saint-Paul, La Reunion', capsules: [] },
  mvk: { name: 'MVK', color: '#8D73FF', tag: 'AMBIENT . DARK', genre: 'AMBIENT', bio: 'Portails, textures lentes, atmospheres mentales.', location: 'Saint-Leu, La Reunion', capsules: [] },
  saiyan: { name: 'SAIYAN', color: '#CAA537', tag: 'RAP . TRAP', genre: 'RAP', bio: 'Brute et crue. Chaque bar est une percee.', location: 'Fleurimont, La Reunion', capsules: [] },
  lat: { name: 'LAT', color: '#5A88D8', tag: 'BOOM BAP . RAP', genre: 'BOOM BAP', bio: 'Fondation bleue du reseau. Technique, profondeur, flow.', location: 'Rouen, Normandie', capsules: [] },
  enden: { name: 'ENDEN', color: '#7F8794', tag: 'EXPERIMENTAL . FUSION', genre: 'FUSION', bio: 'Connexion grise entre tous les mondes.', location: 'La Reunion', capsules: [] },
  lamoula16: { name: 'LAMOULA.16', color: '#4CC38A', tag: 'RAP . CAPSULE', genre: 'RAP', bio: 'Energie verte du reseau. Presence capsule directe, brute et vivante.', location: 'La Reunion', capsules: [] }
};
const CAPSULES = [
  { id: 'capsule-001', num: '001', title: 'LA CAPSULE 1', artistId: 'mvk', artist: 'MVK', status: 'STANDARD', file: '../CAPSULE TRACK/LA CAPSULE 1 - MVK.wav' },
  { id: 'capsule-002', num: '002', title: 'LA CAPSULE 2', artistId: 'enden', artist: 'ENDEN', status: 'STANDARD', file: '../CAPSULE TRACK/LA CAPSULE 2 - ED.wav' },
  { id: 'capsule-003', num: '003', title: 'LA CAPSULE 3', artistId: 'lamoula16', artist: 'LAMOULA.16', status: 'STANDARD', file: '../CAPSULE TRACK/LA CAPSULE 3 - LAMOULA1.6.wav' },
  { id: 'capsule-004', num: '004', title: 'LA CAPSULE 4', artistId: 'lat', artist: 'LAT', status: 'STANDARD', file: '../CAPSULE TRACK/LA CAPSULE 4 - LATR2IIX.wav' },
  { id: 'capsule-005', num: '005', title: 'LA CAPSULE 5', artistId: 'saiyan', artist: 'SAIYAN', status: 'STANDARD', file: '../CAPSULE TRACK/LA CAPSULE 5 - SAIYAN.wav' },
  { id: 'capsule-006', num: '006', title: 'LA CAPSULE 6', artistId: 'goten', artist: 'GOTEN', status: 'STANDARD', file: '../CAPSULE TRACK/LA CAPSULE 6 - GOTEN mkt.wav' }
];
Object.values(ARTISTS).forEach(artist => { artist.capsules = []; });
CAPSULES.forEach(capsule => {
  const artist = ARTISTS[capsule.artistId];
  if (!artist) return;
  artist.capsules.push({
    id: capsule.id,
    num: capsule.num,
    title: capsule.title,
    status: capsule.status,
    file: capsule.file
  });
});
const NEWS = [
  { artistId: 'mvk', title: 'COSMIC FREQUENCY', meta: 'Nouvelle capsule', time: '22:15' },
  { artistId: 'goten', title: 'COLLAB x LAT', meta: 'Collaboration en cours', time: '20:08' },
  { artistId: 'saiyan', title: 'ASTRA LOOP', meta: 'Capsule orbitale', time: 'Hier' }
];
const RADIO = CAPSULES.map(capsule => ({
  id: capsule.id,
  title: capsule.title,
  artist: capsule.artist,
  artistId: capsule.artistId,
  genre: ARTISTS[capsule.artistId]?.genre || 'CAPSULE',
  color: ARTISTS[capsule.artistId]?.color || '#FFFFFF',
  file: capsule.file
}));
const LOCATIONS = {
  goten: { lat: -21.033, lon: 55.242 },
  mvk: { lat: -21.17, lon: 55.288 },
  saiyan: { lat: -21.017, lon: 55.267 },
  lat: { lat: 49.443, lon: 1.099 },
  enden: { lat: -21.115, lon: 55.536 }
};
let currentScreen = 'home';
let previousScreen = 'home';
let radioIndex = 0;
let isPlaying = false;
let eventSeconds = 45 * 3600;
let activePopupId = null;
const ENABLE_GLOBE = true;
const ENABLE_GLOBE_MARKERS = true;
const ENABLE_GLOBE_ARCS = false;
const ENABLE_GLOBE_NIGHT_EMISSIVE = true;
const ENABLE_GLOBE_ATMOSPHERE = false;
const ENABLE_GLOBE_DIAGNOSTIC = false;
const ENABLE_GLOBE_NORMAL_MAP = false;
const ENABLE_GLOBE_ROUGHNESS_MAP = false;
const ENABLE_GLOBE_SCENE_FOG = false;
const ENABLE_GLOBE_RIM_LIGHT = false;
const GLOBE_MARKER_IDS = ['mvk'];
const RETURN_TO_GLOBE_DURATION = 700;
let globeController = null;
let isReturningToGlobe = false;
let globalPinchDistance = null;
const radioAudio = new Audio();
radioAudio.preload = 'metadata';
let activeRadioFile = '';

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function syncRadioPlaybackUi() {
  const play = document.getElementById('play-btn');
  if (play) {
    play.textContent = isPlaying ? 'PAUSE' : 'PLAY';
    play.classList.toggle('playing', isPlaying);
    play.style.background = isPlaying ? 'rgba(255,255,255,.12)' : '';
    play.style.color = isPlaying ? '#fff' : '';
  }
  const radioWave = document.getElementById('radio-wave-vis');
  if (radioWave) radioWave.classList.toggle('radio-paused', !isPlaying);
  const miniWave = document.getElementById('mini-wave');
  if (miniWave) miniWave.classList.toggle('mini-paused', !isPlaying);
}

radioAudio.addEventListener('play', () => {
  isPlaying = true;
  syncRadioPlaybackUi();
});

radioAudio.addEventListener('pause', () => {
  isPlaying = false;
  syncRadioPlaybackUi();
});

radioAudio.addEventListener('ended', () => {
  radioIndex = (radioIndex + 1) % RADIO.length;
  updateRadio({ autoplay: true });
});

radioAudio.addEventListener('error', () => {
  isPlaying = false;
  syncRadioPlaybackUi();
  console.error('[radio] audio failed to load:', activeRadioFile, radioAudio.error);
});

function setActiveScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const nextScreen = document.getElementById(id);
  if (nextScreen) nextScreen.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-screen="${id}"]`);
  if (btn) btn.classList.add('active');
}

function navigate(id, options = {}) {
  const { skipClosePopup = false } = options;
  previousScreen = currentScreen;
  currentScreen = id;
  setActiveScreen(id);
  if (!skipClosePopup) closePopup();
}

function returnToGlobe(options = {}) {
  const { reason = 'manual', instant = false } = options;
  if (currentScreen === 'home') return;
  if (isReturningToGlobe && !instant) return;
  const homeScreen = document.getElementById('home');
  const leavingScreen = currentScreen !== 'home' ? document.getElementById(currentScreen) : null;
  const duration = instant ? 0 : RETURN_TO_GLOBE_DURATION;

  isReturningToGlobe = !instant;
  closePopup();
  document.body.classList.add('app-returning-home');
  homeScreen.classList.add('home-returning');
  homeScreen.classList.remove('home-returning-active');

  if (leavingScreen) {
    leavingScreen.classList.add('transition-leaving');
  }

  navigate('home', { skipClosePopup: true });

  requestAnimationFrame(() => {
    if (leavingScreen) leavingScreen.classList.add('is-fading-out');
    homeScreen.classList.add('home-returning-active');
  });

  if (globeController) {
    globeController.returnToRoot({
      duration,
      revealMarkers: true
    });
  }

  window.setTimeout(() => {
    document.body.classList.remove('app-returning-home');
    homeScreen.classList.remove('home-returning', 'home-returning-active');
    if (leavingScreen) leavingScreen.classList.remove('transition-leaving', 'is-fading-out');
    isReturningToGlobe = false;
  }, duration + 60);

  console.log(`[globe] return to root triggered via ${reason}`);
}

function buildNews() {
  document.getElementById('news-block').innerHTML = NEWS.map(item => {
    const artist = ARTISTS[item.artistId];
    return `<button class="news-item" data-artist="${item.artistId}"><div class="news-swatch" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.76);">${artist.name[0]}</div><div class="news-body"><div class="eyebrow">${item.meta}</div><h4>${item.title}</h4><p>${artist.name}</p></div><div class="news-time">${item.time}</div></button>`;
  }).join('');
  document.querySelectorAll('#news-block [data-artist]').forEach(el => el.addEventListener('click', () => openArtist(el.dataset.artist)));
}

function buildArtists() {
  document.getElementById('artist-grid').innerHTML = Object.entries(ARTISTS).map(([id, artist]) => `<button class="artist-row" data-artist="${id}"><div class="artist-row__swatch"><div class="artist-row__swatch-letter">${artist.name[0]}</div></div><div class="artist-row__info"><div class="eyebrow">${artist.tag}</div><h3>${artist.name}</h3><p>${artist.location}</p></div><div class="artist-row__caps">${artist.capsules.length} caps</div></button>`).join('');
  document.querySelectorAll('#artist-grid [data-artist]').forEach(el => el.addEventListener('click', () => openArtist(el.dataset.artist)));
}

function buildCapsules() {
  document.getElementById('capsule-grid').innerHTML = CAPSULES.map(c => {
    const artist = ARTISTS[c.artistId];
    const bars = Array.from({ length: 18 }, (_, i) => `<span style="height:${8 + ((i * 7 + 3) % 22)}px"></span>`).join('');
    const pillClass = c.status === 'RARE' ? 'rare' : c.status === 'LIMITEE' ? 'limited' : '';
    return `<div class="capsule-card"><div class="capsule-card-top"><div class="capsule-cover" style="color:${artist.color};border-color:${artist.color}22">${c.num}</div><div><div class="eyebrow">${c.artist}</div><h3>${c.title}</h3><p><span class="capsule-pill ${pillClass}">${c.status}</span></p></div></div><div class="waveform">${bars}</div></div>`;
  }).join('');
}

function openArtist(id) {
  const artist = ARTISTS[id];
  if (!artist) return;
  document.getElementById('profile-eyebrow').textContent = artist.location.toUpperCase();
  document.getElementById('profile-name').textContent = artist.name;
  document.getElementById('profile-tag').textContent = artist.tag;
  document.getElementById('profile-bio').textContent = artist.bio;
  document.getElementById('profile-hero-bg').style.background = 'radial-gradient(circle at 70% 30%, rgba(255,255,255,.08), transparent 62%)';
  document.getElementById('profile-capsules').innerHTML = artist.capsules.map(c => {
    const pillClass = c.status === 'RARE' ? 'rare' : c.status === 'LIMITEE' ? 'limited' : '';
    return `<div class="capsule-row"><div class="capsule-num">${c.num}</div><div class="capsule-row-info"><strong>${c.title}</strong><span>${artist.name}</span></div><span class="capsule-pill ${pillClass}">${c.status}</span></div>`;
  }).join('');
  navigate('artist-profile');
}

function openPopup(id) {
  const artist = ARTISTS[id];
  if (!artist) return;
  activePopupId = id;
  document.getElementById('popup-name').textContent = artist.name;
  document.getElementById('popup-name').style.color = '';
  document.getElementById('popup-tag').textContent = artist.tag;
  document.getElementById('popup-bio').textContent = artist.bio;
  document.getElementById('popup-accent').style.background = 'rgba(255,255,255,.12)';
  document.getElementById('popup-meta').innerHTML = `<span class="popup-pill">${artist.location}</span><span class="popup-pill">${artist.genre}</span><span class="popup-pill">${artist.capsules.length} capsules</span>`;
  document.getElementById('popup-open-profile').onclick = () => openArtist(id);
  document.getElementById('artist-popup').classList.add('visible');
}

function closePopup() {
  document.getElementById('artist-popup').classList.remove('visible');
  activePopupId = null;
}

function buildRadioWave() {
  const wrap = document.getElementById('radio-wave-vis');
  wrap.innerHTML = '';
  for (let i = 0; i < 20; i += 1) {
    const bar = document.createElement('div');
    bar.className = 'radio-bar';
    bar.style.animationDelay = `${i * 0.05}s`;
    wrap.appendChild(bar);
  }
}

function buildQueue() {
  document.getElementById('radio-queue').innerHTML = RADIO.map((track, i) => `<button class="queue-item ${i === radioIndex ? 'active' : ''}" data-idx="${i}"><div class="queue-dot" style="background:rgba(255,255,255,.62)"></div><div class="queue-info"><strong>${track.title}</strong><span>${track.artist}</span></div></button>`).join('');
  document.querySelectorAll('#radio-queue [data-idx]').forEach(el => el.addEventListener('click', () => {
    radioIndex = Number(el.dataset.idx);
    updateRadio({ autoplay: isPlaying });
  }));
}

function updateRadio(options = {}) {
  const { autoplay = false } = options;
  const track = RADIO[radioIndex];
  document.getElementById('radio-title').textContent = track.title;
  document.getElementById('radio-now-artist').textContent = track.artist;
  document.getElementById('radio-genre').textContent = track.genre;
  document.getElementById('radio-bg').style.background = 'radial-gradient(circle at 40% 30%, rgba(255,255,255,.08), transparent 65%)';
  document.querySelectorAll('.radio-bar').forEach(el => { el.style.background = 'rgba(255,255,255,.62)'; });
  document.getElementById('mini-title').textContent = track.title;
  document.getElementById('mini-artist').textContent = track.artist;
  document.getElementById('mini-thumb').textContent = track.artist[0];
  document.getElementById('mini-thumb').style.background = 'rgba(255,255,255,.08)';
  document.getElementById('mini-thumb').style.borderColor = 'rgba(255,255,255,.08)';
  document.querySelectorAll('.mini-bar').forEach(el => { el.style.background = 'rgba(255,255,255,.7)'; });
  const nextFile = encodeURI(track.file);
  const shouldAutoplay = autoplay || isPlaying;
  if (activeRadioFile !== nextFile) {
    activeRadioFile = nextFile;
    radioAudio.src = nextFile;
    radioAudio.load();
    console.log('[radio] loaded real capsule track:', track.title, nextFile);
  }
  buildQueue();
  syncRadioPlaybackUi();
  if (shouldAutoplay) {
    radioAudio.play().catch(error => {
      isPlaying = false;
      syncRadioPlaybackUi();
      console.error('[radio] play() failed:', track.title, nextFile, error);
    });
  }
}

function togglePlay() {
  const track = RADIO[radioIndex];
  const nextFile = encodeURI(track.file);
  if (activeRadioFile !== nextFile) {
    activeRadioFile = nextFile;
    radioAudio.src = nextFile;
    radioAudio.load();
  }
  if (radioAudio.paused) {
    radioAudio.play().catch(error => {
      isPlaying = false;
      syncRadioPlaybackUi();
      console.error('[radio] play() failed:', track.title, nextFile, error);
    });
    return;
  }
  radioAudio.pause();
}

function startTimer() {
  setInterval(() => {
    eventSeconds = Math.max(0, eventSeconds - 1);
    const h = Math.floor(eventSeconds / 3600);
    const m = Math.floor((eventSeconds % 3600) / 60);
    document.getElementById('mini-timer').textContent = `EVENT: ${h}H${m > 0 ? `${m}M` : ''}`;
  }, 1000);
}

function initSpaceBackground() {
  const layer = document.getElementById('space-shooting-layer');
  if (!layer) return;

  function spawnShootingStar() {
    if (!layer.isConnected) return;
    const star = document.createElement('span');
    star.className = 'shooting-star';
    const startX = 58 + Math.random() * 28;
    const startY = 10 + Math.random() * 28;
    const travelX = -(72 + Math.random() * 54);
    const travelY = 42 + Math.random() * 30;
    const angle = 198 + Math.random() * 14;
    const duration = 1.05 + Math.random() * 0.7;
    star.style.left = `${startX}%`;
    star.style.top = `${startY}%`;
    star.style.setProperty('--shoot-duration', `${duration}s`);
    star.style.setProperty('--shoot-x', `${travelX}px`);
    star.style.setProperty('--shoot-y', `${travelY}px`);
    star.style.setProperty('--shoot-rotate', `${angle}deg`);
    layer.appendChild(star);
    star.addEventListener('animationend', () => star.remove(), { once: true });
  }

  function queueShootingStar() {
    const delay = 4200 + Math.random() * 9000;
    window.setTimeout(() => {
      spawnShootingStar();
      queueShootingStar();
    }, delay);
  }

  queueShootingStar();
  console.log('[space] background layer active: distant stars, haze, rare shooting stars');
}

function initGlobe() {
  const container = document.getElementById('globe-3d');
  if (!container || typeof THREE === 'undefined') return;
  container.innerHTML = '';
  const bounds = container.getBoundingClientRect();
  const width = Math.max(1, Math.round(bounds.width || container.clientWidth));
  const height = Math.max(1, Math.round(bounds.height || container.clientHeight));
  const scene = new THREE.Scene();
  if (ENABLE_GLOBE_SCENE_FOG) {
    scene.fog = new THREE.FogExp2(0x020202, 0.012);
  }
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
  const cameraTarget = new THREE.Vector3(0, 0.12, 0);
  camera.position.set(0, -0.28, 4.15);
  camera.lookAt(cameraTarget);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xe7edf6, 1.02));
  const hemi = new THREE.HemisphereLight(0xd4deeb, 0x05070c, 0.42);
  const diagonalLightA = new THREE.DirectionalLight(0xf7f9fd, 1.28);
  const diagonalLightB = new THREE.DirectionalLight(0xe4ebf5, 0.96);
  diagonalLightA.position.set(-5.2, 3.6, 6.2);
  diagonalLightB.position.set(5.1, -3.2, 5.4);
  scene.add(hemi, diagonalLightA, diagonalLightB);

  const globeRadius = 1.52;
  let globeMaterial;
  if (ENABLE_GLOBE_DIAGNOSTIC) {
    globeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x737b86),
      roughness: 0.96,
      metalness: 0.02
    });
    console.log('[globe] diagnostic mode enabled: plain sphere only, no textures, no atmosphere, no extra layers');
  } else {
    const textureLoader = new THREE.TextureLoader();
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const texturePaths = {
      surface: '../assets/textures/earth-day.jpg',
      night: '../assets/textures/earth-night.jpg',
      normal: '../assets/textures/earth-normal.jpg',
      roughness: '../assets/textures/earth-roughness.jpg'
    };
    console.log('[artists] external data path expected: ../data/artists.js', Boolean(window.artists));

    function loadTexture(label, path) {
      return textureLoader.load(
        path,
        (texture) => {
          console.log(`[texture:${label}] loaded`, path, texture.image?.width || 'unknown', texture.image?.height || 'unknown');
        },
        undefined,
        (error) => {
          console.error(`[texture:${label}] failed`, path, error);
        }
      );
    }

    function createMonochromeTexture(texture, mode) {
      const image = texture.image;
      if (!image) return texture;
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const compressedLuminance = luminance > 150
          ? 150 + (luminance - 150) * 0.08
          : luminance;
        const blueBias = b - ((r + g) * 0.5);
        const isOcean = blueBias > 12;
        let rr;
        let gg;
        let bb;

        if (mode === 'night') {
          const glow = Math.max(0, compressedLuminance - 18) * 0.2;
          rr = 18 + glow * 0.85;
          gg = 20 + glow * 0.88;
          bb = 24 + glow;
        } else if (isOcean) {
          const tone = 14 + compressedLuminance * 0.065;
          rr = tone;
          gg = tone + 2;
          bb = tone + 8;
        } else {
          const tone = Math.min(176, 108 + compressedLuminance * 0.22);
          rr = tone;
          gg = tone + 1;
          bb = tone + 3;
        }

        data[i] = rr;
        data[i + 1] = gg;
        data[i + 2] = bb;
      }

      ctx.putImageData(imageData, 0, 0);
      const styledTexture = new THREE.CanvasTexture(canvas);
      styledTexture.colorSpace = THREE.SRGBColorSpace;
      styledTexture.anisotropy = maxAnisotropy;
      styledTexture.needsUpdate = true;
      return styledTexture;
    }

    const surfaceMap = loadTexture('surface', texturePaths.surface);
    const normalMap = loadTexture('normal', texturePaths.normal);
    const roughnessMap = loadTexture('roughness', texturePaths.roughness);
    const nightMap = loadTexture('night', texturePaths.night);
    if (THREE.SRGBColorSpace) {
      surfaceMap.colorSpace = THREE.SRGBColorSpace;
      nightMap.colorSpace = THREE.SRGBColorSpace;
    }
    [surfaceMap, normalMap, roughnessMap, nightMap].forEach(map => { map.anisotropy = maxAnisotropy; });

    globeMaterial = new THREE.MeshStandardMaterial({
      map: surfaceMap,
      color: new THREE.Color(0xc7d0db),
      normalMap: ENABLE_GLOBE_NORMAL_MAP ? normalMap : null,
      normalScale: ENABLE_GLOBE_NORMAL_MAP ? new THREE.Vector2(0.07, 0.07) : new THREE.Vector2(0, 0),
      roughnessMap: ENABLE_GLOBE_ROUGHNESS_MAP ? roughnessMap : null,
      roughness: ENABLE_GLOBE_ROUGHNESS_MAP ? 1 : 1,
      metalness: 0,
      emissiveMap: ENABLE_GLOBE_NIGHT_EMISSIVE ? nightMap : null,
      emissive: new THREE.Color(0xbcc9db),
      emissiveIntensity: ENABLE_GLOBE_NIGHT_EMISSIVE ? 0.06 : 0
    });

    const applyStyledMaps = () => {
      globeMaterial.map = createMonochromeTexture(surfaceMap, 'day');
      globeMaterial.emissiveMap = ENABLE_GLOBE_NIGHT_EMISSIVE ? createMonochromeTexture(nightMap, 'night') : null;
      globeMaterial.needsUpdate = true;
      console.log('[globe] monochrome premium grade applied to Earth surface');
    };

    if (surfaceMap.image && (!ENABLE_GLOBE_NIGHT_EMISSIVE || nightMap.image)) {
      applyStyledMaps();
    } else {
      const tryApplyStyledMaps = setInterval(() => {
        if (surfaceMap.image && (!ENABLE_GLOBE_NIGHT_EMISSIVE || nightMap.image)) {
          clearInterval(tryApplyStyledMaps);
          applyStyledMaps();
        }
      }, 50);
    }
  }

  const globe = new THREE.Mesh(new THREE.SphereGeometry(globeRadius, 96, 96), globeMaterial);
  scene.add(globe);
  let tintShell = null;
  let atmosphere = null;
  if (ENABLE_GLOBE_ATMOSPHERE) {
    tintShell = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius * 1.002, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0xbfc7d2,
        transparent: true,
        opacity: 0.022,
        depthWrite: false
      })
    );
    atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius * 1.01, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0xd9e3ee,
        transparent: true,
        opacity: 0.016,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    globe.add(tintShell);
    globe.add(atmosphere);
  }

  function latLonToVector3(lat, lon, radius = globeRadius * 0.985) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(-(radius * Math.sin(phi) * Math.cos(theta)), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
  }

  const markerGroup = new THREE.Group();
  const markers = [];
  const markerVisuals = [];
  const markerFacingAxis = new THREE.Vector3(0, 0, 1);
  if (ENABLE_GLOBE_MARKERS) {
    GLOBE_MARKER_IDS.forEach((id, index) => {
      const point = LOCATIONS[id];
      const artist = ARTISTS[id];
      if (!point || !artist) return;
      const color = new THREE.Color(artist.color);
      const markerPosition = latLonToVector3(point.lat, point.lon, globeRadius * 1.006);
      const markerNormal = markerPosition.clone().normalize();
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.0108, 12, 12), new THREE.MeshStandardMaterial({
        color,
        emissive: color.clone(),
        emissiveIntensity: 0.52,
        metalness: 0,
        roughness: 0.34,
        transparent: true,
        opacity: 1,
        depthTest: true,
        depthWrite: true
      }));
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), new THREE.MeshBasicMaterial({
        color: color.clone(),
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false
      }));
      const waveA = new THREE.Mesh(
        new THREE.RingGeometry(0.018, 0.03, 48),
        new THREE.MeshBasicMaterial({
          color: color.clone(),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          side: THREE.DoubleSide
        })
      );
      const waveB = new THREE.Mesh(
        new THREE.RingGeometry(0.016, 0.026, 48),
        new THREE.MeshBasicMaterial({
          color: color.clone(),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          side: THREE.DoubleSide
        })
      );
      waveA.position.copy(markerPosition.clone().addScaledVector(markerNormal, 0.004));
      waveB.position.copy(markerPosition.clone().addScaledVector(markerNormal, 0.0045));
      waveA.quaternion.setFromUnitVectors(markerFacingAxis, markerNormal);
      waveB.quaternion.setFromUnitVectors(markerFacingAxis, markerNormal);
      marker.add(glow);
      marker.position.copy(markerPosition);
      marker.userData.artistId = id;
      markerGroup.add(marker);
      markerGroup.add(waveA);
      markerGroup.add(waveB);
      markers.push(marker);
      markerVisuals.push({
        marker,
        glow,
        waveA,
        waveB,
        phase: index * 1.2,
        material: marker.material,
        glowMaterial: glow.material,
        waveAMaterial: waveA.material,
        waveBMaterial: waveB.material
      });
    });
    scene.add(markerGroup);
  }

  const arcs = [];
  if (ENABLE_GLOBE_ARCS) {
    const arcGroup = new THREE.Group();
    function createArc(fromId, toId, colorHex, altitude) {
      const from = LOCATIONS[fromId];
      const to = LOCATIONS[toId];
      const start = latLonToVector3(from.lat, from.lon, globeRadius * 1.002);
      const end = latLonToVector3(to.lat, to.lon, globeRadius * 1.002);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(globeRadius + altitude);
      const curve = new THREE.CatmullRomCurve3([start, mid, end]);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(72));
      const material = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false });
      arcGroup.add(new THREE.Line(geometry, material));
      arcs.push({ material, phase: arcs.length * 0.9 });
    }
    createArc('goten', 'saiyan', 0x45d6ff, 0.26);
    createArc('mvk', 'enden', 0xff4fd8, 0.34);
    createArc('lat', 'mvk', 0x7a7dff, 0.28);
    globe.add(arcGroup);
  }

  const rotatables = [globe, markerGroup];
  let rotationX = -0.22;
  let rotationY = -0.36;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let pinchDistance = null;
  let dragDistance = 0;
  const cameraOffset = camera.position.clone().sub(cameraTarget);
  const cameraDirection = cameraOffset.clone().normalize();
  const minCameraDistance = 4.0;
  const maxCameraDistance = 5.55;
  let cameraDistance = cameraOffset.length();
  const rootCameraDistance = cameraDistance;
  const closeZoomStartDistance = Math.max(minCameraDistance + 0.1, cameraDistance - 0.08);
  let targetCameraDistance = cameraDistance;
  let markerReveal = ENABLE_GLOBE_MARKERS ? 1 : 0;
  let returnAnimation = null;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const globeWorldCenter = new THREE.Vector3();
  const markerWorldPosition = new THREE.Vector3();
  const markerSurfaceNormal = new THREE.Vector3();
  const globeToCamera = new THREE.Vector3();

  function applyRotation() { rotatables.forEach(mesh => { mesh.rotation.x = rotationX; mesh.rotation.y = rotationY; }); }
  function applyCameraDistance() {
    camera.position.copy(cameraTarget).addScaledVector(cameraDirection, cameraDistance);
    camera.lookAt(cameraTarget);
  }
  function beginDrag(x, y) { isDragging = true; lastX = x; lastY = y; dragDistance = 0; }
  function dragTo(x, y) {
    if (!isDragging) return;
    const dx = x - lastX;
    const dy = y - lastY;
    rotationY += dx * 0.0044;
    rotationX += dy * 0.0031;
    rotationX = Math.max(-1.35, Math.min(1.35, rotationX));
    dragDistance += Math.abs(dx) + Math.abs(dy);
    applyRotation();
    lastX = x;
    lastY = y;
  }
  function applyCloseZoomResistance(nextDistance) {
    const clampedDistance = Math.max(minCameraDistance, Math.min(maxCameraDistance, nextDistance));
    if (clampedDistance >= closeZoomStartDistance) return clampedDistance;
    const closeRange = closeZoomStartDistance - minCameraDistance;
    const normalized = Math.max(0, Math.min(1, (clampedDistance - minCameraDistance) / closeRange));
    const resisted = 1 - Math.pow(1 - normalized, 2.6);
    return minCameraDistance + closeRange * resisted;
  }
  function setTargetCameraDistance(nextDistance) {
    targetCameraDistance = applyCloseZoomResistance(nextDistance);
  }
  function adjustZoom(delta) {
    const range = maxCameraDistance - minCameraDistance;
    const proximity = (targetCameraDistance - minCameraDistance) / range;
    const zoomFactor = 0.18 + Math.max(0, proximity) * 0.82;
    setTargetCameraDistance(targetCameraDistance + delta * zoomFactor);
  }
  function getTouchDistance(touches) { return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY); }
  function canReturnToRoot() {
    return Math.abs(cameraDistance - rootCameraDistance) > 0.03 || Math.abs(targetCameraDistance - rootCameraDistance) > 0.03;
  }
  function returnToRoot(options = {}) {
    const { duration = RETURN_TO_GLOBE_DURATION, revealMarkers = true } = options;
    if (duration <= 0) {
      cameraDistance = rootCameraDistance;
      targetCameraDistance = rootCameraDistance;
      markerReveal = revealMarkers && ENABLE_GLOBE_MARKERS ? 1 : markerReveal;
      returnAnimation = null;
      applyCameraDistance();
      return;
    }
    markerReveal = revealMarkers && ENABLE_GLOBE_MARKERS ? 0 : markerReveal;
    returnAnimation = {
      startTime: performance.now(),
      duration,
      fromDistance: cameraDistance,
      toDistance: rootCameraDistance,
      fromMarkerReveal: markerReveal,
      toMarkerReveal: revealMarkers && ENABLE_GLOBE_MARKERS ? 1 : markerReveal
    };
  }

  applyRotation();
  applyCameraDistance();
  globeController = {
    canReturnToRoot,
    returnToRoot,
    getRootDistance: () => rootCameraDistance
  };
  container.addEventListener('mousedown', e => beginDrag(e.clientX, e.clientY));
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', e => dragTo(e.clientX, e.clientY));
  container.addEventListener('touchstart', e => { if (e.touches.length === 1) beginDrag(e.touches[0].clientX, e.touches[0].clientY); if (e.touches.length === 2) pinchDistance = getTouchDistance(e.touches); }, { passive: true });
  container.addEventListener('touchmove', e => {
    if (e.touches.length === 1) dragTo(e.touches[0].clientX, e.touches[0].clientY);
    if (e.touches.length === 2) {
      const next = getTouchDistance(e.touches);
      if (pinchDistance) adjustZoom(-(next - pinchDistance) * 0.004);
      pinchDistance = next;
    }
  }, { passive: true });
  container.addEventListener('touchend', () => { pinchDistance = null; isDragging = false; });
  container.addEventListener('wheel', e => {
    e.preventDefault();
    adjustZoom(e.deltaY * 0.0032);
  }, { passive: false });
  container.addEventListener('click', e => {
    if (!ENABLE_GLOBE_MARKERS) {
      if (activePopupId) closePopup();
      return;
    }
    if (dragDistance > 6) return;
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const visibleMarkers = markers.filter(marker => marker.visible);
    const hit = raycaster.intersectObjects(visibleMarkers)[0];
    if (hit) openPopup(hit.object.userData.artistId);
    else if (activePopupId) closePopup();
  });

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;
    if (!isDragging) { rotationY += 0.0033; applyRotation(); }
    if (returnAnimation) {
      const elapsed = performance.now() - returnAnimation.startTime;
      const progress = Math.max(0, Math.min(1, elapsed / returnAnimation.duration));
      const eased = easeInOutCubic(progress);
      cameraDistance = returnAnimation.fromDistance + (returnAnimation.toDistance - returnAnimation.fromDistance) * eased;
      targetCameraDistance = cameraDistance;
      markerReveal = returnAnimation.fromMarkerReveal + (returnAnimation.toMarkerReveal - returnAnimation.fromMarkerReveal) * eased;
      if (progress >= 1) {
        cameraDistance = returnAnimation.toDistance;
        targetCameraDistance = returnAnimation.toDistance;
        markerReveal = returnAnimation.toMarkerReveal;
        returnAnimation = null;
      }
    } else {
      const closeRange = closeZoomStartDistance - minCameraDistance;
      const closeBlend = closeRange > 0
        ? 1 - Math.max(0, Math.min(1, (cameraDistance - minCameraDistance) / closeRange))
        : 0;
      const zoomDamping = 0.12 - closeBlend * 0.055;
      cameraDistance += (targetCameraDistance - cameraDistance) * zoomDamping;
    }
    applyCameraDistance();
    if (ENABLE_GLOBE_MARKERS) {
      globe.getWorldPosition(globeWorldCenter);
      globeToCamera.copy(camera.position).sub(globeWorldCenter).normalize();
      markerVisuals.forEach(({ marker, glow, waveA, waveB, phase, material, glowMaterial, waveAMaterial, waveBMaterial }) => {
        marker.getWorldPosition(markerWorldPosition);
        markerSurfaceNormal.copy(markerWorldPosition).sub(globeWorldCenter).normalize();
        const facing = markerSurfaceNormal.dot(globeToCamera);
        const visibilityBase = Math.max(0, Math.min(1, (facing - 0.12) / 0.22));
        const visibility = (visibilityBase * visibilityBase * (3 - 2 * visibilityBase)) * markerReveal;
        const pulse = 0.5 + 0.5 * Math.sin(time * 2.5 + phase);
        const wavePulseA = (time * 0.72 + phase * 0.18) % 1;
        const wavePulseB = (time * 0.72 + 0.48 + phase * 0.18) % 1;
        const isVisible = visibility > 0.01;
        marker.visible = isVisible;
        glow.visible = isVisible;
        waveA.visible = isVisible;
        waveB.visible = isVisible;
        marker.scale.setScalar(1 + pulse * 0.16);
        glow.scale.setScalar(1 + pulse * 0.42);
        material.opacity = visibility;
        material.emissiveIntensity = (0.34 + pulse * 0.34) * visibility;
        glowMaterial.opacity = (0.08 + pulse * 0.1) * visibility;
        waveA.scale.setScalar(0.6 + wavePulseA * 5.4);
        waveB.scale.setScalar(0.45 + wavePulseB * 4.8);
        waveAMaterial.opacity = (1 - wavePulseA) * 0.34 * visibility;
        waveBMaterial.opacity = (1 - wavePulseB) * 0.24 * visibility;
      });
    }
    if (ENABLE_GLOBE_ARCS) {
      arcs.forEach(({ material, phase }) => { material.opacity = 0.04 + (0.5 + 0.5 * Math.sin(time * 1.1 + phase)) * 0.045; });
    }
    if (ENABLE_GLOBE_NIGHT_EMISSIVE && globeMaterial.emissiveMap) {
      const cityPulse = 0.05
        + (0.5 + 0.5 * Math.sin(time * 2.8)) * 0.035
        + (0.5 + 0.5 * Math.sin(time * 6.4 + 1.2)) * 0.018;
      globeMaterial.emissiveIntensity = cityPulse;
    }
    if (tintShell && atmosphere) {
      tintShell.material.opacity = 0.018 + (0.5 + 0.5 * Math.sin(time * 0.45)) * 0.006;
      atmosphere.material.opacity = 0.013 + (0.5 + 0.5 * Math.sin(time * 0.8)) * 0.004;
    }
    renderer.render(scene, camera);
  }
  animate();
  console.log('[globe] art direction tuned: monochrome premium Earth');
  console.log('[globe] background stars removed from Three.js scene; globe stays foreground only');
  console.log('[globe] zoom keeps the early smooth feel and heavily softens the final close range');
  console.log('[globe] markers enabled:', ENABLE_GLOBE_MARKERS);
  console.log('[globe] arcs enabled:', ENABLE_GLOBE_ARCS);
  console.log('[globe] night emissive enabled:', ENABLE_GLOBE_NIGHT_EMISSIVE);
  console.log('[globe] atmosphere enabled:', ENABLE_GLOBE_ATMOSPHERE);
  console.log('[globe] diagnostic mode enabled:', ENABLE_GLOBE_DIAGNOSTIC);
  console.log('[globe] normal map enabled:', ENABLE_GLOBE_NORMAL_MAP);
  console.log('[globe] roughness map enabled:', ENABLE_GLOBE_ROUGHNESS_MAP);
  console.log('[globe] scene fog enabled:', ENABLE_GLOBE_SCENE_FOG);
  console.log('[globe] rim light enabled:', ENABLE_GLOBE_RIM_LIGHT);
  console.log('[globe] brighter Earth lighting active, with subtle pulsing city lights from the night map');
  console.log('[globe] standard Three.js materials only:', globe.material.type, tintShell?.material?.type || 'none', atmosphere?.material?.type || 'none');
  window.addEventListener('resize', () => {
    const nextBounds = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(nextBounds.width || container.clientWidth));
    const h = Math.max(1, Math.round(nextBounds.height || container.clientHeight));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

function initEvents() {
  document.getElementById('start-btn').addEventListener('click', () => {
    const ob = document.getElementById('onboarding');
    ob.classList.add('hidden');
    setTimeout(() => { ob.style.display = 'none'; }, 600);
  });
  document.querySelectorAll('.nav-btn[data-screen]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.screen)));
  document.getElementById('mini-player').addEventListener('click', () => navigate('radio'));
  document.getElementById('back-btn').addEventListener('click', () => navigate(previousScreen || 'artists'));
  document.getElementById('popup-close').addEventListener('click', closePopup);
  document.getElementById('play-btn').addEventListener('click', togglePlay);
  document.getElementById('prev-btn').addEventListener('click', () => { radioIndex = (radioIndex - 1 + RADIO.length) % RADIO.length; updateRadio({ autoplay: isPlaying }); });
  document.getElementById('next-btn').addEventListener('click', () => { radioIndex = (radioIndex + 1) % RADIO.length; updateRadio({ autoplay: isPlaying }); });

  window.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (currentScreen === 'home') return;
    returnToGlobe({ reason: 'escape' });
  });

  window.addEventListener('contextmenu', event => {
    const target = event.target;
    if (target instanceof HTMLElement && (target.closest('input, textarea, [contenteditable="true"]'))) return;
    if (currentScreen === 'home') return;
    event.preventDefault();
    returnToGlobe({ reason: 'right-click' });
  });

  window.addEventListener('wheel', event => {
    if (!(window.matchMedia && window.matchMedia('(pointer: fine)').matches)) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (currentScreen === 'home') return;
    if (event.deltaY <= 110) return;

    const activeScroll = document.querySelector('.screen.active .screen-scroll');
    const isScrollable = activeScroll && activeScroll.scrollHeight > activeScroll.clientHeight + 12;
    const isNearBottom = !isScrollable || (activeScroll.scrollTop + activeScroll.clientHeight >= activeScroll.scrollHeight - 12);

    if (isNearBottom) {
      event.preventDefault();
      returnToGlobe({ reason: 'wheel-down' });
    }
  }, { passive: false });

  window.addEventListener('touchstart', event => {
    if (event.touches.length === 2) {
      globalPinchDistance = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY
      );
    }
  }, { passive: true });

  window.addEventListener('touchmove', event => {
    if (event.touches.length !== 2 || globalPinchDistance == null) return;
    const nextDistance = Math.hypot(
      event.touches[0].clientX - event.touches[1].clientX,
      event.touches[0].clientY - event.touches[1].clientY
    );
    const pinchDelta = nextDistance - globalPinchDistance;
    const shouldReturn = pinchDelta < -20 && currentScreen !== 'home';
    if (shouldReturn) {
      returnToGlobe({ reason: 'pinch-in' });
      globalPinchDistance = nextDistance;
      return;
    }
    globalPinchDistance = nextDistance;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    globalPinchDistance = null;
  }, { passive: true });
}

buildNews();
buildArtists();
buildCapsules();
buildRadioWave();
updateRadio();
initEvents();
startTimer();
initSpaceBackground();
if (ENABLE_GLOBE) {
  requestAnimationFrame(() => requestAnimationFrame(() => initGlobe()));
} else {
  console.log('[globe] temporarily disabled to preview the background only');
}
