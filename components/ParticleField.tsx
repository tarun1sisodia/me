"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { themeAccent } from "@/lib/themeAccent";

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    let dispose: () => void = () => {};
    const setup = () => {
      if (!mount) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        mount.clientWidth / Math.max(1, mount.clientHeight),
        0.1,
        100
      );
      camera.position.z = 8;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      mount.appendChild(renderer.domElement);

      const COUNT = 850;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const accent = new THREE.Color(themeAccent());
      const white = new THREE.Color("#FFFFFF");
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 24;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        const c = Math.random() > 0.72 ? white : accent;
        const dim = 0.22 + Math.random() * 0.78;
        colors[i * 3] = c.r * dim;
        colors[i * 3 + 1] = c.g * dim;
        colors[i * 3 + 2] = c.b * dim;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);

      const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.7, 1),
        new THREE.MeshBasicMaterial({
          color: themeAccent(),
          wireframe: true,
          transparent: true,
          opacity: 0.22,
        })
      );
      ico.position.set(5.4, 0.9, -3);
      scene.add(ico);

      const ico2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.0, 0),
        new THREE.MeshBasicMaterial({
          color: "#FFFFFF",
          wireframe: true,
          transparent: true,
          opacity: 0.2,
        })
      );
      ico2.position.set(-6.6, -2.2, -4);
      scene.add(ico2);

      const mouse = { x: 0, y: 0 };
      const onMouse = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

      let raf = 0;
      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        points.rotation.y = t * 0.02 + mouse.x * 0.14;
        points.rotation.x = mouse.y * 0.07;
        ico.rotation.x = t * 0.12;
        ico.rotation.y = t * 0.16 + mouse.x * 0.4;
        ico.position.y = 0.9 + Math.sin(t * 0.7) * 0.35;
        ico2.rotation.x = -t * 0.1;
        ico2.rotation.y = t * 0.14 - mouse.x * 0.3;
        ico2.position.y = -2.2 + Math.cos(t * 0.6) * 0.3;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
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
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        geo.dispose();
        mat.dispose();
        ico.geometry.dispose();
        (ico.material as THREE.Material).dispose();
        ico2.geometry.dispose();
        (ico2.material as THREE.Material).dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
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

  return <div ref={mountRef} className="particle-field" aria-hidden="true" />;
}
