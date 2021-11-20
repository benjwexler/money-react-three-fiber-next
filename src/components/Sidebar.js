
export default function Sidebar({ shouldShowSidebar, children }) {
  return (
    <div style={{
      transform: `translateX(${shouldShowSidebar ? 0 : -100}%)`,
      transition: `${shouldShowSidebar ? 500 : 0}ms transform ease`,
    }} className="sidebar">
      {children}
    </div>

  )
}