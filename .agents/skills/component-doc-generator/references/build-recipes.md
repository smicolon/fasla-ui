# Build Recipes — `figma_execute` helpers

Paste the **Helper library** at the top of each build `figma_execute` call, then call the builders below. Build top-down, 2–3 sections per call, `timeout: 30000`. All values come from `design-spec.md`.

Three gotchas that will bite you:
- **`layoutSizingHorizontal='FILL'`** — after `parent.appendChild(child)`, a child only stretches to parent width if you set this (parent must be auto-layout). Columns share a row's width via `layoutGrow = 1`. The `fill()` helper does the stretch.
- **`layoutGrow` is 0 or 1 only** — it is NOT a flex-grow weight. For unequal columns use fixed widths, don't pass `2`.
- **`resize()` locks the axis to FIXED** — calling `frame.resize(w, h)` on an auto-layout frame sets `primaryAxisSizingMode='FIXED'`, so the frame stops hugging its content and clips. After sizing the outer doc width, immediately restore `doc.primaryAxisSizingMode='AUTO'` (keep `counterAxisSizingMode='FIXED'` to hold the width). Same trap for any fixed-width column: `col.counterAxisSizingMode='FIXED'; col.resize(340,10); col.primaryAxisSizingMode='AUTO'`.
- **Append THEN fill** — `layoutSizingHorizontal='FILL'` throws unless the node is *already* a child of an auto-layout frame. Never `parent.appendChild(fill(makeThing()))`; always `const n=makeThing(); parent.appendChild(n); n.layoutSizingHorizontal='FILL'`. Also set a section to fill the doc AFTER `doc.appendChild`/`insertChild`, not before.
- **`globalThis` does NOT persist between `figma_execute` calls** (verified 2026-09-06 — it does for some servers, but not this one; every helper came back `undefined` on the next call). `figma.root.setSharedPluginData` / `getSharedPluginData` DO persist, and `new Function` works in the sandbox. Store the helper library once as a source string ending in `return {af, T, ...}`, then open every build call with one line:
  `const B = await (new Function('figma','return (async function(){'+figma.root.getSharedPluginData('fasla','fdoc1')+figma.root.getSharedPluginData('fasla','fdoc2')+'})()'))(figma);`
  Split the source across two keys to keep each `setSharedPluginData` call small. Wrap the stored source in a **template literal** and therefore avoid backslashes in it — `\*` inside a template literal collapses to `*` and silently breaks a regex like `/\*\*(.+?)\*\*/`. Write `richText` with `raw.split('**')` instead of a regex, and replace `/^theme\//` with `v.name.indexOf('theme/')===0`.
- **`figma.currentPage` resets to the file's first page at the start of every call.** Start each build call with `await figma.setCurrentPageAsync(targetPage)` or new nodes land on the wrong page.
- **The plugin sandbox rejects spread in array literals** (`[...a, b]`) — use `push`/`concat`.
- **`insertChild(i, node)` when the node is already a child at `j < i` lands it at `i-1`** (it removes first, then inserts). To move a section to sit immediately after the child at index `k`, call `insertChild(k+2, node)`.
- **New nodes attach to the page immediately** — `createFrame()`/`createRectangle()`/`createText()` land on the current page the moment they're created. If a build call throws partway, the half-built nodes are orphaned on the page (not inside the doc). On error, clean up before retrying: remove page-level frames that aren't the doc and match your build (e.g. contain a `Stage`, or are an empty `Container`, or a `Section` whose heading matches the one you were building) — then re-run. Rebuild sections **in place** with `doc.insertChild(index, section)`, not `appendChild` (which moves them to the end and scrambles order).

## Helper library (paste verbatim)

