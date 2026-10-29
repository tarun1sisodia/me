"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { themeAccent } from "@/lib/themeAccent";

const STOPS = [
  { id: "about", name: "About" },
  { id: "services", name: "Services" },
  { id: "work", name: "Work" },
  { id: "journey", name: "Journey" },
  { id: "now", name: "Now" },
  { id: "connect", name: "Connect" },
];

export default function HeroScene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

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
        100
      );
      const camDir = new THREE.Vector3(0, 15, 11).normalize();
      const basePos = new THREE.Vector3();
      const layoutCamera = () => {
        const aspect = mount.clientWidth / Math.max(1, mount.clientHeight);
        const dist = Math.max(18.6, (8 / (0.414 * aspect)) * 1.15);
        camera.position.copy(camDir).multiplyScalar(dist);
        basePos.copy(camera.position);
      };
      layoutCamera();

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mount.appendChild(renderer.domElement);

      const accent = new THREE.Color(themeAccent());
      const rootStyle = getComputedStyle(document.documentElement);
      const bg = rootStyle.getPropertyValue("--bg").trim() || "#06060B";
      const text = rootStyle.getPropertyValue("--text").trim() || "#ffffff";

      scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a22, 0.9));
      const key = new THREE.DirectionalLight(0xffffff, 2.0);
      key.position.set(4, 8, 5);
      scene.add(key);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(bg) })
      );
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);

      const grid = new THREE.GridHelper(32, 32, accent, new THREE.Color(0x555555));
      (grid.material as THREE.Material).transparent = true;
      (grid.material as THREE.Material).opacity = 0.3;
      scene.add(grid);

      const road = new THREE.Mesh(
        new THREE.RingGeometry(7.6, 8.6, 64),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.06 })
      );
      road.rotation.x = -Math.PI / 2;
      road.position.y = 0.02;
      scene.add(road);

      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 + 0.4;
        const r = 11.5 + (i % 3);
        const h = 1 + ((i * 0.7) % 3);
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, h, 1.8),
          new THREE.MeshStandardMaterial({ color: new THREE.Color(text), transparent: true, opacity: 0.2 })
        );
        b.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r);
        scene.add(b);
      }

      const car = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.5, roughness: 0.4 });
      const darkMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x1a1a22) });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 1.7), bodyMat);
      body.position.y = 0.4;
      car.add(body);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.9), darkMat);
      cabin.position.set(0, 0.72, -0.15);
      car.add(cabin);
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.08, 0.05),
        new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 2 })
      );
      strip.position.set(0, 0.42, 0.88);
      car.add(strip);
      car.scale.setScalar(1.8);
      const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16);
      for (const [x, z] of [[-0.45, 0.55], [0.45, 0.55], [-0.45, -0.55], [0.45, -0.55]] as const) {
        const w = new THREE.Mesh(wheelGeo, darkMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(x, 0.18, z);
        car.add(w);
      }
      scene.add(car);

      const cruise = window.matchMedia("(pointer: coarse)").matches;
      let cruiseAngle = 0;
      let heading = 0;
      let speed = 0;
      car.position.set(8, 0, 0);
      car.rotation.y = 0;

      const stops = STOPS.map((s, i) => {
        const a = (i / STOPS.length) * Math.PI * 2;
        const pos = new THREE.Vector3(Math.cos(a) * 8, 0, Math.sin(a) * 8);
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 1.7, 12),
          new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.4 })
        );
        beam.position.set(pos.x, 0.85, pos.z);
        scene.add(beam);
        const base = new THREE.Mesh(
          new THREE.CircleGeometry(0.55, 24),
          new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.25 })
        );
        base.rotation.x = -Math.PI / 2;
        base.position.set(pos.x, 0.03, pos.z);
        scene.add(base);
        const el = document.createElement("button");
        el.type = "button";
        el.className = "hero-drive-label";
        el.textContent = s.name;
        el.addEventListener("click", () => {
          document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
        });
        mount.appendChild(el);
        return { ...s, pos, labelPos: new THREE.Vector3(pos.x, 3, pos.z), el };
      });

      const goTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      };

      const keys = new Set<string>();
      const onKeyDown = (e: KeyboardEvent) => {
        const ae = document.activeElement;
        if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.tagName === "SELECT")) return;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
          if (visible && window.scrollY < window.innerHeight) e.preventDefault();
        }
        if (e.code === "Enter" && activeStop) goTo(activeStop.id);
        keys.add(e.code);
      };
      const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

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
        layoutCamera();
      };
      window.addEventListener("resize", onResize);

      const reduced =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        document.documentElement.classList.contains("motion-off");

      let activeStop: (typeof stops)[number] | null = null;
      const proj = new THREE.Vector3();
      const updateLabels = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        for (const s of stops) {
          proj.copy(s.labelPos).project(camera);
          if (proj.z > 1) {
            s.el.style.opacity = "0";
            continue;
          }
          s.el.style.opacity = "1";
          const x = (proj.x * 0.5 + 0.5) * w;
          const y = (-proj.y * 0.5 + 0.5) * h;
          s.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
        }
      };

      const clock = new THREE.Clock();
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
          const dt = Math.min(clock.getDelta(), 0.05);
          if (cruise) {
            cruiseAngle += dt * 0.35;
            car.position.set(Math.cos(cruiseAngle) * 8, 0, Math.sin(cruiseAngle) * 8);
            car.rotation.y = -cruiseAngle;
          } else {
            const gas = keys.has("ArrowUp") || keys.has("KeyW");
            const brake = keys.has("ArrowDown") || keys.has("KeyS");
            const left = keys.has("ArrowLeft") || keys.has("KeyA");
            const right = keys.has("ArrowRight") || keys.has("KeyD");
            if (gas) speed = Math.min(10, speed + 14 * dt);
            else if (brake) speed = Math.max(-3.5, speed - 14 * dt);
            else speed += (0 - speed) * Math.min(1, 2.5 * dt);
            const steer = (left ? 1 : 0) - (right ? 1 : 0);
            heading += steer * 2.0 * dt * Math.min(1, Math.abs(speed) / 4) * (speed >= 0 ? 1 : -1);
            car.position.x += Math.sin(heading) * speed * dt;
            car.position.z += Math.cos(heading) * speed * dt;
            const len = Math.hypot(car.position.x, car.position.z);
            if (len > 14) {
              car.position.x *= 14 / len;
              car.position.z *= 14 / len;
            }
            car.rotation.y = heading;
          }
          let best: (typeof stops)[number] | null = null;
          let bestD = 3.2;
          for (const s of stops) {
            const d = Math.hypot(car.position.x - s.pos.x, car.position.z - s.pos.z);
            if (d < bestD) {
              bestD = d;
              best = s;
            }
            s.el.classList.toggle("is-active", s === best);
          }
          activeStop = best;
          mouse.x += (mouse.tx - mouse.x) * 0.04;
          mouse.y += (mouse.ty - mouse.y) * 0.04;
          camera.position.x = basePos.x + mouse.x * 2.5;
          camera.position.z = basePos.z + mouse.y * 1.5;
          camera.lookAt(0, 0, 0);
          updateLabels();
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
        car.position.set(8, 0, 0);
        car.rotation.y = 0;
        camera.lookAt(0, 0, 0);
        updateLabels();
        renderer.render(scene, camera);
      } else {
        loop();
      }

      dispose = () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVis);
        observer.disconnect();
        for (const s of stops) s.el.remove();
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

  return (
    <div ref={mountRef} className="hero-scene-3d" aria-hidden="true">
      <div className="hero-drive-hint">
        {isTouch ? "Cruising the world — tap a stop to visit" : "WASD / arrows to drive — Enter visits a stop"}
      </div>
    </div>
  );
}
