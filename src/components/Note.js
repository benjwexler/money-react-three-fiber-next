
import cx from 'classnames';

export default function Note({_ref, title, children, className }) {
  return (
    <div  className={cx("note", className)}>
    {/* <div style={{marginTop: 200}}></div> */}
    <div  ref={_ref}  className="note-inner">
      <h1 className="text-title">
        {title}
      </h1>

      <div className="text-subtitle">
        {children}
      </div>
      </div>
    </div>
  )
}