```js
// ---- fonts (call once at top) ----
for (const s of ['Regular','Medium','Semi Bold','Bold']) await figma.loadFontAsync({family:'Inter',style:s});
await figma.loadFontAsync({family:'Geist',style:'Medium'});
for (const s of ['Regular','Medium','SemiBold','Bold']) await figma.loadFontAsync({family:'Cairo',style:s}); // Arabic doc chrome

const C = h => { h=h.replace('#',''); return {r:parseInt(h.slice(0,2),16)/255,g:parseInt(h.slice(2,4),16)/255,b:parseInt(h.slice(4,6),16)/255}; };
const fill = n => { n.layoutSizingHorizontal='FILL'; return n; };

function af(name,dir,gap,pad){ const f=figma.createFrame(); f.name=name; f.layoutMode=dir;
  f.itemSpacing=gap||0; f.primaryAxisSizingMode='AUTO'; f.counterAxisSizingMode='AUTO'; f.fills=[];
  if(pad){f.paddingTop=pad[0];f.paddingRight=pad[1];f.paddingBottom=pad[2];f.paddingLeft=pad[3];} return f; }

function T(chars,o){ o=o||{}; const t=figma.createText(); t.fontName={family:o.family||'Inter',style:o.style||'Regular'};
  t.characters=chars; t.fontSize=o.size||16; if(o.lh) t.lineHeight={value:o.lh,unit:'PIXELS'};
  t.fills=[{type:'SOLID',color:C(o.color||'#09090B')}]; if(o.ls) t.letterSpacing={value:o.ls,unit:'PIXELS'}; if(o.upper) t.textCase='UPPER';
  if(o.w){t.textAutoResize='HEIGHT'; t.resize(o.w,t.height);} return t; }

// rich text: bold the words wrapped in **double asterisks** (used in Do/Don't lines)
function richText(raw,o){ const re=/\*\*(.+?)\*\*/g; let out='',last=0,m; const ranges=[];
  while((m=re.exec(raw))!==null){ out+=raw.slice(last,m.index); const a=out.length; out+=m[1]; ranges.push([a,out.length]); last=m.index+m[0].length; }
  out+=raw.slice(last); const t=T(out,o); ranges.forEach(([a,b])=>t.setRangeFontName(a,b,{family:'Inter',style:'Bold'})); return t; }

async function styleId(name){ const st=await figma.getLocalTextStylesAsync(); const s=st.find(x=>x.name===name); return s?s.id:null; }

function sectionHeader(h2,desc){ const w=af('Header','VERTICAL',16);
  const hf=af('Heading 2','VERTICAL',0); hf.appendChild(T(h2,{style:'Bold',size:26,lh:39})); w.appendChild(hf);
  if(desc){ const pf=af('Paragraph','VERTICAL',0); pf.appendChild(T(desc,{size:15,lh:24.75,color:'#52525B',w:735})); w.appendChild(pf);} return w; }

// property rows: [{prop, values, default}]
function propTable(rows){
  const box=af('Table','VERTICAL',0,[1,1,1,1]); box.cornerRadius=14; box.clipsContent=true;
  box.fills=[{type:'SOLID',color:C('#FFFFFF')}]; box.strokes=[{type:'SOLID',color:C('#E4E4E7')}]; box.strokeWeight=1;
  const head=af('head','HORIZONTAL',0,[11,18,12,18]); head.fills=[{type:'SOLID',color:C('#FAFAFA')}];
  ['PROPERTY','VALUES','DEFAULT'].forEach(h=>{const c=af('h','VERTICAL',0);c.layoutGrow=1;c.appendChild(T(h,{style:'Semi Bold',size:11,lh:16.5,color:'#A1A1AA'}));head.appendChild(c);});
  box.appendChild(head); fill(head);
  rows.forEach((r,i)=>{ const row=af('row','HORIZONTAL',0,[12,18,12,18]); row.fills=[{type:'SOLID',color:C('#FFFFFF')}];
    if(i>0){row.strokes=[{type:'SOLID',color:C('#F1F1F3')}];row.strokeTopWeight=1;row.strokeBottomWeight=0;row.strokeLeftWeight=0;row.strokeRightWeight=0;}
    [[r.prop,'#09090B'],[r.values,'#52525B'],[r.default,'#52525B']].forEach(([txt,col])=>{const c=af('c','VERTICAL',0);c.layoutGrow=1;c.appendChild(T(String(txt),{size:13,color:col}));row.appendChild(c);});
    box.appendChild(row); fill(row); });
  return box;
}

function infoCallout(text){ const b=af('Info','HORIZONTAL',10,[14,18,14,18]); b.cornerRadius=10;
  b.fills=[{type:'SOLID',color:C('#EFF6FF')}]; b.counterAxisAlignItems='CENTER';
  b.appendChild(T('ℹ',{size:15,lh:22.5,color:'#1E40AF'})); const t=T(text,{size:15,lh:22.5,color:'#1E40AF'}); b.appendChild(t); fill(t); return b; }

// House Do/Don't: two TINTED cards (green / red), UPPERCASE tracked labels, hairline row
// dividers (NOT per-row boxes), body text #3f3f46, keywords bolded via **markers**.
// items are strings that may contain **bold** spans.
function doDont(dos,donts){ const g=af('Container','HORIZONTAL',16); g.counterAxisAlignItems='MIN';
  const col=(label,color,fillHex,strokeHex,items)=>{ const c=af('Container','VERTICAL',14,[23,23,1,23]); c.layoutGrow=1;
    c.cornerRadius=12; c.fills=[{type:'SOLID',color:C(fillHex)}]; c.strokes=[{type:'SOLID',color:C(strokeHex)}]; c.strokeWeight=1;
    const h4=af('Heading 4','VERTICAL',0); h4.appendChild(T(label,{style:'Semi Bold',size:12,color,ls:0.96,upper:true})); c.appendChild(h4); fill(h4);
    const list=af('List','VERTICAL',0);
    items.forEach((it,i)=>{ const li=af('List Item','VERTICAL',0,[13,0,13,0]);
      if(i<items.length-1){ li.strokes=[{type:'SOLID',color:{r:0,g:0,b:0},opacity:0.05}]; li.strokeBottomWeight=1; li.strokeTopWeight=0; li.strokeLeftWeight=0; li.strokeRightWeight=0; }
      const tx=richText(it,{size:13,lh:19.5,color:'#3f3f46'}); li.appendChild(tx); fill(tx); list.appendChild(li); fill(li); });
    c.appendChild(list); fill(list); return c; };
  g.appendChild(col('✓ Do','#16a34a','#f0fdf4','#bbf7d0',dos));
  g.appendChild(col("✗ Don't",'#dc2626','#fff1f2','#fecdd3',donts)); return g; }

// ---- live variant instance ----
async function variantByProps(set,props){
  const want=Object.entries(props);
  const m=set.children.find(v=>v.type==='COMPONENT' && want.every(([k,val])=>new RegExp('(^|,\\s*)'+k+'='+val+'(\\s*,|$)').test(v.name)));
  const comp=m||set.defaultVariant||set.children.find(c=>c.type==='COMPONENT');
  return comp.createInstance();
}

// ---- dark-mode preview: set the Light/Dark mode on a frame ----
// The light/dark modes live in the collection that OWNS the theme/* variables — NOT
// necessarily a collection named "theme". In Fasla that collection is "☾  Mode"
// (id VariableCollectionId:82:3, modes ⚪️ Light = 82:0, 🌑 Dark = 3686:0). Resolve it by
// finding the collection that owns a theme/* variable, so this survives renames:
async function themeCollection(){ const vars=await figma.variables.getLocalVariablesAsync();
  const bg=vars.find(v=>/(^|\/)background$/i.test(v.name)&&/theme/i.test(v.name))||vars.find(v=>/^theme\//.test(v.name));
  return bg ? figma.variables.getVariableCollectionByIdAsync(bg.variableCollectionId) : null; }
async function setMode(col,frame,modeName){ if(!col) return;
  const mode=col.modes.find(m=>new RegExp(modeName,'i').test(m.name)) || col.modes.find(m=>/dark/i.test(m.name));
  if(mode) frame.setExplicitVariableModeForCollection(col, mode.modeId); }   // pass the collection OBJECT, not its id

// a framed preview cell holding a live instance; dark=true renders dark mode
// NOTE: pass the collection in — setMode's signature is (collection, frame, modeName).
async function previewCell(inst,dark,col){ const f=af('preview','VERTICAL',8,[20,20,20,20]); f.cornerRadius=12;
  f.strokes=[{type:'SOLID',color:C('#E4E4E7')}]; f.strokeWeight=1; f.primaryAxisAlignItems='CENTER'; f.counterAxisAlignItems='CENTER';
  f.fills=[{type:'SOLID',color:C(dark?'#09090B':'#FFFFFF')}]; if(dark) await setMode(col,f,'dark'); f.appendChild(inst); return f; }
// Shipped docs caption each cell: append a T(label,{size:11,color: dark?'#a1a1aa':'#71717a'}) after the instance.
```

