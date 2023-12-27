import { Suspense, useState, useRef, useEffect, useLayoutEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
// @ts-ignore
import { TextureLoader } from "three/src/loaders/TextureLoader";
import {
  EffectComposer,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import font from "./font.ttf";

const targetOffset = 0.6;

export const Home = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const spotlightRef = useRef<any>(null);

  const displacementMap = useLoader(TextureLoader, "287.jpg");

  useLayoutEffect(() => {
    const spinner = document.querySelector(".spinner");
    if (spinner) (spinner as HTMLElement).style.display = "none";

    return () => {
      const spinner = document.querySelector(".spinner");
      if (spinner) (spinner as HTMLElement).style.display = "block";
      document.querySelector(".info-btn")?.classList.remove("active");
    };
  }, []);

  useEffect(() => {
    if (spotlightRef.current) {
      spotlightRef.current.target!.position.x = pos.x / targetOffset;
      spotlightRef.current.target.position.y = -pos.y / targetOffset;
      spotlightRef.current.target.updateMatrixWorld();
    }
  }, [spotlightRef.current, pos]);

  useEffect(() => {
    if (isHovered) {
      document.querySelector(".info-btn")?.classList.toggle("active");
      setTimeout(() => {
        document.querySelector(".info-btn")?.classList.toggle("active");
        setIsHovered(false);
      }, 1500);
    }
  }, [isHovered]);

  return (
    <div
      style={{
        fontSize: 200,
        zIndex: 1000,
        color: "white",
        width: "100%",
        height: "100%",
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          shadows
          gl={{ antialias: true }}
          onMouseMove={(e) =>
            setPos({
              x: (e.clientX - window.innerWidth / 2) / 1000 - 0.5,
              y: (e.clientY - window.innerHeight / 2) / 1000,
            })
          }
        >
          <EffectComposer>
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL} // blend mode
              //@ts-ignore
              offset={[pos.x / 500, -pos.y / 500]} // color offset
            />
          </EffectComposer>
          <spotLight
            ref={spotlightRef}
            position={[pos.x, -pos.y, 2]}
            intensity={50}
            decay={4.5}
            penumbra={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <mesh position={[0, 0, -1.1]} receiveShadow>
            <boxGeometry args={[10, 10, 1]} />
            <meshStandardMaterial
              bumpMap={displacementMap}
              displacementMap={displacementMap}
              metalnessMap={displacementMap}
              roughness={0.5}
              color="grey"
            />
          </mesh>
          <Text
            scale={0.4}
            font={font}
            fontSize={0.3}
            outlineColor="white"
            outlineWidth={0.005}
            lineHeight={0.7}
            color="white"
            anchorX="center"
            anchorY={-3}
            castShadow
          >
            Welcome.&#10;&#13;&#10;&#13;&#10;&#13;&#10;&#13;I am Ivan Radev,
            &#10;&#13;a creative, full-stack developer based in
            Bulgaria.&#10;&#13;&#10;&#13;I weave visions into reality since
            2007. &#10;&#13;&#10;&#13;&#10;&#13;This showcase website is made
            with Astro &#10;&#13;+ React / Angular / Svelte / Vue / HTMX
          </Text>
          <Text
            onPointerEnter={() => setIsHovered(true)}
            scale={0.4}
            font={font}
            fontSize={0.3}
            outlineColor="white"
            outlineWidth={0.005}
            lineHeight={0.7}
            color="white"
            anchorX="center"
            anchorY={3}
            castShadow
          >
            Press the Info button for more.
          </Text>
        </Canvas>
      </Suspense>
    </div>
  );
};
