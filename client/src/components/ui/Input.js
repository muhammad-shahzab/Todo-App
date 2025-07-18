import React from "react"

const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return <input type={type} className={`input ${className}`} ref={ref} {...props} />
})

Input.displayName = "Input"

export default Input