## Assembling the outer frame

```js
const page = figma.currentPage;             // navigate to the component's page first
const W = 895;                              // doc width; content column = W - 112
const doc = af('<Component> — Fasla Component Documentation','VERTICAL',72,[222,56,140,56]);
doc.fills=[{type:'SOLID',color:C('#FCFCFC')}];
page.appendChild(doc);                      // append BEFORE resizing
doc.counterAxisSizingMode='FIXED'; doc.resize(W, doc.height); doc.primaryAxisSizingMode='AUTO';
doc.x = /*right of existing content*/ 0; doc.y = 0;

// TOP masthead = LINKED Design system header instance, positioned ABSOLUTELY at (20,20).
// It is NOT an in-flow child and there is NO content-wrapper frame — see design-spec.md.
const dshVariant = await figma.getNodeByIdAsync('38817:8062');   // Design system header / Type=Component Header
const masthead = dshVariant.createInstance();
doc.appendChild(masthead);
masthead.layoutPositioning='ABSOLUTE';
masthead.resize(W-40, masthead.height);     // renders 156 tall; the 222 top padding clears it
masthead.x=20; masthead.y=20;
const mTx = masthead.findOne(n=>n.type==='TEXT' && n.name==='Heading');
if(mTx){ await figma.loadFontAsync(mTx.fontName); mTx.characters='Documentation'; }

// Component Header title card — the first IN-FLOW child, appended straight to `doc`
const chWrap = af('📃 Component Header','VERTICAL',16); chWrap.primaryAxisAlignItems='CENTER';
const chTitle = af('Title','HORIZONTAL',8,[16,24,16,24]); chTitle.cornerRadius=14; chTitle.fills=[{type:'SOLID',color:C('#ffffff')}]; chTitle.strokes=[{type:'SOLID',color:C('#e5e5e5')}]; chTitle.strokeWeight=1;
const chInner = af('Frame 1','VERTICAL',15);
const pill = af('Text','HORIZONTAL',0,[4,11,4,11]); pill.cornerRadius=6; pill.fills=[{type:'SOLID',color:C('#f4f4f5')}]; pill.primaryAxisAlignItems='CENTER'; pill.counterAxisAlignItems='CENTER';
pill.appendChild(T('Component',{size:11,lh:17,color:'#71717a',style:'Medium'}));
chInner.appendChild(pill);
chInner.appendChild(T('<Name>',{style:'Bold',size:40,lh:60,color:'#09090b'}));
const chIntro = T('<intro… ending in the variant math>',{size:16,lh:27.2,color:'#52525b'});
chInner.appendChild(chIntro);
chTitle.appendChild(chInner); chWrap.appendChild(chTitle); doc.appendChild(chWrap);
// append THEN fill, outermost first
chWrap.layoutSizingHorizontal='FILL'; chTitle.layoutSizingHorizontal='FILL';
chInner.layoutSizingHorizontal='FILL'; chIntro.layoutSizingHorizontal='FILL';

// … then append every Section straight to `doc` (there is no `body` wrapper), each set FILL
// after append. There is NO bottom footer — the masthead is the only Design system header.
return {id: doc.id};
```
Then in later calls, `const doc = await figma.getNodeByIdAsync(id)` and append each section to `doc`, calling `fill(section)` after append so it spans the content column.

