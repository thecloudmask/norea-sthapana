<template>
  <div class="w-full border rounded-xl overflow-hidden bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
        title="Bold"
      >
        <BoldIcon class="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
        title="Italic"
      >
        <ItalicIcon class="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
        title="Underline"
      >
        <UnderlineIcon class="h-4 w-4" />
      </Button>

      <div class="w-[1px] h-4 bg-border mx-1"></div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
        title="Bullet List"
      >
        <ListIcon class="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        :class="{ 'bg-primary/20 text-primary': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
        title="Ordered List"
      >
        <ListOrderedIcon class="h-4 w-4" />
      </Button>

      <div class="w-[1px] h-4 bg-border mx-1"></div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive({ textAlign: 'left' }) }"
        title="Align Left"
      >
        <AlignLeftIcon class="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive({ textAlign: 'center' }) }"
        title="Align Center"
      >
        <AlignCenterIcon class="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive({ textAlign: 'right' }) }"
        title="Align Right"
      >
        <AlignRightIcon class="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :class="{ 'bg-primary/20 text-primary': editor.isActive({ textAlign: 'justify' }) }"
        title="Justify"
      >
        <AlignJustifyIcon class="h-4 w-4" />
      </Button>

      <div class="w-[1px] h-4 bg-border mx-1"></div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().undo()"
        title="Undo"
      >
        <UndoIcon class="h-4 w-4" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-lg"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().redo()"
        title="Redo"
      >
        <RedoIcon class="h-4 w-4" />
      </Button>
    </div>

    <!-- Editor Content -->
    <editor-content :editor="editor" class="min-h-[150px] p-4 font-khmer cursor-text prose prose-sm dark:prose-invert max-w-none" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon, 
  ListIcon, 
  ListOrderedIcon, 
  AlignLeftIcon, 
  AlignCenterIcon, 
  AlignRightIcon, 
  AlignJustifyIcon,
  UndoIcon, 
  RedoIcon 
} from 'lucide-vue-next'
import { Button } from './button'
import { watch } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    Placeholder.configure({
      placeholder: props.placeholder || 'Type something here...',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none h-full min-h-[150px]',
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Sync with modelValue when it changes from outside
watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value || '', { emitUpdate: false })
  }
})
</script>

<style>
/* Tiptap specific styles */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.ProseMirror ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

.ProseMirror blockquote {
  border-left: 3px solid #e9ecef;
  padding-left: 1rem;
}
</style>
