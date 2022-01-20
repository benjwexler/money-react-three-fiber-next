import '../styles/globals.css'

import React, { useRef, useState, Suspense, useEffect } from 'react'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, AdaptiveDpr } from '@react-three/drei'
import { animated as a, useSprings, useTransition } from '@react-spring/three'
import * as THREE from "three";
import testVertexShader from '../src/shaders/vertex.glsl';
import testFragmentShader from '../src/shaders/fragment.glsl';
import Note from '../src/components/Note';
import SidebarWithContent from '../src/components/SidebarWithContent';
import Helmet from '../src/components/Helmet';
import debounce from 'lodash.debounce';
import ShowIf from '../src/components/ShowIf';


const checkIfElemHasPastViewport = (elem) => {
  if (!elem) return;

  //get the distance scrolled on body (by default can be changed)
  var distanceScrolled = document.body.scrollTop;
  //create viewport offset object
  var elemRect = elem.getBoundingClientRect();
  elem.style.opacity = getPercentInViewport(elemRect)
  //get the offset from the element to the viewport
  var elemViewportOffset = elemRect.top;
  //add them together
  var totalOffset = distanceScrolled + elemViewportOffset;

  let _scrollPercentage;
  _scrollPercentage = totalOffset / window.innerHeight
  _scrollPercentage = _scrollPercentage < 0 ? 0 : _scrollPercentage
  _scrollPercentage = _scrollPercentage > 1 ? 0 : 1 - _scrollPercentage
 

  return _scrollPercentage;
}

export function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

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

const length = 2.61 / 6.14
const height = 0.008;
const width = 1;

const OrigCameraCoords = [-2, 4, 5]
const endCameraCoords = [2, 4, 0];
const diffCameraCoords = OrigCameraCoords.map((coord, i) => coord - endCameraCoords[i])

const cameraInfo = { position: [-2, 4, 5], fov: 30, near: 3, far: 15 };

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
  
  uRotation: { value: 0.0 },
};

const DollarBill = ({
  isVisible,
  _ref,
  position,
  rotation,
  uCoefficientVal = 0.0
}) => {

  const dollarTexture = useTexture('usdollar100front.jpeg')

  const uniforms = {
    ..._uniforms,
    uCoefficient: { value: uCoefficientVal },
    uTexture: { value: dollarTexture },
  }

  return (
    <a.mesh
      position={position}
      rotation={rotation}
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
    </a.mesh>

  )

}

function DollarBillStacked({
  index,
  numRow,
  numCol,
  ...restProps,
}) {

  const position = { x: 0, y: 0, z: 0 }
  position.y += ((index * height) * 3);
  position.z += (numRow * length * 1.1) + (length / 2);
  position.x += ((numCol) * 1.1) + width / 2;

  return (
    <DollarBill 
      {...restProps}
      position={[position.x, position.y, position.z]}
      rotation={[degrees_to_radians(270), 0, 0]} 
    />
  )

}

const getPercentInViewport = (boundingRect) => {
  if (!boundingRect) return 0;
  const { height, top, bottom } = boundingRect;
  const offsetAmount = 100
  let amountInViewportTop = 1 - (-1 * ((top - offsetAmount) / height))
  amountInViewportTop = amountInViewportTop > 1 ? 1 : amountInViewportTop < 0 ? 0 : amountInViewportTop
  let amountInViewPortBottom = 1 - (((bottom + offsetAmount) - window.innerHeight) / height)
  amountInViewPortBottom = amountInViewPortBottom > 1 ? 1 : amountInViewPortBottom < 0 ? 0 : amountInViewPortBottom
  const finalVal = Math.min(amountInViewportTop, amountInViewPortBottom) * 1
  return (finalVal < .8 ? .8 : finalVal).toFixed(1)
}

