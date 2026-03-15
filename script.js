let globe;

const artists = {
  goten: {
    name: 'GOTEN',
    color: '#e2583e',
    tag: 'TRAP · DRILL',
    bio: 'Nœud rouge du réseau. Dans cette V4 claire, sa couleur n’apparaît qu’en accent pour garder un rendu premium et lisible.',
    avatarLabel: 'AVATAR GOTEN',
    capsules: [
      { num: '006', title: 'CAPSULE 6', status: 'LIMITÉE' },
  
    ],
  },
  mvk: {
    name: 'MVK',
    color: '#8d73ff',
    tag: 'AMBIENT · DARK',
    bio: 'Portails, textures lentes, atmosphères mentales. Ici, son violet devient un détail rare, pas une surcharge permanente.',
    avatarLabel: 'VISUEL MVK',
    capsules: [
      { num: '001', title: 'VOID TRANSMISSION', status: 'RARE' },
    
    ],
  },
  saiyan: {
    name: 'SAIYAN',
    color: '#caa537',
    tag: 'RAP · TRAP',
    bio: ' Brute et crue, Saiyan i envoie rienk la pure.',
    avatarLabel: 'AVATAR SAIYAN',
    capsules: [
      { num: '005', title: 'CAPSULE 5', status: 'STANDARD' },
      
    ],
  },
  lat: {
    name: 'LAT',
    color: '#5a88d8',
    tag: 'BOOM BAP · RAP',
    bio: 'Fondation bleue du réseau. Son accent garde une présence propre et précise sur les cartes et les capsules.',
    avatarLabel: 'VISUEL LAT',
    capsules: [
      { num: '009', title: 'PROFONDEUR 01', status: 'RARE' },
      { num: '010', title: 'FONDATION', status: 'STANDARD' },
    ],
  },
  enden: {
    name: 'ENDEN',
    color: '#7f8794',
    tag: 'EXPÉRIMENTAL · FUSION',
    bio: 'Connexion grise entre tous les mondes. Sa zone est idéale pour des visuels hybrides, glitchés ou des avatars plus conceptuels.',
    avatarLabel: 'AVATAR ENDEN',
    capsules: [
      { num: '011', title: 'SYNTHÈSE ZÉRO', status: 'STANDARD' },
      { num: '012', title: 'INTERFÉRENCE', status: 'LIMITÉE' },
    ],
  },
};
const newsItems = [
  { artist: 'MVK', title: 'COSMIC FREQUENCY', meta: 'Découverte', time: '22:15', artistId: 'mvk' },
  { artist: 'GOTEN × LAT', title: 'COLLAB EN PRÉPARATION', meta: 'Collaboration', time: '20:08', artistId: 'goten' },
  { artist: 'SAIYAN', title: 'ASTRA LOOP', meta: 'Capsule spatiale', time: 'Hier', artistId: 'saiyan' },
];
const radioTracks = [
  {
    title: 'INFERNO 001',
    artist: 'GOTEN',
    color: '#e2538e'
  },
  {
    title: 'VOID TRANSMISSION',
    artist: 'MVK',
    color: '#8d73ff'
  },
  {
    title: 'CAPSULE 5',
    artist: 'SAIYAN',
    color: '#caa537',
    src: 'assets/audio/capsule5_saiyan.wav'
  },
  {
    title: 'PROFONDEUR 01',
    artist: 'LAT',
    color: '#5a88d8'
  },
  {
    title: 'SYNTHÈSE ZÉRO',
    artist: 'ENDEN',
    color: '#7f8794'
  }
];
let currentScreen = 'home';
let previousScreen = 'home';
let currentTrack = 0;
let isPlaying = false;

const audio = new Audio();
audio.addEventListener('play', () => {
  const btn = document.getElementById('toggle-play');
  if (btn) btn.textContent = 'Pause';
});

audio.addEventListener('pause', () => {
  const btn = document.getElementById('toggle-play');
  if (btn) btn.textContent = 'Play';
});

