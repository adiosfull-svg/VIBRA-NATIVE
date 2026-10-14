// Port di src/components/download/UploadMaterialDialog.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/misc';
import { base44 } from '@/lib/base44';
import { Upload, Plus, Loader2 } from '@/ui/icons.generated';
import { useOverlay } from '@/web/lib/overlayStackContext';

import { doc as webDocument } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

const STATIC_SECTIONS = [
  { id: 'vibra-loghi',  label: 'Loghi Vibra',       icon: '🟣', color: '#8b5cf6' },
  { id: 'loghi-locali', label: 'Loghi Locali',       icon: '🎵', color: '#f97316' },
  { id: 'sfondi',       label: 'Sfondi',             icon: '🖼️', color: '#0ea5e9' },
  { id: 'materiali',    label: 'Materiali Grafici',  icon: '🎨', color: '#22c55e' },
];

const BG_OPTIONS = [
  { value: 'bg-gray-900', label: 'Scuro' },
  { value: 'bg-white',    label: 'Bianco' },
  { value: 'bg-purple-900', label: 'Viola' },
  { value: 'bg-black',    label: 'Nero' },
];

export default function UploadMaterialDialog({ open, onOpenChange, customSections, onSaved }) {
  useOverlay(open, () => onOpenChange?.(false));
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [sectionMode, setSectionMode] = useState('existing'); // 'existing' | 'new'
  const [selectedSection, setSelectedSection] = useState('vibra-loghi');
  const [newSectionLabel, setNewSectionLabel] = useState('');
  const [newSectionIcon, setNewSectionIcon] = useState('📁');
  const [newSectionColor, setNewSectionColor] = useState('#6366f1');
  const [bgClass, setBgClass] = useState('bg-gray-900');
  const [uploading, setUploading] = useState(false);

  const allSections = [...STATIC_SECTIONS, ...customSections];

  const reset = () => {
    setFile(null);
    setName('');
    setSectionMode('existing');
    setSelectedSection('vibra-loghi');
    setNewSectionLabel('');
    setNewSectionIcon('📁');
    setNewSectionColor('#6366f1');
    setBgClass('bg-gray-900');
  };

  const handleSubmit = async () => {
    if (!file || !name.trim()) return;
    setUploading(true);

    // 1. Upload file
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // 2. Determina tipo
    const ext = file.name.split('.').pop().toLowerCase();
    const file_type = ['pdf', 'doc', 'docx', 'zip', 'psd', 'ai'].includes(ext) ? 'file' : 'img';

    // 3. Determina sezione
    let section_id, section_label, section_icon, section_color;
    if (sectionMode === 'new') {
      section_id = 'custom_' + Date.now();
      section_label = newSectionLabel.trim();
      section_icon = newSectionIcon;
      section_color = newSectionColor;
    } else {
      const sec = allSections.find(s => s.id === selectedSection);
      section_id = sec.id;
      section_label = sec.label;
      section_icon = sec.icon;
      section_color = sec.color;
    }

    await base44.entities.DownloadItem.create({
      name: name.trim(),
      file_url,
      file_type,
      section_id,
      section_label,
      section_icon,
      section_color,
      bg_class: bgClass,
    });

    setUploading(false);
    reset();
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            Aggiungi Materiale
          </DialogTitle>
        </DialogHeader>

        <Div className="space-y-4">
          {/* File picker */}
          <Div>
            <Label className="text-xs">File *</Label>
            <Btn
              className="mt-1 border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => webDocument.getElementById('upload-file-input').click()}
            >
              {file ? (
                <P className="text-sm font-medium text-primary truncate">{file.name}</P>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                  <P className="text-xs text-muted-foreground">Clicca per scegliere un file (immagine, PDF, ecc.)</P>
                </>
              )}
              <HtmlInput
                type="file"
                className="hidden"
                accept="image/*,.pdf,.zip,.psd,.ai,.doc,.docx"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setFile(f);
                    if (!name) setName(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '));
                  }
                }} />
            </Btn>
          </Div>

          {/* Nome */}
          <Div>
            <Label className="text-xs">Nome visualizzato *</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Es. Logo Vibra 2026 (PNG)"
              className="mt-1 h-8 text-sm"
            />
          </Div>

          {/* Sfondo preview */}
          <Div>
            <Label className="text-xs">Sfondo anteprima</Label>
            <Div className="flex gap-2 mt-1">
              {BG_OPTIONS.map(opt => (
                <Btn
                  button
                  key={opt.value}
                  onClick={() => setBgClass(opt.value)}
                  className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${bgClass === opt.value ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
                >
                  {opt.label}
                </Btn>
              ))}
            </Div>
          </Div>

          {/* Sezione */}
          <Div>
            <Label className="text-xs">Sezione</Label>
            <Div className="flex gap-2 mt-1">
              <Btn
                button
                onClick={() => setSectionMode('existing')}
                className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${sectionMode === 'existing' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
              >
                Sezione esistente
              </Btn>
              <Btn
                button
                onClick={() => setSectionMode('new')}
                className={`flex-1 py-1.5 rounded-lg text-xs border transition-all flex items-center justify-center gap-1 ${sectionMode === 'new' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}
              >
                <Plus className="w-3 h-3" /> Nuova sezione
              </Btn>
            </Div>
          </Div>

          {sectionMode === 'existing' ? (
            <Div className="grid grid-cols-2 gap-2">
              {allSections.map(s => (
                <Btn
                  button
                  key={s.id}
                  onClick={() => setSelectedSection(s.id)}
                  style={selectedSection === s.id ? { borderColor: s.color, color: s.color, background: s.color + '18' } : {}}
                  className={`px-3 py-2 rounded-lg text-xs border transition-all text-left ${selectedSection === s.id ? '' : 'border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {s.icon} {s.label}
                </Btn>
              ))}
            </Div>
          ) : (
            <Div className="space-y-3 rounded-xl border border-border bg-secondary/20 p-3">
              <P className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Nuova sezione</P>
              <Div>
                <Label className="text-xs">Nome sezione *</Label>
                <Input value={newSectionLabel} onChange={e => setNewSectionLabel(e.target.value)} placeholder="Es. Template Storie" className="mt-1 h-8 text-sm" />
              </Div>
              <Div className="flex gap-3">
                <Div className="flex-1">
                  <Label className="text-xs">Emoji icona</Label>
                  <Input value={newSectionIcon} onChange={e => setNewSectionIcon(e.target.value)} placeholder="📁" className="mt-1 h-8 text-sm" maxLength={4} />
                </Div>
                <Div className="flex-1">
                  <Label className="text-xs">Colore</Label>
                  <Div className="flex items-center gap-2 mt-1">
                    <HtmlInput type="color" value={newSectionColor} onChange={e => setNewSectionColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent" />
                    <Span className="text-xs text-muted-foreground">{newSectionColor}</Span>
                  </Div>
                </Div>
              </Div>
            </Div>
          )}

          <Div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => { reset(); onOpenChange(false); }}>Annulla</Button>
            <Button
              size="sm"
              disabled={!file || !name.trim() || (sectionMode === 'new' && !newSectionLabel.trim()) || uploading}
              onClick={handleSubmit}
            >
              {uploading ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Caricamento...</> : <><Upload className="w-3.5 h-3.5 mr-1.5" />Carica</>}
            </Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}