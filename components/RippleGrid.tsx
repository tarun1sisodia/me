"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RippleGrid() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / Math.max(1, mount.clientHeight),
      0.1,
      100
    );
    camera.position.set(0, 5.4, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const W = 42;
    const H = 22;
    const geo = new THREE.PlaneGeometry(W, H, 120, 60);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const cyan = new THREE.Color("#00E5FF");
    const white = new THREE.Color("#FFFFFF");
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getX(i) + W / 2) / W;
      const c = cyan.clone().lerp(white, t).multiplyScalar(0.5);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    points.rotation.x = -0.62;
    scene.add(points);

    const hitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitPlane.rotation.x = -0.62;
    scene.add(hitPlane);

    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(-10, -10);
    const onMouse = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      mouseNDC.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    const local = new THREE.Vector3();
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(mount);

    const base = (pos.array as Float32Array).slice();
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();

      raycaster.setFromCamera(mouseNDC, camera);
      const hit = raycaster.intersectObject(hitPlane)[0];
      if (hit) {
        local.copy(hit.point);
        points.worldToLocal(local);
      } else {
        local.set(9999, 9999, 0);
      }

      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        const dx = x - local.x;
        const dy = y - local.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ripple =
          Math.sin(dist * 1.4 - t * 6) * Math.exp(-dist * 0.45) * 1.7;
        const ambient =
          Math.sin(x * 0.4 + t * 0.9) * 0.35 +
          Math.cos(y * 0.5 + t * 0.7) * 0.25;
        pos.setZ(i, ambient + ripple);
      }
      pos.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = mount.clientWidth / Math.max(1, mount.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="ripple-grid" aria-hidden="true" />;
}
