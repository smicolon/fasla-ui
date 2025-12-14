"use client"

import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  /** Available options */
  options: ComboboxOption[]
  /** Currently selected value(s) */
  value?: string | string[]
  /** Called when selection changes */
  onChange?: (value: string | string[]) => void
  /** Placeholder text */
  placeholder?: string
  /** Search placeholder */
  searchPlaceholder?: string
  /** Allow multiple selections */
  multiple?: boolean
  /** Allow creating new options */
  creatable?: boolean
  /** Called when a new option is created */
  onCreate?: (value: string) => void
  /** Text shown when no options match */
  emptyText?: string
  /** Text for create option */
  createText?: string
  /** Disabled state */
  disabled?: boolean
  /** Custom class name */
  className?: string
  /** Loading state */
  loading?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  multiple = false,
  creatable = false,
  onCreate,
  emptyText = "No options found.",
  createText = "Create",
  disabled = false,
  className,
  loading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  // Normalize value to array for easier handling
  const selectedValues = React.useMemo(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search) return options
    const searchLower = search.toLowerCase()
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchLower) ||
        option.value.toLowerCase().includes(searchLower)
    )
  }, [options, search])

  // Check if search matches any existing option exactly
  const exactMatch = React.useMemo(() => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return options.some(
      (option) =>
        option.label.toLowerCase() === searchLower ||
        option.value.toLowerCase() === searchLower
    )
  }, [options, search])

  // Can show create option
  const showCreate = creatable && search && !exactMatch

  // Get display value
  const displayValue = React.useMemo(() => {
    if (selectedValues.length === 0) return ""
    if (multiple) {
      return selectedValues
        .map((v) => options.find((o) => o.value === v)?.label || v)
        .join(", ")
    }
    return options.find((o) => o.value === selectedValues[0])?.label || selectedValues[0]
  }, [selectedValues, options, multiple])

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      onChange?.(newValues)
    } else {
      onChange?.(optionValue)
      setOpen(false)
      setSearch("")
    }
  }

  // Handle create new option
  const handleCreate = () => {
    if (onCreate && search) {
      onCreate(search)
      if (!multiple) {
        setOpen(false)
      }
      setSearch("")
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    const totalItems = filteredOptions.length + (showCreate ? 1 : 0)

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % totalItems)
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems)
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex < filteredOptions.length) {
          const option = filteredOptions[highlightedIndex]
          if (!option.disabled) {
            handleSelect(option.value)
          }
        } else if (showCreate) {
          handleCreate()
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        setSearch("")
        break
    }
  }

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (open && listRef.current) {
      const highlighted = listRef.current.querySelector('[data-highlighted="true"]')
      if (highlighted) {
        highlighted.scrollIntoView({ block: "nearest" })
      }
    }
  }, [highlightedIndex, open])

  // Reset highlighted index when search changes
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [search])

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest(".combobox-container")?.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className={cn("combobox-container relative w-full", className)}>
      {/* Trigger / Input */}
      <div
        className={cn(
          "flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
          "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={open ? search : displayValue}
          onChange={(e) => {
            setSearch(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
        />
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={open ? "Close" : "Open"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("transition-transform", open && "rotate-180")}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95">
          {/* Search input when open */}
          {displayValue && (
            <div className="border-b p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          )}

          {/* Options list */}
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-auto p-1"
          >
            {loading ? (
              <li className="px-2 py-4 text-center text-sm text-muted-foreground">
                Loading...
              </li>
            ) : filteredOptions.length === 0 && !showCreate ? (
              <li className="px-2 py-4 text-center text-sm text-muted-foreground">
                {emptyText}
              </li>
            ) : (
              <>
                {filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value)
                  const isHighlighted = index === highlightedIndex

                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      data-highlighted={isHighlighted}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                        isHighlighted && "bg-accent text-accent-foreground",
                        isSelected && "font-medium",
                        option.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      {multiple && (
                        <span
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input"
                          )}
                        >
                          {isSelected && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      )}
                      <span className="flex-1">{option.label}</span>
                      {!multiple && isSelected && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="ml-2 text-primary"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </li>
                  )
                })}

                {/* Create new option */}
                {showCreate && (
                  <li
                    role="option"
                    data-highlighted={highlightedIndex === filteredOptions.length}
                    onClick={handleCreate}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                      highlightedIndex === filteredOptions.length &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="mr-2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    {createText} "{search}"
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Selected count for multiple */}
          {multiple && selectedValues.length > 0 && (
            <div className="border-t px-2 py-1.5 text-xs text-muted-foreground">
              {selectedValues.length} selected
            </div>
          )}
        </div>
      )}

      {/* Selected tags for multiple */}
      {multiple && selectedValues.length > 0 && !open && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selectedValues.map((val) => {
            const option = options.find((o) => o.value === val)
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs"
              >
                {option?.label || val}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(val)
                  }}
                  className="hover:text-destructive"
                  aria-label={`Remove ${option?.label || val}`}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
