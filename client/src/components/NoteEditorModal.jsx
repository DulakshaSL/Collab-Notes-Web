import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Pin,
  Archive,
  Trash2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Users,
} from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CollaboratorPanel from "./CollaboratorPanel.jsx";

export default function NoteEditorModal({
  open,
  note = null,
  mode = "edit", 
  onClose,
  onSave,
  onCreate,
  onTogglePin,
  onToggleArchive,
  onTrash,
}) {
  const isCreateMode = mode === "create";

  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (isCreateMode) {
      setTitle("");
      setShowCollaborators(false);
      return;
    }

    if (note) {
      setTitle(note.title || "");
      setShowCollaborators(false);
    }
  }, [open, note, isCreateMode]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Placeholder.configure({
        placeholder: isCreateMode ? "Write your note..." : "Take a note...",
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "ProseMirror w-full outline-none text-white/85 leading-relaxed text-[15px]",
        style: "word-break: break-word; overflow-wrap: anywhere;",
      },
    },
  });

  useEffect(() => {
    if (!open || !editor) return;

    if (isCreateMode) {
      editor.commands.setContent("", false);
    } else {
      editor.commands.setContent(note?.content || "", false);
    }
  }, [open, note, editor, isCreateMode]);

  const canSave = useMemo(() => {
    const html = editor?.getHTML?.() || "";
    const plain = html.replace(/<[^>]*>/g, "").trim();
    return title.trim().length > 0 || plain.length > 0;
  }, [title, editor]);

  const resetAndClose = () => {
    setTitle("");
    setShowCollaborators(false);
    editor?.commands.clearContent();
    onClose?.();
  };

  const handleSaveAndClose = async () => {
    if (!editor) {
      onClose?.();
      return;
    }

    if (!canSave) {
      resetAndClose();
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...(note || {}),
        title: title.trim(),
        content: editor.getHTML(),
      };

      if (isCreateMode) {
        await onCreate?.(payload);
      } else {
        await onSave?.(payload);
      }

      resetAndClose();
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleSaveAndClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, editor, note, title, isCreateMode]);

  const keepFocus = (fn) => (e) => {
    e.preventDefault();
    fn?.();
  };

  const ToolbarBtn = ({ onClick, active, children, title }) => (
    <button
      type="button"
      title={title}
      onMouseDown={keepFocus(onClick)}
      className={[
        "p-2 rounded-lg transition cursor-pointer",
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleSaveAndClose();
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="
              relative w-full max-w-3xl
              h-[85vh]
              rounded-2xl border border-white/10
              bg-[#0b1220]/85 backdrop-blur-xl
              shadow-[0_25px_80px_rgba(0,0,0,0.65)]
              overflow-hidden flex flex-col
            "
          >
            <style>{`
              .ProseMirror:focus { outline: none; }

              .ProseMirror,
              .ProseMirror p,
              .ProseMirror li,
              .ProseMirror blockquote {
                overflow-wrap: anywhere;
                word-break: break-word;
              }

              .ProseMirror p {
                margin: 0.35rem 0;
              }

              .ProseMirror ul {
                list-style: disc;
                padding-left: 1.25rem;
                margin: 0.5rem 0;
              }

              .ProseMirror ol {
                list-style: decimal;
                padding-left: 1.25rem;
                margin: 0.5rem 0;
              }

              .ProseMirror li {
                margin: 0.2rem 0;
              }

              .ProseMirror blockquote {
                border-left: 3px solid rgba(148,163,184,0.45);
                padding-left: 0.9rem;
                margin: 0.7rem 0;
                color: rgba(226,232,240,0.9);
              }

              .ProseMirror code {
                background: rgba(255,255,255,0.06);
                padding: 0.15rem 0.35rem;
                border-radius: 0.35rem;
              }

              .ProseMirror pre {
                background: rgba(0,0,0,0.35);
                padding: 0.9rem;
                border-radius: 0.8rem;
                overflow: auto;
                max-width: 100%;
              }
            `}</style>

            {/* Header */}
            <div className="shrink-0 flex items-start justify-between gap-3 px-5 pt-5">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-transparent text-white/95 placeholder:text-white/35 text-xl font-semibold outline-none"
              />

              <div className="flex items-center gap-1">
                {!isCreateMode && (
                  <button
                    type="button"
                    onMouseDown={keepFocus(() =>
                      setShowCollaborators((prev) => !prev)
                    )}
                    className={`p-2 rounded-lg transition cursor-pointer ${
                      showCollaborators
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                    title="Collaborators"
                  >
                    <Users size={18} />
                  </button>
                )}

                {!isCreateMode && (
                  <button
                    type="button"
                    onMouseDown={keepFocus(() => onTogglePin?.(note))}
                    className="p-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition cursor-pointer"
                    title={note?.pinned ? "Unpin" : "Pin"}
                  >
                    <Pin
                      size={18}
                      className={note?.pinned ? "text-yellow-300" : ""}
                    />
                  </button>
                )}

                <button
                  type="button"
                  onMouseDown={keepFocus(handleSaveAndClose)}
                  className="p-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition cursor-pointer"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-h-0 px-5 pb-3 pt-2">
              <div className="h-full min-h-0 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex flex-col">
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4">
                  <EditorContent editor={editor} />
                </div>

                {!isCreateMode && showCollaborators && note && (
                  <div className="shrink-0 border-t border-white/10 bg-black/20 p-4">
                    <CollaboratorPanel note={note} open={showCollaborators} />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-1">
                <ToolbarBtn
                  title="Bold"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  active={editor?.isActive("bold")}
                >
                  <Bold size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                  title="Italic"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  active={editor?.isActive("italic")}
                >
                  <Italic size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                  title="Bullet List"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  active={editor?.isActive("bulletList")}
                >
                  <List size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                  title="Ordered List"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  active={editor?.isActive("orderedList")}
                >
                  <ListOrdered size={16} />
                </ToolbarBtn>

                <ToolbarBtn
                  title="Quote"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  active={editor?.isActive("blockquote")}
                >
                  <Quote size={16} />
                </ToolbarBtn>

                {!isCreateMode && (
                  <>
                    <button
                      type="button"
                      onMouseDown={keepFocus(() => onToggleArchive?.(note))}
                      className="ml-2 p-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white transition cursor-pointer"
                      title={note?.archived ? "Unarchive" : "Archive"}
                    >
                      <Archive size={16} />
                    </button>

                    <button
                      type="button"
                      onMouseDown={keepFocus(() => onTrash?.(note))}
                      className="p-2 rounded-lg text-red-200/80 hover:bg-red-500/10 transition cursor-pointer"
                      title="Move to trash"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isCreateMode && (
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-4 py-2 rounded-xl text-sm text-white/70 hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveAndClose}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 cursor-pointer ${
                    isCreateMode
                      ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white hover:opacity-95"
                      : "text-white/85 hover:bg-white/5"
                  }`}
                >
                  {saving
                    ? isCreateMode
                      ? "Creating..."
                      : "Saving..."
                    : isCreateMode
                    ? "Create"
                    : "Close"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}