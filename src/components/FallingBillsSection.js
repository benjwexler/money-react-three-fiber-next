import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import ShowIf from "./ShowIf";
import FallingBills from "./FallingBills";
import { cameraInfo } from "../constants";
import EndCredits from "./EndCredits";

const endCreditsStyle = {
  color: "white",
  transform: "translate(-50%, -50%)",
  position: "absolute",
  left: "50%",
  top: "50%",
  padding: 20,
  borderRadius: 5,
  width: "100%",
};

export default function FallingBillsSection({
  shouldDisplayFallingBills,
  scrollingSectionRef,
  scale,
}) {
  return (
    <>
      <Canvas
        className="canvas"
        gl={{ antialias: false }}
        camera={{ ...cameraInfo, position: [0, -4, 5] }}
        dpr={
          typeof window === "undefined"
            ? 1
            : Math.min(window.devicePixelRatio, 2)
        }
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <FallingBills isVisible={shouldDisplayFallingBills} scale={scale} />
        </Suspense>
      </Canvas>
      <div ref={scrollingSectionRef} className="falling-bills-section">
        Falling Bills Section
      </div>
      <ShowIf condition={shouldDisplayFallingBills}>
        <div
          style={{
            position: "fixed",
            top: 0,
            width: "100vw",
            height: "100vh",
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...endCreditsStyle,
              background: "black",
              opacity: 0.5,
            }}
          >
            <EndCredits style={{ visibility: "hidden" }} />
          </div>

          <EndCredits
            style={{
              ...endCreditsStyle,
              opacity: 1,
            }}
          />
        </div>
      </ShowIf>
    </>
  );
}
