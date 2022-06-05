
import {useEffect, useRef} from 'react';
import cx from 'classnames';

const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

export default function Sidebar({ shouldShowSidebar, children, contentId, className, _ref, style }) {

  const ref = useRef();
  console.log('_ref', _ref)
  useEffect(() => {
    ref?.current?.scrollTop = 0;
  }, [contentId]);
  // ref={mergeRefs([ref, _ref])
  return (
    <div ref={ref}
      style={{
        ...style,
      transform: `translateX(${shouldShowSidebar ? 0 : -100}%)`,
      transition: `${shouldShowSidebar ? 500 : 0}ms transform ease`,
    }} className={cx("sidebar", className)}>
      {children}
    </div>

  )
}