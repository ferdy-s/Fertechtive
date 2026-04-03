"use client";

import { useEffect, useRef, useState } from "react";

type EditorProps = {
  name: string;
  defaultValue?: string;
  uploadAction?: (fd: FormData) => Promise<{ url: string }>;
};

export default function Editor({
  name,
  defaultValue = "",
  uploadAction,
}: EditorProps) {
  const [html, setHtml] = useState<string>(defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  /* ======================== INIT ======================== */
  useEffect(() => {
    if (ref.current && defaultValue) {
      const init = sanitize(transformFencedCode(defaultValue));
      ref.current.innerHTML = init;
      setHtml(init);
    }
  }, [defaultValue]);

  /* ====== enhance code blocks (copy btn + highlight) ===== */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Copy buttons
    root.querySelectorAll<HTMLPreElement>("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.className =
        "copy-btn absolute right-2 top-2 text-xs rounded bg-black/50 px-2 py-1";
      btn.textContent = "Copy";
      btn.onclick = async (e) => {
        e.preventDefault();
        const code = pre.querySelector("code")?.textContent ?? "";
        await navigator.clipboard.writeText(code);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1000);
      };
      pre.style.position = "relative";
      pre.appendChild(btn);
    });

    // Lightweight highlight
    root.querySelectorAll("pre code").forEach((code) => {
      const lang = (
        code.getAttribute("data-lang") || detectLang(code.textContent || "")
      ).toLowerCase();
      code.setAttribute("data-lang", lang);
      code.innerHTML = highlight(code.textContent || "", lang);
    });
  }, [html]);

  /* ======================== TOOLBAR ======================== */
  function exec(cmd: string, value?: string) {
    document.execCommand(cmd, false, value);
    update();
  }
  function insertHtml(fragment: string) {
    document.execCommand("insertHTML", false, fragment);
    update();
  }
  function wrap(tag: string) {
    insertHtml(`<${tag}>${getSelectionHtml()}</${tag}>`);
  }
  function insertLink() {
    const url = prompt("Masukkan URL");
    if (!url) return;

    const safeUrl = escapeHtml(url);
    const text = getSelectionHtml() || safeUrl;

    insertHtml(
      `<a href="${safeUrl}" target="_blank" rel="nofollow noopener">${text}</a>`,
    );
  }
  async function insertImage() {
    if (!uploadAction) return alert("Upload tidak tersedia di lingkungan ini.");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (!input.files?.[0]) return;
      const fd = new FormData();
      fd.set("file", input.files[0]);
      const { url } = await uploadAction(fd);
      insertHtml(
        `<figure><img src="${url}" alt="" /><figcaption></figcaption></figure>`,
      );
    };
    input.click();
  }
  function insertCodeBlock() {
    const text = getSelectionText() || "console.log('hello');";
    const lang = prompt("Bahasa (js,ts,py,html,css,sql)?", "js") || "text";
    const safe = escapeHtml(text);
    insertHtml(`<pre><code data-lang="${lang}">${safe}</code></pre>`);
  }
  function clearFormatting() {
    exec("removeFormat");
    update();
  }

  function update() {
    const raw = ref.current?.innerHTML || "";
    const normalized = transformFencedCode(raw);
    const safe = sanitize(normalized);
    setHtml(safe);
  }

  /* ===================== PASTE INTERCEPT ===================== */
  function onBeforeInput(
    e: React.FormEvent<HTMLDivElement> & { nativeEvent: InputEvent },
  ) {
    const ne = e.nativeEvent;
    if (ne.inputType !== "insertFromPaste") return;
    e.preventDefault();
    // @ts-ignore
    const cd: DataTransfer | undefined = ne.dataTransfer;
    if (!cd) return;
    handlePastePayload(cd.getData("text/html"), cd.getData("text/plain"));
  }

  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    handlePastePayload(
      e.clipboardData.getData("text/html"),
      e.clipboardData.getData("text/plain"),
    );
  }

  function handlePastePayload(htmlData: string, textData: string) {
    let incoming = "";
    if (htmlData) {
      incoming = normalizePastedHTML(htmlData);
    } else if (textData) {
      incoming = markdownToHtml(textData);
    }
    incoming = transformFencedCode(incoming);
    const safe = sanitize(incoming);
    document.execCommand("insertHTML", false, safe);
    update();
  }

  return (
    <div className="grid gap-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/5 p-2 text-sm">
        <button
          onClick={() => wrap("h2")}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          H2
        </button>
        <button
          onClick={() => wrap("h3")}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          H3
        </button>
        <button
          onClick={() => exec("bold")}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          B
        </button>
        <button
          onClick={() => exec("italic")}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          I
        </button>
        <button
          onClick={() => exec("underline")}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          U
        </button>
        <button
          onClick={() => exec("insertUnorderedList")}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          • List
        </button>
        <button
          onClick={() => exec("insertOrderedList")}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          1. List
        </button>
        <button
          onClick={() => wrap("blockquote")}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          Quote
        </button>
        <button
          onClick={insertLink}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          Link
        </button>
        <button
          onClick={insertImage}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          Gambar
        </button>
        <button
          onClick={insertCodeBlock}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          Code
        </button>
        <button
          onClick={clearFormatting}
          className="px-2 py-1 rounded hover:bg-white/10"
        >
          Clear
        </button>
      </div>

      {/* Editable */}
      <div
        ref={ref}
        className="min-h-[300px] rounded-2xl border border-white/10 bg-white/5 p-4 focus:outline-none prose prose-invert max-w-none"
        contentEditable
        spellCheck
        aria-label="Editor konten"
        onBeforeInput={onBeforeInput}
        onPaste={onPaste}
        onInput={update}
        onBlur={update}
        suppressContentEditableWarning
      />

      {/* Hidden field to submit HTML */}
      <textarea hidden name={name} value={html} readOnly />

      {/* Styles khusus typografi & list (final) */}
      <style jsx global>{`
        /* Heading rules — sesuai permintaan */
        .prose h2 {
          font-size: 16px;
          line-height: 1.35;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }

        .prose h3 {
          font-size: 14px;
          line-height: 1.35;
          font-weight: 700;
          margin: 0.75rem 0 0.4rem;
        }

        /* List tampilan konsisten & BERINDENTASI */
        .prose ul,
        .prose ol {
          margin: 0.5rem 0 0.75rem;
          padding-left: 1.4rem;
        }
        .prose ul {
          list-style: disc;
        }
        .prose ol {
          list-style: decimal;
        }

        /* Nested level indents */
        .prose ul ul,
        .prose ul ol,
        .prose ol ul,
        .prose ol ol {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          padding-left: 1.4rem;
        }

        .prose li {
          display: list-item;
        }

        pre {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 16px;
          border-radius: 14px;
          overflow: auto;
          position: relative;
        }
        code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 0.9em;
        }

        /* Highlight tokens */
        code .kw {
          color: #7dd3fc;
        } /* keyword */
        code .fn {
          color: #a78bfa;
        } /* function */
        code .st {
          color: #f9a8d4;
        } /* string */
        code .nu {
          color: #fde68a;
        } /* number */
        code .cm {
          color: #9ca3af;
          font-style: italic;
        } /* comment */
        code .tg {
          color: #86efac;
        } /* html tag */
        code .at {
          color: #93c5fd;
        } /* html attr */
      `}</style>
    </div>
  );
}

