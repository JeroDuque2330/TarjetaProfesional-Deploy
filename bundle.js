(()=>{
  var modules = {
    574(module, exports, require) {
      const configureTargets = () => {
        if (window.XR8 && window.XR8.XrController) {
          window.XR8.XrController.configure({
            imageTargetData: [require(924), require(232)]
          });
        }
      };
      if (window.XR8 && window.XR8.XrController) {
        configureTargets();
      } else {
        window.addEventListener("xrloaded", configureTargets);
      }
    },
    232(module) {
      "use strict";
      module.exports = JSON.parse("{\n  \"type\": \"PLANAR\",\n  \"properties\": {\n    \"top\": 0,\n    \"left\": 0,\n    \"width\": 960,\n    \"height\": 1280,\n    \"isRotated\": false,\n    \"originalWidth\": 960,\n    \"originalHeight\": 1280\n  },\n  \"imagePath\": \"image-targets/TarjetaProfe_luminance.jpg\",\n  \"metadata\": null,\n  \"name\": \"TarjetaProfe\",\n  \"resources\": {\n    \"originalImage\": \"TarjetaProfe_original.jpg\",\n    \"croppedImage\": \"TarjetaProfe_cropped.jpg\",\n    \"thumbnailImage\": \"TarjetaProfe_thumbnail.jpg\",\n    \"luminanceImage\": \"TarjetaProfe_luminance.jpg\"\n  },\n  \"created\": 1785901273592,\n  \"updated\": 1785901273592\n}");
    },
    924(module) {
      "use strict";
      module.exports = JSON.parse("{\n  \"type\": \"PLANAR\",\n  \"properties\": {\n    \"top\": 85,\n    \"left\": 0,\n    \"width\": 1024,\n    \"height\": 1365,\n    \"isRotated\": false,\n    \"originalWidth\": 1024,\n    \"originalHeight\": 1536\n  },\n  \"imagePath\": \"image-targets/TarjetaProfesional_luminance.png\",\n  \"metadata\": null,\n  \"name\": \"TarjetaProfesional\",\n  \"resources\": {\n    \"originalImage\": \"TarjetaProfesional_original.png\",\n    \"croppedImage\": \"TarjetaProfesional_cropped.png\",\n    \"thumbnailImage\": \"TarjetaProfesional_thumbnail.png\",\n    \"luminanceImage\": \"TarjetaProfesional_luminance.png\"\n  },\n  \"created\": 1786919704078,\n  \"updated\": 1786919704078\n}");
    }
  };

  const cache = {};
  function require(id) {
    if (cache[id] !== undefined) return cache[id].exports;
    const module = cache[id] = { exports: {} };
    modules[id](module, module.exports, require);
    return module.exports;
  }

  (() => {
    "use strict";
    try {
      require(574);
    } catch (e) {
      console.warn("Error loading targets module:", e);
    }

    const ECS = window.ecs;
    if (!ECS) {
      console.error("8th Wall ECS not found on window.ecs");
      return;
    }

    // =========================================================================
    // UI OVERLAY: GUÍA VISUAL "APUNTA TU CÁMARA"
    // =========================================================================
    let targetPrompt = null;
    function createTargetPrompt() {
      if (document.getElementById("target-prompt-guide")) return;
      targetPrompt = document.createElement("div");
      targetPrompt.id = "target-prompt-guide";
      targetPrompt.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ad50ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span style="font-family:system-ui,-apple-system,sans-serif;font-size:14px;font-weight:600;color:#ffffff;letter-spacing:0.3px;">
            Apunta la cámara a la Tarjeta Profesional
          </span>
        </div>
      `;
      Object.assign(targetPrompt.style, {
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(10px)",
        webkitBackdropFilter: "blur(10px)",
        padding: "10px 20px",
        borderRadius: "30px",
        border: "1px solid rgba(173, 80, 255, 0.4)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        zIndex: "9998",
        pointerEvents: "none",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: "1"
      });
      document.body.appendChild(targetPrompt);
    }

    function showTargetPrompt(show) {
      if (!targetPrompt) return;
      targetPrompt.style.opacity = show ? "1" : "0";
      targetPrompt.style.transform = show ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-15px)";
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createTargetPrompt);
    } else {
      createTargetPrompt();
    }

    window.addEventListener("xrimagefound", () => {
      showTargetPrompt(false);
    });

    window.addEventListener("xrimagelost", () => {
      showTargetPrompt(true);
    });

    // =========================================================================
    // 1. REDIRECCIÓN INDEPENDIENTE DE REDES SOCIALES (open-url-button.ts)
    // =========================================================================
    const SOCIAL_LINKS = {
      whatsapp: "https://wa.me/573154445000",
      instagram: "https://www.instagram.com/jeronimoduque423/",
      spotify: "https://open.spotify.com/user/o0gt0327bv62udbgzyjh0qomt?si=076634e60fe84ede"
    };

    let lastUrlOpenTime = 0;

    function navigateToUrl(url) {
      const now = Date.now();
      if (now - lastUrlOpenTime < 600) return;
      lastUrlOpenTime = now;
      console.log("[open-url-button] Redirigiendo a:", url);

      try {
        const win = window.open(url, "_blank", "noopener,noreferrer");
        if (!win || win.closed || typeof win.closed === "undefined") {
          window.location.href = url;
        }
      } catch (err) {
        window.location.href = url;
      }
    }

    function getUrlFromIdentifier(identifierStr, customUrl) {
      if (customUrl && customUrl.trim()) return customUrl.trim();
      const str = (identifierStr || "").toLowerCase();

      // 1. WhatsApp
      if (str.includes("whatsapp") || str.includes("whats") || str.includes("wa.me") || str.includes("wsp") || str.includes("wapp")) {
        return SOCIAL_LINKS.whatsapp;
      }
      // 2. Instagram
      if (str.includes("instagram") || str.includes("insta") || str.includes("ig")) {
        return SOCIAL_LINKS.instagram;
      }
      // 3. Spotify
      if (str.includes("spotify") || str.includes("spoti") || str.includes("music")) {
        return SOCIAL_LINKS.spotify;
      }

      return null;
    }

    function pulseObjectScale(obj) {
      try {
        if (!obj || !obj.scale) return;
        const orig = { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z };
        obj.scale.set(orig.x * 1.3, orig.y * 1.3, orig.z * 1.3);
        setTimeout(() => {
          if (obj && obj.scale) obj.scale.set(orig.x, orig.y, orig.z);
        }, 220);
      } catch (e) {}
    }

    function handleTouchOnIcons(world, clientX, clientY, targetEid) {
      const threeState = world.three;
      if (!threeState) return;

      const camera = threeState.activeCamera;
      const renderer = threeState.renderer;
      const canvas = renderer?.domElement || document.querySelector("canvas");
      if (!camera || !canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const entityToObject = threeState.entityToObject;
      if (!entityToObject) return;

      const logoObjects = [];
      for (const [eid, obj] of entityToObject.entries()) {
        if (!obj || obj.visible === false) continue;
        let gltfSrc = "";
        try {
          if (ECS.GltfModel && ECS.GltfModel.has(world, eid)) {
            const c = ECS.GltfModel.get(world, eid);
            gltfSrc = c.src || c.url || "";
          }
        } catch (e) {}
        const fullId = (obj.name || "" + " " + gltfSrc).toLowerCase();
        if (
          !fullId.includes("snoop") &&
          !fullId.includes("plane") &&
          !fullId.includes("plano") &&
          !fullId.includes("video") &&
          !fullId.includes("camera") &&
          !fullId.includes("light")
        ) {
          let url = getUrlFromIdentifier(fullId);
          if (!url && ECS.Ui && ECS.Ui.has(world, eid)) {
            const posX = obj.position?.x || 0;
            if (posX < -0.12) url = SOCIAL_LINKS.whatsapp;
            else if (posX > 0.12) url = SOCIAL_LINKS.spotify;
            else url = SOCIAL_LINKS.instagram;
          }
          if (url) {
            logoObjects.push({ eid, obj, url });
          }
        }
      }

      // 1. Raycast 3D exacto con Three.js
      try {
        const THREE = window.THREE || camera.constructor?.prototype ? camera.constructor : null;
        const RaycasterCtor = THREE?.Raycaster || window.THREE?.Raycaster || camera.raycaster?.constructor;
        if (RaycasterCtor) {
          const raycaster = new RaycasterCtor();
          const mouse = {
            x: ((clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
            y: -((clientY - canvasRect.top) / canvasRect.height) * 2 + 1
          };
          raycaster.setFromCamera(mouse, camera);

          const meshesToTest = [];
          const meshToLogoMap = new Map();

          for (const item of logoObjects) {
            item.obj.traverse((child) => {
              if (child.isMesh) {
                meshesToTest.push(child);
                meshToLogoMap.set(child, item);
              }
            });
          }

          const intersects = raycaster.intersectObjects(meshesToTest, false);
          if (intersects && intersects.length > 0) {
            const hitMesh = intersects[0].object;
            const matchedLogo = meshToLogoMap.get(hitMesh);
            if (matchedLogo) {
              console.log("[open-url-button] Raycast 3D exacto:", matchedLogo.url);
              pulseObjectScale(matchedLogo.obj);
              navigateToUrl(matchedLogo.url);
              return;
            }
          }
        }
      } catch (rayErr) {}

      // 2. Proyección 2D en pantalla (Fallback por proximidad)
      let closestMatch = null;
      let minDistance = 120;

      for (const item of logoObjects) {
        const obj = item.obj;
        let objDist = Infinity;

        try {
          const Vector3Class = camera.position?.constructor;
          if (Vector3Class && camera.project) {
            const worldPos = new Vector3Class();
            if (obj.getWorldPosition) obj.getWorldPosition(worldPos);
            else if (obj.matrixWorld) worldPos.setFromMatrixPosition(obj.matrixWorld);

            const screenPoint = worldPos.clone();
            camera.project(screenPoint);

            if (screenPoint.z > -1 && screenPoint.z < 1) {
              const screenX = ((screenPoint.x + 1) / 2) * canvasRect.width + canvasRect.left;
              const screenY = ((-screenPoint.y + 1) / 2) * canvasRect.height + canvasRect.top;
              objDist = Math.hypot(screenX - clientX, screenY - clientY);
            }
          }
        } catch (e) {}

        if (objDist < minDistance) {
          minDistance = objDist;
          closestMatch = { obj, url: item.url, dist: objDist };
        }
      }

      if (closestMatch && closestMatch.url) {
        console.log("[open-url-button] Proximidad 2D:", closestMatch.url, "(" + Math.round(closestMatch.dist) + "px)");
        pulseObjectScale(closestMatch.obj);
        navigateToUrl(closestMatch.url);
      }
    }

    try {
      ECS.registerComponent({
        name: "open-url-button",
        schema: {
          url: ECS.string,
          target: ECS.string
        },
        schemaDefaults: {
          url: "",
          target: "_blank"
        },
        add: (world, component) => {
          const act = () => {
            const obj = world.three?.entityToObject?.get(component.eid);
            const url = getUrlFromIdentifier(obj?.name || "", component.schema?.url);
            if (url) {
              if (obj) pulseObjectScale(obj);
              navigateToUrl(url);
            }
          };
          world.events.addListener(component.eid, ECS.input.UI_CLICK, act);
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, act);
          world.events.addListener(component.eid, "click", act);
        }
      });
    } catch (e) {}

    try {
      ECS.registerComponent({
        name: "open-whatsapp",
        add: (world, component) => {
          const act = () => navigateToUrl(SOCIAL_LINKS.whatsapp);
          world.events.addListener(component.eid, ECS.input.UI_CLICK, act);
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, act);
          world.events.addListener(component.eid, "click", act);
        }
      });
      ECS.registerComponent({
        name: "open-instagram",
        add: (world, component) => {
          const act = () => navigateToUrl(SOCIAL_LINKS.instagram);
          world.events.addListener(component.eid, ECS.input.UI_CLICK, act);
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, act);
          world.events.addListener(component.eid, "click", act);
        }
      });
      ECS.registerComponent({
        name: "open-spotify",
        add: (world, component) => {
          const act = () => navigateToUrl(SOCIAL_LINKS.spotify);
          world.events.addListener(component.eid, ECS.input.UI_CLICK, act);
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, act);
          world.events.addListener(component.eid, "click", act);
        }
      });
    } catch (e) {}

    let isOpenUrlGlobalAttached = false;
    try {
      ECS.registerComponent({
        name: "open-url-global-behavior",
        add: (world) => {
          if (isOpenUrlGlobalAttached) return;
          isOpenUrlGlobalAttached = true;

          world.events.addListener(world.events.globalId, ECS.input.SCREEN_TOUCH_START, (event) => {
            if (event?.position) {
              handleTouchOnIcons(world, event.position.x, event.position.y, event.target);
            }
          });

          const canvas = world.three?.renderer?.domElement || document.querySelector("canvas") || window;
          canvas.addEventListener("touchend", (e) => {
            if (e.changedTouches && e.changedTouches.length > 0) {
              handleTouchOnIcons(world, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
          }, { passive: true });

          canvas.addEventListener("click", (e) => {
            handleTouchOnIcons(world, e.clientX, e.clientY);
          });
        }
      });
    } catch (e) {}

    // =========================================================================
    // 2. ALTERNANCIA DE ANIMACIONES DEL PERSONAJE SNOOP (character-animation-toggle.ts)
    // =========================================================================
    let lastAvatarToggleTime = 0;
    const CLIPS = [
      "Bailecito Hip Hop",
      "Bailecito Tranquilito"
    ];
    let currentClipIndex = 0;

    function toggleCharacterAnimation(world, eid) {
      const now = Date.now();
      if (now - lastAvatarToggleTime < 450) return;
      lastAvatarToggleTime = now;

      currentClipIndex = (currentClipIndex + 1) % CLIPS.length;
      const nextClip = CLIPS[currentClipIndex];

      console.log("[character-animation-toggle] Cambiando baile de Snoop a:", nextClip);

      let targetEid = eid;
      if (!targetEid) {
        for (const id of world.allEntities) {
          if (ECS.GltfModel && ECS.GltfModel.has(world, id)) {
            targetEid = id;
            break;
          }
        }
      }

      if (targetEid && ECS.GltfModel && ECS.GltfModel.has(world, targetEid)) {
        try {
          ECS.GltfModel.mutate(world, targetEid, (cursor) => {
            cursor.animationClip = nextClip;
            cursor.loop = true;
            cursor.paused = false;
          });
        } catch (err) {
          console.error("[character-animation-toggle] Error al mutar animacion:", err);
        }
      }
    }

    try {
      ECS.registerComponent({
        name: "character-animation-toggle",
        schema: {
          clip1: ECS.string,
          clip2: ECS.string
        },
        schemaDefaults: {
          clip1: "Bailecito Hip Hop",
          clip2: "Bailecito Tranquilito"
        },
        add: (world, component) => {
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, () => {
            toggleCharacterAnimation(world, component.eid);
          });
          world.events.addListener(component.eid, ECS.input.UI_CLICK, () => {
            toggleCharacterAnimation(world, component.eid);
          });
          world.events.addListener(component.eid, "click", () => {
            toggleCharacterAnimation(world, component.eid);
          });
        }
      });
    } catch (e) {}

    try {
      ECS.registerComponent({
        name: "AvatarAnimationComponent",
        schema: {
          clip1: ECS.string,
          clip2: ECS.string
        },
        schemaDefaults: {
          clip1: "Bailecito Hip Hop",
          clip2: "Bailecito Tranquilito"
        },
        add: (world, component) => {
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, () => {
            toggleCharacterAnimation(world, component.eid);
          });
          world.events.addListener(component.eid, ECS.input.UI_CLICK, () => {
            toggleCharacterAnimation(world, component.eid);
          });
          world.events.addListener(component.eid, "click", () => {
            toggleCharacterAnimation(world, component.eid);
          });
        }
      });
    } catch (e) {}

    try {
      ECS.registerComponent({
        name: "character-toggle",
        add: (world, component) => {
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, () => {
            toggleCharacterAnimation(world, component.eid);
          });
          world.events.addListener(component.eid, ECS.input.UI_CLICK, () => {
            toggleCharacterAnimation(world, component.eid);
          });
          world.events.addListener(component.eid, "click", () => {
            toggleCharacterAnimation(world, component.eid);
          });
        }
      });
    } catch (e) {}

    let isCharGlobalAttached = false;
    try {
      ECS.registerComponent({
        name: "character-animation-global-behavior",
        add: (world) => {
          if (isCharGlobalAttached) return;
          isCharGlobalAttached = true;

          const findAvatarEid = () => {
            const threeState = world.three;
            if (!threeState?.entityToObject) return null;

            for (const [eid, obj] of threeState.entityToObject.entries()) {
              let gltfSrc = "";
              try {
                if (ECS.GltfModel && ECS.GltfModel.has(world, eid)) {
                  const cursor = ECS.GltfModel.get(world, eid);
                  gltfSrc = cursor.src || cursor.url || "";
                }
              } catch (e) {}

              const objName = (obj?.name || "").toLowerCase();
              const fullId = (objName + " " + gltfSrc).toLowerCase();
              if (fullId.includes("snoop") || (ECS.GltfModel && ECS.GltfModel.has(world, eid))) {
                return eid;
              }
            }
            return null;
          };

          const checkAvatarRaycast = (clientX, clientY, targetEid) => {
            const avatarEid = findAvatarEid();
            if (!avatarEid) return;

            if (targetEid === avatarEid) {
              toggleCharacterAnimation(world, avatarEid);
              return;
            }

            const threeState = world.three;
            if (!threeState) return;
            const avatarObj = threeState.entityToObject?.get(avatarEid);
            const camera = threeState.activeCamera;
            const canvas = threeState.renderer?.domElement || document.querySelector("canvas");
            if (!avatarObj || !camera || !canvas || avatarObj.visible === false) return;

            const canvasRect = canvas.getBoundingClientRect();

            try {
              const THREE = window.THREE || camera.constructor?.prototype ? camera.constructor : null;
              const RaycasterCtor = THREE?.Raycaster || window.THREE?.Raycaster;
              if (RaycasterCtor) {
                const raycaster = new RaycasterCtor();
                const mouse = {
                  x: ((clientX - canvasRect.left) / canvasRect.width) * 2 - 1,
                  y: -((clientY - canvasRect.top) / canvasRect.height) * 2 + 1
                };
                raycaster.setFromCamera(mouse, camera);

                const meshes = [];
                avatarObj.traverse((child) => {
                  if (child.isMesh) meshes.push(child);
                });

                const intersects = raycaster.intersectObjects(meshes, false);
                if (intersects && intersects.length > 0) {
                  console.log("[character-animation-toggle] Raycast 3D impacto en Snoop.");
                  toggleCharacterAnimation(world, avatarEid);
                  return;
                }
              }
            } catch (rayErr) {}

            let minDistance = Infinity;
            try {
              const Vector3Class = camera.position?.constructor;
              if (Vector3Class && camera.project) {
                const worldPos = new Vector3Class();
                if (avatarObj.getWorldPosition) avatarObj.getWorldPosition(worldPos);
                else if (avatarObj.matrixWorld) worldPos.setFromMatrixPosition(avatarObj.matrixWorld);

                const points = [
                  worldPos.clone(),
                  worldPos.clone().add(new Vector3Class(0, 0.25, 0)),
                  worldPos.clone().add(new Vector3Class(0, 0.5, 0))
                ];

                for (const pt of points) {
                  camera.project(pt);
                  if (pt.z > -1 && pt.z < 1) {
                    const screenX = ((pt.x + 1) / 2) * canvasRect.width + canvasRect.left;
                    const screenY = ((-pt.y + 1) / 2) * canvasRect.height + canvasRect.top;
                    const dist = Math.hypot(screenX - clientX, screenY - clientY);
                    if (dist < minDistance) minDistance = dist;
                  }
                }
              }
            } catch (e) {}

            if (minDistance <= 130) {
              console.log("[character-animation-toggle] Proximidad 2D impacto en Snoop (" + Math.round(minDistance) + "px)");
              toggleCharacterAnimation(world, avatarEid);
            }
          };

          world.events.addListener(world.events.globalId, ECS.input.SCREEN_TOUCH_START, (event) => {
            if (event?.position) {
              checkAvatarRaycast(event.position.x, event.position.y, event.target);
            }
          });

          const canvas = world.three?.renderer?.domElement || document.querySelector("canvas") || window;
          canvas.addEventListener("touchend", (e) => {
            if (e.changedTouches && e.changedTouches.length > 0) {
              checkAvatarRaycast(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
          }, { passive: true });

          canvas.addEventListener("click", (e) => {
            checkAvatarRaycast(e.clientX, e.clientY);
          });
        }
      });
    } catch (e) {}

    // =========================================================================
    // 3. CONTROL INTEGRAL DE VIDEO (video-toggle-button.ts)
    // =========================================================================
    let lastToggleTime = 0;
    let isVideoPlaying = false;
    let uiFloatingBtn = null;

    function updateUiFloatingBtn(playing) {
      if (!uiFloatingBtn) return;
      if (playing) {
        uiFloatingBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1.5" /><rect x="14" y="4" width="4" height="16" rx="1.5" /></svg>';
        uiFloatingBtn.style.backgroundColor = "rgba(15, 23, 42, 0.85)";
        uiFloatingBtn.setAttribute("title", "Pausar Video");
      } else {
        uiFloatingBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 3px;"><polygon points="5,3 19,12 5,21" /></svg>';
        uiFloatingBtn.style.backgroundColor = "rgba(173, 80, 255, 0.85)";
        uiFloatingBtn.setAttribute("title", "Reproducir Video");
      }
    }

    function findVideoElement(world) {
      const threeState = world.three;
      if (threeState?.entityToObject) {
        for (const [_, obj] of threeState.entityToObject.entries()) {
          let found = null;
          obj.traverse((child) => {
            if (child.material?.map?.image instanceof HTMLVideoElement) {
              found = child.material.map.image;
            }
          });
          if (found) return found;
        }
      }

      const videos = Array.from(document.querySelectorAll("video"));
      const matched = videos.find(v => {
        const s = v.src || v.querySelector("source")?.src || "";
        return s.includes("Video") || s.includes(".mp4");
      });
      return matched || videos[0] || null;
    }

    function findVideoPlaneEid(world) {
      const threeState = world.three;
      if (!threeState?.entityToObject) return null;

      const VideoControls = ECS.VideoControls;
      for (const [eid, obj] of threeState.entityToObject.entries()) {
        const objName = (obj?.name || "").toLowerCase();
        if (objName.includes("plano") || objName.includes("plane") || (VideoControls && VideoControls.has(world, eid))) {
          return eid;
        }
      }
      return null;
    }

    function playVideo(world) {
      const planeEid = findVideoPlaneEid(world);
      const VideoControls = ECS.VideoControls;
      if (planeEid && VideoControls && VideoControls.has(world, planeEid)) {
        try {
          VideoControls.mutate(world, planeEid, (cursor) => {
            cursor.paused = false;
          });
        } catch (e) {}
      }

      const vid = findVideoElement(world);
      if (vid) {
        vid.muted = false;
        vid.play().catch(() => {
          vid.muted = true;
          vid.play().then(() => {
            const unlockAudio = () => {
              vid.muted = false;
              window.removeEventListener("touchstart", unlockAudio);
              window.removeEventListener("click", unlockAudio);
            };
            window.addEventListener("touchstart", unlockAudio, { once: true });
            window.addEventListener("click", unlockAudio, { once: true });
          });
        });
      }

      isVideoPlaying = true;
      updateUiFloatingBtn(true);
    }

    function pauseVideo(world) {
      const planeEid = findVideoPlaneEid(world);
      const VideoControls = ECS.VideoControls;
      if (planeEid && VideoControls && VideoControls.has(world, planeEid)) {
        try {
          VideoControls.mutate(world, planeEid, (cursor) => {
            cursor.paused = true;
          });
        } catch (e) {}
      }

      const vid = findVideoElement(world);
      if (vid) {
        vid.pause();
      }

      isVideoPlaying = false;
      updateUiFloatingBtn(false);
    }

    function toggleVideo(world) {
      const now = Date.now();
      if (now - lastToggleTime < 400) return;
      lastToggleTime = now;

      if (isVideoPlaying) {
        pauseVideo(world);
      } else {
        playVideo(world);
      }
    }

    function createFloatingButton(world) {
      if (document.getElementById("video-control-toggle-btn")) {
        uiFloatingBtn = document.getElementById("video-control-toggle-btn");
        return;
      }

      uiFloatingBtn = document.createElement("button");
      uiFloatingBtn.id = "video-control-toggle-btn";
      uiFloatingBtn.setAttribute("aria-label", "Reproducir o Pausar Video");

      Object.assign(uiFloatingBtn.style, {
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        backgroundColor: "rgba(173, 80, 255, 0.85)",
        backdropFilter: "blur(8px)",
        webkitBackdropFilter: "blur(8px)",
        border: "2px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        color: "#FFFFFF",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "9999",
        outline: "none",
        transition: "transform 0.15s ease, background-color 0.2s ease",
        userSelect: "none",
        webkitUserSelect: "none",
        touchAction: "manipulation"
      });

      updateUiFloatingBtn(false);

      uiFloatingBtn.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        if (uiFloatingBtn) uiFloatingBtn.style.transform = "scale(0.92)";
      });

      const resetScale = () => {
        if (uiFloatingBtn) uiFloatingBtn.style.transform = "scale(1)";
      };
      uiFloatingBtn.addEventListener("pointerup", resetScale);
      uiFloatingBtn.addEventListener("pointercancel", resetScale);

      uiFloatingBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleVideo(world);
      });

      document.body.appendChild(uiFloatingBtn);
    }

    try {
      ECS.registerComponent({
        name: "video-toggle-button",
        add: (world, component) => {
          world.events.addListener(component.eid, ECS.input.UI_CLICK, () => {
            toggleVideo(world);
          });
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, () => {
            toggleVideo(world);
          });
          world.events.addListener(component.eid, "click", () => {
            toggleVideo(world);
          });
        }
      });
    } catch (e) {}

    try {
      ECS.registerComponent({
        name: "video-button",
        add: (world, component) => {
          world.events.addListener(component.eid, ECS.input.UI_CLICK, () => {
            toggleVideo(world);
          });
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, () => {
            toggleVideo(world);
          });
          world.events.addListener(component.eid, "click", () => {
            toggleVideo(world);
          });
        }
      });
    } catch (e) {}

    try {
      ECS.registerComponent({
        name: "VideoControlComponent",
        schema: {
          targetName: ECS.string,
          videoSrc: ECS.string
        },
        schemaDefaults: {
          targetName: "TarjetaProfesional",
          videoSrc: "assets/Video_.mp4"
        },
        add: (world, component) => {
          world.events.addListener(component.eid, ECS.input.UI_CLICK, () => {
            toggleVideo(world);
          });
          world.events.addListener(component.eid, ECS.input.SCREEN_TOUCH_START, () => {
            toggleVideo(world);
          });
          world.events.addListener(component.eid, "click", () => {
            toggleVideo(world);
          });
        }
      });
    } catch (e) {}

    let isVideoBehaviorAttached = false;
    try {
      ECS.registerComponent({
        name: "video-global-behavior",
        add: (world) => {
          if (isVideoBehaviorAttached) return;
          isVideoBehaviorAttached = true;

          createFloatingButton(world);

          setTimeout(() => {
            pauseVideo(world);
          }, 300);

          world.events.addListener(world.events.globalId, ECS.input.UI_CLICK, (event) => {
            if (event?.target) {
              const obj = world.three?.entityToObject?.get(event.target);
              const objName = (obj?.name || "").toLowerCase();
              if (
                objName.includes("button") ||
                objName.includes("icon") ||
                objName.includes("text") ||
                objName.includes("plano") ||
                objName.includes("plane")
              ) {
                toggleVideo(world);
              }
            }
          });

          window.addEventListener("xrimagelost", () => {
            if (isVideoPlaying) {
              pauseVideo(world);
            }
          });
        }
      });
    } catch (e) {}

    // =========================================================================
    // 4. INICIALIZACIÓN DE LA ESCENA ECS (sceneData)
    // =========================================================================
    try {
      const sceneData = JSON.parse("{\"objects\":{\"47699d9e-18a5-4f88-a4f9-b8be92e8f74a\":{\"id\":\"47699d9e-18a5-4f88-a4f9-b8be92e8f74a\",\"name\":\"Ambient Light\",\"light\":{\"type\":\"ambient\"},\"position\":[10,5,5],\"rotation\":[0,0,0,1],\"scale\":[1,1,1],\"geometry\":null,\"material\":null,\"components\":{},\"parentId\":\"88453035-dc0f-486d-868a-8ff7c2fda864\",\"order\":0.4038940050501252},\"a608ddd9-9379-464d-966f-5d8d8674c83c\":{\"id\":\"a608ddd9-9379-464d-966f-5d8d8674c83c\",\"name\":\"Camera\",\"camera\":{\"type\":\"perspective\",\"xr\":{\"desktop\":\"AR\",\"xrCameraType\":\"world\",\"headset\":\"disabled\",\"phone\":\"AR\",\"world\":{\"disableWorldTracking\":true}}},\"position\":[0.03637070092622008,0.3428902101473694,0.9377429834050228],\"rotation\":[0.00044368872331410124,0.9659425615285845,-0.25875089860082223,0.0016563336561801576],\"scale\":[1,1,1],\"geometry\":null,\"material\":null,\"components\":{},\"parentId\":\"88453035-dc0f-486d-868a-8ff7c2fda864\",\"order\":1.0308214152219775},\"ac1989e3-3b71-49e2-a05f-e682aeb18c36\":{\"id\":\"ac1989e3-3b71-49e2-a05f-e682aeb18c36\",\"name\":\"Directional Light\",\"light\":{\"intensity\":1,\"type\":\"directional\"},\"position\":[20,50,10],\"rotation\":[0,0,0,1],\"scale\":[1,1,1],\"geometry\":null,\"material\":null,\"components\":{},\"parentId\":\"88453035-dc0f-486d-868a-8ff7c2fda864\",\"order\":0.6644431107322474},\"d3095e1b-bea4-4bc3-a74c-2441e054fe7b\":{\"id\":\"d3095e1b-bea4-4bc3-a74c-2441e054fe7b\",\"name\":\"Objetivo de la imagen\",\"imageTarget\":{\"name\":\"TarjetaProfesional\"},\"position\":[-0.05458437117628462,0.06312800072308819,-0.6740009820787723],\"rotation\":[-0.7071067811865475,0,0,0.7071067811865476],\"scale\":[1,1,1],\"geometry\":null,\"material\":null,\"components\":{\"comp-open-url-global\":{\"id\":\"comp-open-url-global\",\"name\":\"open-url-global-behavior\",\"parameters\":{}},\"comp-video-global\":{\"id\":\"comp-video-global\",\"name\":\"video-global-behavior\",\"parameters\":{}}},\"parentId\":\"88453035-dc0f-486d-868a-8ff7c2fda864\",\"order\":6.373509013138244},\"ccf8ac42-b656-4264-84ad-43c579b75198\":{\"id\":\"ccf8ac42-b656-4264-84ad-43c579b75198\",\"name\":\"Snoop_Final.glb\",\"gltfModel\":{\"src\":{\"type\":\"asset\",\"asset\":\"assets/Snoop_Final.glb\"},\"animationClip\":\"Bailecito Hip Hop\",\"loop\":true,\"collider\":true},\"position\":[-0.014991475952302658,0.030572794466398046,0.04999999999999996],\"rotation\":[0.7088707591934409,0,0,0.7053383916677971],\"scale\":[0.35,0.35,0.35],\"geometry\":null,\"material\":null,\"components\":{\"comp-char-anim-global\":{\"id\":\"comp-char-anim-global\",\"name\":\"character-animation-global-behavior\",\"parameters\":{}},\"comp-char-anim\":{\"id\":\"comp-char-anim\",\"name\":\"character-animation-toggle\",\"parameters\":{}},\"comp-avatar-anim-01\":{\"id\":\"comp-avatar-anim-01\",\"name\":\"AvatarAnimationComponent\",\"parameters\":{\"clip1\":\"Bailecito Hip Hop\",\"clip2\":\"Bailecito Tranquilito\"}},\"character-toggle\":{}},\"parentId\":\"d3095e1b-bea4-4bc3-a74c-2441e054fe7b\",\"order\":4.551449927932822},\"f68f517b-4d60-4960-a637-0da9d937912a\":{\"id\":\"f68f517b-4d60-4960-a637-0da9d937912a\",\"name\":\"Plano\",\"geometry\":{\"type\":\"plane\",\"width\":1,\"height\":1},\"material\":{\"type\":\"basic\",\"color\":\"#FFFFFF\",\"side\":\"double\",\"textureSrc\":{\"type\":\"asset\",\"asset\":\"assets/Video_.mp4\"}},\"videoControls\":{\"volume\":0.2},\"position\":[0.007523595137484747,0.49964553775287757,0.43487265642658285],\"rotation\":[0.7071067811865475,0,0,0.7071067811865476],\"scale\":[0.8344912431725956,0.7792024619622739,0.55],\"components\":{\"comp-video-toggle\":{\"id\":\"comp-video-toggle\",\"name\":\"video-toggle-button\",\"parameters\":{}}},\"parentId\":\"d3095e1b-bea4-4bc3-a74c-2441e054fe7b\",\"order\":7.399586142219819},\"f9736927-15fb-4047-bfa2-87fd5ac7ffe3\":{\"id\":\"f9736927-15fb-4047-bfa2-87fd5ac7ffe3\",\"name\":\"Button\",\"ui\":{\"type\":\"3d\",\"width\":100,\"height\":36,\"background\":\"#ad50ff\",\"borderRadius\":18,\"flexDirection\":\"row\",\"backgroundOpacity\":1,\"padding\":\"10\",\"gap\":\"6\",\"alignItems\":\"center\",\"justifyContent\":\"center\"},\"position\":[0,0,0.05],\"rotation\":[0,0,0,1],\"scale\":[0.4,0.4,0.4],\"geometry\":null,\"material\":null,\"components\":{\"video-button\":{},\"comp-video-toggle-btn\":{\"id\":\"comp-video-toggle-btn\",\"name\":\"video-toggle-button\",\"parameters\":{}}},\"parentId\":\"f68f517b-4d60-4960-a637-0da9d937912a\",\"order\":5.781078692337625},\"6fe0dd7e-beef-49aa-be50-c33b1e7efd2e\":{\"id\":\"6fe0dd7e-beef-49aa-be50-c33b1e7efd2e\",\"name\":\"Icon\",\"ui\":{\"width\":16,\"height\":16,\"image\":{\"type\":\"url\",\"url\":\"https://cdn.8thwall.com/web/assets/sprites/8w-icon-m8j35d7y.png\"},\"backgroundOpacity\":1},\"position\":[-0.323,0,0],\"rotation\":[0,0,0,1],\"scale\":[1,1,1],\"geometry\":null,\"material\":null,\"components\":{},\"parentId\":\"f9736927-15fb-4047-bfa2-87fd5ac7ffe3\",\"order\":0.014952728539884108},\"c9c1804d-2116-4eee-88c2-ee675ff0e32e\":{\"id\":\"c9c1804d-2116-4eee-88c2-ee675ff0e32e\",\"name\":\"Text\",\"ui\":{\"width\":50,\"height\":14,\"text\":\"Pausa\",\"color\":\"#ffffff\",\"fontSize\":16},\"position\":[0,0,0],\"rotation\":[0,0,0,1],\"scale\":[1,1,1],\"geometry\":null,\"material\":null,\"components\":{},\"parentId\":\"f9736927-15fb-4047-bfa2-87fd5ac7ffe3\",\"order\":1.2768869785494683},\"b1111111-wapp-4000-8000-000000000001\":{\"id\":\"b1111111-wapp-4000-8000-000000000001\",\"name\":\"WhatsApp\",\"ui\":{\"type\":\"3d\",\"width\":36,\"height\":36,\"borderRadius\":18,\"background\":\"#25D366\",\"backgroundOpacity\":0.2},\"position\":[-0.24245649538101038,-0.3997994183059203,0.05017281760330736],\"rotation\":[0,0,0,1],\"scale\":[0.2,0.2,0.2],\"geometry\":null,\"material\":null,\"components\":{\"open-whatsapp\":{},\"comp-wapp\":{\"id\":\"comp-wapp\",\"name\":\"open-url-button\",\"parameters\":{\"url\":\"https://wa.me/573154445000\"}}},\"parentId\":\"d3095e1b-bea4-4bc3-a74c-2441e054fe7b\",\"order\":8.1},\"b2222222-insta-4000-8000-000000000002\":{\"id\":\"b2222222-insta-4000-8000-000000000002\",\"name\":\"Instagram\",\"ui\":{\"type\":\"3d\",\"width\":36,\"height\":36,\"borderRadius\":18,\"background\":\"#E1306C\",\"backgroundOpacity\":0.2},\"position\":[0,-0.42,0.05],\"rotation\":[0,0,0,1],\"scale\":[0.2,0.2,0.2],\"geometry\":null,\"material\":null,\"components\":{\"open-instagram\":{},\"comp-insta\":{\"id\":\"comp-insta\",\"name\":\"open-url-button\",\"parameters\":{\"url\":\"https://www.instagram.com/jeronimoduque423/\"}}},\"parentId\":\"d3095e1b-bea4-4bc3-a74c-2441e054fe7b\",\"order\":8.2},\"b3333333-spoti-4000-8000-000000000003\":{\"id\":\"b3333333-spoti-4000-8000-000000000003\",\"name\":\"Spotify\",\"ui\":{\"type\":\"3d\",\"width\":36,\"height\":36,\"borderRadius\":18,\"background\":\"#1DB954\",\"backgroundOpacity\":0.2},\"position\":[0.26,-0.42,0.05],\"rotation\":[0,0,0,1],\"scale\":[0.2,0.2,0.2],\"geometry\":null,\"material\":null,\"components\":{\"open-spotify\":{},\"comp-spoti\":{\"id\":\"comp-spoti\",\"name\":\"open-url-button\",\"parameters\":{\"url\":\"https://open.spotify.com/user/o0gt0327bv62udbgzyjh0qomt?si=076634e60fe84ede\"}}},\"parentId\":\"d3095e1b-bea4-4bc3-a74c-2441e054fe7b\",\"order\":8.3}},\"spaces\":{\"88453035-dc0f-486d-868a-8ff7c2fda864\":{\"id\":\"88453035-dc0f-486d-868a-8ff7c2fda864\",\"name\":\"Default Space\",\"activeCamera\":\"a608ddd9-9379-464d-966f-5d8d8674c83c\"}},\"entrySpaceId\":\"88453035-dc0f-486d-868a-8ff7c2fda864\"}");
      delete sceneData.history;
      delete sceneData.historyVersion;
      ECS.application.init(sceneData);
      console.log("[TarjetaProfesional] Escena 8th Wall iniciada correctamente.");
    } catch (e) {
      console.error("Error during ECS application init:", e);
    }
  })();
})();
