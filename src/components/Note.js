
export default function Note({_ref, title, children }) {
  return (
    <div ref={_ref} class="note">
      <h1 class="text-title">
        {title}
      </h1>

      <div class="text-subtitle">
        {children}
      </div>
    </div>
  )
}