export function Scroll({ noteRef, noteRef2, setShouldShowSidebar, setNoteToDisplay, scrollingSectionRef, handleScroll }) {
  const scrollPercentage = useRef(0);



  const refs = [noteRef ?.current, noteRef2 ?.current]

  const isFallingSectionInViewportRef = useRef();


  useEffect(() => {
    window.addEventListener('scroll', debounce(() => {
      handleScroll();
      const elemViewportPercentage = checkIfElemHasPastViewport(noteRef ?.current)
      scrollPercentage ?.current = elemViewportPercentage;
      const shouldShow = elemViewportPercentage >= 1
      
      setShouldShowSidebar(shouldShow)
  
      const index = refs.findIndex((elem, i) => {
        const percentage = checkIfElemHasPastViewport(elem);
        return !(percentage >= 1)
      });
      let note = index < 0 ? refs.length : index;
      setNoteToDisplay(note)
    }, 16, { leading: true }), true)
  }, [])

  useFrame(({ camera }) => {
    const x = OrigCameraCoords[0] - (diffCameraCoords[0] * scrollPercentage.current);
    const y = OrigCameraCoords[1] - (diffCameraCoords[1] * scrollPercentage.current)
    const z = OrigCameraCoords[2] - (diffCameraCoords[2] * scrollPercentage.current)

    if(isFallingSectionInViewportRef.current) {
      // camera.position.set(0, -4, 5)
      var cameraTarget = new THREE.Vector3(0, -4, 5);
      camera.position.lerp(cameraTarget, 0.01);

    } else {
      camera.position.set(
        x > 0 ? 0 : x < -2 ? -2 : x,
        y,
        z > 5 ? 5 : z,
      )

    }

   

    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

  })
  return null
}

var vector = new THREE.Vector3();

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
          <DollarBillStacked {...bills[10]} _ref={hiddenBillRef} isVisible={false} />
        </Suspense>
      </Canvas>
    </>
  )
}



