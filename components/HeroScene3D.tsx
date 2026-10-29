"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { themeAccent } from "@/lib/themeAccent";

const LETTERS = ["T", "R", "A", "U", "N"];
const RING_R = 3.1;
const STOP_ANGLES: Record<string, number> = Object.fromEntries(
  LETTERS.map((l, i) => [l, Math.PI / 2 - i * ((Math.PI * 2) / 5)])
);

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

      scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a22, 0.9));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(4, 6, 5);
      scene.add(key);

      const sceneGroup = new THREE.Group();
      scene.add(sceneGroup);

      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.x = -1.05;
      sceneGroup.add(orbitGroup);

      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        new THREE.EllipseCurve(0, 0, RING_R, RING_R, 0, Math.PI * 2).getPoints(128)
      );
      const ring = new THREE.LineLoop(
        ringGeo,
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.4 })
      );
      orbitGroup.add(ring);

      const markers = LETTERS.map((letter) => {
        const mat = new THREE.MeshStandardMaterial({
          color: accent,
          emissive: accent,
          emissiveIntensity: 0.7,
        });
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), mat);
        const a = STOP_ANGLES[letter];
        m.position.set(Math.cos(a) * RING_R, Math.sin(a) * RING_R, 0);
        orbitGroup.add(m);
        return { letter, mesh: m, mat };
      });

      const satellite = new THREE.Group();
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 24, 24),
        new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 2 })
      );
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 24, 24),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.16 })
      );
      satellite.add(core);
      satellite.add(halo);
      orbitGroup.add(satellite);

      const dots = new THREE.BufferGeometry();
      const count = 120;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 14;
      dots.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const stars = new THREE.Points(
        dots,
        new THREE.PointsMaterial({ color: accent, size: 0.04, transparent: true, opacity: 0.45 })
      );
      sceneGroup.add(stars);

      const layout = () => {
        orbitGroup.scale.setScalar(Math.min(1, camera.aspect * 0.85));
      };
      layout();

      let angle = STOP_ANGLES.T;
      let targetAngle: number | null = null;
      let activeLetter: string | null = null;
      const placeSatellite = () => {
        satellite.position.set(Math.cos(angle) * RING_R, Math.sin(angle) * RING_R, 0);
      };
      placeSatellite();

      const onHighlight = (e: Event) => {
        const letter = (e as CustomEvent<string | null>).detail;
        activeLetter = letter && STOP_ANGLES[letter] !== undefined ? letter : null;
        targetAngle = activeLetter ? STOP_ANGLES[activeLetter] : null;
      };
      window.addEventListener("name:highlight", onHighlight);

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

      const clock = new THREE.Clock();
      let running = false;
      const arc = (a: number) => {
        let d = (a + Math.PI * 3) % (Math.PI * 2);
        if (d < 0) d += Math.PI * 2;
        return d - Math.PI;
      };
      const loop = () => {
        if (disposed || !visible || reduced || running) return;
        running = true;
        const tick = () => {
          if (disposed || !visible || reduced) {
            running = false;
            return;
          }
          raf = requestAnimationFrame(tick);
          const dt = Math.min(clock.getDelta(), 0.05);
          const t = clock.elapsedTime;
          if (targetAngle !== null) {
            const diff = arc(targetAngle - angle);
            const step = Math.max(-dt * 2.4, Math.min(dt * 2.4, diff));
            angle += step;
            if (Math.abs(diff) < 0.005) angle = targetAngle;
          } else {
            angle += dt * ((Math.PI * 2) / 24);
          }
          placeSatellite();
          const docked = targetAngle !== null && Math.abs(arc(targetAngle - angle)) < 0.05;
          halo.scale.setScalar(docked ? 1 + Math.sin(t * 3) * 0.15 : 1);
          for (const m of markers) {
            const on = m.letter === activeLetter;
            const s = on ? 1.8 : 1;
            m.mesh.scale.x += (s - m.mesh.scale.x) * 0.15;
            m.mesh.scale.y = m.mesh.scale.x;
            m.mesh.scale.z = m.mesh.scale.x;
            m.mat.emissiveIntensity += ((on ? 2.2 : 0.7) - m.mat.emissiveIntensity) * 0.15;
          }
          mouse.x += (mouse.tx - mouse.x) * 0.05;
          mouse.y += (mouse.ty - mouse.y) * 0.05;
          sceneGroup.rotation.y = mouse.x * 0.22;
          sceneGroup.rotation.x = mouse.y * 0.12;
          stars.rotation.y = t * 0.02;
          renderer.render(scene, camera);
        };
        tick();
      };

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

      if (reduced) {
        activeLetter = "T";
        for (const m of markers) {
          if (m.letter === "T") {
            m.mesh.scale.setScalar(1.8);
            m.mat.emissiveIntensity = 2.2;
          }
        }
        renderer.render(scene, camera);
      } else {
        loop();
      }

      dispose = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("name:highlight", onHighlight);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVis);
        observer.disconnect();
        scene.traverse((o) => {
          if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.Line) {
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
