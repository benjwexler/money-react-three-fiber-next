/* eslint-disable react-hooks/rules-of-hooks */
import "../styles/globals.css";

import React, { useRef, useState, useEffect, useCallback } from "react";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import Note from "../src/components/Note";
import SidebarWithContent from "../src/components/SidebarWithContent";
import Helmet from "../src/components/Helmet";
import ShowIf from "../src/components/ShowIf";
import TextHighlight from "../src/components/TextHighlight";
import FallingBillsSection from "../src/components/FallingBillsSection";
import StackedBills from "../src/components/StackedBills";
import TitleWithHiddenCanvas from "../src/components/TitleWithHiddenCanvas";
import Scroll from "../src/components/Scroll";
import { checkIfElemHasPastViewport, createBillsArr } from "../src/utils";
import { cameraInfo } from "../src/constants";
import { useInViewport } from "react-in-viewport";

const getBreakpoint = (width) => {
  if (width >= 1200) return "L";

  if (width >= 700) return "M";

  return "S";
};

export default function App() {
  const [noteRef, noteRef2, noteRef3, scrollingSectionRef] = Array.from(
    Array(4)
  ).map(() => useRef());
  const [noteToDisplay, setNoteToDisplay] = useState(0);
  const [_shouldDisplayFallingBills, setShouldDisplayFallingBills] =
    useState(false);

  const [breakpoint, setBreakpoint] = useState(() => {
    if (typeof window === "undefined") return false;
    return getBreakpoint(window.innerWidth);
  });

  const [noteRef3viewportInfo] = [noteRef3].map((ref) => {
    return useInViewport(ref, { threshold: 0.1 }, { disconnectOnLeave: false });
  });

  const shouldDisplayFallingBills =
    _shouldDisplayFallingBills && !noteRef3viewportInfo?.inViewport;

  const [_shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const shouldShowSidebar = _shouldShowSidebar && !shouldDisplayFallingBills;
  const handleScroll = () => {
    const isFallingSectionInViewport = !!checkIfElemHasPastViewport(
      scrollingSectionRef?.current
    );
    setShouldDisplayFallingBills(isFallingSectionInViewport);
  };
  const scrollProps = {
    noteRef,
    noteRef2,
    setShouldShowSidebar,
    setNoteToDisplay,
    scrollingSectionRef,
    handleScroll,
  };

  const [showChild, setShowChild] = useState(false);
  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);

    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bills = createBillsArr({ cols: breakpoint !== "L" ? 2 : 4 });

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return (
    <>
      <Helmet />
      <TitleWithHiddenCanvas
        breakpoint={breakpoint}
        billProps={bills[10]}
        author={
          <a
            href="https://www.linkedin.com/in/benjwexler/"
            rel="noreferrer"
            target="_blank"
          >
            Ben Wexler
          </a>
        }
      >
        Intriguing Article Title
      </TitleWithHiddenCanvas>

      <Canvas
        className="canvas"
        gl={{ antialias: false }}
        camera={cameraInfo}
        dpr={
          typeof window === "undefined"
            ? 1
            : Math.min(window.devicePixelRatio, 2)
        }
      >
        <AdaptiveDpr pixelated />
        <Scroll {...scrollProps} />
        <StackedBills
          breakpoint={breakpoint}
          isVisible={!shouldDisplayFallingBills}
          bills={bills}
        />
      </Canvas>

      <Note _ref={noteRef} title="Note 1" className="note-first">
        This is <TextHighlight> something</TextHighlight> we want to highlight
        right here.
      </Note>
      <SidebarWithContent
        shouldShowSidebar
        noteToDisplay={1}
        className="sidebar-mobile"
      />

      <Note _ref={noteRef2} title="Note 2">
        This is <TextHighlight> something</TextHighlight> we want to highlight
        right here.
      </Note>
      <div id="sidebar-mobile-container-last">
        <SidebarWithContent
          _ref={noteRef3}
          style={{}}
          shouldShowSidebar
          noteToDisplay={2}
          className="sidebar-mobile"
        />
      </div>
      <Note title="Note 3" className="invisible">
        This is <TextHighlight> something</TextHighlight> we want to highlight
        right here.
      </Note>
      <ShowIf condition={showChild}>
        <SidebarWithContent
          shouldShowSidebar={shouldShowSidebar}
          noteToDisplay={noteToDisplay}
          className="sidebar-desktop"
        />
      </ShowIf>

      <FallingBillsSection
        scrollingSectionRef={scrollingSectionRef}
        shouldDisplayFallingBills={shouldDisplayFallingBills}
      />
    </>
  );
}