audio.addEventListener('ended', () => {
  const btn = document.getElementById('toggle-play');
  isPlaying = false;
  if (btn) btn.textContent = 'Play';
});

function navigate(screen) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
  document.getElementById(screen).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((el) => el.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-screen="${screen}"]`);
  if (btn) btn.classList.add('active');
  currentScreen = screen;
}
function buildNews() {
  const wrap = document.getElementById('news-list');
  wrap.innerHTML = newsItems.map(item => {
    const artist = artists[item.artistId];
    return `
      <button class="news-item" data-artist="${item.artistId}">
        <div class="media-slot media-slot--small" style="height:70px;border-radius:16px;color:${artist.color};">${item.artist}</div>
        <div class="news-item__meta">
          <div class="eyebrow">${item.meta}</div>
          <h3>${item.title}</h3>
          <p>${item.artist}</p>
        </div>
        <div class="news-item__time">${item.time}</div>
      </button>
    `;
  }).join('');
  wrap.querySelectorAll('[data-artist]').forEach(btn => {
    btn.addEventListener('click', () => openArtist(btn.dataset.artist));
  });
}
function buildArtists() {
  const wrap = document.getElementById('artist-list');
  wrap.innerHTML = Object.entries(artists).map(([id, artist]) => `
    <button class="artist-item" data-artist="${id}">
      <div class="artist-item__swatch" style="--artist:${artist.color}"></div>
      <div class="artist-item__meta">
        <div class="eyebrow">${artist.tag}</div>
        <h3>${artist.name}</h3>
        <p>${artist.capsules.length} capsules prêtes à mettre en scène</p>
      </div>
    </button>
  `).join('');
  wrap.querySelectorAll('[data-artist]').forEach(btn => {
    btn.addEventListener('click', () => openArtist(btn.dataset.artist));
  });
}
function buildCapsules() {
  const wrap = document.getElementById('capsule-grid');
  const list = Object.values(artists).flatMap(artist => artist.capsules.map(c => ({...c, artist: artist.name, color: artist.color})));
  wrap.innerHTML = list.map(capsule => `
    <article class="capsule-item">
      <div class="capsule-item__head">
        <div class="capsule-item__cover media-slot media-slot--small" style="color:${capsule.color};border-radius:18px;">${capsule.num}</div>
        <div>
          <div class="eyebrow">${capsule.artist}</div>
          <h3>${capsule.title}</h3>
          <p>${capsule.status}</p>
        </div>
      </div>
      <div class="waveform">${Array.from({length: 18}, (_, i) => `<span style="height:${10 + ((i * 7) % 26)}px"></span>`).join('')}</div>
    </article>
  `).join('');
}
function openArtist(id) {
  const artist = artists[id];
  if (!artist) return;
  previousScreen = currentScreen;
  document.getElementById('profile-name').textContent = artist.name;
  document.getElementById('profile-tag').textContent = artist.tag;
  document.getElementById('profile-bio').textContent = artist.bio;
  const avatarSlot = document.getElementById('profile-avatar-slot');
  avatarSlot.innerHTML = `<div class="media-slot__label">${artist.avatarLabel}</div><div class="media-slot__hint">Tu peux remplacer ce bloc par &lt;img&gt;, &lt;video&gt; ou animation canvas</div>`;
  avatarSlot.style.boxShadow = `inset 0 0 0 1px ${artist.color}22, 0 18px 40px ${artist.color}12`;
  avatarSlot.style.color = artist.color;
  const capsuleWrap = document.getElementById('profile-capsules');
  capsuleWrap.innerHTML = artist.capsules.map(capsule => `
    <div class="capsule-row">
      <div class="capsule-row__num">${capsule.num}</div>
      <div class="capsule-row__info">
        <strong>${capsule.title}</strong>
        <div class="eyebrow">${artist.name}</div>
      </div>
      <div class="capsule-row__pill">${capsule.status}</div>
    </div>
  `).join('');
  navigate('artist-profile');
}
function updateRadio() {
  const track = radioTracks[currentTrack];
  document.getElementById('radio-title').textContent = track.title;
  document.getElementById('radio-artist').textContent = track.artist;
  document.getElementById('mini-title').textContent = track.title;
  document.getElementById('mini-artist').textContent = track.artist;
  document.getElementById('mini-cover').textContent = track.artist[0];
  document.getElementById('mini-cover').style.color = track.color;
  const playBtn = document.getElementById('toggle-play');
if (playBtn) {
  playBtn.textContent = audio.paused ? 'Play' : 'Pause';
}

  const visual = document.getElementById('radio-visual');
  visual.style.background = `radial-gradient(circle at 35% 35%, ${track.color}66, rgba(12,12,14,0.96))`;

  if (isPlaying) {
    if (track.src) {
      audio.src = track.src;
      audio.play().catch(err => console.log('Erreur audio :', err));
    } else {
      audio.pause();
      isPlaying = false;
      const playBtn = document.getElementById('toggle-play');
      if (playBtn) playBtn.textContent = 'Play';
    }
  }
}
function drawGlobe() {
  const canvas = document.getElementById('globe-canvas');
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const grad = ctx.createRadialGradient(size * 0.34, size * 0.28, size * 0.08, size * 0.5, size * 0.5, size * 0.52);
  grad.addColorStop(0, '#2a2a2d');
  grad.addColorStop(.55, '#121214');
  grad.addColorStop(1, '#050505');
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = 'rgba(102,162,255,0.08)';
  [[.34,.33,.14,.07],[.62,.37,.17,.09],[.58,.62,.2,.1],[.36,.58,.18,.08]].forEach(([x, y, rx, ry]) => {
    ctx.beginPath();
    ctx.ellipse(size * x, size * y, size * rx, size * ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}
function initEvents() {
  document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('onboarding').classList.remove('active');
  });
  document.querySelectorAll('.nav-btn, .mini-player').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.screen));
  });
  document.getElementById('back-from-profile').addEventListener('click', () => navigate(previousScreen || 'artists'));
  document.getElementById('prev-track').addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + radioTracks.length) % radioTracks.length;
    updateRadio();
  });
  document.getElementById('next-track').addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % radioTracks.length;
    updateRadio();
  });
document.getElementById('toggle-play').addEventListener('click', (e) => {
  const track = radioTracks[currentTrack];

  if (!track.src) {
    console.log('Aucun fichier audio pour ce morceau');
    e.currentTarget.textContent = 'Play';
    return;
  }

  if (audio.src !== new URL(track.src, window.location.href).href) {
    audio.src = track.src;
  }

  if (audio.paused) {
    audio.play()
      .then(() => {
        isPlaying = true;
        e.currentTarget.textContent = 'Pause';
      })
      .catch((err) => {
        console.log('Erreur audio :', err);
        e.currentTarget.textContent = 'Play';
      });
  } else {
    audio.pause();
    isPlaying = false;
    e.currentTarget.textContent = 'Play';
  }
});
  window.addEventListener('resize', drawGlobe);
}
function initGlobe3D() {
  const container = document.getElementById("globe-3d");
  if (!container || typeof THREE === "undefined") return;

  container.innerHTML = "";

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020202, 0.012);

  const width = container.clientWidth;
  const height = container.clientHeight;

  const defaultFov = 38;
  let currentFov = defaultFov;
  const minFov = 32;
  const maxFov = 50;

  const camera = new THREE.PerspectiveCamera(currentFov, width / height, 0.1, 1000);
  camera.position.set(0, -0.28, 4.15);
  camera.lookAt(0, 0.12, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  if ("toneMapping" in renderer) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
  }

  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.88);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xc6d5f0, 0x122033, 0.92);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xfff5e8, 1.88);
  keyLight.position.set(3.2, 1.8, 5.2);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x86b4ff, 1.02);
  rimLight.position.set(-4.4, 0.8, 3.4);
  scene.add(rimLight);

  const warmRim = new THREE.DirectionalLight(0xe6b16d, 0.48);
  warmRim.position.set(-2.8, -1.8, 2.4);
  scene.add(warmRim);
const globeRadius = 1.52;
  const textureLoader = new THREE.TextureLoader();
  const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

// =========================
// KVMECORP EARTH
// =========================

const surfaceMap = textureLoader.load(
"assets/textures/earth-day.jpg"
);

const normalMap = textureLoader.load(
  "assets/textures/earth-normal.jpg"
);

const roughnessMap = textureLoader.load(
  "assets/textures/earth-roughness.jpg"
);

const nightMap = textureLoader.load(
  "assets/textures/earth-night.jpg"
);


// --- COLOR SPACE (IMPORTANT)

if (THREE.SRGBColorSpace) {
  surfaceMap.colorSpace = THREE.SRGBColorSpace;
  nightMap.colorSpace = THREE.SRGBColorSpace;
}


// --- ANISOTROPY (sharp textures)

surfaceMap.anisotropy = maxAnisotropy;
normalMap.anisotropy = maxAnisotropy;
roughnessMap.anisotropy = maxAnisotropy;
nightMap.anisotropy = maxAnisotropy;

const globeMaterial = new THREE.MeshStandardMaterial({

map: surfaceMap,
color: new THREE.Color(0x5e6c83),

normalMap: normalMap,
normalScale: new THREE.Vector2(0.1, 0.1),

roughnessMap: roughnessMap,
roughness: 0.95,

metalness: 0.08,

emissiveMap: nightMap,
emissive: new THREE.Color(0x081320),
emissiveIntensity: 0.08

});

  const globeShaderState = {
    shader: null
  };

  globeMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uHoloCyan = { value: new THREE.Color(0x4cd8ff) };
    shader.uniforms.uHoloStrength = { value: 0.07 };

    shader.vertexShader = `
      varying vec3 vHoloNormal;
      varying vec2 vHoloUv;
    ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <defaultnormal_vertex>",
      `#include <defaultnormal_vertex>
      vHoloNormal = normalize(transformedNormal);
      vHoloUv = uv;`
    );

    shader.fragmentShader = `
      uniform vec3 uHoloCyan;
      uniform float uHoloStrength;
      varying vec3 vHoloNormal;
      varying vec2 vHoloUv;
    ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
      float holoRim = pow(1.0 - clamp(dot(normalize(vHoloNormal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 3.6);
      float holoBands = 0.5 + 0.5 * sin(vHoloUv.y * 120.0);
      gl_FragColor.rgb += uHoloCyan * holoRim * (0.75 + holoBands * 0.25) * uHoloStrength;
      #include <dithering_fragment>
      `
    );

    globeShaderState.shader = shader;
  };

  globeMaterial.customProgramCacheKey = () => "kvmecorp-holo-globe-v1";

