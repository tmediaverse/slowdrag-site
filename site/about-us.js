(() => {
  const body = document.body;
  const root = document.documentElement;
  const cursor = document.querySelector(".cursor");
  const themeToggle = document.querySelector(".theme-toggle");
  const topbar = document.querySelector(".topbar");
  const primaryNav = document.getElementById("primaryNav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = primaryNav ? [...primaryNav.querySelectorAll("a")] : [];
  const mobileHeaderQuery = window.matchMedia("(max-width: 980px)");
  const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const useCompactScene = window.matchMedia("(max-width: 720px), (hover: none), (pointer: coarse)").matches || prefersReducedMotion;

  const founderData = {
    sujith: {
      image: "./About%20us%20images/Sujith.jpeg",
      targetX: -1.78,
      targetZ: 0.12,
      targetRotationY: 0.18,
    },
    shatakshi: {
      image: "./About%20us%20images/sitting%202.jpeg",
      targetX: 1.78,
      targetZ: -0.08,
      targetRotationY: -0.18,
    },
  };

  let portraitLookup = {};
  let portraitWorld = null;

  function readSavedTheme() {
    try {
      return localStorage.getItem("slowdrag-theme");
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("slowdrag-theme", theme);
    } catch {
      return;
    }
  }

  function setTheme(theme) {
    if (!themeToggle) {
      return;
    }

    const nextTheme = theme === "dark" ? "dark" : "light";
    const isDark = nextTheme === "dark";
    root.dataset.theme = nextTheme;
    themeToggle.textContent = isDark ? "Light" : "Dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    saveTheme(nextTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  function syncMobileNavAccess(isOpen) {
    if (!primaryNav) {
      return;
    }

    const isMobile = mobileHeaderQuery.matches;

    if (!isMobile) {
      primaryNav.removeAttribute("aria-hidden");
      navLinks.forEach((link) => link.removeAttribute("tabindex"));
      return;
    }

    primaryNav.setAttribute("aria-hidden", String(!isOpen));
    navLinks.forEach((link) => {
      if (isOpen) {
        link.removeAttribute("tabindex");
        return;
      }

      link.setAttribute("tabindex", "-1");
    });
  }

  function setMobileNavOpen(isOpen) {
    if (!topbar || !navToggle) {
      return;
    }

    const shouldOpen = Boolean(isOpen && mobileHeaderQuery.matches);
    topbar.classList.toggle("is-nav-open", shouldOpen);
    navToggle.setAttribute("aria-expanded", String(shouldOpen));
    navToggle.setAttribute("aria-label", shouldOpen ? "Close navigation" : "Open navigation");
    syncMobileNavAccess(shouldOpen);
  }

  function updateMobileHeaderState() {
    if (!mobileHeaderQuery.matches) {
      setMobileNavOpen(false);
      syncMobileNavAccess(false);
      return;
    }

    syncMobileNavAccess(topbar?.classList.contains("is-nav-open"));
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      setMobileNavOpen(!topbar?.classList.contains("is-nav-open"));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMobileNavOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!mobileHeaderQuery.matches || !topbar?.classList.contains("is-nav-open")) {
      return;
    }

    if (topbar.contains(event.target)) {
      return;
    }

    setMobileNavOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileNavOpen(false);
    }
  });

  window.addEventListener("resize", updateMobileHeaderState, { passive: true });

  if (typeof mobileHeaderQuery.addEventListener === "function") {
    mobileHeaderQuery.addEventListener("change", updateMobileHeaderState);
  } else if (typeof mobileHeaderQuery.addListener === "function") {
    mobileHeaderQuery.addListener(updateMobileHeaderState);
  }

  updateMobileHeaderState();

  setTheme(readSavedTheme());

  if (cursor && supportsFinePointer) {
    let cursorBlinkTimer = 0;

    const updateCursor = (event) => {
      cursor.classList.add("is-visible");
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    };

    const blinkCursor = () => {
      cursor.classList.remove("is-blinking");
      void cursor.offsetWidth;
      cursor.classList.add("is-blinking");

      window.clearTimeout(cursorBlinkTimer);
      cursorBlinkTimer = window.setTimeout(() => {
        cursor.classList.remove("is-blinking");
      }, 240);
    };

    window.addEventListener("pointermove", updateCursor, { passive: true });
    window.addEventListener("pointerdown", blinkCursor, { passive: true });
    window.addEventListener("pointerleave", () => {
      cursor.classList.remove("is-visible");
    });
  }

  if (!(window.THREE && window.gsap && window.ScrollTrigger)) {
    body.classList.add("webgl-fallback");
    return;
  }

  const { THREE, gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".reveal").forEach((element) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 92%",
          once: true,
        },
      },
    );
  });

  const canvas = document.getElementById("webgl-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  if ("outputColorSpace" in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, useCompactScene ? 1.2 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 140);
  camera.position.set(0, 0.12, 8.7);

  scene.add(new THREE.AmbientLight(0xffffff, 1.45));

  const keyLight = new THREE.DirectionalLight(0xbddcff, 1.9);
  keyLight.position.set(3.4, 2.6, 5.4);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xff78dd, 2.25, 26, 2);
  fillLight.position.set(-4.5, -1.4, 4);
  scene.add(fillLight);

  const glowLight = new THREE.PointLight(0x6aa8ff, 2.1, 26, 2);
  glowLight.position.set(2.6, 0.8, 2.6);
  scene.add(glowLight);

  const pointer = { x: 0, y: 0 };
  const pointerEase = { x: 0, y: 0 };
  const particleTexture = createParticleTexture(THREE);

  const heroVisualState = {
    fade: 1,
    paletteMix: 0,
  };

  const rotationSpeed = {
    x: 0.0026,
    y: 0.0044,
  };

  const heroWorld = new THREE.Group();
  heroWorld.position.set(0.55, -0.04, 0);
  heroWorld.scale.setScalar(1.18);
  scene.add(heroWorld);

  const baseCore = new THREE.Color("#dfe9ff");
  const warmCore = new THREE.Color("#ffd4f0");
  const baseGlow = new THREE.Color("#0e2f62");
  const warmGlow = new THREE.Color("#37113b");
  const baseWire = new THREE.Color("#7ddbff");
  const warmWire = new THREE.Color("#ffd46d");

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: baseCore.clone(),
    roughness: 0.15,
    metalness: 0.24,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
    emissive: baseGlow.clone(),
    emissiveIntensity: 0.92,
    transparent: true,
    opacity: 0.92,
  });

  const shellMaterial = new THREE.MeshBasicMaterial({
    color: baseWire.clone(),
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });

  const knotMaterial = new THREE.MeshBasicMaterial({
    color: baseWire.clone(),
    wireframe: true,
    transparent: true,
    opacity: 0.16,
  });

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: baseWire.clone(),
    transparent: true,
    opacity: 0.5,
  });

  const dustMaterial = new THREE.PointsMaterial({
    map: particleTexture,
    size: 0.056,
    color: baseWire.clone(),
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const coreMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 4), coreMaterial);
  const shellMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(2.22, 1), shellMaterial);
  const knotMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(2.52, 0.06, 220, 16), knotMaterial);
  const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.74, 0.022, 20, 240), ringMaterial);
  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.02, 20, 220), ringMaterial.clone());
  ringA.rotation.x = Math.PI * 0.22;
  ringA.rotation.y = Math.PI * 0.12;
  ringB.rotation.x = Math.PI * 0.66;
  ringB.rotation.z = Math.PI * 0.08;

  const nodeField = createNodeField(THREE, particleTexture, useCompactScene ? 72 : 110, 3.5);
  const dustField = createDustField(THREE, particleTexture, useCompactScene ? 960 : 1800, 6.2, 0.045, 0.46);

  heroWorld.add(coreMesh, shellMesh, knotMesh, ringA, ringB, nodeField, dustField);

  portraitWorld = new THREE.Group();
  portraitWorld.position.set(0.3, 0.04, -0.36);
  portraitWorld.scale.setScalar(0.94);
  portraitWorld.visible = false;
  scene.add(portraitWorld);

  const portraitDust = createDustField(THREE, particleTexture, useCompactScene ? 420 : 700, 2.9, 0.058, 0.34);
  const portraitHaloA = createOrbitLine(THREE, 2.22, 2.78, 0.16, "#72d7ff");
  const portraitHaloB = createOrbitLine(THREE, 1.86, 2.28, -0.18, "#ff74d8");
  portraitHaloA.rotation.z = 0.14;
  portraitHaloB.rotation.z = -0.12;
  portraitWorld.add(portraitDust, portraitHaloA, portraitHaloB);

  Promise.all(
    Object.entries(founderData).map(async ([id, founder]) => {
      const portrait = await buildPortraitParticles(THREE, particleTexture, id, founder.image);
      portraitLookup[id] = portrait;
      portraitWorld.add(portrait);
    }),
  )
    .then(() => {
      showPortraits(true);
      ScrollTrigger.refresh();
    })
    .catch((error) => {
      console.error("Founder particle portrait fallback:", error);
    });

  function showPortraits(immediate = false) {
    if (!portraitWorld || !window.gsap) {
      return;
    }

    body.classList.add("has-portrait-particles");
    portraitWorld.visible = true;

    Object.entries(portraitLookup).forEach(([key, portrait]) => {
      const founder = founderData[key];
      const duration = immediate ? 0 : 0.72;

      portrait.userData.materials.forEach((material, materialIndex) => {
        const targetOpacity = materialIndex === 0 ? 0.86 : materialIndex === 1 ? 0.18 : 0.26;

        gsap.to(material, {
          opacity: targetOpacity,
          duration,
          ease: "power3.out",
          overwrite: true,
        });
      });

      gsap.to(portrait.position, {
        x: founder.targetX,
        y: 0,
        z: founder.targetZ,
        duration,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(portrait.rotation, {
        y: founder.targetRotationY,
        x: 0.02,
        duration,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(portrait.scale, {
        x: 0.98,
        y: 0.98,
        z: 0.98,
        duration,
        ease: "power3.out",
        overwrite: true,
      });
    });
  }

  function applyHeroPalette() {
    const mix = heroVisualState.paletteMix;
    const fade = heroVisualState.fade;

    coreMaterial.color.copy(baseCore).lerp(warmCore, mix);
    coreMaterial.emissive.copy(baseGlow).lerp(warmGlow, mix);
    coreMaterial.opacity = 0.92 * fade;

    shellMaterial.color.copy(baseWire).lerp(warmWire, mix);
    knotMaterial.color.copy(baseWire).lerp(warmWire, mix);
    ringA.material.color.copy(baseWire).lerp(warmWire, mix);
    ringB.material.color.copy(baseWire).lerp(warmWire, mix);
    dustField.material.color.copy(baseWire).lerp(warmWire, mix);
    nodeField.material.color.copy(baseWire).lerp(warmWire, mix);

    shellMaterial.opacity = 0.3 * fade;
    knotMaterial.opacity = 0.16 * fade;
    ringA.material.opacity = 0.5 * fade;
    ringB.material.opacity = 0.34 * fade;
    dustField.material.opacity = 0.46 * fade;
    nodeField.material.opacity = 0.82 * fade;
  }

  applyHeroPalette();

  gsap.to(heroWorld.position, {
    x: 1.4,
    y: 0.14,
    z: -0.2,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.1,
    },
  });

  gsap.to(heroWorld.scale, {
    x: 1.34,
    y: 1.34,
    z: 1.34,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.1,
    },
  });

  gsap.to(camera.position, {
    z: 7.9,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.1,
    },
  });

  gsap.to(heroWorld.position, {
    x: -2.65,
    y: 0.18,
    z: -1.6,
    ease: "none",
    scrollTrigger: {
      trigger: "#founders",
      start: "top bottom",
      end: "top center",
      scrub: 1.2,
    },
  });

  gsap.to(heroWorld.scale, {
    x: 0.66,
    y: 0.66,
    z: 0.66,
    ease: "none",
    scrollTrigger: {
      trigger: "#founders",
      start: "top bottom",
      end: "top center",
      scrub: 1.2,
    },
  });

  gsap.to(heroVisualState, {
    fade: 0.24,
    ease: "none",
    scrollTrigger: {
      trigger: "#founders",
      start: "top 90%",
      end: "top 34%",
      scrub: 1.2,
    },
    onUpdate: applyHeroPalette,
  });

  gsap.to(portraitWorld.position, {
    x: 0,
    y: 0.02,
    z: -0.18,
    ease: "none",
    scrollTrigger: {
      trigger: "#founders",
      start: "top bottom",
      end: "top center",
      scrub: 1.2,
    },
  });

  gsap.to(portraitWorld.scale, {
    x: 1.04,
    y: 1.04,
    z: 1.04,
    ease: "none",
    scrollTrigger: {
      trigger: "#founders",
      start: "top bottom",
      end: "top center",
      scrub: 1.2,
    },
  });

  gsap.to(heroVisualState, {
    paletteMix: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "#expertise",
      start: "top bottom",
      end: "top center",
      scrub: 1.1,
    },
    onUpdate: applyHeroPalette,
  });

  gsap.to(rotationSpeed, {
    x: 0.0014,
    y: 0.0054,
    ease: "none",
    scrollTrigger: {
      trigger: "#contact",
      start: "top bottom",
      end: "top center",
      scrub: 1.1,
    },
  });

  let width = window.innerWidth;
  let height = window.innerHeight;

  if (supportsFinePointer) {
    window.addEventListener("pointermove", (event) => {
      pointer.x = (event.clientX / width) * 2 - 1;
      pointer.y = -((event.clientY / height) * 2 - 1);
      body.style.setProperty("--pointer-x", `${(event.clientX / width) * 100}%`);
      body.style.setProperty("--pointer-y", `${(event.clientY / height) * 100}%`);
    });
  }

  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, useCompactScene ? 1.2 : 2));
    ScrollTrigger.refresh();
  });

  const clock = new THREE.Clock();

  function render() {
    const elapsed = clock.getElapsedTime();

    pointerEase.x += (pointer.x - pointerEase.x) * 0.04;
    pointerEase.y += (pointer.y - pointerEase.y) * 0.04;

    camera.position.x = pointerEase.x * (useCompactScene ? 0.24 : 0.52);
    camera.position.y = 0.12 + pointerEase.y * (useCompactScene ? 0.12 : 0.24);
    camera.lookAt(0, 0, 0);

    heroWorld.rotation.x += rotationSpeed.x;
    heroWorld.rotation.y += rotationSpeed.y;
    heroWorld.rotation.x += pointerEase.y * (useCompactScene ? 0.0008 : 0.0018);
    heroWorld.rotation.y += pointerEase.x * (useCompactScene ? 0.0011 : 0.0022);

    shellMesh.rotation.x -= rotationSpeed.x * 0.48;
    shellMesh.rotation.y += rotationSpeed.y * 0.42;
    knotMesh.rotation.x = elapsed * 0.16;
    knotMesh.rotation.y = elapsed * 0.19;
    ringA.rotation.z = elapsed * 0.14;
    ringB.rotation.z = -elapsed * 0.11;
    dustField.rotation.y = elapsed * 0.025;
    dustField.rotation.x = elapsed * 0.012;
    nodeField.rotation.y = -elapsed * 0.18;

    if (portraitWorld) {
      portraitDust.rotation.y = -elapsed * 0.12;
      portraitHaloA.rotation.y = elapsed * 0.14;
      portraitHaloB.rotation.y = -elapsed * 0.1;

      Object.values(portraitLookup).forEach((portrait, index) => {
        portrait.rotation.z = Math.sin(elapsed * 0.35 + index * 1.4) * 0.025;
        portrait.position.y += ((Math.sin(elapsed * 0.75 + index) * 0.035) - portrait.position.y) * 0.03;
      });
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
  }

  render();
})();