## Per-section assembly

```js
// 1. Component Header (eyebrow + title + intro)
const hdr = af('Component Header','VERTICAL',16);
hdr.appendChild(T('Component',{style:'Semi Bold',size:11,lh:16.5,color:'#71717A'}));   // category eyebrow
hdr.appendChild(T('<Name>',{style:'Bold',size:40,lh:60}));
hdr.appendChild(T('<intro… ending in the variant math>',{size:16,lh:27.2,color:'#52525B',w:735}));
doc.appendChild(hdr); fill(hdr);

// 2. Component Properties
const s2 = af('Section','VERTICAL',28);
s2.appendChild(sectionHeader('Component Properties','All Figma variant properties exposed by the <Name> component. Each property combines independently.'));
s2.appendChild(propTable([
  {prop:'Type', values:'Solid · Soft · Outline', default:'"Solid"'},
  // …one row per property from set.componentPropertyDefinitions
]));
s2.appendChild(infoCallout('The component exposes <N> unique variants (<math>). Use the Variant panel to switch between them.'));
[...s2.children].forEach(fill); doc.appendChild(s2); fill(s2);

// 6. Variants — one block per Type value, styles × Light/Dark (+ LTR/RTL)
const set = /* the target COMPONENT_SET */;
const styleIdEn = await styleId('Tailwind En/SM/Medium');
const s6 = af('Section','VERTICAL',28);
s6.appendChild(sectionHeader('Variants','Each type is shown across all styles in Light and Dark mode, with LTR and RTL direction.'));
for (const type of ['Solid','Soft','Outline']) {           // the Type options
  const block = af('block','VERTICAL',16);
  block.appendChild(T(type,{style:'Bold',size:18}));
  block.appendChild(T('Type: '+type,{size:13,color:'#71717A'}));
  const grid = af('grid','HORIZONTAL',16); grid.layoutWrap='WRAP';
  for (const style of ['Primary','Secondary','Destructive']) {
    for (const dark of [false,true]) {
      const inst = await variantByProps(set,{Type:type,Style:style,State:'Enabled'});
      grid.appendChild(await previewCell(inst,dark));
    }
  }
  block.appendChild(grid); fill(grid); s6.appendChild(block); fill(block);
}
doc.appendChild(s6); fill(s6);

// 9. Do's & Don'ts
const s9 = af('Section','VERTICAL',28);
s9.appendChild(sectionHeader("Usage Guidelines",'Best practices for applying <Name> variants to keep hierarchy and consistency.'));
s9.appendChild(doDont(
  ['Use **Solid Primary** as the single highest-priority action per view', /*…*/],
  ["Don't place two **Solid Primary** buttons of equal weight side by side", /*…*/]));
// Bold the key term in each line with **markers** — variant names, props, or the core concept.
[...s9.children].forEach(fill); doc.appendChild(s9); fill(s9);
```

