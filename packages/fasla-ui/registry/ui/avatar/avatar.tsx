import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../src/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Image source URL */
  src?: string
  /** Alt text for the image */
  alt?: string
  /** Fallback initials or content when image fails to load */
  fallback?: React.ReactNode
}

export function Avatar({
  className,
  size,
  src,
  alt,
  fallback,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  const showImage = src && !imageError

  // Generate initials from alt text if no fallback provided
  const initials = React.useMemo(() => {
    if (fallback) return null
    if (!alt) return null
    return alt
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }, [alt, fallback])

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {showImage ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          onError={() => setImageError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground">
          {fallback || initials || (
            <svg
              width="50%"
              height="50%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          )}
        </div>
      )}
    </div>
  )
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to show */
  max?: number
  /** Size of avatars */
  size?: "xs" | "sm" | "default" | "lg" | "xl"
  children: React.ReactNode
}

export function AvatarGroup({
  children,
  max = 4,
  size = "default",
  className,
  ...props
}: AvatarGroupProps) {
  const childArray = React.Children.toArray(children)
  const visibleChildren = childArray.slice(0, max)
  const remainingCount = childArray.length - max

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleChildren.map((child, index) => (
        <div
          key={index}
          className="ring-2 ring-background rounded-full"
          style={{ zIndex: visibleChildren.length - index }}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
            : child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            avatarVariants({ size }),
            "ring-2 ring-background flex items-center justify-center bg-muted text-muted-foreground"
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}

export { avatarVariants }