function createParticleTexture(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(203,240,255,0.98)");
  gradient.addColorStop(0.58, "rgba(103,175,255,0.46)");
  gradient.addColorStop(1, "rgba(103,175,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 96, 96);
  return new THREE.CanvasTexture(canvas);
}

function createDustField(THREE, particleTexture, count, radius, size, opacity) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * radius * 1.4;
    const spread = radius * (0.45 + Math.random() * 0.8);
    positions[index * 3] = Math.cos(angle) * spread;
    positions[(index * 3) + 1] = y;
    positions[(index * 3) + 2] = (Math.random() - 0.5) * radius * 1.8;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    map: particleTexture,
    size,
    color: new THREE.Color("#80ddff"),
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

function createNodeField(THREE, particleTexture, count, radius) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const spread = radius * (0.88 + Math.random() * 0.18);
    positions[index * 3] = Math.sin(phi) * Math.cos(theta) * spread;
    positions[(index * 3) + 1] = Math.cos(phi) * spread;
    positions[(index * 3) + 2] = Math.sin(phi) * Math.sin(theta) * spread;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    map: particleTexture,
    size: 0.09,
    color: new THREE.Color("#b6efff"),
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}

function createOrbitLine(THREE, width, height, z, color) {
  const points = [];
  for (let index = 0; index <= 90; index += 1) {
    const angle = (index / 90) * Math.PI * 2;
    const wobble = Math.sin(index * 0.36) * 0.04;
    points.push(new THREE.Vector3(
      Math.cos(angle) * (width + wobble),
      Math.sin(angle) * (height + wobble * 0.8),
      z,
    ));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.22,
  });
  return new THREE.Line(geometry, material);
}

