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

const BUILDING_COLORS = ["#3a3a44", "#4a3f38", "#2e3a3a", "#453a2e", "#383852"];

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
      const camDir = new THREE.Vector3(0, 12.5, 12.5).normalize();
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
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      mount.appendChild(renderer.domElement);

      const accent = new THREE.Color(themeAccent());
      const rootStyle = getComputedStyle(document.documentElement);
      const bg = rootStyle.getPropertyValue("--bg").trim() || "#06060B";
      const text = rootStyle.getPropertyValue("--text").trim() || "#ffffff";

      scene.fog = new THREE.Fog(new THREE.Color(bg), 30, 60);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a22, 0.7));
      const sun = new THREE.DirectionalLight(0xffdfb0, 2.4);
      sun.position.set(8, 14, 6);
      sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      sun.shadow.camera.left = -16;
      sun.shadow.camera.right = 16;
      sun.shadow.camera.top = 16;
      sun.shadow.camera.bottom = -16;
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 40;
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.02;
      sun.shadow.camera.updateProjectionMatrix();
      scene.add(sun);

      const groundCanvas = document.createElement("canvas");
      groundCanvas.width = groundCanvas.height = 256;
      const gtx = groundCanvas.getContext("2d")!;
      gtx.fillStyle = bg;
      gtx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 4000; i++) {
        gtx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)";
        gtx.fillRect(Math.random() * 256, Math.random() * 256, 1.5, 1.5);
      }
      const groundTex = new THREE.CanvasTexture(groundCanvas);
      groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
      groundTex.repeat.set(10, 10);
      groundTex.colorSpace = THREE.SRGBColorSpace;

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.95 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const road = new THREE.Mesh(
        new THREE.RingGeometry(7.4, 8.8, 64),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(0x232327), roughness: 0.9 })
      );
      road.rotation.x = -Math.PI / 2;
      road.position.y = 0.02;
      road.receiveShadow = true;
      scene.add(road);

      for (const [inner, outer] of [[7.4, 7.55], [8.65, 8.8]] as const) {
        const edge = new THREE.Mesh(
          new THREE.RingGeometry(inner, outer, 64),
          new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.55 })
        );
        edge.rotation.x = -Math.PI / 2;
        edge.position.y = 0.03;
        scene.add(edge);
      }

      const dashMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(text), transparent: true, opacity: 0.75 });
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2;
        const dash = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.62), dashMat);
        dash.position.set(Math.cos(a) * 8.1, 0.04, Math.sin(a) * 8.1);
        dash.rotation.y = -a;
        scene.add(dash);
      }

      const medallion = new THREE.Mesh(
        new THREE.CircleGeometry(1.3, 32),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.1 })
      );
      medallion.rotation.x = -Math.PI / 2;
      medallion.position.y = 0.03;
      scene.add(medallion);
      const medallionRing = new THREE.Mesh(
        new THREE.RingGeometry(1.3, 1.45, 48),
        new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.45 })
      );
      medallionRing.rotation.x = -Math.PI / 2;
      medallionRing.position.y = 0.03;
      scene.add(medallionRing);

      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2 + 0.4;
        const r = 11.5 + (i % 3);
        const h = 1 + ((i * 0.7) % 3);
        const c = new THREE.Color(BUILDING_COLORS[i % BUILDING_COLORS.length]);
        const b = new THREE.Mesh(
          new THREE.BoxGeometry(1.8, h, 1.8),
          new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 })
        );
        b.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r);
        b.castShadow = true;
        b.receiveShadow = true;
        scene.add(b);
        const roof = new THREE.Mesh(
          new THREE.BoxGeometry(1.95, 0.12, 1.95),
          new THREE.MeshStandardMaterial({ color: c.clone().multiplyScalar(1.3), roughness: 0.85 })
        );
        roof.position.set(Math.cos(a) * r, h + 0.06, Math.sin(a) * r);
        roof.castShadow = true;
        scene.add(roof);
      }

      const trunkMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x5a4632), roughness: 1 });
      const leafMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x2e4b34), roughness: 1 });
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + 0.9;
        const r = 10.2 + (i % 3) * 1.1;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.5, 8), trunkMat);
        trunk.position.set(x, 0.25, z);
        trunk.castShadow = true;
        scene.add(trunk);
        const cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.4, 8), leafMat);
        cone1.position.set(x, 1.1, z);
        cone1.castShadow = true;
        scene.add(cone1);
        const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.0, 8), leafMat);
        cone2.position.set(x, 1.85, z);
        cone2.castShadow = true;
        scene.add(cone2);
      }

      const poleMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x1a1a22), roughness: 0.6 });
      const lampMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xffd9a0), emissive: new THREE.Color(0xffd9a0), emissiveIntensity: 2.2 });
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        const x = Math.cos(a) * 9.7;
        const z = Math.sin(a) * 9.7;
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.3, 8), poleMat);
        pole.position.set(x, 1.15, z);
        scene.add(pole);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), lampMat);
        lamp.position.set(x, 2.35, z);
        scene.add(lamp);
      }

      const car = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.55, roughness: 0.35 });
      const glassMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x101418), metalness: 0.9, roughness: 0.12 });
      const darkMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0x111114), roughness: 0.9 });
      const hubMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xb8b8c0), metalness: 0.85, roughness: 0.3 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.42, 1.85), bodyMat);
      body.position.y = 0.42;
      car.add(body);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 1.0), glassMat);
      cabin.position.set(0, 0.8, -0.12);
      car.add(cabin);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(0.87, 0.07, 1.02), bodyMat);
      roof.position.set(0, 1.03, -0.12);
      car.add(roof);
      const headMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xfff2cc), emissive: new THREE.Color(0xfff2cc), emissiveIntensity: 3 });
      for (const x of [-0.28, 0.28]) {
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.09, 0.05), headMat);
        head.position.set(x, 0.45, 0.94);
        car.add(head);
      }
      const tailMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xff2a22), emissive: new THREE.Color(0xff2a22), emissiveIntensity: 2 });
      for (const x of [-0.28, 0.28]) {
        const tail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.09, 0.05), tailMat);
        tail.position.set(x, 0.45, -0.94);
        car.add(tail);
      }
      for (const x of [-0.56, 0.56]) {
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.09, 0.08), bodyMat);
        mirror.position.set(x, 0.78, 0.28);
        car.add(mirror);
      }
      const tireGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.16, 20);
      const hubGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.17, 16);
      for (const [x, z] of [[-0.5, 0.6], [0.5, 0.6], [-0.5, -0.6], [0.5, -0.6]] as const) {
        const tire = new THREE.Mesh(tireGeo, darkMat);
        tire.rotation.z = Math.PI / 2;
        tire.position.set(x, 0.21, z);
        car.add(tire);
        const hub = new THREE.Mesh(hubGeo, hubMat);
        hub.rotation.z = Math.PI / 2;
        hub.position.set(x, 0.21, z);
        car.add(hub);
      }
      car.traverse((o) => {
        if (o instanceof THREE.Mesh) o.castShadow = true;
      });
      car.scale.setScalar(1.8);
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
            (Array.isArray(m) ? m : [m]).forEach((x) => {
              const t = (x as THREE.MeshStandardMaterial).map;
              if (t) t.dispose();
              x.dispose();
            });
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
