import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei/core/Text";
import { TextureLoader, Vector2, type SpotLight } from "three";
import {
  EffectComposer,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import font from "./font.ttf";

const targetOffset = 0.6;

interface SceneProps {
  pos: { x: number; y: number };
  onInfoHint: () => void;
  onReady: () => void;
}

const Scene = ({ pos, onInfoHint, onReady }: SceneProps) => {
  const spotlightRef = useRef<SpotLight>(null);
  const displacementMap = useLoader(TextureLoader, "/287.webp");
  const chromaticOffset = useMemo(
    () => new Vector2(pos.x / 500, -pos.y / 500),
    [pos.x, pos.y],
  );

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    spotlight.target.position.x = pos.x / targetOffset;
    spotlight.target.position.y = -pos.y / targetOffset;
    spotlight.target.updateMatrixWorld();
  }, [pos]);

  return (
    <>
      <EffectComposer>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={chromaticOffset}
          radialModulation={false}
          modulationOffset={0.15}
        />
      </EffectComposer>
      <spotLight
        ref={spotlightRef}
        position={[pos.x, -pos.y, 2]}
        intensity={50}
        decay={4.5}
        penumbra={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
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
        &#10;&#13;a creative, full-stack developer based in Bulgaria.
        &#10;&#13;&#10;&#13;I weave visions into reality since 2007.
        &#10;&#13;&#10;&#13;&#10;&#13;This showcase website is made with Astro
        &#10;&#13;+ React / Angular / Svelte / Vue / HTMX
      </Text>
      <Text
        onPointerEnter={onInfoHint}
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
    </>
  );
};

export const Home = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [showInfoHint, setShowInfoHint] = useState(false);

  const handleReady = useCallback(() => {
    const spinner = document.querySelector<HTMLElement>(".spinner");
    if (spinner) spinner.style.display = "none";
  }, []);

  useEffect(() => {
    if (!showInfoHint) return;

    const infoButton = document.querySelector(".info-btn");
    infoButton?.classList.add("active");

    const timer = window.setTimeout(() => {
      infoButton?.classList.remove("active");
      setShowInfoHint(false);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
      infoButton?.classList.remove("active");
    };
  }, [showInfoHint]);

  return (
    <div className="home-container">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onMouseMove={(event) =>
          setPos({
            x: (event.clientX - window.innerWidth / 2) / 1000 - 0.5,
            y: (event.clientY - window.innerHeight / 2) / 1000,
          })
        }
      >
        <Suspense fallback={null}>
          <Scene
            pos={pos}
            onInfoHint={() => setShowInfoHint(true)}
            onReady={handleReady}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
