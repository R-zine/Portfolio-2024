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
import { Fallback } from "./components";

const isMobile = (function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
    // @ts-ignore
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
})();

const targetOffset = 0.6;

export const Home = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const spotlightRef = useRef<any>(null);

  const displacementMap = useLoader(TextureLoader, "287.webp");

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

  if (isMobile) return <Fallback />;

  return (
    <>
      <div
        className="home-container"
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
      <Fallback isFallback />
    </>
  );
};
