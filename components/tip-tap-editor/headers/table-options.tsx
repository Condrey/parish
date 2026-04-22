import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Editor } from "@tiptap/react";
import {
  ColumnsIcon,
  MoveDownIcon,
  MoveRightIcon,
  RowsIcon,
  TableCellsMergeIcon,
  TableCellsSplitIcon,
  TableIcon,
} from "lucide-react";

export default function TableOptions({ editor }: { editor: Editor }) {
  return (
    <div className="flex gap-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" type="button">
            Insert
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Table options</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
            >
              <TableIcon className="size-4 mr-2 text-foreground" /> Table
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ColumnsIcon className="size-4 mr-2" />
                Column
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    disabled={!editor.can().addColumnBefore()}
                    onClick={() =>
                      editor.chain().focus().addColumnBefore().run()
                    }
                  >
                    Column before
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!editor.can().addColumnAfter()}
                    onClick={() =>
                      editor.chain().focus().addColumnAfter().run()
                    }
                  >
                    Column after
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RowsIcon className="size-4 mr-2" />
                Row
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    disabled={!editor.can().addRowBefore()}
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                  >
                    Row before
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!editor.can().addRowAfter()}
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                  >
                    Row after
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" type="button">
            Delete
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.can().deleteColumn()}
          >
            <MoveDownIcon />
            Delete Column
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.can().deleteRow()}
          >
            <MoveRightIcon />
            Delete Row
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}
          >
            <TableIcon />
            Delete Table
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        size="sm"
        variant={"ghost"}
        title="Merge cells"
        type="button"
        onClick={() => editor.chain().focus().mergeCells().run()}
        disabled={!editor.can().mergeCells()}
      >
        <TableCellsMergeIcon />
      </Button>
      <Button
        size="sm"
        variant={"ghost"}
        title="Split cells"
        type="button"
        onClick={() => editor.chain().focus().splitCell().run()}
        disabled={!editor.can().splitCell()}
      >
        <TableCellsSplitIcon />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant={"ghost"} size={"sm"}>
            Header
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            disabled={!editor.can().toggleHeaderColumn()}
          >
            Toggle Column Header
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            disabled={!editor.can().toggleHeaderRow()}
          >
            Toggle Row Header
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            disabled={!editor.can().toggleHeaderCell()}
          >
            Make cell an header
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <button               type="button"

        onClick={() =>
          editor
            .chain()
            .focus()
            .setCellAttribute("backgroundColor", "#FAF594")
            .run()
        }
        disabled={!editor.can().setCellAttribute("backgroundColor", "#FAF594")}
      >
        Set cell attribute
      </button> */}
    </div>
  );
}
