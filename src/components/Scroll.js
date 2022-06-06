
import { useRef, useEffect } from 'react'

import { useFrame } from '@react-three/fiber'
import * as THREE from "three";

import debounce from 'lodash.debounce';
import { checkIfElemHasPastViewport } from '../utils';
import { useInViewport } from 'react-in-viewport';

const origCameraCoords = [-2, 4, 5]
const endCameraCoords = [2, 4, 0];

const diffCameraCoords = origCameraCoords.map((coord, i) => coord - endCameraCoords[i])


export default function Scroll({ noteRef, noteRef2, setShouldShowSidebar, setNoteToDisplay, handleScroll }) {
  const scrollPercentage = useRef(0);
  const refs = [noteRef?.current, noteRef2?.current]

  const isFallingSectionInViewportRef = useRef();

  useEffect(() => {
    window.addEventListener('scroll', debounce(() => {
      handleScroll();
      const elemViewportPercentage = checkIfElemHasPastViewport(noteRef?.current)
      scrollPercentage?.current = elemViewportPercentage;
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
    const x = origCameraCoords[0] - (diffCameraCoords[0] * scrollPercentage.current);
    const y = origCameraCoords[1] - (diffCameraCoords[1] * scrollPercentage.current)
    const z = origCameraCoords[2] - (diffCameraCoords[2] * scrollPercentage.current)

    if (isFallingSectionInViewportRef.current) {
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