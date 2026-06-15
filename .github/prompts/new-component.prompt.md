---
applyTo: "**/*.prompt.md"
---

# Create New React Component

You are creating a new React component for the SmartBudget frontend following Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui patterns.

## Analysis Phase

Before implementing, analyze:

1. **Component Purpose**: What does this component do? Is it a UI building block (shadcn-like) or a domain-specific component?
2. **Props Contract**: What props should it accept? Should it extend HTML elements?
3. **State Needs**: Does it need internal state? Should it be "use client" or server-component compatible?
4. **Styling**: Will it use Tailwind CSS classes with `cn()` utility? Default styles + customizable via props?
5. **Reusability**: Is this component reusable across the app, or feature-specific?

## Implementation Requirements

### File Naming & Location

- **Location**: `frontend/components/{category}/{ComponentName}.tsx`
  - `ui/` for base/shadcn-like components
  - `shared/` for reusable domain-agnostic components
  - Leave at root level for page-specific components
- **Naming**: `PascalCase.tsx` matching the component function name

### TypeScript Props

- **Always type props**, even if empty
- Extend `React.ComponentProps<"elementType">` for HTML elements
- Use interfaces for complex props
- Include JSDoc comments for public APIs

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, ...props }, ref) => (
    // implementation
  )
)
```

### Styling with Tailwind + `cn()`

- Import `cn` from `@/lib/utils`
- Build class string conditionally with object keys or ternaries
- Accept `className` prop and merge with defaults using `cn()`
- Never use inline `style={{}}` unless absolutely necessary

```typescript
import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm p-4",
        className
      )}
      {...props}
    />
  )
}
```

### Forwarding Refs (when needed)

- Use `React.forwardRef` if the component wraps an HTML element that might need ref access
- Specify the element type and props type in generic parameters
- Set `displayName` for debugging

```typescript
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("px-3 py-2 border rounded-md", className)}
      {...props}
    />
  )
)
Input.displayName = "Input"
```

### "use client" Directive

- Add `"use client"` ONLY if component uses:
  - `useState`, `useContext`, `useEffect`, event listeners
  - React Query hooks (`useQuery`, `useMutation`)
  - Custom hooks that need client features
- Server components are the default (no directive needed)

```typescript
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

export function DataTable({ endpoint }: { endpoint: string }) {
  const [sortBy, setSortBy] = useState("name")
  const { data } = useQuery({ queryKey: [endpoint, sortBy], ... })

  return <table>...</table>
}
```

### Composition Best Practices

- Build components from smaller pieces
- Avoid deeply nested JSX; extract complex parts to separate components
- Use slots/render props for maximum flexibility

```typescript
export function Card({ children, className }: React.ComponentProps<"div">) {
  return <div className={cn("bg-white rounded-lg p-4", className)}>{children}</div>
}

export function CardHeader({ children }: React.ComponentProps<"div">) {
  return <div className="mb-4 pb-4 border-b">{children}</div>
}

export function CardTitle({ children }: React.ComponentProps<"h2">) {
  return <h2 className="text-lg font-bold">{children}</h2>
}
```

### Import Organization

Follow this order in all components:

1. React core imports
2. External library imports
3. Utility functions (from `@/lib`)
4. Shadcn/ui or local components
5. Types/interfaces

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MyComponentProps extends React.ComponentProps<"div"> {
  title: string;
}

export function MyComponent({ title, className, ...props }: MyComponentProps) {
  // implementation
}
```

### Component Variants & Defaults

- Define variants as union types or const objects
- Always provide sensible defaults
- Document variant options

```typescript
type Size = "sm" | "md" | "lg"
type Variant = "primary" | "secondary" | "danger"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size
  variant?: Variant
}

const sizeClasses: Record<Size, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
}

export function Button({
  size = "md",
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
```

### Accessibility

- Include ARIA labels where needed
- Ensure keyboard navigation works
- Use semantic HTML (`<button>` not `<div>`)
- Test with screen readers when applicable

```typescript
export function Dialog({ isOpen, onClose, children }: DialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className={cn("fixed inset-0 bg-black/50 flex items-center justify-center",
        !isOpen && "hidden"
      )}
    >
      <div className="bg-white rounded-lg p-6">{children}</div>
    </div>
  )
}
```

## Output Requirements

1. **Single file**: Component in `frontend/components/{path}/{ComponentName}.tsx`
2. **Complete & runnable**: Import all dependencies, no missing pieces
3. **Properly typed**: All props and returns have TypeScript types
4. **Styled correctly**: Use Tailwind + `cn()`, follow design patterns
5. **Documented**: JSDoc comments for public APIs and complex logic
6. **Tested**: If this is a complex component, suggest unit tests with Vitest

## Example: Complete Button Component

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: "default" | "outline" | "ghost" | "danger"
  /** Button size */
  size?: "sm" | "md" | "lg"
  /** Show loading state */
  isLoading?: boolean
  /** Full width button */
  fullWidth?: boolean
}

/**
 * Button component with multiple variants and sizes
 * @example
 * <Button variant="primary" size="lg">Click me</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      ghost: "text-gray-700 hover:bg-gray-100",
      danger: "bg-red-600 text-white hover:bg-red-700",
    }

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading && <span className="animate-spin mr-2">⟳</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
```

Now create the component following these guidelines, focusing on reusability, TypeScript correctness, and Tailwind styling.
