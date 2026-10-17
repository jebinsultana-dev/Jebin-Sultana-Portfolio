import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PageRoute } from '../types';
import { Sparkles, Compass, Eye, Zap } from 'lucide-react';

interface Interactive3DBackgroundProps {
  currentPage: PageRoute;
}

export const Interactive3DBackground: React.FC<Interactive3DBackgroundProps> = ({ currentPage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interactiveMode, setInteractiveMode] = useState<'flow' | 'gravity' | 'constellation'>('flow');
  const [hudOpen, setHudOpen] = useState(false);

  // References to communicate with Three.js animation loop without re-instantiating scene
  const modeRef = useRef(interactiveMode);
  modeRef.current = interactiveMode;

  const pageRef = useRef(currentPage);
  pageRef.current = currentPage;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // SCENE & RENDERER SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090d16, 0.025);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;
    camera.position.y = 0;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // PALETTES BY ROUTE
    const themePalettes = {
      home: {
        primary: new THREE.Color(0xf59e0b), // Amber
        secondary: new THREE.Color(0x38bdf8), // Sky
        particles: new THREE.Color(0xfcd34d),
        fog: 0x090d16,
      },
      work: {
        primary: new THREE.Color(0x38bdf8), // Sky Blue
        secondary: new THREE.Color(0x818cf8), // Indigo
        particles: new THREE.Color(0x7dd3fc),
        fog: 0x070b14,
      },
      'rabbit-holes': {
        primary: new THREE.Color(0xa855f7), // Purple
        secondary: new THREE.Color(0xec4899), // Pink
        particles: new THREE.Color(0xd8b4fe),
        fog: 0x090918,
      },
      'rabbit-hole-article': {
        primary: new THREE.Color(0xc084fc), // Amethyst
        secondary: new THREE.Color(0x38bdf8), // Sky
        particles: new THREE.Color(0xe9d5ff),
        fog: 0x090918,
      },
    };

    let currentTheme = themePalettes[currentPage] || themePalettes.home;

    // AMBIENT & LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mouseLight = new THREE.PointLight(currentTheme.primary, 4, 35);
    mouseLight.position.set(0, 0, 10);
    scene.add(mouseLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    // 1. DYNAMIC INTERACTIVE FLOATING 3D POLYHEDRA
    // A constellation of varied 3D polyhedra dispersed through depth
    const shapeCount = 22;
    const shapes: {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      floatSpeed: number;
      floatPhase: number;
      scale: number;
    }[] = [];

    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.TetrahedronGeometry(1.3, 0),
      new THREE.TorusGeometry(1.0, 0.25, 12, 28),
      new THREE.DodecahedronGeometry(1.0, 0),
    ];

    const shapeMaterials = [
      new THREE.MeshStandardMaterial({
        color: currentTheme.primary,
        metalness: 0.3,
        roughness: 0.3,
        transparent: true,
        opacity: 0.55,
        wireframe: true,
      }),
      new THREE.MeshStandardMaterial({
        color: currentTheme.secondary,
        metalness: 0.6,
        roughness: 0.2,
        transparent: true,
        opacity: 0.45,
        wireframe: false,
      }),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.8,
        thickness: 0.5,
        transparent: true,
        opacity: 0.35,
      }),
    ];

    for (let i = 0; i < shapeCount; i++) {
      const geo = geometries[i % geometries.length];
      const mat = shapeMaterials[i % shapeMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);

      // Distribute widely across viewable field
      const baseX = (Math.random() - 0.5) * 55;
      const baseY = (Math.random() - 0.5) * 45;
      const baseZ = (Math.random() - 0.5) * 30 - 5;

      mesh.position.set(baseX, baseY, baseZ);
      const scale = 0.6 + Math.random() * 0.9;
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);

      shapes.push({
        mesh,
        baseX,
        baseY,
        baseZ,
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.5 + Math.random() * 0.8,
        floatPhase: Math.random() * Math.PI * 2,
        scale,
      });
    }

    // 2. INTERACTIVE PARTICLES WITH DYNAMIC CONNECTIVE NETWORK
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 60;
      const py = (Math.random() - 0.5) * 50;
      const pz = (Math.random() - 0.5) * 35 - 5;

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.01,
        ox: px,
        oy: py,
        oz: pz,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: currentTheme.particles,
      size: 0.15,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 3. INTERACTIVE CONSTELLATION LINES
    const maxLineConnections = 240;
    const linePositions = new Float32Array(maxLineConnections * 6);
    const lineColors = new Float32Array(maxLineConnections * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // MOUSE & INTERACTION STATE
    const mouse3D = new THREE.Vector3(0, 0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    const currentMouse = new THREE.Vector2(0, 0);
    let clickImpulse = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const onPointerMove = (e: MouseEvent) => {
      // Normalize to -1..1
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Project onto a plane at z=0 for interactive 3D light & particle interaction
      const vector = new THREE.Vector3(targetMouse.x, targetMouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      mouse3D.copy(pos);
    };

    const onPointerDown = () => {
      // Create a playful energetic impulse wave
      clickImpulse = 1.0;
    };

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mousedown', onPointerDown, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const mode = modeRef.current;
      const activePage = pageRef.current;

      // Smoothly update colors based on route
      const targetTheme = themePalettes[activePage] || themePalettes.home;
      mouseLight.color.lerp(targetTheme.primary, 0.05);
      particleMaterial.color.lerp(targetTheme.particles, 0.05);

      // Smooth mouse damping
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

      // Smooth scroll parallax
      scrollY += (targetScrollY - scrollY) * 0.06;

      // Camera responds to scroll and mouse with deep 3D perspective
      if (!prefersReducedMotion) {
        camera.position.x = currentMouse.x * 2.5;
        camera.position.y = -scrollY * 0.01 + currentMouse.y * 1.8;
        camera.lookAt(currentMouse.x * 0.5, -scrollY * 0.01, 0);

        // Position the mouse point light
        mouseLight.position.x = mouse3D.x;
        mouseLight.position.y = mouse3D.y;
        mouseLight.position.z = 4 + clickImpulse * 5;
      }

      // Decay click shockwave impulse
      clickImpulse *= 0.92;

      // Update 3D Floating Polyhedra with playful physics
      shapes.forEach((item, index) => {
        if (!prefersReducedMotion) {
          // Continuous rotational drift
          item.mesh.rotation.x += item.rotSpeedX;
          item.mesh.rotation.y += item.rotSpeedY;
          item.mesh.rotation.z += item.rotSpeedZ;

          // Organic floating oscillation
          const floatOffset = Math.sin(elapsedTime * item.floatSpeed + item.floatPhase) * 1.2;

          // Interactive response to mouse position
          const dx = item.mesh.position.x - mouse3D.x;
          const dy = item.mesh.position.y - mouse3D.y;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);

          let pushX = 0;
          let pushY = 0;
          let pushZ = 0;

          if (distToMouse < 14) {
            const factor = (14 - distToMouse) / 14;
            if (mode === 'gravity') {
              // Attract towards cursor playfully
              pushX = -dx * factor * 0.25;
              pushY = -dy * factor * 0.25;
            } else {
              // Flow / Repel away from cursor
              pushX = (dx / (distToMouse + 0.1)) * factor * 3.5;
              pushY = (dy / (distToMouse + 0.1)) * factor * 3.5;
              pushZ = factor * 4.0;
            }
          }

          // Click shockwave expansion
          if (clickImpulse > 0.01) {
            const shockDist = Math.max(distToMouse, 0.5);
            pushX += (dx / shockDist) * clickImpulse * 5.0;
            pushY += (dy / shockDist) * clickImpulse * 5.0;
            item.mesh.rotation.x += clickImpulse * 0.08;
            item.mesh.rotation.y += clickImpulse * 0.08;
          }

          // Smoothly lerp towards target position
          const targetX = item.baseX + pushX;
          const targetY = item.baseY + floatOffset + pushY;
          const targetZ = item.baseZ + pushZ;

          item.mesh.position.x += (targetX - item.mesh.position.x) * 0.06;
          item.mesh.position.y += (targetY - item.mesh.position.y) * 0.06;
          item.mesh.position.z += (targetZ - item.mesh.position.z) * 0.06;
        }
      });

      // Update Particle Cloud and Network Connections
      const positions = particleGeometry.attributes.position.array as Float32Array;
      let lineIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        let px = positions[i * 3];
        let py = positions[i * 3 + 1];
        let pz = positions[i * 3 + 2];

        if (!prefersReducedMotion) {
          px += vel.x;
          py += vel.y;
          pz += vel.z;

          // Soft boundaries wrap-around
          if (px > 35) px = -35;
          if (px < -35) px = 35;
          if (py > 30) py = -30;
          if (py < -30) py = 30;

          // Mouse influence
          const pdx = px - mouse3D.x;
          const pdy = py - mouse3D.y;
          const pDist = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pDist < 10) {
            const pFactor = (10 - pDist) / 10;
            if (mode === 'gravity') {
              px -= pdx * pFactor * 0.08;
              py -= pdy * pFactor * 0.08;
            } else {
              px += (pdx / (pDist + 0.1)) * pFactor * 0.4;
              py += (pdy / (pDist + 0.1)) * pFactor * 0.4;
            }
          }

          if (clickImpulse > 0.01) {
            px += (pdx / (pDist + 0.2)) * clickImpulse * 0.8;
            py += (pdy / (pDist + 0.2)) * clickImpulse * 0.8;
          }

          positions[i * 3] = px;
          positions[i * 3 + 1] = py;
          positions[i * 3 + 2] = pz;
        }

        // Connect nearby particles with lines if in constellation or flow mode
        if ((mode === 'constellation' || mode === 'flow') && lineIndex < maxLineConnections - 1) {
          for (let j = i + 1; j < Math.min(i + 12, particleCount); j++) {
            const jx = positions[j * 3];
            const jy = positions[j * 3 + 1];
            const jz = positions[j * 3 + 2];

            const dx = px - jx;
            const dy = py - jy;
            const dz = pz - jz;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < 22 && lineIndex < maxLineConnections) {
              const baseIdx = lineIndex * 6;
              linePositions[baseIdx] = px;
              linePositions[baseIdx + 1] = py;
              linePositions[baseIdx + 2] = pz;
              linePositions[baseIdx + 3] = jx;
              linePositions[baseIdx + 4] = jy;
              linePositions[baseIdx + 5] = jz;

              const alpha = Math.max(0, 1 - distSq / 22);
              const colorA = targetTheme.primary;
              const colorB = targetTheme.secondary;

              lineColors[baseIdx] = colorA.r * alpha;
              lineColors[baseIdx + 1] = colorA.g * alpha;
              lineColors[baseIdx + 2] = colorA.b * alpha;
              lineColors[baseIdx + 3] = colorB.r * alpha;
              lineColors[baseIdx + 4] = colorB.g * alpha;
              lineColors[baseIdx + 5] = colorB.b * alpha;

              lineIndex++;
            }
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;

      // Clear remaining line segments
      for (let k = lineIndex * 6; k < maxLineConnections * 6; k++) {
        linePositions[k] = 0;
        lineColors[k] = 0;
      }
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Context lost / restored
    const canvas = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    const handleContextRestored = () => {
      animate();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }

      geometries.forEach(g => g.dispose());
      shapeMaterials.forEach(m => m.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      {/* FULL VIEWPORT FIXED 3D BACKGROUND CANVAS */}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden select-none"
      />

      {/* PLAYFUL INTERACTIVE BACKGROUND CONTROLS HUD */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {hudOpen && (
          <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl space-y-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between gap-4 font-mono text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                3D Playful Physics
              </span>
              <span className="text-[10px] text-slate-500">Click anywhere to pulse</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setInteractiveMode('flow')}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                  interactiveMode === 'flow'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Disperse Flow
              </button>

              <button
                type="button"
                onClick={() => setInteractiveMode('gravity')}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                  interactiveMode === 'gravity'
                    ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Gravity Pull
              </button>

              <button
                type="button"
                onClick={() => setInteractiveMode('constellation')}
                className={`px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                  interactiveMode === 'constellation'
                    ? 'bg-purple-400/20 text-purple-300 border border-purple-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Constellation
              </button>
            </div>

            <div className="text-[10px] text-slate-400 leading-tight">
              Move cursor to bend 3D field · Click for kinetic shockwave
            </div>
          </div>
        )}

        {/* Small Discreet Floating Toggle Button */}
        <button
          type="button"
          onClick={() => setHudOpen(!hudOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/70 shadow-lg backdrop-blur-md transition-all active:scale-95 text-xs font-mono group"
          title="Customize 3D Interactive Background"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">3D Background:</span>
          <span className="capitalize text-amber-300 font-semibold">{interactiveMode}</span>
        </button>
      </div>
    </>
  );
};
