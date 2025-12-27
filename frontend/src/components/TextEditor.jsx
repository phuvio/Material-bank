import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

// Quill modules for toolbar
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
}

const Editor = forwardRef(({ value, onTextChange, readOnly = false }, ref) => {
  const editorRef = useRef(null)
  const quillInstance = useRef(null)

  useEffect(() => {
    // Initialize Quill
    quillInstance.current = new Quill(editorRef.current, {
      theme: 'snow',
      modules,
      readOnly,
    })

    // Listen to content changes
    quillInstance.current.on('text-change', () => {
      const html = quillInstance.current.root.innerHTML
      if (onTextChange) {
        onTextChange(html)
      }
    })

    return () => {
      quillInstance.current.off('text-change')
    }
  }, [])

  // Sync external value changes into Quill
  useEffect(() => {
    const editor = quillInstance.current
    if (editor && value !== editor.root.innerHTML) {
      const sel = editor.getSelection() // preserve cursor position
      editor.root.innerHTML = value || ''
      if (sel) editor.setSelection(sel) // restore selection if possible
    }
  }, [value])

  // Update readonly mode dynamically
  useEffect(() => {
    if (quillInstance.current) {
      quillInstance.current.enable(!readOnly)
    }
  }, [readOnly])

  // Expose Quill API to parent via ref
  useImperativeHandle(ref, () => ({
    getHTML: () => quillInstance.current.root.innerHTML,
    setHTML: (html) => {
      quillInstance.current.root.innerHTML = html
    },
    getText: () => quillInstance.current.getText(),
    getLength: () => quillInstance.current.getLength(),
  }))

  return (
    <div
      ref={editorRef}
      data-testid="text-editor"
      id="description" // <-- ADD THIS
      style={{ minHeight: '200px' }}
    />
  )
})

export default Editor