/* ==============================
   Utils: selection & HTML tools
============================== */
function getSelectionText() {
  return window.getSelection()?.toString() ?? "";
}
function getSelectionHtml() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return "";
  const container = document.createElement("div");
  for (let i = 0; i < sel.rangeCount; i++)
    container.appendChild(sel.getRangeAt(i).cloneContents());
  return container.innerHTML;
}
function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m as "&" | "<" | ">" | '"' | "'"
      ]!,
  );
}

/* ==============================
   Fenced code → pre/code
============================== */
function transformFencedCode(html: string): string {
  return html.replace(
    /```(\w+)?\s*([\s\S]*?)```/g,
    (_, lang = "text", body) => {
      return `<pre><code data-lang="${lang}">${escapeHtml(body)}</code></pre>`;
    },
  );
}

/* ==============================
   Sanitizer whitelist
============================== */
const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "h1",
  "h2",
  "h3",
  "strong",
  "em",
  "u",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "pre",
  "code",
  "figure",
  "figcaption",
  "span",
]);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
  img: new Set(["src", "alt"]),
  code: new Set(["data-lang"]),
  span: new Set(["class"]),
  ol: new Set(["start", "type"]),
};
function sanitize(input: string): string {
  const tpl = document.createElement("template");
  tpl.innerHTML = input;

  (function walk(node: Node) {
    if (node.nodeType === 1) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        const parent = el.parentNode;
        while (el.firstChild) parent?.insertBefore(el.firstChild, el);
        parent?.removeChild(el);
        return;
      }

      [...el.attributes].forEach((attr) => {
        const allow = ALLOWED_ATTRS[tag];
        if (!allow || !allow.has(attr.name)) el.removeAttribute(attr.name);

        if (tag === "a" && attr.name === "href") {
          const href = el.getAttribute("href") || "";
          if (!/^(https?:\/\/|\/|#)/.test(href)) el.removeAttribute("href");
          el.setAttribute("rel", "nofollow noopener");
          el.setAttribute("target", "_blank");
        }
        if (tag === "img" && attr.name === "src") {
          const src = el.getAttribute("src") || "";
          if (!/^(https?:\/\/|\/)/.test(src)) el.removeAttribute("src");
        }
      });

      el.removeAttribute("style");
      if (tag !== "code" && tag !== "pre") el.className = "";
    }
    [...(node.childNodes as any)].forEach(walk);
  })(tpl.content);

  return tpl.innerHTML;
}

