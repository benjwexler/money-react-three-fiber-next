import '../styles/globals.css'

import React, { useRef, useState, Suspense, useEffect, useLayoutEffect } from 'react'

import { a, useSpring, config } from '@react-spring/web';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from "three";
import testVertexShader from '../src/shaders/vertex.glsl';
import testFragmentShader from '../src/shaders/fragment.glsl';
import Note from '../src/components/Note';
import Sidebar from '../src/components/Sidebar';
import Helmet from '../src/components/Helmet';
import debounce from 'lodash.debounce';

export function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function toScreenPosition({object, length, camera, size}) {
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

const length = 2.61 / 6.14
const height = 0.008;
const width = 1;

const OrigCameraCoords = [-2, 4, 5]
const endCameraCoords = [2, 4, 0];
const diffCameraCoords = OrigCameraCoords.map((coord, i) => coord - endCameraCoords[i])

const cameraInfo = { position: [-2, 4, 5], fov: 30, near: 0.1, far: 100 };

const createBillsArr = () => {
  const arr = []
  const rows = 4;
  const cols = 4;
  const numBills = 10;
  let num = (numBills / 2) * -1;
  let row = (rows / 2) * -1;
  let col = (cols / 2) * -1;

  while (col < (cols / 2)) {
    arr.push({
      index: num,
      numRow: row,
      numCol: col,
    })

    num += 1

    if (num > numBills / 2) {
      num = (numBills / 2) * -1
      row += 1
    }

    if (row >= rows / 2) {
      col += 1
      row = (rows / 2) * -1

    }
  }

  return arr;
}

const _uniforms = {
  uFrequency: { value: new THREE.Vector2(0, 9.2) },
  uTime: { value: 0 },
  uColor: { value: new THREE.Color('cyan') },
  uCoefficient: { value: 0.0 },
  uRotation: { value: 0.0 },
};

function DollarBill({
  index,
  numRow,
  numCol,
  isVisible,
  _ref,
}) {
  const dollarTexture = useTexture('usdollar100front.jpeg')

  const uniforms = {
    ..._uniforms,
    uTexture: { value: dollarTexture },
  }

  const position = { x: 0, y: 0, z: 0 }
  position.y += ((index * height) * 3);
  position.z += (numRow * length * 1.1) + (length / 2);
  position.x += ((numCol) * 1.1) + width / 2;

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      rotation={[degrees_to_radians(270), 0, 0]}
      scale={[1, length, 1]}
      visible={isVisible}
      ref={_ref}
    >
      <planeBufferGeometry args={[1, 1, 32, 32]} />
      <rawShaderMaterial
        args={[{
          uniforms,
          vertexShader: testVertexShader,
          fragmentShader: testFragmentShader,
        }]}
      />
    </mesh>
  )
}

export function Scroll({ noteRef, noteRef2, setShouldShowSidebar, setNoteToDisplay }) {
  const scrollPercentage = useRef(0);
  const checkIfElemHasPastViewport = (elem, shouldSetScrollPercentage) => {
    if (!elem) return;

    //get the distance scrolled on body (by default can be changed)
    var distanceScrolled = document.body.scrollTop;
    //create viewport offset object
    var elemRect = elem.getBoundingClientRect();

    //get the offset from the element to the viewport
    var elemViewportOffset = elemRect.top;
    //add them together
    var totalOffset = distanceScrolled + elemViewportOffset;

    let _scrollPercentage;
    _scrollPercentage = totalOffset / window.innerHeight
    _scrollPercentage = _scrollPercentage < 0 ? 0 : _scrollPercentage
    _scrollPercentage = 1 - _scrollPercentage;
    if (shouldSetScrollPercentage) scrollPercentage ?.current = _scrollPercentage;

    return _scrollPercentage;
  }

  const refs = [noteRef ?.current, noteRef2 ?.current]

  useEffect(() => {
    window.addEventListener('scroll', debounce(() => {
      const shouldShow = checkIfElemHasPastViewport(noteRef ?.current, true) >= 1
      setShouldShowSidebar(shouldShow)
      const index = refs.findIndex((elem, i) => !(checkIfElemHasPastViewport(elem) >= 1));
      let note = index < 0 ? refs.length : index;
      setNoteToDisplay(note)
    }, 16, { leading: true }), true)
  }, [])

  useFrame(({ camera }) => {
    const x = OrigCameraCoords[0] - (diffCameraCoords[0] * scrollPercentage.current);
    const y = OrigCameraCoords[1] - (diffCameraCoords[1] * scrollPercentage.current)
    const z = OrigCameraCoords[2] - (diffCameraCoords[2] * scrollPercentage.current)

    camera.position.set(
      x > 0 ? 0 : x < -2 ? -2 : x,
      y,
      z > 5 ? 5 : z,
    )

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

  })
  return null
}

