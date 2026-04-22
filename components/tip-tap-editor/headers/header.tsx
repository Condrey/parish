import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Code2Icon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HeadingIcon,
  HighlighterIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  LucideSubscript,
  LucideSuperscript,
  PilcrowIcon,
  Quote,
  QuoteIcon,
  SeparatorHorizontalIcon,
  TableIcon,
} from "lucide-react";
import { useState } from "react";
import ImageOptions from "./image-options";
import TableOptions from "./table-options";

interface TipTapEditorHeaderProps {
  editor: Editor | null;
}

export default function TipTapEditorHeader({
  editor,
}: TipTapEditorHeaderProps) {
  if (!editor) return null;
  const [showTableOptions, setShowTableOptions] = useState(false);

  return (
    <div className="control-group sticky top-0 z-10 flex flex-row flex-wrap items-center gap-4 rounded-md border-b bg-card px-3 py-2">
      <ToggleGroup type="multiple" className="button-group" size="sm">
        {/* Headings  */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className={
                editor.isActive("heading", { level: 1 }) ||
                editor.isActive("heading", { level: 2 }) ||
                editor.isActive("heading", { level: 3 })
                  ? "is-active bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground"
              }
            >
              <HeadingIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex w-full max-w-sm flex-wrap justify-evenly gap-1">
            <DropdownMenuItem asChild>
              <ToggleGroupItem
                defaultChecked={editor.isActive("heading", { level: 1 })}
                value="h1"
                aria-label="Toggle heading1"
                title="Toggle heading1"
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 })
                    ? "is-active bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                }
              >
                <Heading1Icon className="size-4" />
              </ToggleGroupItem>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ToggleGroupItem
                value="h2"
                aria-label="Toggle heading2"
                title="Toggle heading2"
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 })
                    ? "is-active bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                }
              >
                <Heading2Icon className="size-4" />
              </ToggleGroupItem>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ToggleGroupItem
                value="h3"
                aria-label="Toggle heading3"
                title="Toggle heading3"
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor.isActive("heading", { level: 3 })
                    ? "is-active bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                }
              >
                <Heading3Icon className="size-4" />
              </ToggleGroupItem>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Superscript */}
        <ToggleGroupItem
          value="superscript"
          aria-label="Toggle superscript"
          title="Toggle superscript"
          type="button"
          onClick={() => editor.chain().focus().setSuperscript().run()}
          className={
            editor.isActive("superscript")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <LucideSuperscript size={16} className="size-4" />
        </ToggleGroupItem>

        {/* Subscript  */}
        <ToggleGroupItem
          value="subscript"
          aria-label="Toggle subscript"
          title="Toggle subscript"
          type="button"
          onClick={() => editor.chain().focus().setSubscript().run()}
          className={
            editor.isActive("subscript")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <LucideSubscript size={16} className="size-4" />
        </ToggleGroupItem>

        {/* Paragraph  */}
        <ToggleGroupItem
          value="paragraph"
          aria-label="Toggle paragraph"
          title="Toggle paragraph"
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <PilcrowIcon size={16} className="size-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          title="Toggle bold"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <BoldIcon className="size-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          title="Toggle italic"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <ItalicIcon className="size-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="highlight"
          aria-label="Toggle highlight"
          title="Toggle highlight"
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={
            editor.isActive("highlight")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <HighlighterIcon className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Listings  */}
      <ToggleGroup type="multiple" className="button-group" size="sm">
        <ToggleGroupItem
          value="list-bullet"
          aria-label="Toggle list bullet"
          title="Toggle list bullet"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <ListIcon className="size-4" />
        </ToggleGroupItem>{" "}
        <ToggleGroupItem
          value="list-ordered"
          aria-label="Toggle list ordered"
          title="Toggle list ordered"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <ListOrderedIcon className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* others  */}
      <ToggleGroup type="multiple" className="button-group" size="sm">
        <ToggleGroupItem
          value="code-block"
          aria-label="Toggle code-block"
          title="Toggle code-block"
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <Code2Icon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="blockquote"
          aria-label="Toggle blockquote"
          title="Toggle blockquote"
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote")
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <QuoteIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="horizontal-rule"
          aria-label="Toggle horizontal-rule"
          title="Toggle horizontal-rule"
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <SeparatorHorizontalIcon className="size-4" />{" "}
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Alignment  */}
      <ToggleGroup type="multiple" className="button-group" size="sm">
        <ToggleGroupItem
          value="left-align"
          aria-label="Toggle left-align"
          title="Toggle left-align"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" })
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <AlignLeftIcon className="size-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="center-align"
          aria-label="Toggle center-align"
          title="Toggle center-align"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" })
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <AlignCenterIcon className="size-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="right-align"
          aria-label="Toggle right-align"
          title="Toggle right-align"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" })
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <AlignRightIcon className="size-4" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="justify-align"
          aria-label="Toggle justify-align"
          title="Toggle justify-align"
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" })
              ? "is-active bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }
        >
          <AlignJustifyIcon className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <ImageOptions editor={editor} />
      {/* About the table  */}
      <Button
        title={`${showTableOptions ? "Hide" : "Show"} table options`}
        type="button"
        variant={showTableOptions ? "default" : "ghost"}
        onClick={() => setShowTableOptions(!showTableOptions)}
      >
        <TableIcon className="size-4" />
      </Button>
      {showTableOptions && <TableOptions editor={editor} />}
    </div>
  );
}