/* ==============================
   NORMALIZER PASTE HTML (Word/Docs/Web)
============================== */
function normalizePastedHTML(raw: string): string {
  // Clip fragment (Docs)
  const sIdx = raw.indexOf("<!--StartFragment-->");
  const eIdx = raw.indexOf("<!--EndFragment-->");
  if (sIdx !== -1 && eIdx !== -1) {
    raw = raw.slice(sIdx + "<!--StartFragment-->".length, eIdx);
  }

  const doc = new DOMParser().parseFromString(raw, "text/html");
  const body = doc.body;

  // Simpan margin-left sementara (untuk level list Word)
  const marginMap = new WeakMap<HTMLElement, number>();
  body.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const st = (el.getAttribute("style") || "").toLowerCase();
    const m = st.match(/margin-left:\s*([0-9.]+)\s*(pt|px)/);
    if (m) {
      const val = parseFloat(m[1]) * (m[2] === "pt" ? 1.333 : 1);
      marginMap.set(el, val);
    }
  });

  // Hapus noise umum
  body
    .querySelectorAll("style, meta, link, script, xml, o\\:p")
    .forEach((n) => n.remove());

  // Konversi list Word (bertahap + nesting) — SAFE INSERT
  convertMsoListsWithNesting(body, marginMap);

  // Map inline style → semantik + heading heuristics
  body.querySelectorAll<HTMLElement>("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const style = (el.getAttribute("style") || "").toLowerCase();

    // Heuristik heading by font-size
    const fsMatch = style.match(/font-size:\s*([0-9.]+)\s*(pt|px)/);
    if (/^h[4-6]$/.test(tag)) replaceTag(el, "h3");
    if (!/^h[1-3]$/.test(tag) && fsMatch) {
      const size = parseFloat(fsMatch[1]);
      const unit = fsMatch[2];
      const px = unit === "pt" ? size * 1.333 : size;
      if (px >= 28) replaceTag(el, "h1");
      else if (px >= 22) replaceTag(el, "h2");
      else if (px >= 18) replaceTag(el, "h3");
    }

    // Bold/Italic/Underline dari style
    if (style.includes("font-weight") && /bold|700|800|900/.test(style))
      wrapInline(el, "strong");
    if (style.includes("font-style") && style.includes("italic"))
      wrapInline(el, "em");
    if (style.includes("text-decoration") && style.includes("underline"))
      wrapInline(el, "u");

    // div hanya text → p
    if (
      tag === "div" &&
      !el.querySelector("p,h1,h2,h3,ul,ol,pre,blockquote,figure")
    ) {
      replaceTag(el, "p");
    }

    // span polos → unwrap
    if (tag === "span" && el.attributes.length === 0) unwrap(el);

    // Bersihkan kelas/style/data-*
    el.removeAttribute("class");
    el.removeAttribute("style");
    [...el.getAttributeNames()].forEach((n) => {
      if (n.startsWith("data-")) el.removeAttribute(n);
    });
  });

  // Setelah bersih: deteksi list dari paragraf biasa (dengan nesting kasar) — SAFE INSERT
  wrapParagraphSequencesIntoListsWithIndent(body);

  return body.innerHTML;
}

