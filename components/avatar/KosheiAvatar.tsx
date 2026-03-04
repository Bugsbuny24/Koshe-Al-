"use client";

import { useEffect, useRef } from "react";

interface AvatarProps {
  isSpeaking: boolean;
}

export default function KosheiAvatar({ isSpeaking }: AvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isSpeakingRef = useRef(isSpeaking);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    }

    async function init() {
      try {
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        );
        // UMD build: GLTFLoader'ı THREE global'ine attach eder
        await loadScript(
          "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"
        );
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@0.6.7/lib/three-vrm.js"
        );

        const T = (window as any).THREE;
        if (!T) throw new Error("THREE not loaded");
        if (!T.GLTFLoader) throw new Error("GLTFLoader not on THREE");

        setupScene(T, mount);
      } catch (err) {
        console.error("Avatar init error:", err);
        mount.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:13px;">Avatar yüklenemedi</div>`;
      }
    }

    function setupScene(T: any, container: HTMLDivElement) {
      const w = container.clientWidth;
      const h = container.clientHeight;

      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(30, w / h, 0.1, 20);
      camera.position.set(0, 1.35, 1.6);
      camera.lookAt(0, 1.3, 0);

      scene.add(new T.AmbientLight(0xffffff, 0.7));
      const dir = new T.DirectionalLight(0xffffff, 0.8);
      dir.position.set(1, 2, 2);
      scene.add(dir);
      const fill = new T.DirectionalLight(0x8899ff, 0.3);
      fill.position.set(-1, 0, 1);
      scene.add(fill);

      let vrm: any = null;
      let mouthOpen = 0;
      let animFrame = 0;
      const clock = new T.Clock();

      // Düzeltme: T.GLTFLoader (THREE'ye attach edilmiş)
      const loader = new T.GLTFLoader();
      const VRM = (window as any).THREE_VRM;
      if (VRM) loader.register((p: any) => new VRM.VRMLoaderPlugin(p));

      loader.load(
        "/Youko.vrm",
        (gltf: any) => {
          vrm = gltf.userData.vrm || gltf.scene;
          const vrmScene = vrm.scene || vrm;
          vrmScene.rotation.y = Math.PI;
          scene.add(vrmScene);
        },
        undefined,
        (e: any) => console.warn("VRM load error:", e)
      );

      function animate() {
        animFrame = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const t = Date.now();

        if (vrm) {
          const target = isSpeakingRef.current
            ? 0.5 + Math.sin(t * 0.012) * 0.35
            : 0;
          mouthOpen += (target - mouthOpen) * 0.12;
          try {
            const exp = vrm.expressionManager;
            if (exp) exp.setValue("aa", mouthOpen);
          } catch {}
          const vrmScene = vrm.scene || vrm;
          if (vrmScene?.rotation) {
            vrmScene.rotation.y = Math.PI + Math.sin(t * 0.0004) * 0.04;
            vrmScene.rotation.x = Math.sin(t * 0.0003) * 0.015;
          }
          if (vrm.update) vrm.update(delta);
        }

        renderer.render(scene, camera);
      }

      animate();

      cleanupRef.current = () => {
        cancelAnimationFrame(animFrame);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    init();
    return () => { cleanupRef.current?.(); };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "320px",
        borderRadius: "1rem",
        overflow: "hidden",
        background: "linear-gradient(180deg, #050510 0%, #130820 100%)",
      }}
    />
  );
