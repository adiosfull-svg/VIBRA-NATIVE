// Port di src/components/ilmiovibra/MieNote.jsx (convertito da scripts/port/codemod.mjs).
// Drag & drop delle note: @hello-pangea/dnd → web/shims/dnd.tsx (pressione lunga e trascinamento).
import React, { useState } from 'react';
import MaterialeLocaliSection from '@/web/components/ilmiovibra/MaterialeLocaliSection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { Plus, Trash2, Pin, Search, LayoutGrid, Square, List, X, NotebookPen } from '@/ui/icons.generated';
import { DragDropContext, Droppable, Draggable } from '@/web/shims/dnd';
import SectionHeader from '@/web/components/shared/SectionHeader';


import { storage as webStorage } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlInput, HtmlOption, HtmlSelect, HtmlTextarea } from '@/ui/elements';
import { HtmlText } from '@/ui/htmlText';


const NOTE_COLORS = [
  { hex: '#1e1e2e', label: 'Scuro' },
  { hex: '#1c2333', label: 'Blu notte' },
  { hex: '#1f2d1f', label: 'Verde scuro' },
  { hex: '#2d1f1f', label: 'Rosso' },
  { hex: '#2d2a1f', label: 'Giallo' },
  { hex: '#2a1f2d', label: 'Viola' },
  { hex: '#0f3460', label: 'Azzurro' },
  { hex: '#2d4a1f', label: 'Verde lime' },
  { hex: '#3d1f2a', label: 'Rosa' },
  { hex: '#2a2a1f', label: 'Marrone' },
];





