
import { useRef, useState, Suspense } from 'react'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import ShowIf from './ShowIf'
import * as THREE from "three";
import { 
  degrees_to_radians,
  checkIfElemHasPastViewport,
  createBillsArr,
} from '../utils';
import {cameraInfo, bills} from '../constants'
import DollarBillStacked from './DollarBillStacked';

var vector = new THREE.Vector3();

function toScreenPosition({ object, length, camera, size }) {
  if (!object) return { x: 0, y: 0 }

  var widthHalf = 0.5 * size.width;
  var heightHalf = 0.5 * size.height;
  const objectClone = object.clone()
  objectClone.position.x = objectClone.position.x - 0.5;
  objectClone.position.y = objectClone.position.y + (0.5 * length);

  objectClone.updateMatrixWorld();
  vector.setFromMatrixPosition(objectClone.matrixWorld);
  vector.project(camera);

  return {
    x: ((vector.x - 0) * widthHalf) + widthHalf,
    y: - ((vector.y + 0) * heightHalf) + heightHalf
  };
};

export function TitlePosition({ hiddenBillRef, setTitlePosition }) {
  const { camera, size } = useThree();

  const updateScreenPosition = () => {
    const { x, y } = toScreenPosition({ object: hiddenBillRef ?.current, length, size, camera })
    setTitlePosition({ x, y })
  }

  useFrame(() => {
    updateScreenPosition()
  })

  return null;
}

const TitleWithHiddenCanvas = ({ children, author, isMobile }) => {
  const hiddenBillRef = useRef();
  const [titlePosition, setTitlePosition] = useState({ x: 0, y: 0 })
  return (
    <>
      <ShowIf condition={hiddenBillRef ?.current}>
        <div className="title-container">
          <div className="page1-title-container" style={{ marginLeft: titlePosition.x > 60 ? titlePosition.x : 60 }}>
            <h1 className="title">{children}</h1>
            <h2 className="creator">
              <span style={{ color: 'white' }}>By </span>
              {author}
            </h2>
          </div>
        </div>
      </ShowIf>

      <Canvas
        frameloop="demand"
        className="canvas"
        camera={cameraInfo}
      >
        <TitlePosition hiddenBillRef={hiddenBillRef} setTitlePosition={setTitlePosition} />
        <Suspense fallback={null}>
          <DollarBillStacked isMobile={isMobile} {...bills[10]} _ref={hiddenBillRef} isVisible={false} />
        </Suspense>
      </Canvas>
    </>
  )
}

export default TitleWithHiddenCanvas;
