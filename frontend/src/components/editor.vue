<template>
  <Card
    v-if="editor"
    :class="cn('editor w-full', affixRelativeElement)"
    :style="editable ? '' : 'border: 1px dashed #d1d5db'"
  >
    <div v-sticky="stickyConfig" class="bg-background border-b">
      <div class="flex items-center gap-1 p-2 min-h-[52px] flex-wrap">
        <!-- Format Section -->
        <div v-if="toolbar.indexOf('format') !== -1" class="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="h-8 w-8 p-0 data-[state=open]:bg-accent"
              >
                <component :is="formatIcon" class="h-4 w-4" />
                <span class="sr-only">Text Format</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                @click="editor.chain().focus().setParagraph().run()"
                :class="{ 'bg-accent': editor.isActive('paragraph') }"
              >
                <Type class="mr-2 h-4 w-4" />
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                :class="{ 'bg-accent': editor.isActive('heading', { level: 1 }) }"
              >
                <Heading1 class="mr-2 h-4 w-4" />
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'bg-accent': editor.isActive('heading', { level: 2 }) }"
              >
                <Heading2 class="mr-2 h-4 w-4" />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'bg-accent': editor.isActive('heading', { level: 3 }) }"
              >
                <Heading3 class="mr-2 h-4 w-4" />
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                :class="{ 'bg-accent': editor.isActive('heading', { level: 4 }) }"
              >
                <Heading4 class="mr-2 h-4 w-4" />
                Heading 4
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
                :class="{ 'bg-accent': editor.isActive('heading', { level: 5 }) }"
              >
                <Heading5 class="mr-2 h-4 w-4" />
                Heading 5
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
                :class="{ 'bg-accent': editor.isActive('heading', { level: 6 }) }"
              >
                <Heading6 class="mr-2 h-4 w-4" />
                Heading 6
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Separator
          v-if="toolbar.indexOf('format') !== -1"
          orientation="vertical"
          class="mx-1 h-6"
        />
        
        <!-- Marks Section -->
        <div v-if="toolbar.indexOf('marks') !== -1" class="flex items-center gap-1">
          <!-- Highlight Dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="h-8 w-8 p-0 data-[state=open]:bg-accent"
              >
                <Highlighter class="h-4 w-4" />
                <span class="sr-only">Highlight</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHighlight({ color: 'hsl(var(--color-warning-emphasis))' }).run()"
                :class="{ 'bg-accent': editor.isActive('highlight') }"
              >
                <div class="mr-2 h-4 w-4 bg-warning-emphasis rounded"></div>
                Yellow
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHighlight({ color: 'hsl(var(--color-error-emphasis))' }).run()"
                :class="{ 'bg-accent': editor.isActive('highlight') }"
              >
                <div class="mr-2 h-4 w-4 bg-error-emphasis rounded"></div>
                Red
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHighlight({ color: 'hsl(var(--color-success-emphasis))' }).run()"
                :class="{ 'bg-accent': editor.isActive('highlight') }"
              >
                <div class="mr-2 h-4 w-4 bg-success-emphasis rounded"></div>
                Green
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="editor.chain().focus().toggleHighlight({ color: 'hsl(var(--color-info-emphasis))' }).run()"
                :class="{ 'bg-accent': editor.isActive('highlight') }"
              >
                <div class="mr-2 h-4 w-4 bg-info-emphasis rounded"></div>
                Cyan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Format Buttons -->
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('bold') }"
                  @click="editor.chain().focus().toggleBold().run()"
                >
                  <Bold class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bold</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('italic') }"
                  @click="editor.chain().focus().toggleItalic().run()"
                >
                  <Italic class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Italic</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('underline') }"
                  @click="editor.chain().focus().toggleUnderline().run()"
                >
                  <UnderlineIcon class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Underline</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('strike') }"
                  @click="editor.chain().focus().toggleStrike().run()"
                >
                  <Strikethrough class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Strike</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('link') }"
                  @click="setLink"
                >
                  <LinkIcon class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Set Link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :disabled="!editor.isActive('link')"
                  @click="editor.chain().focus().unsetLink().run()"
                >
                  <Unlink class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove Link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator
          v-if="toolbar.indexOf('marks') !== -1"
          orientation="vertical"
          class="mx-1 h-6"
        />

        <!-- Lists Section -->
        <div v-if="toolbar.indexOf('list') !== -1" class="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('bulletList') }"
                  @click="editor.chain().focus().toggleBulletList().run()"
                >
                  <List class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bullet List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('orderedList') }"
                  @click="editor.chain().focus().toggleOrderedList().run()"
                >
                  <ListOrdered class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Numbered List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator
          v-if="toolbar.indexOf('list') !== -1"
          orientation="vertical"
          class="mx-1 h-6"
        />

        <!-- Code Section -->
        <div v-if="toolbar.indexOf('code') !== -1" class="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('code') }"
                  @click="editor.chain().focus().toggleCode().run()"
                >
                  <Code class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Inline Code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :class="{ 'bg-accent': editor.isActive('codeBlock') }"
                  @click="editor.chain().focus().toggleCodeBlock().run()"
                >
                  <Terminal class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Code Block</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator
          v-if="toolbar.indexOf('code') !== -1"
          orientation="vertical"
          class="mx-1 h-6"
        />

        <!-- Table Section -->
        <div v-if="toolbar.indexOf('table') !== -1" class="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
                >
                  <TableIcon class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Insert Table</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  @click="editor.chain().focus().addColumnAfter().run()"
                >
                  <Plus class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Column</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  @click="editor.chain().focus().addRowAfter().run()"
                >
                  <RowsIcon class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Row</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  @click="editor.chain().focus().mergeCells().run()"
                >
                  <Merge class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Merge Cells</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :disabled="!editor.can().deleteRow()"
                  @click="editor.chain().focus().deleteRow().run()"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Row</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :disabled="!editor.can().deleteColumn()"
                  @click="editor.chain().focus().deleteColumn().run()"
                >
                  <Columns class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Column</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  :disabled="!editor.can().deleteTable()"
                  @click="editor.chain().focus().deleteTable().run()"
                >
                  <X class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Table</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator
          v-if="toolbar.indexOf('table') !== -1"
          orientation="vertical"
          class="mx-1 h-6"
        />

        <!-- Image Section -->
        <div v-if="toolbar.indexOf('image') !== -1" class="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  as-child
                >
                  <label class="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="importImage($event.target.files)"
                      :disabled="!editable"
                    />
                    <ImageIcon class="h-4 w-4" />
                  </label>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Insert Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Separator
          v-if="toolbar.indexOf('image') !== -1"
          orientation="vertical"
          class="mx-1 h-6"
        />

        <!-- Caption Section -->
        <div v-if="toolbar.indexOf('caption') !== -1" class="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="h-8 w-8 p-0 data-[state=open]:bg-accent"
              >
                <FileText class="h-4 w-4" />
                <span class="sr-only">Insert Caption</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                v-for="caption of $settings.report.public.captions"
                :key="caption"
                @click="editor.chain().focus().caption({ label: caption, alt: '' }).run()"
              >
                {{ caption }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator
          v-if="toolbar.indexOf('caption') !== -1"
          orientation="vertical"
          class="mx-1 h-6"
        />

        <!-- Undo/Redo Section -->
        <div class="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  @click="editor.chain().focus().undo().run()"
                >
                  <Undo class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 w-8 p-0"
                  @click="editor.chain().focus().redo().run()"
                >
                  <Redo class="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <!-- Diff Toggle -->
        <div v-if="diff !== undefined && (diff || modelValue) && modelValue !== diff" class="flex items-center gap-1">
          <Separator orientation="vertical" class="mx-1 h-6" />
          <Button
            variant="ghost"
            size="sm"
            :class="{ 'bg-accent': toggleDiff }"
            @click="toggleDiff = !toggleDiff"
          >
            Toggle Diff
          </Button>
        </div>
      </div>
    </div>
    
    <Separator />
    
    <!-- Bubble Menu -->
    <bubble-menu
      class="flex items-center gap-1 p-1 bg-popover border rounded-md shadow-md"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      v-if="editor"
    >
      <Button
        variant="ghost"
        size="sm"
        class="h-8 w-8 p-0"
        :class="{ 'bg-accent': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Bold class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="h-8 w-8 p-0"
        :class="{ 'bg-accent': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Italic class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="h-8 w-8 p-0"
        :class="{ 'bg-accent': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <Strikethrough class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="h-8 w-8 p-0"
        :class="{ 'bg-accent': editor.isActive('code') }"
        @click="editor.chain().focus().toggleCode().run()"
      >
        <Code class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        class="h-8 w-8 p-0"
        @click="editor.isActive('link') ? editor.chain().focus().unsetLink().run() : setLink()"
      >
                        <component :is="editor.isActive('link') ? Unlink : LinkIcon" class="h-4 w-4" />
      </Button>
    </bubble-menu>
    
    <!-- Language Tool Bubble Menu -->
    <bubble-menu
      class="p-3 bg-popover border rounded-md shadow-md max-w-sm"
      v-if="editor"
      :editor="editor"
      :tippy-options="{ placement: 'bottom', animation: 'fade' }"
    >
      <div class="space-y-2">
        <div class="text-sm font-medium">{{ matchMessage }}</div>
        <div class="space-y-1">
          <Button
            v-for="(replacement, i) in replacements"
            :key="i + replacement.value"
            variant="ghost"
            size="sm"
            class="w-full justify-start text-left"
            @click="acceptSuggestion(replacement)"
          >
            {{ replacement.value }}
          </Button>
        </div>
      </div>
    </bubble-menu>
    
    <!-- Editor Content -->
    <div class="min-h-[200px]">
      <editor-content
        v-if="typeof diff === 'undefined' || !toggleDiff"
        class="p-4 prose prose-sm max-w-none focus:outline-none"
        :editor="editor"
      />
      <div v-else class="p-4 prose prose-sm max-w-none">
        <div class="ProseMirror" v-html="diffContent"></div>
      </div>
    </div>
  </Card>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { cn } from '@/lib/utils'

import { Editor, EditorContent, BubbleMenu, VueNodeViewRenderer } from "@tiptap/vue-3"
//  Import extensions
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

import { LanguageTool } from './languagetool'
import Highlight from "@tiptap/extension-highlight"
import Underline from "@tiptap/extension-underline"
import StarterKit from "@tiptap/starter-kit"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import Link from "@tiptap/extension-link"
import CustomImage from "./editor-image"
//import Caption from "./editor-caption";
import { Figure } from "./figure";
import { TriggerMenuExtension } from './internal-link';
import { v4 as uuidv4 } from 'uuid'
import UserService from '@/services/user';
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'

// Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

// Icons
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Terminal,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Highlighter,
  ImageIcon,
  FileText,
  Table as TableIcon,
  Plus,
  RowsIcon,
  Merge,
  Trash2,
  Columns,
  X,
  Undo,
  Redo,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from 'lucide-vue-next'

import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import http from 'highlight.js/lib/languages/http'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import json from 'highlight.js/lib/languages/json'
import CodeBlockComponent from './CodeBlockComponent.vue'

import { all, createLowlight } from 'lowlight'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('javascripts', js)
lowlight.register('ts', ts)
lowlight.register('http', http)
lowlight.register('bash', bash)
lowlight.register('sql', sql)
lowlight.register('json', json)

const Diff = require("diff")
//  Internal libs
import Utils from "@/services/utils"
import ImageService from "@/services/image"

const match = ref(null)

const updateHtmlLanguageTool = () => navigator.clipboard.writeText(editor.value.getHTML())

export default defineComponent({
  emits: ['editorchange', 'ready', 'update:modelValue'],
  name: "BasicEditor",

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: true,
    },
    collab: {
      type: Boolean,
      default: true,
    },
    idUnique: {
      type: String,
      default: '',
    },
    toolbar: {
      type: Array,
      default: function () {
        return ["format", "marks", "list", "code", "table", "image", "caption"];
      },
    },
    noAffix: {
      type: Boolean,
      default: false,
    },
    diff: String,
    disableDrop: {
      type: Boolean,
      default: false,
    },
    noSync: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    EditorContent,
    BubbleMenu
  },

  computed: {
    formatIcon() {
      if (this.editor?.isActive('heading', { level: 1 })) return Heading1
      if (this.editor?.isActive('heading', { level: 2 })) return Heading2
      if (this.editor?.isActive('heading', { level: 3 })) return Heading3
      if (this.editor?.isActive('heading', { level: 4 })) return Heading4
      if (this.editor?.isActive('heading', { level: 5 })) return Heading5
      if (this.editor?.isActive('heading', { level: 6 })) return Heading6
      return Type
    },
    formatLabel() {
      if (this.editor?.isActive('heading', { level: 1 })) return 'H1'
      if (this.editor?.isActive('heading', { level: 2 })) return 'H2'
      if (this.editor?.isActive('heading', { level: 3 })) return 'H3'
      if (this.editor?.isActive('heading', { level: 4 })) return 'H4'
      if (this.editor?.isActive('heading', { level: 5 })) return 'H5'
      if (this.editor?.isActive('heading', { level: 6 })) return 'H6'
      return 'P'
    },
    highlightIcon() {
      return Highlighter
    },
    // ... rest of existing computed properties
  },

  data() {
    return {
      editor: null,
      json: "",
      html: "",
      toggleDiff: true,
      affixRelativeElement: "affix-relative-element",
      status: 'connecting',
      state: false,
      fullId: "",
      countChange: 0,
      countChangeAfterUpdate: -1,
      initialeDataUpdated: false,
      htmlEncode: Utils.htmlEncode,
      stickyConfig: {
        zIndex: 1000,
        top: 50,
        sticked: true,
        disabled: false,
        wrapper: true
      },
      // ... rest of existing data
    }
  },

  // ... rest of existing methods
})
</script>