function NoteCard({ note, onEdit, onDelete, onPin, layout, isDragging, provided, snapshot }) {
  const renderedContent = renderMarkdown(note.content);

  if (layout === 'list') {
    return (
      <Btn
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        className={`rounded-lg border border-border/60 p-3 flex items-start justify-between cursor-pointer transition-all ${snapshot?.isDragging ? 'opacity-50 border-primary/60 bg-primary/10' : 'hover:border-primary/40'}`}
        style={{ background: note.color || '#1e1e2e', ...provided?.draggableProps?.style }}
        onClick={() => onEdit(note)}
      >
        <Div className="min-w-0 flex-1">
          {note.title && <P className="font-semibold text-sm">{note.title}</P>}
          <P className="text-xs text-muted-foreground line-clamp-1">{note.content?.substring(0, 50)}</P>
        </Div>
        <Div className="flex gap-1 ml-2 shrink-0">
          <Btn
            button
            onClick={e => { e.stopPropagation(); onPin(note); }}
            className="p-1 hover:bg-white/10 rounded">
            <Pin className={`w-3 h-3 ${note.pinned ? 'text-amber-400' : 'text-muted-foreground'}`} />
          </Btn>
          <Btn
            button
            onClick={e => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1 hover:bg-white/10 rounded text-destructive">
            <Trash2 className="w-3 h-3" />
          </Btn>
        </Div>
      </Btn>
    );
  }

  const isSquare = layout === 'square';
  return (
    <Btn
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`rounded-2xl border border-border/60 p-4 cursor-pointer hover:border-primary/40 transition-all group relative ${snapshot?.isDragging ? 'opacity-50 border-primary/60 bg-primary/10' : ''} ${isSquare ? 'aspect-square flex flex-col' : ''}`}
      style={{ background: note.color || '#1e1e2e', ...provided?.draggableProps?.style }}
      onClick={() => onEdit(note)}
    >
      {note.pinned && <Pin className="absolute top-2 right-2 w-3.5 h-3.5 text-amber-400" fill="currentColor" />}
      {note.title && <P className="font-semibold text-sm mb-2 pr-6 leading-tight line-clamp-2">{note.title}</P>}
      {note.content && (
        <Div className={`text-xs text-muted-foreground ${isSquare ? 'flex-1 overflow-hidden' : 'line-clamp-3'} prose prose-sm prose-invert max-w-none break-words whitespace-pre-wrap`}>
          {renderedContent}
        </Div>
      )}
      {!note.title && !note.content && <P className="text-xs text-muted-foreground/40 italic">Nota vuota</P>}
      <Div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Btn
          button
          onClick={e => { e.stopPropagation(); onPin(note); }}
          className="p-1.5 rounded-lg hover:bg-white/10">
          <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'text-amber-400' : 'text-muted-foreground'}`} />
        </Btn>
        <Btn
          button
          onClick={e => { e.stopPropagation(); onDelete(note.id); }}
          className="p-1.5 rounded-lg hover:bg-white/10 text-destructive">
          <Trash2 className="w-3.5 h-3.5" />
        </Btn>
      </Div>
    </Btn>
  );
}

function renderMarkdown(content) {
  if (!content) return null;
  // Converti markdown in HTML senza mostrare i delimitatori
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/~~(.*?)~~/g, '<del>$1</del>')
    .replace(/# (.*?)(?=\n|$)/gm, '<h3 style="font-weight:bold;margin-top:0.5rem">$1</h3>')
    .replace(/^- (.*?)$/gm, '• $1');
  return <HtmlText html={html} />;
}

function stripMarkdown(content) {
  // Rimuove i delimitatori markdown per la visualizzazione in textarea
  if (!content) return '';
  return content
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/# (.*?)(?=\n|$)/gm, '$1')
    .replace(/^- /gm, '');
}

function RichTextEditor({ value, onChange }) {
  const [selection, setSelection] = React.useState({ start: 0, end: 0 });
  const textareaRef = React.useRef(null);

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setSelection({
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      });
    }
  };

  const applyFormat = (before, after = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || 'testo';
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);
    
    setTimeout(() => {
      textarea.focus();
      const newStart = start + before.length;
      const newEnd = newStart + selected.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  return (
    <Div className="space-y-2 w-full">
      <Div className="flex gap-1 flex-wrap bg-secondary/30 p-2 rounded-lg items-center text-[11px]">
        <Span className="text-muted-foreground px-2 italic">Formatta:</Span>
        <Btn
          button
          onClick={() => applyFormat('**', '**')}
          className="px-2 py-1 rounded text-xs font-bold hover:bg-secondary"
          accessibilityLabel="Grassetto">B</Btn>
        <Btn
          button
          onClick={() => applyFormat('*', '*')}
          className="px-2 py-1 rounded text-xs italic hover:bg-secondary"
          accessibilityLabel="Corsivo">I</Btn>
        <Btn
          button
          onClick={() => applyFormat('~~', '~~')}
          className="px-2 py-1 rounded text-xs line-through hover:bg-secondary"
          accessibilityLabel="Barrato">S</Btn>
      </Div>
      <HtmlTextarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onSelect={handleSelectionChange}
        className="w-full bg-transparent text-sm placeholder-muted-foreground/40 focus:outline-none border border-border rounded-lg p-2 resize-none"
        rows={8}
        placeholder="Scrivi una nota..."
      />
    </Div>
  );
}

function NoteEditor({ note, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || NOTE_COLORS[0].hex);
  const [pinned, setPinned] = useState(note?.pinned || false);

  const handleSave = () => {
    onSave({ title, content, color, pinned });
    onClose();
  };

  return (
    <Btn className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center pt-8 p-4 overflow-y-auto" onClick={e => { if (e.target === e.currentTarget) { onClose(); } }}>
      <Btn
        className="w-full max-w-sm rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] my-auto"
        style={{ background: color }}
        onClick={e => e.stopPropagation()}
      >
        {/* Corpo nota - scrollabile */}
        <Div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
          <HtmlInput
            type="text"
            placeholder="Titolo"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent text-xl font-semibold placeholder-muted-foreground/40 focus:outline-none border-none"
            autoFocus
          />
          <RichTextEditor value={content} onChange={setContent} />
        </Div>

        {/* Opzioni in basso */}
        <Div className="border-t border-white/10 p-4 space-y-3">
          {/* Colori */}
          <Div className="space-y-1">
            <P className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Colore</P>
            <Div className="flex gap-2 flex-wrap">
              {NOTE_COLORS.map(c => (
                <Btn
                  button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${color === c.hex ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ background: c.hex === '#1e1e2e' ? '#333' : c.hex }}
                  accessibilityLabel={c.label} />
              ))}
            </Div>
          </Div>

          {/* Pulsanti azione */}
          <Div className="flex items-center justify-between pt-2 border-t border-white/10">
           <Div className="flex gap-1">
             <Btn
               button
               onClick={() => setPinned(!pinned)}
               className={`p-1.5 rounded-lg hover:bg-white/10 ${pinned ? 'text-amber-400' : 'text-muted-foreground'}`}
               accessibilityLabel={pinned ? 'Rimuovi da evidenza' : 'Aggiungi a evidenza'}>
               <Pin className="w-4 h-4" />
             </Btn>
             {note?.id && (
               <Btn
                 button
                 onClick={() => { onDelete(note.id); onClose(); }}
                 className="p-1.5 rounded-lg hover:bg-white/10 text-destructive"
                 accessibilityLabel="Elimina nota">
                 <Trash2 className="w-4 h-4" />
               </Btn>
             )}
           </Div>
           <Div className="flex gap-2">
             <Btn
               button
               onClick={onClose}
               className="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/5 text-xs font-medium transition-all">
               Annulla
             </Btn>
             <Btn
               button
               onClick={handleSave}
               className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold transition-all">
               Salva
             </Btn>
           </Div>
          </Div>
        </Div>
      </Btn>
    </Btn>
  );
}

export default function MieNote({ user, promoter }) {
  const [editingNote, setEditingNote] = useState(null);
  const [layout, setLayout] = useState(() => webStorage.getItem('mieNoteLayout') || 'rect');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [sortBy, setSortBy] = useState(() => webStorage.getItem('mieNoteSortBy') || 'data');

  const qc = useQueryClient();

  const { data: notes = [] } = useQuery({
    queryKey: ['promoter-notes', promoter?.id],
    queryFn: () => promoter?.id ? base44.entities.PromoterNote.filter({ promoter_id: promoter.id }) : Promise.resolve([]),
    enabled: !!promoter?.id,
  });

  const createMut = useMutation({
    mutationFn: d => base44.entities.PromoterNote.create(d),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ['promoter-notes', promoter?.id] });
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PromoterNote.update(id, data),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ['promoter-notes', promoter?.id] });
    },
  });

  const updateNoteOrderMut = useMutation({
    mutationFn: ({ id, order }) => base44.entities.PromoterNote.update(id, { display_order: order }),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ['promoter-notes', promoter?.id] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: id => base44.entities.PromoterNote.delete(id),
    onSuccess: async () => {
      await qc.refetchQueries({ queryKey: ['promoter-notes', promoter?.id] });
      setDeleteConfirmId(null);
    },
  });

  const handleDelete = (noteId) => {
    const noteToDelete = notes.find(n => n.id === noteId);
    if (noteToDelete) {
      setUndoStack(prev => [...prev, noteToDelete]);
      deleteMut.mutate(noteId);
    }
  };

  const handleUndo = async () => {
    if (undoStack.length === 0) return;
    const lastDeleted = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    
    const { id, ...noteData } = lastDeleted;
    await createMut.mutateAsync(noteData);
  };

  const handleSave = (noteData) => {
    if (!promoter?.id) return;
    if (editingNote?.id) {
      updateMut.mutate({ id: editingNote.id, data: noteData });
    } else {
      createMut.mutate({ ...noteData, promoter_id: promoter.id });
    }
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    webStorage.setItem('mieNoteLayout', newLayout);
  };

  const sortedNotes = (() => {
    const base = [...notes];
    
    if (sortBy === 'libero') {
      return base.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    } else if (sortBy === 'alfabetico') {
      return base.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'data') {
      return base.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    
    return base;
  })();

  const handleDragEnd = (result) => {
    if (sortBy !== 'libero') return;
    const { source, destination, type } = result;
    if (!destination || source.index === destination.index) return;

    let workList;
    if (type === 'pinned') {
      workList = [...pinned];
    } else {
      workList = [...filteredUnpinned];
    }

    const [draggedNote] = workList.splice(source.index, 1);
    workList.splice(destination.index, 0, draggedNote);

    // Salva ordine per tutta la lista (pinned + unpinned)
    const allNotes = [...pinned.filter(n => !workList.includes(n)), ...workList];
    allNotes.forEach((note, idx) => {
      updateNoteOrderMut.mutate({ id: note.id, order: idx });
    });
  };



  if (!promoter?.id) {
    return <Div className="rounded-xl bg-card border border-border p-8 text-center"><P className="text-sm text-muted-foreground">Nessun profilo promoter collegato.</P></Div>;
  }

  const pinned = sortedNotes.filter(n => n.pinned);
  const filteredUnpinned = sortedNotes.filter(n => !n.pinned && (n.title?.toLowerCase().includes(searchTerm.toLowerCase()) || n.content?.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <Div className="space-y-5">
      {/* Materiale Locali — in cima */}
      <MaterialeLocaliSection />

      {/* Header */}
      <Div className="flex items-center gap-2 flex-wrap">
        {undoStack.length > 0 && (
          <Btn
            button
            onClick={handleUndo}
            className="px-3 py-2 rounded-lg border border-amber-500/30 text-xs font-medium text-amber-400 hover:bg-amber-500/10 transition-all">
            ↶ Undo ({undoStack.length})
          </Btn>
        )}
        <Btn
          className="rounded-2xl border border-border/60 px-5 py-3.5 cursor-text flex items-center gap-3 flex-1 min-w-64 hover:border-primary/30 transition-all bg-secondary/10"
          onClick={() => setEditingNote({})}
        >
          <Plus className="w-4 h-4 text-muted-foreground/40 shrink-0" />
          <Span className="text-sm text-muted-foreground/50">Aggiungi nota...</Span>
        </Btn>

        {/* Search */}
        <Div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
          <HtmlInput
            type="text"
            placeholder="Cerca..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </Div>

        {/* Layout toggles */}
        <Div className="flex gap-1 bg-secondary/30 p-1 rounded-lg">
          {[
            { key: 'rect', icon: Square, label: 'Rettangoli' },
            { key: 'square', icon: LayoutGrid, label: 'Quadrati' },
            { key: 'list', icon: List, label: 'Lista' },
          ].map(({ key, icon: Icon, label }) => (
            <Btn
              button
              key={key}
              onClick={() => handleLayoutChange(key)}
              className={`p-2 rounded transition-all ${layout === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              accessibilityLabel={label}>
              <Icon className="w-4 h-4" />
            </Btn>
          ))}
        </Div>

        {/* Sort selector */}
        <HtmlSelect
          value={sortBy}
          onChange={e => { setSortBy(e.target.value); webStorage.setItem('mieNoteSortBy', e.target.value); }}
          className="px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <HtmlOption value="data">Data (recenti)</HtmlOption>
          <HtmlOption value="alfabetico">Alfabetico</HtmlOption>
          <HtmlOption value="libero">Libero (drag)</HtmlOption>
        </HtmlSelect>
      </Div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Note in evidenza */}
        {pinned.length > 0 && (
          <Div>
            <SectionHeader icon={Pin} title="In Evidenza" color="#fbbf24" className="mb-3" />
            <Droppable droppableId="pinned-notes" type="pinned">
              {(provided) => (
                <Div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={layout === 'list' ? 'space-y-2' : layout === 'square' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'}
                >
                  {pinned.map((note, idx) => (
                    <Draggable key={note.id} draggableId={`pinned-${note.id}`} index={idx} isDragDisabled={sortBy !== 'libero'}>
                      {(provided, snapshot) => (
                        <NoteCard note={note} onEdit={n => setEditingNote(n)} onDelete={id => setDeleteConfirmId(id)} onPin={() => updateMut.mutate({ id: note.id, data: { pinned: false } })} layout={layout} provided={provided} snapshot={snapshot} />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Div>
              )}
            </Droppable>
          </Div>
        )}

        {/* Note filtrate */}
        {filteredUnpinned.length > 0 && (
          <Div>
            {pinned.length > 0 && (
              <SectionHeader
                icon={NotebookPen}
                title={searchTerm ? `Altre Note (${filteredUnpinned.length})` : 'Altre Note'}
                color="#a78bfa"
                className="mb-3"
              />
            )}
            <Droppable droppableId="unpinned-notes" type="unpinned">
              {(provided) => (
                <Div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={layout === 'list' ? 'space-y-2' : layout === 'square' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'}
                >
                  {filteredUnpinned.map((note, idx) => (
                    <Draggable key={note.id} draggableId={`unpinned-${note.id}`} index={idx} isDragDisabled={sortBy !== 'libero'}>
                      {(provided, snapshot) => (
                        <NoteCard note={note} onEdit={n => setEditingNote(n)} onDelete={id => setDeleteConfirmId(id)} onPin={() => updateMut.mutate({ id: note.id, data: { pinned: true } })} layout={layout} provided={provided} snapshot={snapshot} />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Div>
              )}
            </Droppable>
          </Div>
        )}
      </DragDropContext>

      {notes.length === 0 && <Div className="text-center py-12"><P className="text-sm text-muted-foreground">Nessuna nota. Clicca sopra per crearne una!</P></Div>}
      {searchTerm && filteredUnpinned.length === 0 && pinned.length === 0 && <Div className="text-center py-8"><P className="text-sm text-muted-foreground">Nessuna nota corrispondente.</P></Div>}

      {editingNote !== null && <NoteEditor note={editingNote?.id ? editingNote : null} onClose={() => setEditingNote(null)} onSave={handleSave} onDelete={id => setDeleteConfirmId(id)} />}

      {/* Delete confirmation dialog */}
      {deleteConfirmId && (
        <Div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-lg space-y-4">
            <H className="font-semibold text-lg">Eliminare questa nota?</H>
            <P className="text-sm text-muted-foreground">Questa azione non può essere annullata, ma potrai usare il pulsante Undo.</P>
            <Div className="flex gap-2 justify-end">
              <Btn
                button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary/20">
                Annulla
              </Btn>
              <Btn
                button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90">
                Elimina
              </Btn>
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}