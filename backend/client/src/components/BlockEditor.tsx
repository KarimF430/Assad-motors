import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  GripVertical,
  Plus,
  Trash2,
  Type,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "image"
  | "bulletList"
  | "numberedList"
  | "quote"
  | "code";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  links?: Array<{
    text: string;
    url: string;
    startIndex: number;
    endIndex: number;
  }>;
}

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

interface SortableBlockProps {
  block: ContentBlock;
  onUpdate: (id: string, content: string, field?: string) => void;
  onDelete: (id: string) => void;
  onImageUpload: (id: string, file: File) => void;
}

function SortableBlock({
  block,
  onUpdate,
  onDelete,
  onImageUpload,
}: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case "heading1":
        return (
          <Input
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Heading 1"
            className="text-3xl font-bold border-none focus-visible:ring-0 px-0"
          />
        );

      case "heading2":
        return (
          <Input
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Heading 2"
            className="text-2xl font-bold border-none focus-visible:ring-0 px-0"
          />
        );

      case "heading3":
        return (
          <Input
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="Heading 3"
            className="text-xl font-bold border-none focus-visible:ring-0 px-0"
          />
        );

      case "paragraph":
        return (
          <div className="space-y-1">
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              placeholder="Write your paragraph here... Use [link text](url) for hyperlinks"
              className="min-h-[100px] border-none focus-visible:ring-0 px-0 resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground px-0">
              💡 Tip: Add links using [text](url) format. Example: [Maruti Victoris](/models/maruti-victoris)
            </p>
          </div>
        );

      case "image":
        return (
          <div className="space-y-2">
            {block.imageUrl ? (
              <div className="relative group">
                <img
                  src={block.imageUrl}
                  alt={block.imageCaption || "Article image"}
                  className="w-full rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onUpdate(block.id, "", "imageUrl")}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload image
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageUpload(block.id, file);
                  }}
                  className="max-w-xs mx-auto"
                />
              </div>
            )}
            <Input
              value={block.imageCaption || ""}
              onChange={(e) => onUpdate(block.id, e.target.value, "imageCaption")}
              placeholder="Image caption (optional)"
              className="text-sm text-muted-foreground border-none focus-visible:ring-0 px-0"
            />
          </div>
        );

      case "bulletList":
        return (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="• Item 1&#10;• Item 2&#10;• Item 3"
            className="min-h-[100px] border-none focus-visible:ring-0 px-0 font-mono text-sm resize-none"
            rows={3}
          />
        );

      case "numberedList":
        return (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="1. Item 1&#10;2. Item 2&#10;3. Item 3"
            className="min-h-[100px] border-none focus-visible:ring-0 px-0 font-mono text-sm resize-none"
            rows={3}
          />
        );

      case "quote":
        return (
          <div className="border-l-4 border-primary pl-4">
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate(block.id, e.target.value)}
              placeholder="Enter quote..."
              className="min-h-[80px] border-none focus-visible:ring-0 px-0 italic resize-none"
              rows={2}
            />
          </div>
        );

      case "code":
        return (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, e.target.value)}
            placeholder="// Enter code here..."
            className="min-h-[120px] border-none focus-visible:ring-0 px-0 font-mono text-sm bg-muted rounded-lg p-4 resize-none"
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start gap-2">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Block Content */}
        <div className="flex-1">{renderBlockContent()}</div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(block.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      onChange(arrayMove(blocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random()}`,
      type,
      content: "",
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string, field?: string) => {
    onChange(
      blocks.map((block) => {
        if (block.id === id) {
          if (field === "imageUrl") {
            return { ...block, imageUrl: content };
          } else if (field === "imageCaption") {
            return { ...block, imageCaption: content };
          } else {
            return { ...block, content };
          }
        }
        return block;
      })
    );
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter((block) => block.id !== id));
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Use the uploaded file URL from server
        updateBlock(id, data.url, "imageUrl");
      } else {
        // Fallback to blob URL if upload fails
        console.error('Image upload failed, using blob URL');
        const imageUrl = URL.createObjectURL(file);
        updateBlock(id, imageUrl, "imageUrl");
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to blob URL
      const imageUrl = URL.createObjectURL(file);
      updateBlock(id, imageUrl, "imageUrl");
    }
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onUpdate={updateBlock}
              onDelete={deleteBlock}
              onImageUpload={handleImageUpload}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Block Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Content Block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => addBlock("paragraph")}>
            <Type className="h-4 w-4 mr-2" />
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock("heading1")}>
            <Heading1 className="h-4 w-4 mr-2" />
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock("heading2")}>
            <Heading2 className="h-4 w-4 mr-2" />
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock("heading3")}>
            <Heading3 className="h-4 w-4 mr-2" />
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock("image")}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock("bulletList")}>
            <List className="h-4 w-4 mr-2" />
            Bullet List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock("numberedList")}>
            <ListOrdered className="h-4 w-4 mr-2" />
            Numbered List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock("quote")}>
            <Quote className="h-4 w-4 mr-2" />
            Quote
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => addBlock("code")}>
            <Code className="h-4 w-4 mr-2" />
            Code Block
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No content blocks yet. Click "Add Content Block" to start writing.</p>
        </div>
      )}
    </div>
  );
}
