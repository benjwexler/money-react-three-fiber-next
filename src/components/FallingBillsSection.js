import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import ShowIf from "./ShowIf";
import TextHighlight from "./TextHighlight";
import FallingBills from "./FallingBills";
import { cameraInfo } from "../constants";

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
              color: "white",
              transform: "translate(-50%, -50%)",
              position: "absolute",
              left: "50%",
              top: "50%",
              padding: 20,
              background: "black",
              opacity: 0.5,
              borderRadius: 5,
              width: "100%",
            }}
          >
            <div style={{ visibility: "hidden" }}>
              <h1 className="the-end">The End</h1>
              <h2 style={{ fontSize: 24 }} className="created-with">
                Created with React-Three-Fiber & React-Spring
              </h2>
              <h3 style={{ marginTop: 20 }}>
                <a
                  style={{ color: "#31d192" }}
                  href="https://github.com/benjwexler/money-react-three-fiber-next"
                  target="_blank"
                >
                  Source Code
                </a>
              </h3>
            </div>
          </div>

          <div
            className="falling-bills-text-container"
            style={{
              color: "white",
              transform: "translate(-50%, -50%)",
              position: "absolute",
              left: "50%",
              top: "50%",
              padding: 20,
              opacity: 1,
              borderRadius: 5,
              width: "100%",
            }}
          >
            <h1 className="the-end">The End</h1>
            <h2
              style={{
                fontSize: 24,
              }}
              className="created-with"
            >
              Created with React-Three-Fiber & React-Spring
            </h2>
            <h3 style={{ marginTop: 20 }}>
              <TextHighlight>
                <a
                  href="https://github.com/benjwexler/money-react-three-fiber-next"
                  target="_blank"
                >
                  Source Code
                </a>
              </TextHighlight>
            </h3>
          </div>
        </div>
      </ShowIf>
    </>
  );
}