globe = new THREE.Mesh(
  new THREE.SphereGeometry(globeRadius, 96, 96),
  globeMaterial
);
scene.add(globe);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(globeRadius * 1.01, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0x56e0ff,
    transparent: true,
    opacity: 0.04,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);
globe.add(atmosphere);


  // LOCATIONS (points géographiques uniques)
const locations = {
  plateauCaillou: {
    country: "France",
    region: "La Réunion",
    city: "Saint-Paul",
    neighborhood: "Plateau Caillou",
    lat: -21.0330,
    lon: 55.2420
  },

  fleurimont: {
    country: "France",
    region: "La Réunion",
    city: "Saint-Paul",
    neighborhood: "Fleurimont",
    lat: -21.0167,
    lon: 55.2667
  },

  saintLeu: {
    country: "France",
    region: "La Réunion",
    city: "Saint-Leu",
    neighborhood: null,
    lat: -21.1700,
    lon: 55.2880
  },

  rouen: {
    country: "France",
    region: "Normandie",
    city: "Rouen",
    neighborhood: null,
    lat: 49.4431,
    lon: 1.0993
  }
};


const energyColors = {
  red: "#e2583e",
  purple: "#8d73ff",
  blue: "#5a88d8",
  green: "#4cc38a",
  gold: "#caa537",
  white: "#ffffff"
};