/* ===== Word list converter with nesting — SAFE INSERT ===== */
function convertMsoListsWithNesting(
  root: HTMLElement,
  marginMap: WeakMap<HTMLElement, number>,
) {
  const paras = Array.from(
    root.querySelectorAll<HTMLElement>(
      "p.MsoListParagraph, p[class*='MsoList']",
    ),
  );
  if (!paras.length) return;

  // Grup berurutan
  const allPs = Array.from(root.querySelectorAll<HTMLElement>("p"));
  const groups: HTMLElement[][] = [];
  let cur: HTMLElement[] = [];
  const isListPara = (p: HTMLElement) =>
    /MsoList/i.test(p.className) ||
    /mso-list/i.test(p.getAttribute("style") || "");

  allPs.forEach((p) => {
    if (isListPara(p)) cur.push(p);
    else if (cur.length) (groups.push(cur), (cur = []));
  });
  if (cur.length) groups.push(cur);

  groups.forEach((g) => {
    if (!g.length) return;

    // Simpan parent & ref SEBELUM p dihapus
    const parent = g[0].parentNode as HTMLElement | null;
    const ref = g[0] as ChildNode | null;
    if (!parent) return;

    const container = root.ownerDocument!.createElement("div");
    const stack: {
      list: HTMLOListElement | HTMLUListElement;
      level: number;
    }[] = [];
    let baseType: "ul" | "ol-decimal" | "ol-a" | "ol-A" | "ol-i" | "ol-I" =
      "ul";

    g.forEach((p, idx) => {
      const txt = (p.textContent || "").trim();
      if (idx === 0) baseType = detectListMarkerType(txt);

      const mLeft = marginMap.get(p) ?? 0;
      const level = Math.max(0, Math.round(mLeft / 18)); // 18px ~ 1 indent level

      const type = detectListMarkerType(txt) || baseType;

      while (stack.length && stack[stack.length - 1].level > level) stack.pop();
      if (!stack.length || stack[stack.length - 1].level < level) {
        const list = root.ownerDocument!.createElement(
          type.startsWith("ol") ? "ol" : "ul",
        );
        if (type === "ol-a") list.setAttribute("type", "a");
        if (type === "ol-A") list.setAttribute("type", "A");
        if (type === "ol-i") list.setAttribute("type", "i");
        if (type === "ol-I") list.setAttribute("type", "I");

        if (stack.length) stack[stack.length - 1].list.appendChild(list);
        else container.appendChild(list);
        stack.push({ list, level });
      }

      const li = root.ownerDocument!.createElement("li");
      li.textContent = txt.replace(
        /^\s*([0-9ivxa-zA-Z]+)[.)]\s+|^[•·\-–—]\s+/,
        "",
      );
      stack[stack.length - 1].list.appendChild(li);
      p.remove(); // aman karena parent & ref sudah disimpan
    });

    if (!container.firstChild) return;

    // Pindahkan hasil ke fragment, baru sisipkan dengan aman
    const frag = root.ownerDocument!.createDocumentFragment();
    while (container.firstChild) frag.appendChild(container.firstChild);

    if (ref && ref.parentNode === parent) {
      parent.insertBefore(frag, ref);
    } else {
      parent.appendChild(frag);
    }
  });
}

function detectListMarkerType(
  txt: string,
): "ul" | "ol-decimal" | "ol-a" | "ol-A" | "ol-i" | "ol-I" {
  if (/^\d+[.)]/.test(txt)) return "ol-decimal";
  if (/^[a]\./.test(txt)) return "ol-a";
  if (/^[A]\./.test(txt)) return "ol-A";
  if (/^[i]\./.test(txt)) return "ol-i";
  if (/^[I]\./.test(txt)) return "ol-I";
  if (/^[•·\-–—]\s+/.test(txt)) return "ul";
  return "ul";
}

