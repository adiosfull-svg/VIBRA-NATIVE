// Riordino a trascinamento al posto di @hello-pangea/dnd (solo DOM): stessa API
// (DragDropContext/Droppable/Draggable con provided/snapshot) per il codice portato.
// Sul telefono: pressione lunga (250ms) sull'elemento, poi lo si trascina (segue il dito); al rilascio
// la destinazione è l'elemento della stessa lista sotto il dito (o il più vicino) e onDragEnd riceve
// { draggableId, type, source: { droppableId, index }, destination: { droppableId, index } } come nell'originale.
// Il trascinamento si prende il tocco (onMoveShouldSetResponderCapture): la pagina non scorre.
// Un tocco breve resta un tap (apre la nota).
import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import type { View } from 'react-native';

type DropResult = {
  draggableId: string;
  type: string;
  source: { droppableId: string; index: number };
  destination: { droppableId: string; index: number } | null;
};
type Item = { index: number; node: View | null };
type DroppableReg = { id: string; type: string; items: Map<string, Item> };

const Ctx = createContext<{ onDragEnd: (r: DropResult) => void } | null>(null);
const DropCtx = createContext<DroppableReg | null>(null);

const LONG_PRESS = 250;
const SLOP = 8;

export function DragDropContext({ onDragEnd, children }: { onDragEnd: (r: DropResult) => void; onDragStart?: unknown; children?: ReactNode }) {
  const ref = useRef(onDragEnd);
  ref.current = onDragEnd;
  const value = useMemo(() => ({ onDragEnd: (r: DropResult) => ref.current(r) }), []);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function Droppable({ droppableId, type = 'DEFAULT', children }: {
  droppableId: string; type?: string; direction?: string; isDropDisabled?: boolean;
  children: (provided: { innerRef: (n: unknown) => void; droppableProps: object; placeholder: null }, snapshot: { isDraggingOver: boolean }) => ReactNode;
}) {
  const reg = useRef<DroppableReg>({ id: droppableId, type, items: new Map() }).current;
  reg.id = droppableId;
  reg.type = type;
  return <DropCtx.Provider value={reg}>{children({ innerRef: () => {}, droppableProps: {}, placeholder: null }, { isDraggingOver: false })}</DropCtx.Provider>;
}

type Rect = { x: number; y: number; width: number; height: number };
const measure = (node: View | null) => new Promise<Rect | null>((resolve) => {
  if (!node || typeof (node as { measureInWindow?: unknown }).measureInWindow !== 'function') { resolve(null); return; }
  node.measureInWindow((x, y, width, height) => resolve({ x, y, width, height }));
});

type TouchEv = { touches?: { clientX: number; clientY: number }[]; changedTouches?: { clientX: number; clientY: number }[] };

export function Draggable({ draggableId, index, isDragDisabled, children }: {
  draggableId: string; index: number; isDragDisabled?: boolean;
  children: (provided: { innerRef: (n: View | null) => void; draggableProps: object; dragHandleProps: object | null }, snapshot: { isDragging: boolean }) => ReactNode;
}) {
  const ctx = useContext(Ctx);
  const drop = useContext(DropCtx);
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);
  const s = useRef({ x: 0, y: 0, armed: false, timer: null as ReturnType<typeof setTimeout> | null, rects: null as null | Promise<[string, Item, Rect | null][]> });

  if (drop) drop.items.set(draggableId, { index, node: drop.items.get(draggableId)?.node ?? null });

  const cancel = () => {
    if (s.current.timer) clearTimeout(s.current.timer);
    s.current.timer = null;
    s.current.armed = false;
    setDrag(null);
  };

  const point = (e: TouchEv) => (e.touches?.[0] ?? e.changedTouches?.[0]);

  const handlers = isDragDisabled || !drop || !ctx ? null : {
    onTouchStart: (e: TouchEv) => {
      const p = point(e);
      if (!p) return;
      s.current.x = p.clientX;
      s.current.y = p.clientY;
      s.current.armed = false;
      if (s.current.timer) clearTimeout(s.current.timer);
      s.current.timer = setTimeout(() => {
        s.current.armed = true;
        // posizioni di tutti gli elementi della lista al momento della presa
        s.current.rects = Promise.all([...drop.items.entries()].map(async ([id, it]) => [id, it, await measure(it.node)] as [string, Item, Rect | null]));
        setDrag({ dx: 0, dy: 0 });
      }, LONG_PRESS);
    },
    onTouchMove: (e: TouchEv) => {
      const p = point(e);
      if (!p) return;
      const dx = p.clientX - s.current.x;
      const dy = p.clientY - s.current.y;
      if (!s.current.armed) {
        if (Math.abs(dx) > SLOP || Math.abs(dy) > SLOP) cancel(); // è uno scroll, non una presa
        return;
      }
      setDrag({ dx, dy });
    },
    onTouchEnd: (e: TouchEv) => {
      const p = point(e);
      const wasArmed = s.current.armed;
      const rects = s.current.rects;
      cancel();
      if (!wasArmed || !p || !rects) return;
      void rects.then((list) => {
        let best: { index: number; d: number } | null = null;
        for (const [, it, r] of list) {
          if (!r) continue;
          const inside = p.clientX >= r.x && p.clientX <= r.x + r.width && p.clientY >= r.y && p.clientY <= r.y + r.height;
          const d = inside ? -1 : Math.hypot(p.clientX - (r.x + r.width / 2), p.clientY - (r.y + r.height / 2));
          if (!best || d < best.d) best = { index: it.index, d };
        }
        ctx.onDragEnd({
          draggableId, type: drop.type,
          source: { droppableId: drop.id, index },
          destination: best ? { droppableId: drop.id, index: best.index } : null,
        });
      });
    },
    onTouchCancel: () => cancel(),
    // durante il trascinamento il tocco è nostro: la pagina non scorre e il tap non parte
    onMoveShouldSetResponderCapture: () => s.current.armed,
    onResponderTerminationRequest: () => !s.current.armed,
  };

  const provided = {
    innerRef: (n: View | null) => { if (drop) drop.items.set(draggableId, { index, node: n }); },
    draggableProps: {
      style: drag ? { transform: [{ translateX: drag.dx }, { translateY: drag.dy }], zIndex: 50 } : {},
    },
    dragHandleProps: handlers,
  };
  return <>{children(provided, { isDragging: !!drag })}</>;
}
