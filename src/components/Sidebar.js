import { useEffect, useRef } from "react";
import cx from "classnames";

export default function Sidebar({
  shouldShowSidebar,
  children,
  contentId,
  className,
  style,
}) {
  const ref = useRef();
  useEffect(() => {
    if (ref?.current?.scrollTop) ref.current.scrollTop = 0;
  }, [contentId]);
  return (
    <div
      ref={ref}
      style={{
        ...style,
        transform: `translateX(${shouldShowSidebar ? 0 : -100}%)`,
        transition: `${shouldShowSidebar ? 500 : 0}ms transform ease`,
      }}
      className={cx("sidebar", className)}
    >
      {children}
    </div>
  );
}
