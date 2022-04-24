import '../styles/globals.css'

import React, { useRef, useState, useEffect } from 'react'

import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import Note from '../src/components/Note';
import SidebarWithContent from '../src/components/SidebarWithContent';
import Helmet from '../src/components/Helmet';
import ShowIf from '../src/components/ShowIf'
import TextHighlight from '../src/components/TextHighlight'
import FallingBillsSection from '../src/components/FallingBillsSection';
import StackedBills from '../src/components/StackedBills';
import TitleWithHiddenCanvas from '../src/components/TitleWithHiddenCanvas';
import Scroll from '../src/components/Scroll';
import { checkIfElemHasPastViewport } from '../src/utils';
import { cameraInfo } from '../src/constants'

export default function App() {
  const noteRef = useRef();
  const noteRef2 = useRef();
  const scrollingSectionRef = useRef();

  const [noteToDisplay, setNoteToDisplay] = useState(0);
  const [shouldDisplayFallingBills, setShouldDisplayFallingBills] = useState(false);
  const [_shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const shouldShowSidebar = _shouldShowSidebar && !shouldDisplayFallingBills
  const handleScroll = () => {
    const isFallingSectionInViewport = !!checkIfElemHasPastViewport(scrollingSectionRef ?.current)
    setShouldDisplayFallingBills(isFallingSectionInViewport)
  }
  const scrollProps = { noteRef, noteRef2, setShouldShowSidebar, setNoteToDisplay, scrollingSectionRef, handleScroll };

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
      <TitleWithHiddenCanvas
        author={<a href="https://www.linkedin.com/in/benjwexler/" target="_blank">Ben Wexler</a>}
      >
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
        <StackedBills isVisible={!shouldDisplayFallingBills} />
      </Canvas>

      <Note _ref={noteRef} title='Note 1' className="note-first">
        This is <TextHighlight> something</TextHighlight> we want to highlight right here.
      </Note>
      <SidebarWithContent shouldShowSidebar noteToDisplay={1} className="sidebar-mobile" />

      <Note _ref={noteRef2} title='Note 2'>
        This is <TextHighlight> something</TextHighlight> we want to highlight right here.
      </Note>
      <div style={{ height: '100vh' }}>
        <SidebarWithContent shouldShowSidebar noteToDisplay={2} className="sidebar-mobile" />
      </div>
      <Note title='Note 3' className="invisible">
        This is <TextHighlight> something</TextHighlight> we want to highlight right here.
      </Note>
      <ShowIf condition={showChild}>
        <SidebarWithContent shouldShowSidebar={shouldShowSidebar} noteToDisplay={noteToDisplay} className="sidebar-desktop" />
      </ShowIf>

      <FallingBillsSection
        scrollingSectionRef={scrollingSectionRef}
        shouldDisplayFallingBills={shouldDisplayFallingBills} 
      />
    </>
  )
}
