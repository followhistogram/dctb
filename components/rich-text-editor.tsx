"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Toggle } from "@/components/ui/toggle"
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, Quote } from "lucide-react"

interface RichTextEditorProps {
  id: string
  name: string
  defaultValue?: string
  onChange?: (html: string) => void
  className?: string
}

export default function RichTextEditor({ id, name, defaultValue = "", onChange, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [htmlContent, setHtmlContent] = useState(defaultValue)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = defaultValue
    }
  }, [defaultValue])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML
      setHtmlContent(currentHtml)
      onChange?.(currentHtml)
    }
  }, [onChange])

  const formatText = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      handleInput() // Update state after command
      editorRef.current?.focus() // Keep focus on editor
    },
    [handleInput],
  )

  return (
    <div className={`border rounded-md overflow-hidden ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Toggle size="sm" onPressedChange={() => formatText("bold")} aria-label="Bold">
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => formatText("italic")} aria-label="Italic">
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => formatText("underline")} aria-label="Underline">
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => formatText("insertUnorderedList")} aria-label="Unordered List">
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => formatText("insertOrderedList")} aria-label="Ordered List">
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => formatText("formatBlock", "<h2>")} aria-label="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => formatText("formatBlock", "<h3>")} aria-label="Heading 3">
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <Toggle size="sm" onPressedChange={() => formatText("formatBlock", "<blockquote>")} aria-label="Blockquote">
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>
      <div
        id={id}
        ref={editorRef}
        contentEditable="true"
        onInput={handleInput}
        className="min-h-[400px] p-4 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c13aab] text-sm"
        style={{ whiteSpace: "pre-wrap" }} // Preserve whitespace and line breaks
        aria-multiline="true"
        role="textbox"
      />
      {/* Hidden input to submit the HTML content with the form */}
      <input type="hidden" name={name} value={htmlContent} />
    </div>
  )
}
