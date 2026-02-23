import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Undo,
  Redo,
  Minus,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Table2Icon,
  Highlighter,
  LinkIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEffect } from "react";

interface Props {
  value?: string;
  onChange: (html: string, json:any) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);
  const lowlight = createLowlight();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      HorizontalRule,
      Code,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "Start writing your blog...",
      }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML(), editor.getJSON());
    },
  });

  if (!editor) return null;
  const setLink = () => {
    const url = prompt("Enter URL");
    if (!url) return;
    editor?.chain().focus().setLink({ href: url }).run();
  };
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap gap-2 rounded-xl border bg-muted/40 backdrop-blur px-1 py-2 shadow-sm">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor.isActive("bold") ? "bg-primary/10 text-primary" : ""
          }
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor.isActive("italic") ? "bg-primary/10 text-primary" : ""
          }
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-primary/10 text-primary"
              : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-primary/10 text-primary"
              : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor.isActive("bulletList") ? "bg-primary/10 text-primary" : ""
          }
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor.isActive("orderedList") ? "bg-primary/10 text-primary" : ""
          }
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor.isActive("blockquote") ? "bg-primary/10 text-primary" : ""
          }
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={
            editor.isActive("codeBlock") ? "bg-primary/10 text-primary" : ""
          }
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 size={16} />
        </Button>

        <Button type="button" size="icon" variant="ghost" onClick={setLink}>
          <LinkIcon size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#fde68a" }).run()
          }
        >
          <Highlighter size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()
          }
        >
          <Table2Icon size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo size={16} />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={16} />
        </Button>
      </div>

      {/* Editor Area */}
      <div className="rounded-xl bg-gray-50 p-4 min-h-[300px] border border-gray-200 focus-within:border-black transition">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
