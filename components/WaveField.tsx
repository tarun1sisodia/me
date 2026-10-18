"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { themeAccent } from "@/lib/themeAccent";

export default function WaveField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    let dispose: () => void = () => {};
    const setup = () => {
      if (!mount) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        55,
        mount.clientWidth / Math.max(1, mount.clientHeight),
        0.1,
        100
      );
      camera.position.set(0, 4.6, 11);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mount.appendChild(renderer.domElement);

      const W = 34;
      const H = 14;
      const geo = new THREE.PlaneGeometry(W, H, 110, 36);
      const pos = geo.attributes.position as THREE.BufferAttribute;
      const colors = new Float32Array(pos.count * 3);
      const accent = new THREE.Color(themeAccent());
      const white = new THREE.Color("#FFFFFF");
      for (let i = 0; i < pos.count; i++) {
        const t = (pos.getX(i) + W / 2) / W;
        const c = accent.clone().lerp(white, t).multiplyScalar(0.6);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      points.rotation.x = -0.52;
      scene.add(points);

      const base = (pos.array as Float32Array).slice();
      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
        },
        { threshold: 0 }
      );
      io.observe(mount);

      const clock = new THREE.Clock();
      const animate = () => {
        raf = requestAnimationFrame(animate);
        if (!visible) return;
        const t = clock.getElapsedTime();
        for (let i = 0; i < pos.count; i++) {
          const x = base[i * 3];
          const y = base[i * 3 + 1];
          pos.setZ(
            i,
            Math.sin(x * 0.45 + t * 1.1) * 0.9 + Math.cos(y * 0.7 + t * 0.8) * 0.6
          );
        }
        pos.needsUpdate = true;
        points.rotation.z = Math.sin(t * 0.12) * 0.05;
        renderer.render(scene, camera);
      };
      if (reduced) renderer.render(scene, camera);
      else animate();

      const onResize = () => {
        camera.aspect = mount.clientWidth / Math.max(1, mount.clientHeight);
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener("resize", onResize);

      dispose = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", onResize);
        geo.dispose();
        mat.dispose();
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

  return <div ref={mountRef} className="wave-field" aria-hidden="true" />;
}