async function buildPortraitParticles(THREE, particleTexture, id, source) {
  const image = await loadImage(source);
  const maxDimension = 196;
  const scale = Math.min(maxDimension / image.width, maxDimension / image.height, 1);
  const width = Math.max(56, Math.round(image.width * scale));
  const height = Math.max(56, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const background = sampleBackgroundColor(pixels, width, height);
  const backgroundLuma = luminance(background.r, background.g, background.b);

  const positions = [];
  const colors = [];
  const sparks = [];
  const portraitWidth = 3.05;
  const portraitHeight = portraitWidth * (height / width);

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const pixelIndex = ((y * width) + x) * 4;
      const alpha = pixels[pixelIndex + 3] / 255;
      if (alpha < 0.12) {
        continue;
      }

      const red = pixels[pixelIndex];
      const green = pixels[pixelIndex + 1];
      const blue = pixels[pixelIndex + 2];
      const distance = colorDistance(red, green, blue, background.r, background.g, background.b);
      const value = luminance(red, green, blue);
      const chroma = saturation(red, green, blue);
      const darkerThanBackground = backgroundLuma - value;
      const keepPixel = distance > 50 || darkerThanBackground > 0.08 || chroma > 0.16;

      if (!keepPixel) {
        continue;
      }

      const px = ((x / (width - 1)) - 0.5) * portraitWidth;
      const py = (0.5 - (y / (height - 1))) * portraitHeight;
      const pz = (0.5 - value) * 0.32 + (Math.random() - 0.5) * 0.1;
      positions.push(px, py, pz);

      const color = new THREE.Color();
      if (value > 0.72) {
        color.setHSL(0.89, 0.78, 0.7);
      } else if (value > 0.42) {
        color.setHSL(0.56 + (Math.random() * 0.02), 0.88, 0.62);
      } else {
        color.setHSL(0.61, 0.72, 0.48);
      }
      colors.push(color.r, color.g, color.b);

      if (((x + y) % 9) === 0) {
        sparks.push(px, py, pz + 0.06);
      }
    }
  }

  const portrait = new THREE.Group();

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    map: particleTexture,
    size: 0.068,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const sparkGeometry = new THREE.BufferGeometry();
  sparkGeometry.setAttribute("position", new THREE.Float32BufferAttribute(sparks, 3));
  const sparkMaterial = new THREE.PointsMaterial({
    map: particleTexture,
    size: 0.126,
    color: new THREE.Color("#c2f3ff"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const loopA = createOrbitLine(THREE, portraitWidth * 0.82, portraitHeight * 0.62, 0.11, "#6fd8ff");
  const loopB = createOrbitLine(THREE, portraitWidth * 0.72, portraitHeight * 0.52, -0.08, "#ff75d7");
  loopA.rotation.z = id === "sujith" ? -0.12 : 0.12;
  loopB.rotation.z = id === "sujith" ? 0.08 : -0.08;

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  const sparkPoints = new THREE.Points(sparkGeometry, sparkMaterial);

  portrait.add(particles, sparkPoints, loopA, loopB);
  portrait.userData.materials = [particleMaterial, sparkMaterial, loopA.material, loopB.material];
  portrait.position.x = id === "sujith" ? -0.86 : 0.86;
  portrait.rotation.y = id === "sujith" ? -0.38 : 0.38;
  portrait.scale.setScalar(0.84);
  return portrait;
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function sampleBackgroundColor(pixels, width, height) {
  const samplePoints = [
    [0.04, 0.04],
    [0.5, 0.03],
    [0.96, 0.04],
    [0.03, 0.5],
    [0.97, 0.5],
    [0.04, 0.96],
    [0.5, 0.97],
    [0.96, 0.96],
  ];

  let red = 0;
  let green = 0;
  let blue = 0;

  samplePoints.forEach(([u, v]) => {
    const x = Math.max(0, Math.min(width - 1, Math.round((width - 1) * u)));
    const y = Math.max(0, Math.min(height - 1, Math.round((height - 1) * v)));
    const index = ((y * width) + x) * 4;
    red += pixels[index];
    green += pixels[index + 1];
    blue += pixels[index + 2];
  });

  const count = samplePoints.length;
  return {
    r: red / count,
    g: green / count,
    b: blue / count,
  };
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt((dr * dr) + (dg * dg) + (db * db));
}

function luminance(red, green, blue) {
  return ((0.299 * red) + (0.587 * green) + (0.114 * blue)) / 255;
}

function saturation(red, green, blue) {
  const max = Math.max(red, green, blue) / 255;
  const min = Math.min(red, green, blue) / 255;
  return max - min;
}
