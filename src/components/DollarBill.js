import { animated as a } from "@react-spring/three";
import * as THREE from "three";
import testVertexShader from "../../src/shaders/vertex.glsl";
import testFragmentShader from "../../src/shaders/fragment.glsl";
import { length } from "../constants";
import { useInnerCanvasContext } from "../contexts/InnerCanvasContextProvider";

const DollarBill = ({
  isVisible,
  _ref,
  position,
  rotation,
  uCoefficientVal = 0.0,
  startingYRotation = 0,
  scale = 1,
}) => {
  const { dollarTexture } = useInnerCanvasContext() || {};

  const uniforms = {
    uRotation: { value: 0.0 },
    uCoefficient: { value: uCoefficientVal },
    uTexture: { value: dollarTexture },
  };

  return (
    <a.mesh
      position={position}
      rotation={rotation}
      scale={[1, length, 1]}
      visible={isVisible}
      ref={_ref}
      startingYRotation={startingYRotation}
    >
      <planeGeometry args={[scale, scale, 32, 32]} />
      <rawShaderMaterial
        args={[
          {
            uniforms,
            vertexShader: testVertexShader,
            fragmentShader: testFragmentShader,
            side: THREE.DoubleSide,
          },
        ]}
      />
    </a.mesh>
  );
};

export default DollarBill;
