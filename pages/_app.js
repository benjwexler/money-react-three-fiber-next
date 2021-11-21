import '../styles/globals.css'

import React, { useRef, useState, Suspense, useEffect, useLayoutEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import {a, useSpring, config} from '@react-spring/web';
useLayoutEffect
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from "three";
import testVertexShader from '../src/shaders/vertex.glsl';
import testFragmentShader from '../src/shaders/fragment.glsl';
import Note from '../src/components/Note';
import Sidebar from '../src/components/Sidebar';
import debounce from 'lodash.debounce';

export function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

const length = 2.61 / 6.14
const height = 0.008;
const width = 1;

const OrigCameraCoords = [-2, 4, 5]
const endCameraCoords = [2, 4, 0];
const diffCameraCoords = OrigCameraCoords.map((coord, i) => coord - endCameraCoords[i])

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

function DollarBill({
  index,
  numRow,
  numCol,
  isVisble,
}) {
  const dollarTexture = useTexture('usdollar100front.jpeg')

  const uniforms = {
    uFrequency: { value: new THREE.Vector2(0, 9.2) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('cyan') },
    uTexture: { value: dollarTexture },
    uCoefficient: { value: 0.0 },
    uRotation: { value: 0.0 },
  };

  const position = { x: 0, y: 0, z: 0 }
  position.y += ((index * height) * 3);
  position.z += (numCol * length * 1.1) + (length / 2);
  position.x += ((numRow) * 1.1) + width / 2;

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      rotation={[degrees_to_radians(270), 0, 0]}
      scale={[1, length, 1]}
      visible={isVisble}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <rawShaderMaterial
        args={[{
          uniforms,
          vertexShader: testVertexShader,
          fragmentShader: testFragmentShader,
          transparent: true,
          side: THREE.DoubleSide
        }]}
      />
    </mesh>
  )
}

export function Scroll({ noteRef, noteRef2, setShouldShowSidebar, setNoteToDisplay }) {
  const scrollPercentage = useRef(0);

  const checkIfElemHasPastViewport = (elem, shouldSetScrollPercentage) => {
    // console.log('elem', elem)
    if (!elem) return;
    //get the element
    // var elem = noteRef.current
    //get the distance scrolled on body (by default can be changed)
    var distanceScrolled = document.body.scrollTop;
    //create viewport offset object
    var elemRect = elem.getBoundingClientRect();
   
    // console.log('elemRect', elemRect)
    //get the offset from the element to the viewport
    var elemViewportOffset = elemRect.top;
    //add them together
    var totalOffset = distanceScrolled + elemViewportOffset;
    // console.log('totalOffset', totalOffset, elem)
    let _scrollPercentage;
    _scrollPercentage = totalOffset / window.innerHeight
    _scrollPercentage = _scrollPercentage < 0 ? 0 : _scrollPercentage
    _scrollPercentage = 1 - _scrollPercentage;
    if(shouldSetScrollPercentage) scrollPercentage?.current = _scrollPercentage;

    return _scrollPercentage;

    // setShouldShowSidebar(scrollPercentage.current >= 1)
  }

  const refs = [noteRef?.current, noteRef2?.current]

  useEffect(() => {
    window.addEventListener('scroll', debounce(() => {
      const index = refs.findIndex((elem, i) => !(checkIfElemHasPastViewport(elem) >= 1));
      // console.log('index', index)
      let note = index < 0 ? refs.length : index;
      setNoteToDisplay(note)



    }, 17, {leading: true}), true)

    window.addEventListener('scroll', () => {
      const shouldShow = checkIfElemHasPastViewport(noteRef?.current, true) >= 1
      setShouldShowSidebar(shouldShow)
    }, true)

    
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

export function TextHighlight({ children }) {
  return (
    <span style={{ color: '#31d192' }}>{children} </span>
  )
}

export default function App(props) {
  const [count, setCount] = useState(0)
  const noteRef = useRef();
  const noteRef2 = useRef();

  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);

  const [noteToDisplay, setNoteToDisplay] = useState(0);

  useEffect(() => {
    setInterval(() => setCount(prevCount => prevCount + 1), 50)
  }, [])

  const scrollProps = { noteRef, noteRef2, setShouldShowSidebar, setNoteToDisplay };
  const [shouldReset, setShouldReset] = useState(true);

  useEffect(() => {
    setShouldReset(false)
  }, [shouldReset])

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { ...config.molasses, duration: 650 },
    // delay: 500,

    reset: shouldReset,
  })


  useLayoutEffect(() => {
    setShouldReset(true)
  }, [noteToDisplay])

  const getSidebarContent = () => {
    if(shouldReset) return null;

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

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Antonio&family=Black+Han+Sans&family=Black+Ops+One&family=Chewy&family=Gruppo&family=Merriweather&family=Poppins&family=Press+Start+2P&family=Righteous&family=Sigmar+One&display=swap" rel="stylesheet" />
      </Head>
      <div className="title-container">
        <div className="page1-title-container">
          <h1 className="title">State of Inflation - 2021</h1>
          <h2 className="creator">
            <span style={{ color: 'white' }}>By </span>
            Ben Wexler
          </h2>
        </div>
      </div>
      <Canvas
        className="canvas"
        gl={{ antialias: false }}
        camera={{ position: [-2, 4, 5], fov: 30, near: 0.1, far: 100 }}
        dpr={typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, 2)}
      >
        <Scroll {...scrollProps} />
        <Suspense fallback={null}>
          {createBillsArr().map((item, i) => {
            return (
              <DollarBill
                isVisble={i <= count}
                key={i}
                {...item}
              />
            )
          })}
        </Suspense>
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
          {getSidebarContent()}
      </a.div>

      </Sidebar>

    </>
  )
}
