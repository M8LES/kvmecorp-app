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
  ctx.strokeStyle = 'rgba(214,183,107,0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 9; i++) {
    const y = size * (0.2 + i * 0.08);
    ctx.beginPath();
    ctx.ellipse(size / 2, y, size * 0.34, size * 0.08, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 9; i++) {
    const x = size * (0.16 + i * 0.085);
    ctx.beginPath();
    ctx.ellipse(x, size / 2, size * 0.08, size * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(214,183,107,0.08)';
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
  document.querySelectorAll('.artist-dot').forEach(dot => dot.addEventListener('click', () => openArtist(dot.dataset.artist)));
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
  scene.fog = new THREE.FogExp2(0x020202, 0.055);

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
    renderer.toneMappingExposure = 1.05;
  }
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.72);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xefe3c2, 0x060606, 0.72);
  scene.add(hemi);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
  keyLight.position.set(2.8, 1.6, 4.8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xd6b76b, 0.8);
  rimLight.position.set(-3.8, -1.4, 2.8);
  scene.add(rimLight);

  const globeRadius = 1.52;
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(globeRadius, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0x16171a,
      roughness: 0.58,
      metalness: 0.18
    })
  );
  scene.add(globe);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(globeRadius * 1.035, 48, 48),
    new THREE.MeshPhongMaterial({
      color: 0xf0d894,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    })
  );
  scene.add(atmosphere);

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(globeRadius * 1.1, 48, 48),
    new THREE.MeshBasicMaterial({
      color: 0xd6b76b,
      transparent: true,
      opacity: 0.055
    })
  );
  scene.add(halo);

  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius * 0.94, 16, 16)),
    new THREE.LineBasicMaterial({
      color: 0xd6b76b,
      transparent: true,
      opacity: 0.12
    })
  );
  scene.add(wireframe);

  const artistPoints = [
    {
      id: "goten",
      name: "GOTEN",
      city: "Fleurimont",
      region: "Saint-Paul",
      country: "La Réunion",
      lat: -21.0167,
      lon: 55.2667,
      color: "#e2583e"
    },
    {
      id: "mvk",
      name: "MVK",
      city: "Plateau Caillou",
      region: "Saint-Paul",
      country: "La Réunion",
      lat: -21.0330,
      lon: 55.2420,
      color: "#8d73ff"
    },
    {
      id: "saiyan",
      name: "SAIYAN",
      city: "Plateau Caillou",
      region: "Saint-Paul",
      country: "La Réunion",
      lat: -21.0330,
      lon: 55.2420,
      color: "#caa537"
    },
    {
      id: "enden",
      name: "ENDEN",
      city: "Rouen",
      region: "Normandie",
      country: "France",
      origin: "Martinique",
      lat: 49.4431,
      lon: 1.0993,
      color: "#7f8794"
    },
    {
      id: "latr2iix",
      name: "LATR2IIX",
      city: "Rouen",
      region: "Normandie",
      country: "France",
      lat: 49.4431,
      lon: 1.0993,
      color: "#5a88d8"
    },
    {
      id: "lamoula16",
      name: "LAMOULA.16",
      city: "Saint-Leu",
      region: "La Réunion",
      country: "France",
      lat: -21.1700,
      lon: 55.2880,
      color: "#9906e2"
    }
  ];

  const markerGroup = new THREE.Group();
  const markers = [];

  function latLonToVector3(lat, lon, radius = globeRadius * 0.985) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  artistPoints.forEach((point) => {
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.072, 18, 18),
      new THREE.MeshStandardMaterial({
        color: point.color,
        emissive: point.color,
        emissiveIntensity: 1.25,
        metalness: 0.18,
        roughness: 0.42
      })
    );

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.115, 14, 14),
      new THREE.MeshBasicMaterial({
        color: point.color,
        transparent: true,
        opacity: 0.16
      })
    );
    marker.add(glow);

    marker.position.copy(latLonToVector3(point.lat, point.lon));
    marker.userData.artistId = point.id;

    markerGroup.add(marker);
    markers.push(marker);
  });

  scene.add(markerGroup);

  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0xd6b76b,
    transparent: true,
    opacity: 0.12
  });

  function createOrbit(radiusX, radiusY, rotX, rotY) {
    const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, Math.PI * 2, false, 0);
    const points2D = curve.getPoints(100);
    const points3D = points2D.map((p) => new THREE.Vector3(p.x, p.y, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points3D);
    const line = new THREE.LineLoop(geometry, orbitMaterial);

    line.rotation.x = rotX;
    line.rotation.y = rotY;

    return line;
  }

  const orbit1 = createOrbit(1.95, 0.66, Math.PI / 2.95, 0.18);
  const orbit2 = createOrbit(2.12, 0.76, Math.PI / 2.6, -0.3);
  scene.add(orbit1, orbit2);

  const rotatables = [globe, atmosphere, halo, wireframe, markerGroup];
  let rotationX = -0.22;
  let rotationY = -0.36;

  function applySceneRotation() {
    rotatables.forEach((mesh) => {
      mesh.rotation.x = rotationX;
      mesh.rotation.y = rotationY;
    });
    orbit1.rotation.y = rotationY + 0.18;
    orbit2.rotation.y = rotationY - 0.14;
  }

  function clampRotation() {
    rotationX = Math.max(-0.65, Math.min(0.3, rotationX));
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
      if (artistId) openArtist(artistId);
    }
  });

  function animate() {
    requestAnimationFrame(animate);

    if (!isDragging) {
      rotationY += 0.0033;
      rotationX += (-0.22 - rotationX) * 0.02;
      applySceneRotation();
      orbit1.rotation.z += 0.0012;
      orbit2.rotation.z -= 0.00085;
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