<style lang="scss">

.tiptap {
  :first-child {
    margin-top: 0;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }

    /* Code styling */
    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }
}


.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

.collaboration-cursor__label {
 text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
 color:white;
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;

  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}



.editor {
  :focus {
    outline: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol,
  pre,
  blockquote {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .affix {
    width: auto;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    top: 50px !important;
    z-index: 1000;
  }
}

.editor {
  &__content {
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;

    .ProseMirror {
      min-height: 200px;
      cursor: auto;
    }

    h1 {
      font-size: 4.25rem;
    }

    pre {
      padding: 0.7rem 1rem;
      border-radius: 5px;
      background: black;
      color: white;
      font-size: 0.8rem;
      overflow-x: auto;
      white-space: pre-wrap;

      code {
        display: block;
      }
    }

    p code {
      padding: 0.2rem 0.4rem;
      border-radius: 5px;
      font-size: 0.8rem;
      font-weight: bold;
      background: rgba(black, 0.1);
      color: rgba(black, 0.8);
    }

    ul,
    ol {
      padding-left: 1rem;
    }

    li > p,
    li > ol,
    li > ul {
      margin: 0;
    }

    a {
      color: inherit;
    }

    blockquote {
      border-left: 3px solid rgba(black, 0.1);
      color: rgba(black, 0.8);
      padding-left: 0.8rem;
      font-style: italic;

      p {
        margin: 0;
      }
    }

    img {
      max-width: 100%;
      border-radius: 3px;
    }

    .selected {
      outline-style: solid;
      outline-color: $blue-4;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 0;
      overflow: hidden;

      td,
      th {
        min-width: 1em;
        border: 2px solid grey;
        padding: 3px 5px;
        vertical-align: top;
        box-sizing: border-box;
        position: relative;
        > * {
          margin-bottom: 0;
        }
      }

      th {
        background-color: #f1f3f5;
        font-weight: bold;
        text-align: left;
      }

      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(200, 200, 255, 0.4);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 4px;
        z-index: 20;
        background-color: #adf;
        pointer-events: none;
      }
    }

    .tableWrapper {
      margin: 1em 0;
      overflow-x: auto;
    }

    .resize-cursor {
      cursor: ew-resize;
      cursor: col-resize;
    }
  }
}
.is-active {
  color: green;
}
.editor-toolbar {
  min-height: 32px;
}

.diffrem {
  background-color: hsl(var(--color-diff-removed));
}
pre .diffrem {
  background-color: hsl(var(--color-error-solid));
}

.diffadd {
  background-color: hsl(var(--color-diff-added));
}
pre .diffadd {
  background-color: hsl(var(--color-success-solid));
}

.editor-bubble-menu{
   background: #333333;
    color: white;
    border-radius: 8px;
    padding: 5px;
    margin: -5px;
    display: flex;
}

.editor-bubble-menu > button > i{
  border-radius: 5px;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
}

.editor-bubble-menu > button > i:hover{
        background: #555555;
        color: #ffffff;
        cursor: pointer;
}
.editor-bubble-menu > .is-active > i {
        background: #555555;
        color: #ffffff;
        cursor: pointer;
}
.editor-bubble-menu > button {
  background: bottom;
    border: none;
}

.editor-menubar {
  display: flex;
  gap: 1rem;

  button {
    padding: 0.5rem;
    text-transform: capitalize;
    border: none;
    background-color: white;
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.25);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-weight: 500;
    font-size: 1.1em;

    &:hover {
      box-shadow: 0 0 2px rgba($color: #000000, $alpha: 0.25);
    }
  }
}

.ProseMirror {
  .lt {
    border-bottom: 2px solid hsl(var(--color-error-emphasis));
    transition: background 0.25s ease-in-out;

    &:hover {
      background: hsl(var(--color-error-subtle));
    }

    &-style {
      border-bottom: 2px solid hsl(var(--color-info-emphasis));

      &:hover {
        background: hsl(var(--color-info-subtle)) !important;
      }
    }

    &-typographical,
    &-grammar {
      border-bottom: 2px solid hsl(var(--color-warning-emphasis));

      &:hover {
        background: hsl(var(--color-warning-subtle)) !important;
      }
    }

    &-misspelling {
      border-bottom: 2px solid hsl(var(--color-error-emphasis));

      &:hover {
        background: hsl(var(--color-error-subtle)) !important;
      }
    }
  }

  &-focused {
    outline: none !important;
  }
}


.content {
  max-width: 50%;
  min-width: 50%;
}

.bubble-menu > .bubble-menu-section-container {
  display: flex;
  flex-direction: column;
  background-color: hsl(var(--color-popover));
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  max-width: 400px;

  .suggestions-section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 1em;

    .suggestion {
      background-color: hsl(var(--color-info-solid));
      border-radius: 4px;
      color: hsl(var(--color-info-foreground));
      cursor: pointer;
      font-weight: 500;
      padding: 4px;
      display: flex;
      align-items: center;
      font-size: 1.1em;
      max-width: fit-content;
    }
  }
}

</style>
