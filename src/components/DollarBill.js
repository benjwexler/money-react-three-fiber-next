import { useTexture } from "@react-three/drei";
import { animated as a } from "@react-spring/three";
import * as THREE from "three";
import testVertexShader from "../../src/shaders/vertex.glsl";
import testFragmentShader from "../../src/shaders/fragment.glsl";
import { length } from "../constants";

const _uniforms = {
  uFrequency: { value: new THREE.Vector2(0, 9.2) },
  uTime: { value: 0 },
  uColor: { value: new THREE.Color("cyan") },
  uRotation: { value: 0.0 },
};

const DollarBill = ({
  isVisible,
  _ref,
  position,
  rotation,
  uCoefficientVal = 0.0,
  startingYRotation = 0,
  scale = 1,
}) => {
  const dollarTexture = useTexture("usdollar100front.jpeg");

  const uniforms = {
    ..._uniforms,
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
      <planeBufferGeometry args={[scale, scale, 32, 32]} />
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
