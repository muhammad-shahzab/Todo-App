export default function Button({ className = "", variant = "default", size = "default", children, ...props }) {
  const baseClasses = "btn"

  const variants = {
    default: "btn-default",
    ghost: "btn-ghost",
    outline: "btn-outline",
  }

  const sizes = {
    default: "btn-default-size",
    sm: "btn-sm",
    lg: "btn-lg",
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
