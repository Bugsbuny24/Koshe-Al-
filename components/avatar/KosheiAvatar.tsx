"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";

interface AvatarProps {
  isSpeaking: boolean;
}

export default function KosheiAvatar({ isSpeaking }: AvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const speakingRef = useRef(isSpeaking);
  const cleanupRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    speakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // temiz başla
    container.innerHTML = "";

    let raf = 0;
    let renderer: THREE.WebGLRenderer | null = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 1.35, 1.6);
    camera.lookAt(0, 1.3, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(1.2, 2.2, 2.2);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x88a0ff, 0.25);
    fill.position.set(-1.5, 0.8, 1.2);
    scene.add(fill);

    const clock = new THREE.Clock();

    // resize helper
    const resize = () => {
      if (!renderer) return;
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    resize();

    // VRM load
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    // ÖNEMLİ:
    // VRM dosyan public klasöründeyse: /avatar.vrm
    // public/static altındaysa: /static/avatar.vrm
    const VRM_URL = "/avatar.vrm";

    let vrm: any = null;
    let mouth = 0;

    loader.load(
      VRM_URL,
      (gltf) => {
        vrm = gltf.userData.vrm;
        if (!vrm) {
          console.warn("VRM not found on gltf.userData.vrm");
          return;
        }

        // model normalize (çok kritik: ters eksen/scale vs.)
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        // sahneye ekle
        vrm.scene.rotation.y = Math.PI;
        scene.add(vrm.scene);
      },
      undefined,
      (err) => {
        console.error("VRM load error:", err);
        container.innerHTML =
          `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.35);font-size:13px;">
            Avatar yüklenemedi (VRM dosyası bulunamadı/okunamadı)
          </div>`;
      }
    );

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = Date.now();

      if (vrm) {
        // konuşma animasyonu (basit ağız)
        const target = speakingRef.current ? 0.55 + Math.sin(t * 0.012) * 0.35 : 0;
        mouth += (target - mouth) * 0.12;

        const exp = vrm.expressionManager;
        if (exp?.setValue) {
          exp.setValue("aa", mouth);
        }

        // hafif kafa hareketi
        vrm.scene.rotation.y = Math.PI + Math.sin(t * 0.0004) * 0.04;
        vrm.scene.rotation.x = Math.sin(t * 0.0003) * 0.015;

        vrm.update(delta);
      }

      renderer?.render(scene, camera);
    };

    animate();
    window.addEventListener("resize", resize);

    cleanupRef.current = () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);

      // dispose
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      }
      renderer = null;

      // scene cleanup (basit)
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose?.());
        }
        if (obj.texture) obj.texture.dispose?.();
      });
    };

    return () => cleanupRef.current?.();
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
}
