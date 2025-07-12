import { Node, NodeSelection } from "@tiptap/core";

export default class Caption extends Node {
  get name() {
    return "caption";
  }

  get schema() {
    return {
      attrs: {
        label: {
          default: "Figure",
        },
        alt: {
          default: "",
        },
      },
      group: "block",
      draggable: true,
      parseDOM: [
        {
          tag: "legend[alt]",
          getAttrs: (dom) => ({
            label: dom.getAttribute("label"),
            alt: dom.getAttribute("alt"),
          }),
        },
      ],
      toDOM: (node) => ["legend", node.attrs],
    };
  }

  commands({ type }) {
    return (attrs) => (state, dispatch) =>
      dispatch(state.tr.replaceSelectionWith(type.create(attrs)));
  }

  get view() {
    return {
      props: ["node", "updateAttrs"],
      computed: {
        label: {
          get() {
            return this.node.attrs.label;
          },
          set(label) {
            this.updateAttrs({
              label,
            });
          },
        },
        alt: {
          get() {
            return this.node.attrs.alt;
          },
          set(alt) {
            this.updateAttrs({
              alt,
            });
          },
        },
      },
      template: `
      <div style="margin: 0px auto 16px auto; display: table">
        <div style="max-width:600px" class="cursor-pointer inline-flex items-center gap-1 p-2 rounded hover:bg-gray-50">
          <span>{{label}} - </span>
          <span v-if="alt" class="italic">{{alt}}</span>
          <span v-else class="italic text-gray-500">Caption</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1 opacity-50">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </div>
        <popup-edit v-model="alt" :auto-save="true" :trigger-class="'w-full max-w-[600px]'">
          <template #trigger>
            <div class="w-full max-w-[600px] cursor-pointer inline-flex items-center gap-1 p-2 rounded hover:bg-gray-50">
              <span>{{label}} - </span>
              <span v-if="alt" class="italic">{{alt}}</span>
              <span v-else class="italic text-gray-500">Caption</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1 opacity-50">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
              </svg>
            </div>
          </template>
        </popup-edit>
      </div>
      `,
      components: {
        'popup-edit': () => import('@/components/ui/popup-edit.vue')
      }
    };
  }
}
