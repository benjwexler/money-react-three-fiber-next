import { useRef, useState, useEffect } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import { useTransition, to } from "@react-spring/three";
import * as THREE from "three";

import { width, length } from "../constants";
import { getRandomInt, degrees_to_radians } from "../utils";
import DollarBill from "./DollarBill";

const FallingBills = ({ isVisible }) => {
  const [bills, setBills] = useState([]);
  const groupRef = useRef();

  const [boundingCoords, setBoundingCoords] = useState({ x: 0, y: 0 });

  const percentageToRange = (min, max, percentage) => {
    return (max - min) * (percentage / 100) + min;
  };

  const { camera } = useThree();

  useEffect(() => {
    const handleResize = () => {
      var vec = new THREE.Vector3(); // create once and reuse
      var pos = new THREE.Vector3(); // create once and reuse

      vec.set(0 * 2 - 1, -0 * 2 + 1, 0.5);

      vec.unproject(camera);

      vec.sub(camera.position).normalize();

      var distance = -camera.position.z / vec.z;

      pos.copy(camera.position).add(vec.multiplyScalar(distance));

      setBoundingCoords(pos);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [camera]);

  const boundingY = boundingCoords.y + length / 2;
  let y = percentageToRange(boundingY, -boundingY, 0);
  const boundingX = boundingCoords.x + width / 2;

  const rangeRef = useRef({ min: -8, max: 9 });
  const signRef = useRef(1);
  const angleRotationRef = useRef(0);
  const totalTime = useRef(3);

  useFrame((state, delta) => {
    const angle = angleRotationRef.current;
    const posX = getRandomInt(100);
    totalTime.current += delta;
    if (totalTime.current >= 3) {
      setBills((prevBills) => {
        return [...prevBills, { x: posX, id: Date.now(), shouldDisplay: true }];
      });
      totalTime.current = 0;
    }

    const hasReachedMin = angle <= rangeRef.current.min;
    const hasReachedMax = angle >= rangeRef.current.max;

    angleRotationRef.current = hasReachedMin
      ? rangeRef.current.min
      : hasReachedMax
      ? rangeRef.current.max
      : angle;

    if (hasReachedMax || hasReachedMin) {
      signRef.current *= -1;
    }
    if (signRef?.current) {
      angleRotationRef.current += 0.2 * signRef.current;
    }

    (groupRef.current?.children || []).map((mesh) => {
      mesh.rotation.y =
        degrees_to_radians(angleRotationRef.current) +
        degrees_to_radians(mesh.startingYRotation);
    });
  });

  const transitions = useTransition(bills, {
    keys: (item) => item.id,
    from: (bill) => {
      return {
        position: [percentageToRange(boundingX, -boundingX, bill.x), y, 0],
        positionX: bill.x,
        positionY: y,
        positionZ: 0,
        startingYRotation: degrees_to_radians(getRandomInt(360)),
      };
    },
    enter: (bill) => {
      return {
        position: [percentageToRange(boundingX, -boundingX, bill.x), -y, -2],
        positionY: -y,
        positionZ: -2,
      };
    },
    config: {
      duration: 15000,
    },
    onRest: (result, ctrl, item) => {
      setBills((prevBills) => {
        return prevBills.filter((bill) => bill.id !== item.id);
      });
    },
  });

  return (
    <group ref={groupRef} visible={isVisible}>
      {transitions(
        ({ startingYRotation, positionX, positionY, positionZ }, item) => {
          return (
            <DollarBill
              key={item.id}
              uCoefficientVal={0.16}
              position={to(
                [positionX, positionY, positionZ],
                (positionX, positionY, positionZ) => [
                  percentageToRange(boundingX, -boundingX, positionX),
                  positionY,
                  positionZ,
                ]
              )}
              rotation={[degrees_to_radians(-15), 0, 0]}
              startingYRotation={startingYRotation}
              isVisible={true}
            />
          );
        }
      )}
    </group>
  );
};

export default FallingBills;
