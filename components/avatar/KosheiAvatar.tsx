"use client";

import { useEffect, useRef } from "react";

interface AvatarProps {
  isSpeaking: boolean;
}

export default function KosheiAvatar({ isSpeaking }: AvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    renderer: any;
    scene: any;
    camera: any;
    vrm: any;
    animFrame: number;
    clock: any;
    mouthOpen: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    vrm: null,
    animFrame: 0,
    clock: null,
    mouthOpen: 0,
  });

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    let THREE: any, GLTFLoader: any, VRMLoaderPlugin: any;

    async function init() {
      // Load Three.js modules
      THREE = await import("three" as any).catch(() => null);
      if (!THREE) {
        // Fallback: load from CDN via script tags
        return loadFromCDN();
      }
      setupScene(THREE);
    }

    function loadFromCDN() {
      // Add scripts dynamically
      const scripts = [
        { src: "/three_module.js", global: "THREE" },
        { src: "/GLTFLoader.js", global: null },
        { src: "/three-vrm_module.js", global: null },
      ];

      let loaded = 0;
      scripts.forEach((s) => {
        const script = document.createElement("script");
        script.src = s.src;
        script.type = "module";
        script.onload = () => {
          loaded++;
          if (loaded === scripts.length) {
            setTimeout(() => setupSceneGlobal(), 500);
          }
        };
        document.head.appendChild(script);
      });
    }

    function setupSceneGlobal() {
      const T = (window as any).THREE;
      if (!T) return;
      setupScene(T);
    }

    function setupScene(T: any) {
      const state = stateRef.current;
      const w = mount.clientWidth;
      const h = mount.clientHeight;

      // Renderer
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputColorSpace = T.SRGBColorSpace || T.sRGBEncoding;
      mount.appendChild(renderer.domElement);
      state.renderer = renderer;

      // Scene
      const scene = new T.Scene();
      state.scene = scene;

      // Camera - focused on face
      const camera = new T.PerspectiveCamera(30, w / h, 0.1, 20);
      camera.position.set(0, 1.4, 1.8);
      camera.lookAt(0, 1.3, 0);
      state.camera = camera;

      // Lighting
      const ambient = new T.AmbientLight(0xffffff, 0.6);
      scene.add(ambient);
      const dirLight = new T.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(1, 2, 2);
      scene.add(dirLight);
      const fillLight = new T.DirectionalLight(0x8888ff, 0.3);
      fillLight.position.set(-1, 0, 1);
      scene.add(fillLight);

      // Clock
      state.clock = new T.Clock();

      // Load VRM
      loadVRM(T, scene, state);

      // Start render loop
      animate(T, state);
    }

    function loadVRM(T: any, scene: any, state: any) {
      const loader = new ((window as any).THREE?.GLTFLoader || T.GLTFLoader || {})();
      if (!loader.register) return; // fallback if not available

      const VRMPlugin = (window as any).THREE_VRM?.VRMLoaderPlugin;
      if (VRMPlugin) loader.register((p: any) => new VRMPlugin(p));

      loader.load(
        "/Youko.vrm",
        (gltf: any) => {
          const vrm = gltf.userData.vrm;
          if (!vrm) return;
          scene.add(vrm.scene);
          // Rotate to face camera
          vrm.scene.rotation.y = Math.PI;
          state.vrm = vrm;
        },
        undefined,
        (err: any) => console.error("VRM load error:", err)
      );
    }

    function animate(T: any, state: any) {
      state.animFrame = requestAnimationFrame(() => animate(T, state));
      const delta = state.clock?.getDelta() || 0.016;

      if (state.vrm) {
        // Mouth animation when speaking
        const targetMouth = isSpeaking ? 0.6 + Math.sin(Date.now() * 0.01) * 0.3 : 0;
        state.mouthOpen += (targetMouth - state.mouthOpen) * 0.15;

        try {
          const exp = state.vrm.expressionManager;
          if (exp) {
            exp.setValue("aa", state.mouthOpen);
          }
        } catch {}

        // Subtle idle head movement
        if (state.vrm.scene) {
          state.vrm.scene.rotation.y = Math.PI + Math.sin(Date.now() * 0.0005) * 0.05;
        }

        state.vrm.update(delta);
      }

      state.renderer?.render(state.scene, state.camera);
    }

    init();

    return () => {
      cancelAnimationFrame(stateRef.current.animFrame);
      if (stateRef.current.renderer) {
        stateRef.current.renderer.dispose();
        if (mount.contains(stateRef.current.renderer.domElement)) {
          mount.removeChild(stateRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  // Update speaking state without remounting
  useEffect(() => {
    // isSpeaking is read directly in animate loop via closure ref
  }, [isSpeaking]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "320px",
        borderRadius: "1rem",
        overflow: "hidden",
        background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 100%)",
      }}
    />
  );
}
