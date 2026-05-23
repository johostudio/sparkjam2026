"use client";

import { useEffect, useMemo, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MODEL_PATH = "/iphone-15-model/scene.gltf";
const VIDEO_PATH = "/connecting-friends.mp4";

interface PhoneModelProps {
  rotationY: number | MotionValue<number>;
  /** If true, skip the auto-rotation lerp (user is dragging) */
  enableOrbitOverride?: boolean;
}

export default function PhoneModel({
  rotationY,
  enableOrbitOverride = false,
}: PhoneModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const screenMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name === "BasePhone_Screen_0") {
        const material = Array.isArray(child.material)
          ? child.material[0]
          : child.material;
        if (material instanceof THREE.MeshStandardMaterial) {
          screenMaterialRef.current = material;
        }
      }
    });
  }, [clonedScene]);

  useEffect(() => {
    const screenMaterial = screenMaterialRef.current;
    if (!screenMaterial) return;

    const video = document.createElement("video");
    video.src = VIDEO_PATH;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    videoRef.current = video;

    video.play().catch((err) => {
      console.warn("[PhoneModel] Video autoplay deferred:", err);
    });

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.flipY = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.center.set(0.5, 0.5);
    texture.repeat.set(1.4, -1.4);
    videoTextureRef.current = texture;

    screenMaterial.map = texture;
    screenMaterial.emissiveMap = texture;
    screenMaterial.emissive = new THREE.Color(1, 1, 1);
    screenMaterial.emissiveIntensity = 1.05;
    screenMaterial.needsUpdate = true;

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
      if (videoTextureRef.current) {
        videoTextureRef.current.dispose();
      }
    };
  }, []);

  // Smooth rotation; keep motion minimal to reduce frame cost.
  useFrame(() => {
    if (!groupRef.current) return;
    const targetRotation =
      typeof rotationY === "number" ? rotationY : rotationY.get();

    if (!enableOrbitOverride) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.06
      );
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