For **Anatomy / Layout & Spacing / Sizes / States / Border Radius**, follow the same pattern: `sectionHeader(...)` then content built from `af`/`T` plus live instances via `variantByProps`. For measurement callouts and numbered pins, small absolute-positioned text/line nodes over an instance work — or clone the equivalent sub-block out of a reference doc (`node.clone()`) and retext it, which is often faster and guarantees fidelity.

## Anatomy & Layout annotations (validated helpers)

These two sections carry the house's most distinctive detail: colored numbered pins with leader lines (Anatomy) and colored dimension lines + a grouped spec list (Layout & Spacing). Build both inside a `Stage` frame with `layoutMode='NONE'` so you can absolutely-position overlays with `.x`/`.y`, and drive every position from the instance's REAL geometry (read `region.y`, `region.height` off the live instance) — never hardcode pixel guesses.

```js
// thin solid line / cap, or dashed line when `dash` given: rect(x,y,w,h,'#hex') | rect(x,y,w,h,null,{hex,w,pat})
function rect(x,y,w,h,hex,dash){ const r=figma.createRectangle(); r.resize(Math.max(w,0.01),Math.max(h,0.01)); r.x=x; r.y=y;
  if(dash){ r.fills=[]; r.strokes=[{type:'SOLID',color:C(dash.hex)}]; r.strokeWeight=dash.w||1; r.dashPattern=dash.pat||[3,2]; }
  else if(hex){ r.fills=[{type:'SOLID',color:C(hex)}]; } else r.fills=[]; return r; }
function lbl(txt,x,y,hex,size){ const t=T(txt,{size:size||9,style:'Medium',color:hex}); t.x=x; t.y=y; return t; }
// circular numbered pin (white ring when on-component; drop the ring for legend badges)
function pin(n,size,hex,ring){ const f=af('pin','HORIZONTAL',0); f.primaryAxisSizingMode='FIXED'; f.counterAxisSizingMode='FIXED';
  f.resize(size,size); f.cornerRadius=size/2; f.fills=[{type:'SOLID',color:C(hex)}]; f.primaryAxisAlignItems='CENTER'; f.counterAxisAlignItems='CENTER';
  if(ring){ f.strokes=[{type:'SOLID',color:C('#ffffff')}]; f.strokeWeight=2; }
  f.appendChild(T(String(n),{style:'Semi Bold',size:size>18?11:9,color:'#ffffff'})); return f; }

const PINS=['#e11d48','#7c3aed','#0ea5e9','#f59e0b','#f97316'];   // rose violet sky amber orange
const RED='#ef4444', BLUE='#3b82f6', GREEN='#22c55e', VIO='#7c3aed', FUCHSIA='#d946ef';

// grouped spec list row/group (right column of Layout & Spacing)
function specGroup(title,rows,MONO){ const g=af('Container','VERTICAL',0);
  const h=af('Container','VERTICAL',0,[0,0,4,0]); h.appendChild(T(title,{style:'Semi Bold',size:11,color:'#a1a1aa',ls:0.77,upper:true})); g.appendChild(h); fill(h);
  rows.forEach((r,i)=>{ const row=af('Container','HORIZONTAL',12,[6,0,6,0]); row.primaryAxisAlignItems='SPACE_BETWEEN'; row.counterAxisAlignItems='CENTER';
    if(i<rows.length-1){ row.strokes=[{type:'SOLID',color:C('#f4f4f5')}]; row.strokeBottomWeight=1; row.strokeTopWeight=0; row.strokeLeftWeight=0; row.strokeRightWeight=0; }
    row.appendChild(T(r[0],{size:13,color:'#52525b'})); row.appendChild(T(r[1],{family:MONO,style:'Medium',size:12,color:'#18181b'})); g.appendChild(row); fill(row); }); return g; }
```