const StackedBills = ({}) => {
  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, bills.length);
  }, []);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count + 1 >= bills.length) clearInterval(interval)
      itemsRef ?.current[count] ?.visible = true
      count++
    }, 50)
  }, [])

  return (
    <Suspense fallback={null}>
      {bills.map((item, i) => {
        return (
          <DollarBillStacked
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

export default function App() {
  const noteRef = useRef();
  const noteRef2 = useRef();
  const scrollingSectionRef = useRef();
  const fallingBillRef = useRef()

  const [noteToDisplay, setNoteToDisplay] = useState(0);
  const [shouldDisplayFallingBills, setShouldDisplayFallingBills] = useState(false);
  const [_shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const shouldShowSidebar = _shouldShowSidebar && !shouldDisplayFallingBills
  const handleScroll = () => {
    const isFallingSectionInViewport = !!checkIfElemHasPastViewport(scrollingSectionRef?.current)
    setShouldDisplayFallingBills(isFallingSectionInViewport)
    
  }
  const scrollProps = { noteRef, noteRef2, setShouldShowSidebar, setNoteToDisplay, scrollingSectionRef, handleScroll };
  
 

  // const { camera } = useThree() // This will just crash

  const [showChild, setShowChild] = useState(false);
  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }


  return (
    <>
      <Helmet />
      <TitleWithHiddenCanvas author={<a href="https://www.linkedin.com/in/benjwexler/" target="_blank">Ben Wexler</a>}>
        Intriguing Article Title
      </TitleWithHiddenCanvas>

      <Canvas
        className="canvas"
        gl={{ antialias: false }}
        camera={cameraInfo}
        dpr={typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, 2)}
      >
        <AdaptiveDpr pixelated />
        <Scroll {...scrollProps} />
        <ShowIf condition={!shouldDisplayFallingBills}>
        <StackedBills />
        </ShowIf>
      </Canvas>

      <Note _ref={noteRef} title='Note 1' className="note-first">
        This is <TextHighlight> something</TextHighlight> we want to highlight right here.
      </Note>
      <SidebarWithContent shouldShowSidebar noteToDisplay={1} className="sidebar-mobile" />

      <Note _ref={noteRef2} title='Note 2'>
        This is <TextHighlight> something</TextHighlight> we want to highlight right here.
      </Note>
      <SidebarWithContent shouldShowSidebar noteToDisplay={2} className="sidebar-mobile" />
      <Note title='Note 3' className="invisible">
        This is <TextHighlight> something</TextHighlight> we want to highlight right here.
      </Note>
      <ShowIf condition={showChild}>
        <SidebarWithContent shouldShowSidebar={shouldShowSidebar} noteToDisplay={noteToDisplay} className="sidebar-desktop" />
      </ShowIf>
      

    <Canvas
        className="canvas"
        gl={{ antialias: false }}
        camera={{...cameraInfo, position: [0, -4, 5]}}
        dpr={typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, 2)}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
        <ShowIf condition={shouldDisplayFallingBills}>
          <FallingBills />
        </ShowIf>
        </Suspense>
      </Canvas>
      <div ref={scrollingSectionRef} className="falling-bills-section">Falling Bills Section</div>
    </>
  )
}

const getRandomX = () => ((Math.random() * 3) * ((Math.random() >= .5) ? 1 : -1))

function getRandomInt(max) {
  return Math.round(Math.random() * max);
}

const FallingBills = () => {
  const [bills, setBills] = useState([]);

  const ADD_ITEM = 'ADD_ITEM';
  const REMOVE_ITEM = 'REMOVE_ITEM';

  const countRef = useRef(1);

  const billsReducer = (bills, action) => {
    console.log("action", action)
    // console.log("STATE BILLS", bills)
    switch (action.type) {
      case REMOVE_ITEM:
        return bills.filter((bill) => bill.id !== action.item.id);
      case ADD_ITEM:
        return [...bills, action.item]
      default:
        return bills;
    }
  };

  // const [bills, dispatchBills] = React.useReducer(
  //   billsReducer,
  //   []
  // );

  const [boundingCoords, setBoundingCoords] = useState({x: 0, y:0})

  const percentageToRange = (min, max, percentage) => {
    return ((max - min) * (percentage/100)) + min
  }

  const {camera} = useThree()

  useEffect(() => {
    const handleResize = () => {
      var vec = new THREE.Vector3(); // create once and reuse
      var pos = new THREE.Vector3(); // create once and reuse
      
      vec.set(
          ( 0 ) * 2 - 1,
          - ( 0 ) * 2 + 1,
          0.5 );
      
      vec.unproject( camera );
      
      vec.sub( camera.position ).normalize();
      
      var distance = - camera.position.z / vec.z;
      
      pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

setBoundingCoords(pos)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)

  }, [])

  // console.log('bills', bills)
  const boundingY = boundingCoords.y + (length/2)
  let y = percentageToRange(boundingY, -boundingY, 0)
  const boundingX = boundingCoords.x + (width/2)

  const springs = useSprings(bills.length,
    bills.map(bill => {
      const {id} = bill;
      let x = percentageToRange(boundingX, -boundingX, bill.x)

      return ({
       
        from: {
          position: [x, y, 0],
        },
        to: [{
          position: [x, -y, 0],
          // config: {
          //   duration: 10000,
          // },
          // position: [posX, -10, 0],
          config: {
            duration: 15000,
          },
        id,
        }],
        // config: {
        //   duration: 15000,
        // },
        onRest: (...args) => {
          setBills((prevBills) => {
            const newBills = [...prevBills]
            const indexToRemove = newBills.findIndex((bill) => bill.id === id )
            if(indexToRemove === -1) return newBills
            newBills[indexToRemove] = {...newBills[indexToRemove], shouldDisplay: false}
            return newBills
          })
        }
        
        
        
      })
    })
  )

  console.log('bills', bills)

  const transitions = useTransition(bills, {
    keys: item => item.id,
    from: (bill) => {
      // console.log('bill from', bill)
      return (
        {  position: [percentageToRange(boundingX, -boundingX, bill.x), y, 0] }
      )
    },
    enter: (bill) => {
      // console.log('bill enter', bill)
      return (
        { position: [percentageToRange(boundingX, -boundingX, bill.x), -y, 0] }
      )
    },
    config: {
      duration: 15000,
    },
    // leave: { opacity: 0 },
    // delay: 200,
    // config: config.molasses,
    onRest:  (result, ctrl, item) => {
      // return
      setBills((prevBills) => {

        return prevBills.filter(bill => bill.id !== item.id)
        const newBills = [...prevBills]
        const indexToRemove = newBills.findIndex((bill) => bill.id !== item.id )
        if(indexToRemove === -1) return newBills
        newBills[indexToRemove] = {...newBills[indexToRemove], shouldDisplay: false}
        return newBills
      })

    },
  })

  // return ({
  //   from,

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = Date.now()
      const posX = getRandomInt(100);
      // dispatchBills({type: ADD_ITEM, item: {x: posX, id: countRef.current, shouldDisplay: true }})
      
      setBills((prevBills) => [...prevBills, {x: posX, id: countRef.current, shouldDisplay: true,}] )
      countRef.current++
    }, 3000)

    return () => clearInterval(interval)


  }, [])

  const coof = 0.74;

  return transitions(
    ({position}, item) => {
      // console.log('item', item)
     
      // console.log('styles', styles)
      return (
      <DollarBill uCoefficientVal={0.74} position={position}  rotation={[degrees_to_radians(-15), degrees_to_radians(0), 0]} isVisible={true} />
    )}
  )

  return (
    springs.map((bill, i) => {
      return (
        // <ShowIf key={bills[i].id} condition={bills[i].shouldDisplay}>
          <DollarBill uCoefficientVal={0.74}  position={bill.position} rotation={[degrees_to_radians(-15), degrees_to_radians(0), 0]} isVisible={true} />
        // </ShowIf>
      )
    })
  )
}
