"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function findBone(root: THREE.Object3D, names: string[]): THREE.Bone | null {
  let found: THREE.Bone | null = null;
  root.traverse((o) => {
    if (found || !(o instanceof THREE.Bone)) return;
    const n = o.name.toLowerCase();
    if (names.some((s) => n === s || n.endsWith(s))) found = o;
  });
  return found;
}

export default function AvatarStage({
  className = "",
  onError,
}: {
  className?: string;
  onError?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onError?.();
      return;
    }
    let disposed = false;
    let raf = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      32,
      mount.clientWidth / Math.max(1, mount.clientHeight),
      0.1,
      60
    );
    camera.position.set(0, 1.35, 4.6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff6e8, 0x2a2438, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x00e5ff, 1.1);
    rim.position.set(-4, 3, -3);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xff2d78, 0.35);
    fill.position.set(-2, 1, 4);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.4, 48),
      new THREE.ShadowMaterial({ opacity: 0.32 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    let waving = 0;
    const onTap = () => {
      waving = 2.4;
    };
    mount.addEventListener("pointerdown", onTap);

    const clock = new THREE.Clock();
    let avatar: THREE.Group | null = null;
    let head: THREE.Bone | null = null;
    let armR: THREE.Bone | null = null;
    const headBase = new THREE.Quaternion();
    const armBase = new THREE.Euler();
    const lookTarget = new THREE.Quaternion();
    const lookEuler = new THREE.Euler();

    const fail = () => {
      if (!disposed) onError?.();
    };

    new GLTFLoader().load(
      "/avatar.glb",
      (gltf) => {
        if (disposed) return;
        avatar = gltf.scene;
        avatar.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.castShadow = true;
            o.receiveShadow = false;
          }
        });
        const box = new THREE.Box3().setFromObject(avatar);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        avatar.position.sub(center);
        avatar.position.y += size.y / 2;
        ground.position.y = 0.001;
        const fitDist = (size.y / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.28;
        camera.position.set(0, size.y * 0.52, fitDist);
        camera.lookAt(0, size.y * 0.48, 0);
        scene.add(avatar);

        head = findBone(avatar, ["head"]);
        armR = findBone(avatar, ["rightupperarm", "r_upperarm", "rightshoulder", "r_shoulder", "rightarm", "r_arm"]);
        if (head) headBase.copy(head.quaternion);
        if (armR) armBase.copy(armR.rotation);

        const animate = () => {
          if (disposed) return;
          raf = requestAnimationFrame(animate);
          const dt = Math.min(clock.getDelta(), 0.05);
          const t = clock.elapsedTime;

          if (avatar) {
            avatar.position.y = size.y / 2 + Math.sin(t * 1.5) * 0.025;
            avatar.rotation.y = Math.sin(t * 0.45) * 0.07 + mouse.x * 0.22;
          }
          if (head) {
            lookEuler.set(
              THREE.MathUtils.clamp(-mouse.y * 0.28, -0.3, 0.3),
              THREE.MathUtils.clamp(mouse.x * 0.5, -0.55, 0.55),
              0,
              "YXZ"
            );
            lookTarget.setFromEuler(lookEuler);
            head.quaternion.slerp(headBase.clone().multiply(lookTarget), 0.08);
          }
          if (armR) {
            if (waving > 0) {
              waving -= dt;
              armR.rotation.set(
                armBase.x - 0.5,
                armBase.y,
                armBase.z - 2.35 + Math.sin(t * 11) * 0.38
              );
            } else {
              armR.rotation.x += (armBase.x - armR.rotation.x) * 0.1;
              armR.rotation.z += (armBase.z - armR.rotation.z) * 0.1;
            }
          }

          camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04;
          camera.position.y += (size.y * 0.52 + mouse.y * -0.2 - camera.position.y) * 0.04;
          camera.lookAt(0, size.y * 0.48, 0);

          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      fail
    );

    const onResize = () => {
      camera.aspect = mount.clientWidth / Math.max(1, mount.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("pointerdown", onTap);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material as THREE.Material | THREE.Material[];
          (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, [onError]);

  return (
    <div
      ref={mountRef}
      className={`avatar-stage ${className}`}
      aria-hidden="true"
      title="Tap to wave"
    />
  );
}