var vector = new THREE.Vector3();
var isChrome = typeof window === 'undefined' ? false : !!window.chrome;

export function TitlePosition({ hiddenBillRef, setTitlePosition }) {
  const { camera, size } = useThree();
  const hasInitializedPosition = useRef(false);

  const updateScreenPosition = () => {
    const { x, y } = toScreenPosition({ object: hiddenBillRef?.current, length, size, camera })
    setTitlePosition({ x, y })
  }

  useFrame(() => {
    if (!isChrome) {

      if (!hasInitializedPosition.current && hiddenBillRef.current) {
        hasInitializedPosition.current = true;
        updateScreenPosition()
      }
      return
    };
    updateScreenPosition()
  })

  useEffect(() => {
    if (isChrome) return;
    window.addEventListener('resize', () => {
      updateScreenPosition()
    })
  }, [])

  return null;
}
export function TextHighlight({ children }) {
  return (
    <span style={{ color: '#31d192' }}>{children} </span>
  )
}

const bills = createBillsArr();

const TitleWithHiddenCanvas = ({ children, author }) => {
  const hiddenBillRef = useRef();
  const [titlePosition, setTitlePosition] = useState({ x: 0, y: 0 })
  return (
    <>
      {hiddenBillRef?.current ? (
        <div className="title-container">
          <div className="page1-title-container" style={{ marginLeft: titlePosition.x > 60 ? titlePosition.x : 60 }}>
            <h1 className="title">{children}</h1>
            <h2 className="creator">
              <span style={{ color: 'white' }}>By </span>
              {author}
            </h2>
          </div>
        </div>
      ) : null}

      <Canvas
        frameloop="demand"
        className="canvas"
        camera={cameraInfo}
      >
        <TitlePosition hiddenBillRef={hiddenBillRef} setTitlePosition={setTitlePosition} />
        <Suspense fallback={null}>
          <DollarBill {...bills[10]} _ref={hiddenBillRef} isVisible={false} />
        </Suspense>
      </Canvas>
    </>
  )
}

const getSidebarContent = ({
  shouldReset,
  noteToDisplay,
}) => {
  if (shouldReset) return null;

  switch (noteToDisplay) {
    case 1:
      return (
        <>
          <h2>Some Headline</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </>
      )
    case 2:
      return (
        <>
          <h2>Blah</h2>
          <p>Blah Blah sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Lorem ipsum dolor sit blah, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </>
      )
    default:
      return null;
  }
}

const StackedBills = () => {
  const itemsRef = useRef([]);

  useEffect(() => {
     itemsRef.current = itemsRef.current.slice(0, bills.length);
  }, []);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count + 1 >= bills.length) clearInterval(interval)
      itemsRef?.current[count]?.visible = true
      count++
    }, 50)
  }, [])

  return (
    <Suspense fallback={null}>
      {bills.map((item, i) => {
        return (
          <DollarBill
            isVisible={false}
            key={i}
            _ref={el => itemsRef.current[i] = el} 
            {...item}
          />
        )
      })}
    </Suspense>
  )
}

export default function App(props) {
  const noteRef = useRef();
  const noteRef2 = useRef();

  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const [noteToDisplay, setNoteToDisplay] = useState(0);
  const scrollProps = { noteRef, noteRef2, setShouldShowSidebar, setNoteToDisplay };
  const [shouldReset, setShouldReset] = useState(true);

  useLayoutEffect(() => {
    setShouldReset(true)
  }, [noteToDisplay])

  useEffect(() => {
    setShouldReset(false)
  }, [shouldReset])

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { ...config.molasses, duration: 700 },
    reset: shouldReset,
  })

  return (
    <>
      <Helmet />
      <TitleWithHiddenCanvas author='Ben Wexler'>
        What is Inflation?
      </TitleWithHiddenCanvas>

      <Canvas
        className="canvas"
        gl={{ antialias: false }}
        camera={cameraInfo}
        dpr={typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, 2)}
      >
        <Scroll {...scrollProps} />
        <StackedBills />
      </Canvas>

      <Note _ref={noteRef} title='Rising Prices'>
        Prices rose by <TextHighlight>6.2 per cent</TextHighlight> compared to a year ago.
      </Note>
      <Note _ref={noteRef2} title='Note 2'>
        Prices rose by <TextHighlight>6.2 per cent</TextHighlight> compared to a year ago.
      </Note>
      <Note title='Note 3'>
        Prices rose by <TextHighlight>6.2 per cent</TextHighlight> compared to a year ago.
      </Note>

      <Sidebar shouldShowSidebar={shouldShowSidebar}>
        <a.div style={springProps}>
          {getSidebarContent({ noteToDisplay, shouldReset })}
        </a.div>
      </Sidebar>
    </>
  )
}