**Anatomy assembly:** create the `Stage`, place `inst` at `(cardX, cardY)`, add a dashed container box (`rect(cardX-12,cardY-12,W+24,H+24,null,{hex:'#f97316',pat:[3,2]})`, `cornerRadius=18`) BEHIND the instance. For each sub-region `i` (1-based): a horizontal dashed leader `rect(pinX+size, cy-0.6, cardX-(pinX+size), 1.2, null,{hex:PINS[i-1],pat:[3,2]})` and a `pin(i,22,PINS[i-1],true)` at `(pinX, cy-11)` where `cy = cardY + region.y + region.height/2`. Give the Container the next number with a short leader to the box. RIGHT legend: `pin(i,22,PINS[i-1])` (no ring) + title/desc, VERTICAL gap 20.

**Layout assembly:** fuchsia box first (`rect(...,{hex:FUCHSIA,pat:[5,4]})` with `fills=[{color:'#fdf4ff'}]`, radius 20), then instance. Vertical padding (BLUE) as a `1.4`-wide bar + two end-cap bars + `lbl('24',…,BLUE)` at top and bottom; horizontal padding (RED) as `1.4`-tall bars at a region's left/right; region gaps (GREEN, dashed) spanning each inter-region gap; height bracket (VIO) as a full-height bar + caps + `<h>`/`px` labels to the right. Add the swatch legend below (`rect 9×9` + 11px `#71717a` label for each of Horizontal padding/Vertical padding/Item gap). RIGHT: a fixed-width `specGroup` column — LAYOUT / SPACING / SHAPE.

## Cloning a sub-block from a reference (fidelity shortcut)

When a section's construction is fiddly (annotated spacing diagram, numbered anatomy), clone it from the Button doc and swap contents:
```js
const ref = await figma.getNodeByIdAsync('38807:10828');           // Button doc
const anatomy = ref.children[2].children[2];                        // the Anatomy Section
const copy = anatomy.clone(); doc.appendChild(copy); fill(copy);
// then walk copy, retext TEXT nodes, and replace instances via swapComponent / variantByProps
```
Swap an existing instance's master: `inst.swapComponent(targetComponent)` keeps position/overrides.

## Verify
Screenshot with `figma_take_screenshot`/`figma_capture_screenshot`, compare to a reference doc, and audit that every preview `node.type==='INSTANCE'` and its `getMainComponentAsync()` belongs to the target set. Fix spacing/color drift and re-shoot (≤3 passes).
