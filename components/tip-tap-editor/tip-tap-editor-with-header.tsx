"use client";

import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Typography from "@tiptap/extension-typography";

import { cn } from "@/lib/utils";
import Code from "@tiptap/extension-code";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ColorHighlighter } from "./custom-extensions/color-highlighter";
import { SmilieReplacer } from "./custom-extensions/smiley-replacer";
import TipTapEditorHeader from "./headers/header";
import "./styles.css";

interface TipTapEditorWithHeaderProps {
  className?: string;
  initialContent?: string;
  placeholder?: string;
  includeHeader?: boolean;
  onTextChanged: (content: string) => void;
}

export default function TipTapEditorWithHeader({
  className,
  initialContent,
  placeholder = "type here",
  onTextChanged,
  includeHeader = true,
}: TipTapEditorWithHeaderProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      Superscript,
      Subscript,
      Table.configure({
        resizable: true,
      }),
      TableCell,
      TableHeader,
      TableRow,
      Typography,
      Code,
      Document,
      Paragraph,
      Text,
      ColorHighlighter,
      SmilieReplacer,
      Dropcursor,
      Image,
      ListItem,
      TextStyle,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onTextChanged(editor.getHTML());
    },
  });
  return (
    <div
      className={cn(
        "flex size-full max-h-[20rem] flex-col gap-y-3 overflow-y-auto rounded-md border border-input bg-background pb-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {includeHeader && <TipTapEditorHeader editor={editor} />}
      <EditorContent
        editor={editor}
        className="min-h-[100px] px-3 *:w-full *:h-full list-disc"
      />
    </div>
  );
}
