'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeJSLogo = ({
  className = '',
  sizes = { sm: 200, md: 300, lg: 400, xl: 500 },
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number | null>(null);
  const sizeRef = useRef(sizes.md); // Default to medium size

  // Function to get current size based on window width
  const getCurrentSize = () => {
    if (typeof window === 'undefined') return sizes.md;

    const width = window.innerWidth;
    if (width >= 1280) return sizes.xl; // xl breakpoint
    if (width >= 1024) return sizes.lg; // lg breakpoint
    if (width >= 768) return sizes.md; // md breakpoint
    return sizes.sm; // sm and below
  };

  useEffect(() => {
    console.log('=== useEffect STARTED ===');

    // Ensure we're on the client side
    if (typeof window === 'undefined') {
      console.log('Server side, skipping Three.js setup');
      return;
    }

    // Check if already initialized
    if (sceneRef.current || rendererRef.current) {
      console.log('Three.js already initialized, skipping...');
      return;
    }

    if (!containerRef.current) {
      console.log('Container not available');
      return;
    }

    // Clean container first
    containerRef.current.innerHTML = '';
    console.log('Container cleared');

    // Get size based on current breakpoint
    const canvasSize = getCurrentSize();
    sizeRef.current = canvasSize;
    console.log(`Using size: ${canvasSize}x${canvasSize}`);

    // Scene setup - using breakpoint size
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    // Set size based on breakpoint
    renderer.setSize(canvasSize, canvasSize);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Generate static canvas ID
    const canvasId = 'threejs-canvas-logo';
    renderer.domElement.id = canvasId;
    renderer.domElement.style.maxWidth = '100%';
    renderer.domElement.style.maxHeight = '100%';
    console.log(`Creating canvas with ID: ${canvasId}`);

    containerRef.current.appendChild(renderer.domElement);

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(12, 6, 12);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.radius = 8;
    directionalLight.shadow.blurSamples = 25;
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0xff4444, 0.2);
    rimLight.position.set(-8, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(2, -2, 8);
    scene.add(fillLight);

    // Ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -4;
    ground.receiveShadow = true;
    scene.add(ground);

    // Materials
    const redMaterial = new THREE.MeshPhongMaterial({
      color: 0xcc2a2a,
      shininess: 60,
      specular: 0x881111,
      emissive: 0x110000,
      bumpScale: 0.05,
    });

    const bracketMaterial = new THREE.MeshPhongMaterial({
      color: 0xcc2a2a,
      shininess: 60,
      specular: 0x881111,
      emissive: 0x110000,
      bumpScale: 0.05,
    });

    // Create L shape group
    const group = new THREE.Group();

    // Vertical part of L
    const verticalGeometry = new THREE.BoxGeometry(1.2, 6, 1.2);
    const verticalMesh = new THREE.Mesh(verticalGeometry, redMaterial);
    verticalMesh.position.set(-0.5, 0, 0);
    verticalMesh.castShadow = true;
    verticalMesh.receiveShadow = true;
    group.add(verticalMesh);

    // Horizontal part of L
    const horizontalGeometry = new THREE.BoxGeometry(3.6, 1.2, 1.2);
    const horizontalMesh = new THREE.Mesh(horizontalGeometry, redMaterial);
    horizontalMesh.position.set(0.7, -2.4, 0);
    horizontalMesh.castShadow = true;
    horizontalMesh.receiveShadow = true;
    group.add(horizontalMesh);

    // Corner brackets
    const bracketThickness = 0.3;
    const bracketLength = 1.0;

    // Top left bracket
    const topLeftV = new THREE.Mesh(
      new THREE.BoxGeometry(bracketThickness, bracketLength, bracketThickness),
      bracketMaterial
    );
    topLeftV.position.set(-3.2, 3.5, 0);
    topLeftV.castShadow = true;
    group.add(topLeftV);

    const topLeftH = new THREE.Mesh(
      new THREE.BoxGeometry(bracketLength, bracketThickness, bracketThickness),
      bracketMaterial
    );
    topLeftH.position.set(-2.7, 3.85, 0);
    topLeftH.castShadow = true;
    group.add(topLeftH);

    // Top right bracket
    const topRightV = new THREE.Mesh(
      new THREE.BoxGeometry(bracketThickness, bracketLength, bracketThickness),
      bracketMaterial
    );
    topRightV.position.set(4.0, 3.5, 0);
    topRightV.castShadow = true;
    group.add(topRightV);

    const topRightH = new THREE.Mesh(
      new THREE.BoxGeometry(bracketLength, bracketThickness, bracketThickness),
      bracketMaterial
    );
    topRightH.position.set(3.5, 3.85, 0);
    topRightH.castShadow = true;
    group.add(topRightH);

    // Bottom left bracket
    const bottomLeftV = new THREE.Mesh(
      new THREE.BoxGeometry(bracketThickness, bracketLength, bracketThickness),
      bracketMaterial
    );
    bottomLeftV.position.set(-3.2, -3.5, 0);
    bottomLeftV.castShadow = true;
    group.add(bottomLeftV);

    const bottomLeftH = new THREE.Mesh(
      new THREE.BoxGeometry(bracketLength, bracketThickness, bracketThickness),
      bracketMaterial
    );
    bottomLeftH.position.set(-2.7, -3.85, 0);
    bottomLeftH.castShadow = true;
    group.add(bottomLeftH);

    // Bottom right bracket
    const bottomRightV = new THREE.Mesh(
      new THREE.BoxGeometry(bracketThickness, bracketLength, bracketThickness),
      bracketMaterial
    );
    bottomRightV.position.set(4.0, -3.5, 0);
    bottomRightV.castShadow = true;
    group.add(bottomRightV);

    const bottomRightH = new THREE.Mesh(
      new THREE.BoxGeometry(bracketLength, bracketThickness, bracketThickness),
      bracketMaterial
    );
    bottomRightH.position.set(3.5, -3.85, 0);
    bottomRightH.castShadow = true;
    group.add(bottomRightH);

    scene.add(group);

    // Position camera
    camera.position.set(0, 1, 8);
    camera.lookAt(0, 0, 0);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    groupRef.current = group;

    console.log('Three.js setup complete');

    // Resize handler - updates size based on breakpoint
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;

      const newSize = getCurrentSize();
      if (newSize !== sizeRef.current) {
        sizeRef.current = newSize;
        rendererRef.current.setSize(newSize, newSize);
        cameraRef.current.aspect = 1;
        cameraRef.current.updateProjectionMatrix();

        // Update container size
        if (containerRef.current) {
          containerRef.current.style.width = `${newSize}px`;
          containerRef.current.style.height = `${newSize}px`;
        }
      }
    };

    // Mouse move event listener
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      targetRotationRef.current.y = mouseX * 0.2;
      targetRotationRef.current.x = -mouseY * 0.2;
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (groupRef.current) {
        groupRef.current.rotation.y +=
          (targetRotationRef.current.y - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x +=
          (targetRotationRef.current.x - groupRef.current.rotation.x) * 0.05;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Cleanup function
    return () => {
      console.log(`Cleaning up Three.js canvas: ${canvasId}`);

      // Stop animation
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);

      // Clear container
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }

      // Dispose Three.js objects
      if (scene) {
        scene.traverse((child: any) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material: any) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });

        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
      }

      if (renderer) {
        renderer.dispose();
        const gl = renderer.getContext();
        const loseContext = gl?.getExtension('WEBGL_lose_context');
        if (loseContext) loseContext.loseContext();
      }

      // Clear refs
      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      groupRef.current = null;

      console.log('Three.js cleanup complete');
    };
  }, [sizes]); // Add sizes as dependency

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center transition-all duration-300 ${className}`}
      style={{ width: sizeRef.current, height: sizeRef.current }}
    />
  );
};

export default ThreeJSLogo;
