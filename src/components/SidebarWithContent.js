
import React, { useState, useEffect, useLayoutEffect } from 'react'

import { a, useSpring, config } from '@react-spring/web';
import Sidebar from './Sidebar';

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

export default function SidebarWithContent({ noteToDisplay, className, shouldShowSidebar }) {

  const [shouldReset, setShouldReset] = useState(true);

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { ...config.molasses, duration: 700 },
    reset: shouldReset,
  })

  useLayoutEffect(() => {
    setShouldReset(true)
  }, [noteToDisplay])

  useEffect(() => {
    setShouldReset(false)
  }, [shouldReset])


  return (<Sidebar shouldShowSidebar={shouldShowSidebar} contentId={noteToDisplay} className={className}>
    <a.div style={springProps}>
      {getSidebarContent({ noteToDisplay, shouldReset })}
    </a.div>
  </Sidebar>
  )

}