/* ===== Wrap paragraf list + nesting spasi/tab — SAFE INSERT ===== */
function wrapParagraphSequencesIntoListsWithIndent(root: HTMLElement) {
  const ps = Array.from(root.querySelectorAll<HTMLElement>("p"));
  if (!ps.length) return;

  const blocks: HTMLElement[][] = [];
  let buf: HTMLElement[] = [];
  let mode: string | null = null;

  const which = (t: string) => {
    if (/^\t*\s*\d+\.\s+/.test(t)) return "ol-decimal";
    if (/^\t*\s*[a]\.\s+/.test(t)) return "ol-a";
    if (/^\t*\s*[A]\.\s+/.test(t)) return "ol-A";
    if (/^\t*\s*[i]\.\s+/.test(t)) return "ol-i";
    if (/^\t*\s*[I]\.\s+/.test(t)) return "ol-I";
    if (/^\t*\s*[-*+]\s+/.test(t)) return "ul";
    return null;
  };

  const flush = () => {
    if (!buf.length) return;
    blocks.push([...buf]);
    buf = [];
    mode = null;
  };

  ps.forEach((p) => {
    const t = p.textContent || "";
    const m = which(t);
    if (!m) return flush();
    if (mode && m !== mode) flush();
    mode = m;
    buf.push(p);
  });
  flush();

  blocks.forEach((group) => {
    if (!group.length) return;

    // Simpan parent & ref SEBELUM modifikasi
    const parent = group[0].parentNode as HTMLElement | null;
    const ref = group[0] as ChildNode | null;
    if (!parent) return;

    const container = root.ownerDocument!.createElement("div");
    const stack: {
      list: HTMLOListElement | HTMLUListElement;
      level: number;
      type: string;
    }[] = [];

    group.forEach((p) => {
      const raw = p.textContent || "";
      const lead = raw.match(/^(\s|\t)*/)?.[0] || "";
      const level = Math.floor(lead.replace(/\t/g, "  ").length / 2); // 2 spasi per level
      const kind = ((): string => {
        if (/^\s*\d+\.\s+/.test(raw)) return "ol-decimal";
        if (/^\s*[a]\.\s+/.test(raw)) return "ol-a";
        if (/^\s*[A]\.\s+/.test(raw)) return "ol-A";
        if (/^\s*[i]\.\s+/.test(raw)) return "ol-i";
        if (/^\s*[I]\.\s+/.test(raw)) return "ol-I";
        return "ul";
      })();

      while (stack.length && stack[stack.length - 1].level > level) stack.pop();
      if (
        !stack.length ||
        stack[stack.length - 1].level < level ||
        stack[stack.length - 1].type !== kind
      ) {
        const list = root.ownerDocument!.createElement(
          kind.startsWith("ol") ? "ol" : "ul",
        );
        if (kind === "ol-a") list.setAttribute("type", "a");
        if (kind === "ol-A") list.setAttribute("type", "A");
        if (kind === "ol-i") list.setAttribute("type", "i");
        if (kind === "ol-I") list.setAttribute("type", "I");
        if (stack.length) stack[stack.length - 1].list.appendChild(list);
        else container.appendChild(list);
        stack.push({ list, level, type: kind });
      }

      const li = root.ownerDocument!.createElement("li");
      li.textContent = raw
        .replace(/^\s*/, "")
        .replace(/^(\d+|[a-zA-Z]|[iIvVxX])\.\s+|^[-*+]\s+/, "");
      stack[stack.length - 1].list.appendChild(li);
      p.remove(); // aman karena parent & ref sudah disimpan
    });

    if (!container.firstChild) return;

    const frag = root.ownerDocument!.createDocumentFragment();
    while (container.firstChild) frag.appendChild(container.firstChild);

    if (ref && ref.parentNode === parent) {
      parent.insertBefore(frag, ref);
    } else {
      parent.appendChild(frag);
    }
  });
}

