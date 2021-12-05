
import cx from 'classnames';

export default function Note({_ref, title, children, className }) {
  return (
    <div ref={_ref} className={cx("note", className)}>
      <h1 className="text-title">
        {title}
      </h1>

      <div className="text-subtitle">
        {children}
      </div>
    </div>
  )
}