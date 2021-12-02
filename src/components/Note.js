
export default function Note({_ref, title, children }) {
  return (
    <div ref={_ref} className="note">
      <h1 className="text-title">
        {title}
      </h1>

      <div className="text-subtitle">
        {children}
      </div>
    </div>
  )
}