const profileAliases = {
  latr2iix: "lat"
};

function normalizeLocationKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toLowerCase();
}

const locationKeyAliases = {
  plateaucaillou: "plateauCaillou",
  fleurimont: "fleurimont",
  saintleu: "saintLeu",
  rouen: "rouen"
};

function resolveLocationKey(artist, key) {
  const candidates = [
    artist.locationKey,
    artist.neighborhood,
    artist.city,
    artist.region,
    key
  ];

  for (const candidate of candidates) {
    const normalized = normalizeLocationKey(candidate);
    if (normalized && locationKeyAliases[normalized]) {
      return locationKeyAliases[normalized];
    }
  }

  return artist.locationKey || key;
}

// Fusion artiste + coordonnées
const artistPoints = Object.entries(window.artists || {}).map(([key, artist]) => ({
  id: key,
  name: artist.name,
  color: artists[key]?.color || energyColors[artist.energy] || "#ffffff",
  profileId: artists[key] ? key : profileAliases[key] || null,
  locationKey: resolveLocationKey(artist, key)
}));
const artistPointsResolved = artistPoints
  .map(artist => ({
    ...artist,
    ...locations[artist.locationKey]
  }))
  .filter((artist) => {
    const hasCoordinates = Number.isFinite(artist.lat) && Number.isFinite(artist.lon);
    if (!hasCoordinates) {
      console.warn("Marker ignoré, coordonnées manquantes pour", artist.id);
    }
    return hasCoordinates;
  });

  const markerGroup = new THREE.Group();
  const markers = [];
  const markerVisuals = [];
  const networkGroup = new THREE.Group();
  const networkArcs = [];

  function latLonToVector3(lat, lon, radius = globeRadius * 0.985) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  artistPointsResolved.forEach((point, index) => {
    const accentColor = new THREE.Color(point.color);
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.0095, 10, 10),
      new THREE.MeshStandardMaterial({
        color: point.color,
        emissive: point.color,
        emissiveIntensity: 0.55,
        metalness: 0.12,
        roughness: 0.52
      })
    );

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.0155, 10, 10),
      new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );

    marker.add(glow);
    marker.position.copy(latLonToVector3(point.lat, point.lon));
    marker.userData.artistId = point.profileId;
    marker.userData.sourceArtistId = point.id;
    marker.userData.glow = glow;

    markerGroup.add(marker);
    markers.push(marker);
    markerVisuals.push({
      marker,
      glow,
      phase: index * 0.85,
      baseScale: 1
    });
  });

  scene.add(markerGroup);

  function createNetworkArc(startPoint, endPoint, colorHex, altitude = 0.32) {
    const start = latLonToVector3(startPoint.lat, startPoint.lon, globeRadius * 1.002);
    const end = latLonToVector3(endPoint.lat, endPoint.lon, globeRadius * 1.002);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(globeRadius + altitude);
    const curve = new THREE.CatmullRomCurve3([start, mid, end]);
    const points = curve.getPoints(72);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const arc = new THREE.Line(geometry, material);
    networkGroup.add(arc);
    networkArcs.push({
      line: arc,
      material,
      phase: networkArcs.length * 0.9
    });
  }

  const pointsById = Object.fromEntries(artistPointsResolved.map((point) => [point.id, point]));
  [
    ["goten", "saiyan", 0x45d6ff, 0.26],
    ["mvk", "enden", 0xff4fd8, 0.34],
    ["lamoula16", "goten", 0x7a7dff, 0.28],
    ["latr2iix", "enden", 0x45d6ff, 0.24]
  ].forEach(([fromId, toId, colorHex, altitude]) => {
    const fromPoint = pointsById[fromId];
    const toPoint = pointsById[toId];
    if (fromPoint && toPoint) {
      createNetworkArc(fromPoint, toPoint, colorHex, altitude);
    }
  });
  globe.add(networkGroup);

  const rotatables = [globe, markerGroup];
  let rotationX = -0.22;
  let rotationY = -0.36;

  function applySceneRotation() {
    rotatables.forEach((mesh) => {
      mesh.rotation.x = rotationX;
      mesh.rotation.y = rotationY;
    });
  }

  function clampRotation() {
    rotationX = Math.max(-1.35, Math.min(1.35, rotationX));
  }

  function setCameraFov(nextFov) {
    currentFov = Math.max(minFov, Math.min(maxFov, nextFov));
    camera.fov = currentFov;
    camera.updateProjectionMatrix();
  }

  applySceneRotation();

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let pinchDistance = null;

  function beginDrag(x, y) {
    isDragging = true;
    lastX = x;
    lastY = y;
  }

  function dragTo(x, y) {
    if (!isDragging) return;

    const deltaX = x - lastX;
    const deltaY = y - lastY;

    rotationY += deltaX * 0.0044;
    rotationX += deltaY * 0.0031;
    clampRotation();
    applySceneRotation();

    lastX = x;
    lastY = y;
  }

  function endDrag() {
    isDragging = false;
  }

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  container.addEventListener("mousedown", (e) => {
    beginDrag(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", endDrag);
  window.addEventListener("mousemove", (e) => {
    dragTo(e.clientX, e.clientY);
  });

  container.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      beginDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
    if (e.touches.length === 2) {
      pinchDistance = getTouchDistance(e.touches);
    }
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1) {
      dragTo(e.touches[0].clientX, e.touches[0].clientY);
    }

    if (e.touches.length === 2) {
      const nextDistance = getTouchDistance(e.touches);
      if (pinchDistance) {
        setCameraFov(currentFov - (nextDistance - pinchDistance) * 0.03);
      }
      pinchDistance = nextDistance;
    }
  }, { passive: true });

  container.addEventListener("touchend", () => {
    pinchDistance = null;
    endDrag();
  });

  container.addEventListener("wheel", (event) => {
    event.preventDefault();
    setCameraFov(currentFov + event.deltaY * 0.015);
  }, { passive: false });

  container.addEventListener("click", (event) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers);

    if (intersects.length > 0) {
      const artistId = intersects[0].object.userData.artistId;
      if (artistId && artists[artistId]) openArtist(artistId);
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    const time = performance.now() * 0.001;

    if (!isDragging) {
      rotationY += 0.0033;
      applySceneRotation();
    }

    markerVisuals.forEach(({ marker, glow, phase, baseScale }) => {
      const pulse = 0.5 + 0.5 * Math.sin(time * 1.6 + phase);
      const markerScale = baseScale + pulse * 0.012;
      marker.scale.setScalar(markerScale);
      glow.scale.setScalar(1 + pulse * 0.09);
      glow.material.opacity = 0.07 + pulse * 0.035;
    });

    networkArcs.forEach(({ material, phase }) => {
      const shimmer = 0.5 + 0.5 * Math.sin(time * 1.2 + phase);
      material.opacity = 0.04 + shimmer * 0.045;
    });

    atmosphere.material.opacity = 0.032 + (0.5 + 0.5 * Math.sin(time * 0.8)) * 0.008;

    if (globeShaderState.shader) {
      globeShaderState.shader.uniforms.uHoloStrength.value = 0.026 + (0.5 + 0.5 * Math.sin(time * 0.65)) * 0.01;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}


buildNews();
buildArtists();
buildCapsules();
updateRadio();
drawGlobe();
initGlobe3D();
initEvents();


