/* ==============================
   Helpers normalizer
============================== */
function replaceTag(el: HTMLElement, newTag: string) {
  const n = el.ownerDocument!.createElement(newTag);
  while (el.firstChild) n.appendChild(el.firstChild);
  el.replaceWith(n);
}
function unwrap(el: HTMLElement) {
  const parent = el.parentNode;
  while (el.firstChild) parent?.insertBefore(el.firstChild, el);
  parent?.removeChild(el);
}
function wrapInline(el: HTMLElement, tag: "strong" | "em" | "u") {
  const w = el.ownerDocument!.createElement(tag);
  while (el.firstChild) w.appendChild(el.firstChild);
  el.appendChild(w);
}

/* ==============================
   Markdown → HTML (basic)
============================== */
function markdownToHtml(text: string): string {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let inUl = false,
    inOl = false,
    olType: string | undefined;

  const closeLists = () => {
    if (inUl) out.push("</ul>");
    if (inOl) out.push("</ol>");
    inUl = inOl = false;
    olType = undefined;
  };
  const openOl = (type?: string) => {
    inOl = true;
    olType = type;
    out.push(type ? `<ol type="${type}">` : `<ol>`);
  };

  for (const raw0 of lines) {
    const raw = raw0; // keep indent
    const line = raw.trim();
    if (!line) {
      closeLists();
      continue;
    }

    if (/^###\s+/.test(line)) {
      closeLists();
      out.push(`<h3>${inlineMd(line.replace(/^###\s+/, ""))}</h3>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      closeLists();
      out.push(`<h2>${inlineMd(line.replace(/^##\s+/, ""))}</h2>`);
      continue;
    }
    if (/^#\s+/.test(line)) {
      closeLists();
      out.push(`<h1>${inlineMd(line.replace(/^#\s+/, ""))}</h1>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      if (!inOl) openOl();
      out.push(`<li>${inlineMd(line.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }
    if (/^[a]\.\s+/.test(line)) {
      if (!inOl || olType !== "a") {
        closeLists();
        openOl("a");
      }
      out.push(`<li>${inlineMd(line.replace(/^[a]\.\s+/, ""))}</li>`);
      continue;
    }
    if (/^[A]\.\s+/.test(line)) {
      if (!inOl || olType !== "A") {
        closeLists();
        openOl("A");
      }
      out.push(`<li>${inlineMd(line.replace(/^[A]\.\s+/, ""))}</li>`);
      continue;
    }
    if (/^[i]\.\s+/.test(line)) {
      if (!inOl || olType !== "i") {
        closeLists();
        openOl("i");
      }
      out.push(`<li>${inlineMd(line.replace(/^[i]\.\s+/, ""))}</li>`);
      continue;
    }
    if (/^[I]\.\s+/.test(line)) {
      if (!inOl || olType !== "I") {
        closeLists();
        openOl("I");
      }
      out.push(`<li>${inlineMd(line.replace(/^[I]\.\s+/, ""))}</li>`);
      continue;
    }
    if (/^[-*+]\s+/.test(line)) {
      if (!inUl) {
        closeLists();
        inUl = true;
        out.push("<ul>");
      }
      out.push(`<li>${inlineMd(line.replace(/^[-*+]\s+/, ""))}</li>`);
      continue;
    }

    closeLists();
    out.push(`<p>${inlineMd(line)}</p>`);
  }
  closeLists();
  return out.join("\n");
}
function inlineMd(s: string): string {
  let t = escapeHtml(s);
  t = t.replace(/`([^`]+)`/g, (_m, g1) => `<code>${escapeHtml(g1)}</code>`);
  t = t.replace(
    /\*\*([^*]+)\*\*|__([^_]+)__/g,
    (_m, g1, g2) => `<strong>${escapeHtml(g1 || g2)}</strong>`,
  );
  t = t.replace(
    /\*([^*]+)\*|_([^_]+)_/g,
    (_m, g1, g2) => `<em>${escapeHtml(g1 || g2)}</em>`,
  );
  t = t.replace(/__u__([^_]+)__u__/g, (_m, g1) => `<u>${escapeHtml(g1)}</u>`);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
    const safe = /^(https?:\/\/|\/|#)/.test(url) ? url : "#";
    return `<a href="${escapeHtml(safe)}" target="_blank" rel="nofollow noopener">${escapeHtml(text)}</a>`;
  });
  return t;
}

/* ==============================
   Language detection & highlight
============================== */
function detectLang(s: string): string {
  if (/^\s*</.test(s)) return "html";
  if (/\b(def|import|None|True|False|self)\b/.test(s)) return "py";
  if (/\b(function|const|let|=>|console\.log)\b/.test(s)) return "js";
  if (/\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bFROM\b/i.test(s)) return "sql";
  if (/{[^}]*}/.test(s) && /class|interface|type/.test(s)) return "ts";
  if (/{[^}]*}/.test(s) && /;/.test(s)) return "css";
  return "text";
}
function highlight(code: string, lang: string): string {
  switch (lang) {
    case "js":
    case "ts":
      return jsHighlight(code);
    case "py":
      return pyHighlight(code);
    case "html":
      return htmlHighlight(code);
    case "css":
      return cssHighlight(code);
    case "sql":
      return sqlHighlight(code);
    default:
      return escapeHtml(code);
  }
}
/* ====== naive highlighters (regex) ====== */
function jsHighlight(s: string) {
  s = escapeHtml(s);
  s = s.replace(/(\/\/.*?$)/gm, `<span class="cm">$1</span>`);
  s = s.replace(/(['"`])(?:\\.|(?!\1).)*\1/gm, `<span class="st">$&</span>`);
  s = s.replace(/\b(\d+)\b/g, `<span class="nu">$1</span>`);
  s = s.replace(
    /\b(const|let|var|function|return|if|else|for|while|new|class|extends|import|from|export|async|await|try|catch|throw|switch|case|break|continue)\b/g,
    `<span class="kw">$1</span>`,
  );
  s = s.replace(/\b([A-Za-z_]\w*)\s*(?=\()/g, `<span class="fn">$1</span>`);
  return s;
}
function pyHighlight(s: string) {
  s = escapeHtml(s);
  s = s.replace(/(#.*?$)/gm, `<span class="cm">$1</span>`);
  s = s.replace(/(['"])(?:\\.|(?!\1).)*\1/gm, `<span class="st">$&</span>`);
  s = s.replace(/\b(\d+)\b/g, `<span class="nu">$1</span>`);
  s = s.replace(
    /\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|raise|with|yield|lambda|True|False|None|and|or|not|in|is)\b/g,
    `<span class="kw">$1</span>`,
  );
  s = s.replace(/\b([A-Za-z_]\w*)\s*(?=\()/g, `<span class="fn">$1</span>`);
  return s;
}
function htmlHighlight(s: string) {
  s = escapeHtml(s);
  s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, `<span class="cm">$1</span>`);
  s = s.replace(/&lt;\/?([a-z0-9-]+)([^&]*?)&gt;/gi, (_m, tag, attrs) => {
    const a = attrs.replace(
      /([a-z-:]+)=("[^"]*"|'[^']*')/gi,
      `<span class="at">$1</span>=<span class="st">$2</span>`,
    );
    return `&lt;<span class="tg">${tag}</span>${a}&gt;`;
  });
  return s;
}
function cssHighlight(s: string) {
  s = escapeHtml(s);
  s = s.replace(/(\/\*[\s\S]*?\*\/)/g, `<span class="cm">$1</span>`);
  s = s.replace(/(:\s*)([^;{}]+)/g, `$1<span class="st">$2</span>`);
  s = s.replace(/\b(\d+)(px|rem|em|%)\b/g, `<span class="nu">$1$2</span>`);
  return s;
}
function sqlHighlight(s: string) {
  s = escapeHtml(s);
  s = s.replace(/(--.*?$)/gm, `<span class="cm">$1</span>`);
  s = s.replace(
    /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|ON|GROUP BY|ORDER BY|LIMIT|AND|OR|NOT|AS)\b/gi,
    `<span class="kw">$1</span>`,
  );
  s = s.replace(/('[^']*')/g, `<span class="st">$1</span>`);
  s = s.replace(/\b(\d+)\b/g, `<span class="nu">$1</span>`);
  return s;
}
