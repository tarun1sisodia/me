"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { themeAccent } from "@/lib/themeAccent";

export default function HeroScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let dispose: () => void = () => {};
    const setup = () => {
      let disposed = false;
      let raf = 0;
      let visible = true;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        mount.clientWidth / Math.max(1, mount.clientHeight),
        0.1,
        60
      );
      camera.position.set(0, 0, 9);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mount.appendChild(renderer.domElement);

      const accent = new THREE.Color(themeAccent());
      const text = getComputedStyle(document.documentElement)
        .getPropertyValue("--text")
        .trim();

      scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a22, 0.9));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(4, 6, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(accent, 2.4);
      rim.position.set(-5, 2, -4);
      scene.add(rim);

      const group = new THREE.Group();
      scene.add(group);

      const icosa = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.5, 1),
        new THREE.MeshStandardMaterial({
          color: accent,
          wireframe: true,
          transparent: true,
          opacity: 0.55,
        })
      );
      icosa.position.set(3.1, 1.1, -1);
      group.add(icosa);

      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(1.05, 0.3, 16, 48),
        new THREE.MeshStandardMaterial({
          color: accent,
          metalness: 0.7,
          roughness: 0.3,
          emissive: accent,
          emissiveIntensity: 0.15,
        })
      );
      torus.position.set(-3.3, -1.2, 0);
      group.add(torus);

      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.65, 0.2, 100, 16),
        new THREE.MeshStandardMaterial({
          color: text || "#ffffff",
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        })
      );
      knot.position.set(2.7, -1.9, -2);
      group.add(knot);

      const dots = new THREE.BufferGeometry();
      const count = 220;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 14;
      dots.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const stars = new THREE.Points(
        dots,
        new THREE.PointsMaterial({
          color: accent,
          size: 0.045,
          transparent: true,
          opacity: 0.7,
        })
      );
      group.add(stars);

      const layout = () => {
        const spread = Math.min(1, camera.aspect * 0.85);
        icosa.position.x = 3.1 * spread;
        torus.position.x = -3.3 * spread;
        knot.position.x = 2.7 * spread;
      };
      layout();

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMouse = (e: MouseEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

      const onScroll = () => {
        const fade = Math.max(0, 1 - window.scrollY / window.innerHeight);
        mount.style.opacity = fade.toFixed(3);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const onResize = () => {
        camera.aspect = mount.clientWidth / Math.max(1, mount.clientHeight);
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        layout();
      };
      window.addEventListener("resize", onResize);

      const reduced =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains("motion-off");

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !reduced) loop();
        },
        { threshold: 0 }
      );
      observer.observe(mount);

      const onVis = () => {
        visible = !document.hidden;
        if (visible && !reduced) loop();
      };
      document.addEventListener("visibilitychange", onVis);

      const clock = new THREE.Clock();
      const baseY = new Map<THREE.Object3D, number>([
        [icosa, icosa.position.y],
        [torus, torus.position.y],
        [knot, knot.position.y],
      ]);

      let running = false;
      const loop = () => {
        if (disposed || !visible || reduced || running) return;
        running = true;
        const tick = () => {
          if (disposed || !visible || reduced) {
            running = false;
            return;
          }
          raf = requestAnimationFrame(tick);
          const t = clock.getElapsedTime();
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        group.rotation.y = mouse.x * 0.28 + window.scrollY * 0.0002;
        group.rotation.x = mouse.y * 0.16;
        icosa.rotation.y = t * 0.22;
        icosa.rotation.x = t * 0.13;
        torus.rotation.x = t * 0.3;
        torus.rotation.y = t * 0.18;
        knot.rotation.y = -t * 0.25;
        knot.rotation.z = t * 0.12;
        stars.rotation.y = t * 0.02;
        baseY.forEach((y, obj) => {
          obj.position.y = y + Math.sin(t * 0.9 + y) * 0.18;
        });
        renderer.render(scene, camera);
        };
        tick();
      };

      if (reduced) {
        renderer.render(scene, camera);
      } else {
        loop();
      }

      dispose = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVis);
        observer.disconnect();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
            o.geometry.dispose();
            const m = o.material as THREE.Material | THREE.Material[];
            (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
          }
        });
        renderer.dispose();
        if (renderer.domElement.parentNode === mount)
          mount.removeChild(renderer.domElement);
      };
    };

    setup();
    const onTheme = () => {
      dispose();
      setup();
    };
    window.addEventListener("theme:change", onTheme);
    return () => {
      window.removeEventListener("theme:change", onTheme);
      dispose();
    };
  }, []);

  return <div ref={mountRef} className="hero-scene-3d" aria-hidden="true" />;
}
