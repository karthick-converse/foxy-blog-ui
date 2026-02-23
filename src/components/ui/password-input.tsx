'use client'

import * as React from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

export interface InputPasswordDemoProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const InputPasswordDemo = React.forwardRef<
  HTMLInputElement,
  InputPasswordDemoProps
>(({ label = 'Password', ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const id = React.useId()

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Input
          ref={ref}
          id={id}
          type={isVisible ? 'text' : 'password'}
          className="pr-10"
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(v => !v)}
          className="absolute right-0 top-0 h-9 w-9"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          <span className="sr-only">
            {isVisible ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    </div>
  )
})

InputPasswordDemo.displayName = 'InputPasswordDemo'
export default InputPasswordDemo
