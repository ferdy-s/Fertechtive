"use client";

import { useEffect, useId, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
} from "lexical";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  ListNode,
  ListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $setBlocksType } from "@lexical/selection";

/* =======================================================
   Upload helper
   ======================================================= */
async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload gagal");
  }

  const data = await res.json();
  return data.url as string;
}

/* =======================================================
   Placeholder
   ======================================================= */
function Placeholder() {
  return (
    <div className="pointer-events-none select-none text-white/40">
      Tulis konten di sini…
    </div>
  );
}

/* =======================================================
   Toolbar
   ======================================================= */
function Toolbar({ editor }: { editor: LexicalEditor }) {
  const promptLink = () => {
    const href = prompt("Masukkan URL");
    if (href === null) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, href || null);
  };

  const setHeading = (tag: "paragraph" | "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (tag === "paragraph") {
        const p = $createParagraphNode();
        selection.getNodes().forEach((node) => node.replace(p));
      } else {
        $setBlocksType(selection, () => new HeadingNode(tag));
      }
    });
  };

  const insertImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);

      editor.update(() => {
        const dom = new DOMParser().parseFromString(
          `<p><img src="${previewUrl}" alt="" data-preview="true" /></p>`,
          "text/html",
        );

        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        nodes.forEach((n) => root.append(n));
      });
    };

    input.click();
  };

  return (
    <div className="flex flex-wrap gap-1 rounded-lg border border-white/15 bg-black/30 p-1">
      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-white/10"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        B
      </button>

      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-white/10"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        I
      </button>

      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-white/10"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
      >
        Code
      </button>

      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-white/10"
        onClick={promptLink}
      >
        Link
      </button>

      <div className="mx-1 w-px bg-white/15" />

      {(["paragraph", "h1", "h2", "h3"] as const).map((tag) => (
        <button
          key={tag}
          type="button"
          className="px-2 py-1 rounded hover:bg-white/10"
          onClick={() => setHeading(tag)}
        >
          {tag === "paragraph" ? "P" : tag.toUpperCase()}
        </button>
      ))}

      <div className="mx-1 w-px bg-white/15" />

      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-white/10"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        • List
      </button>

      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-white/10"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      >
        1. List
      </button>

      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-white/10"
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => new QuoteNode());
            }
          })
        }
      >
        Quote
      </button>

      <div className="mx-1 w-px bg-white/15" />

      <button
        type="button"
        className="px-2 py-1 rounded hover:bg-white/10"
        onClick={insertImage}
      >
        Image
      </button>
    </div>
  );
}

/* =======================================================
   Main Component
   ======================================================= */
export default function RichTextEditor({
  name,
  label = "Content",
  initialHTML = "",
}: {
  name: string;
  label?: string;
  initialHTML?: string;
}) {
  const id = useId();
  const hiddenRef = useRef<HTMLTextAreaElement | null>(null);

  const initialConfig = {
    namespace: "RichTextEditor",
    editable: true,
    onError(error: Error) {
      console.error(error);
    },
    theme: {
      paragraph: "mb-2",
      quote: "border-l-4 border-white/20 pl-3 italic",
      heading: {
        h1: "text-2xl font-bold mt-4 mb-2",
        h2: "text-xl font-semibold mt-4 mb-2",
        h3: "text-lg font-semibold mt-3 mb-2",
      },
      code: "rounded bg-white/10 px-1 py-0.5 font-mono",
      list: {
        ul: "list-disc ml-6",
        ol: "list-decimal ml-6",
        listitem: "my-1",
      },
      link: "underline underline-offset-4",
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, LinkNode],
  };

  const handleChange = (editorState: any, editor: LexicalEditor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      if (hiddenRef.current) {
        hiddenRef.current.value = html;
      }
    });
  };

  return (
    <div className="grid gap-2 text-sm">
      <label>{label}</label>

      <LexicalComposer initialConfig={initialConfig}>
        <EditorShell
          id={id}
          initialHTML={initialHTML}
          hiddenRef={hiddenRef}
          onChange={handleChange}
        />
      </LexicalComposer>

      <textarea name={name} ref={hiddenRef} className="hidden" />
    </div>
  );
}

/* =======================================================
   Editor Shell
   ======================================================= */
function EditorShell({
  id,
  initialHTML,
  hiddenRef,
  onChange,
}: {
  id: string;
  initialHTML: string;
  hiddenRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (editorState: any, editor: LexicalEditor) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialHTML) return;

    editor.update(() => {
      const dom = new DOMParser().parseFromString(initialHTML, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      nodes.forEach((node) => root.append(node));
    });
  }, [editor, initialHTML]);

  return (
    <div className="grid gap-2">
      <Toolbar editor={editor} />

      <div className="rounded-lg border border-white/15 bg-black/40">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              id={id}
              className="min-h-[12rem] px-3 py-2 outline-none prose prose-invert max-w-none"
            />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={() => (
            <div className="p-2 text-xs text-red-400">
              Terjadi kesalahan editor
            </div>
          )}
        />

        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <AutoFocusPlugin />
        <OnChangePlugin onChange={onChange} />
      </div>
    </div>
  );
}
