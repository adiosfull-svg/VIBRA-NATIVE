// Port di src/components/ilmiovibra/TeamBacheca.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef, useEffect } from 'react';
import { Crown, Star, TrendingUp, User, Sparkles, Pencil, Check, X, Euro, BarChart2, ImagePlus, Plus, Minus } from '@/ui/icons.generated';
import { useAppSetting, uploadFile } from '@/web/hooks/useAppSetting';
import { base44 } from '@/lib/base44';

import { storage as webStorage, url as webURL, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlInput, Img } from '@/ui/elements';

const RUOLO_CONFIG = {
  fondatore:        { label: 'Fondatore',       color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', ring: 'ring-yellow-400/40', icon: Crown },
  super4:           { label: 'Super 4',          color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', ring: 'ring-purple-400/40', icon: Star },
  capogruppo:       { label: 'Capogruppo',       color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/20',    ring: 'ring-blue-400/40',   icon: TrendingUp },
  pr:               { label: 'PR',               color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/20',  ring: 'ring-green-400/40',  icon: User },
  ragazza_immagine: { label: 'Ragazza Immagine', color: 'text-pink-400',   bg: 'bg-pink-400/10 border-pink-400/20',   ring: 'ring-pink-400/40',   icon: Sparkles },
};

function PhotoEditDialog({ open, onClose, currentPhotoUrl, currentZoom, onConfirm, uploading, promoterName, onDelete }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [zoom, setZoom] = useState(parseFloat(currentZoom || '1'));
  const fileInputRef = useRef();

  useEffect(() => {
    if (open) {
      setZoom(parseFloat(currentZoom || '1'));
      setPreviewUrl(currentPhotoUrl);
      setFile(null);
    }
  }, [open, currentPhotoUrl, currentZoom]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = webURL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleConfirm = () => onConfirm(file, zoom);

  if (!open) return null;

  return (
    <Btn className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <Btn className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
        <Div className="flex items-center justify-between mb-4">
          <H className="text-lg font-semibold">Modifica foto {promoterName}</H>
          <Btn
            button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </Btn>
        </Div>

        {/* Anteprima con zoom applicato */}
        <Div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden bg-secondary flex items-center justify-center border border-border relative">
          {previewUrl ? (
            <Img
              src={previewUrl}
              alt={promoterName}
              className="w-full h-full object-contain"
              style={{ transform: `scale(${zoom})` }}
            />
          ) : (
            <Span className="text-muted-foreground text-xs">Nessuna foto</Span>
          )}
        </Div>

        {/* Controlli zoom — stile Locali */}
        <Div className="flex items-center justify-center gap-2 mb-4">
          <Btn
            button
            onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <Minus className="w-4 h-4" />
          </Btn>
          <Span className="text-sm font-medium w-16 text-center">{Math.round(zoom * 100)}%</Span>
          <Btn
            button
            onClick={() => setZoom(z => Math.min(z + 0.1, 3))}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <Plus className="w-4 h-4" />
          </Btn>
          <Btn
            button
            onClick={() => setZoom(1)}
            className="px-3 py-2 text-xs rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
            Reset
          </Btn>
        </Div>

        <Div className="mb-4">
          <HtmlInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Btn
            button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium">
            {file ? 'Cambia immagine' : currentPhotoUrl ? 'Sostituisci foto' : 'Carica foto'}
          </Btn>
          {file && <P className="text-xs text-muted-foreground text-center mt-1">{file.name}</P>}
        </Div>

        <Div className="flex gap-2">
          {currentPhotoUrl && (
            <Btn
              button
              onClick={onDelete}
              disabled={uploading}
              className="px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium disabled:opacity-50">
              Rimuovi
            </Btn>
          )}
          <Btn
            button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border bg-transparent hover:bg-secondary transition-colors text-sm font-medium">
            Annulla
          </Btn>
          <Btn
            button
            onClick={handleConfirm}
            disabled={uploading}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50">
            {uploading ? 'Salvataggio...' : 'Conferma'}
          </Btn>
        </Div>
      </Btn>
    </Btn>
  );
}

function MemberAvatar({ promoter, isMe = false, isBonus = false, onEditPhoto }) {
  const ruolo = RUOLO_CONFIG[promoter.ruolo];
  const RuoloIcon = ruolo?.icon;
  
  // Usa localStorage se esiste (foto modificata), altrimenti usa quella dal database
  const photoUrl = webStorage.getItem('promoter_photo_' + promoter.id) || promoter.photo_url;
  const photoZoom = parseFloat(webStorage.getItem('promoter_photo_zoom_' + promoter.id) || promoter.photo_zoom || '1');
  const photoOffsetX = parseFloat(webStorage.getItem('promoter_photo_offset_x_' + promoter.id) || promoter.photo_offset_x || '0');
  const photoOffsetY = parseFloat(webStorage.getItem('promoter_photo_offset_y_' + promoter.id) || promoter.photo_offset_y || '0');

  return (
    <Div className="flex flex-col items-center gap-2">
      <Btn
        className={`relative w-16 h-16 rounded-full ${isMe ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
        onClick={() => isMe && onEditPhoto?.()}
        accessibilityLabel={isMe ? 'Clicca per modificare foto' : ''}
      >
        <Div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold overflow-hidden relative">
          {photoUrl ? (
            <Img
              src={photoUrl}
              alt={promoter.name}
              style={{
                position: 'absolute',
                width: `${photoZoom * 100}%`,
                height: `${photoZoom * 100}%`,
                objectFit: 'cover',
                left: `calc(50% + ${photoOffsetX}px)`,
                top: `calc(50% + ${photoOffsetY}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ) : (
            <Span className="text-lg">{promoter.name?.charAt(0)?.toUpperCase()}</Span>
          )}
        </Div>
        {RuoloIcon && (
          <Div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border ${ruolo.bg} ${ruolo.color} border-background`}>
            <RuoloIcon className="w-2.5 h-2.5" />
          </Div>
        )}
        {isMe && (
          <Div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
            <Span className="text-[7px] text-white font-bold">TU</Span>
          </Div>
        )}
      </Btn>
      <Div className="text-center">
        <P className={`text-xs font-semibold truncate max-w-[72px] ${isBonus ? 'text-pink-400' : isMe ? 'text-primary' : 'text-foreground'}`}>
          {promoter.name?.split(' ')[0]}
        </P>
        {ruolo && <P className={`text-[9px] ${ruolo.color} opacity-80`}>{ruolo.label}</P>}
      </Div>
    </Div>
  );
}

export default function TeamBacheca({ promoter, activeTeam, bonusMembers, totalRevenue, totalTables }) {
  // Nome team salvato su server via AppSettings
  const teamNameKey = `team_name_${promoter.id}`;
  const teamLogoKey = `team_logo_${promoter.id}`;

  const [teamName, setTeamNameSetting] = useAppSetting(teamNameKey);
  const [teamLogoUrl, setTeamLogoUrl] = useAppSetting(teamLogoKey);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [photoUploadingMe, setPhotoUploadingMe] = useState(false);
  const [showLogoDialog, setShowLogoDialog] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const displayName = teamName || 'Il Mio Team';

  const saveTeamName = async () => {
    const trimmed = draft.trim() || 'Il Mio Team';
    await setTeamNameSetting(trimmed);
    setEditing(false);
  };

  const cancelEdit = () => setEditing(false);

  const handleLogoConfirm = async (file, newZoom) => {
    setLogoUploading(true);
    try {
      if (file) {
        const url = await uploadFile(file);
        await setTeamLogoUrl(url);
      }
      // zoom non usato per il logo team (è object-contain), ma gestiamo il dialogo
      setShowLogoDialog(false);
    } catch (e) { console.error(e); }
    setLogoUploading(false);
  };

  const handleLogoDelete = async () => {
    setLogoUploading(true);
    try {
      await setTeamLogoUrl('');
      setShowLogoDialog(false);
    } catch (e) { console.error(e); }
    setLogoUploading(false);
  };

  const handlePhotoConfirm = async (file, newZoom) => {
    setPhotoUploadingMe(true);
    try {
      let photoUrl = promoter.photo_url || null;
      if (file) {
        photoUrl = await uploadFile(file);
      }
      // Salva nel DB il promoter con la nuova foto e zoom
      await base44.entities.Promoter.update(promoter.id, {
        photo_url: photoUrl,
        photo_zoom: newZoom,
      });
      setShowPhotoDialog(false);
      // Forza re-render via storage event (per MemberAvatar che legge da localStorage come fallback)
      if (photoUrl) webStorage.setItem('promoter_photo_' + promoter.id, photoUrl);
      webStorage.setItem('promoter_photo_zoom_' + promoter.id, String(newZoom));
      setTimeout(() => webWindow.dispatchEvent(new Event('storage')), 100);
    } catch (error) {
      console.error('Errore upload foto:', error);
    }
    setPhotoUploadingMe(false);
  };

  const handlePhotoDelete = async () => {
    setPhotoUploadingMe(true);
    try {
      await base44.entities.Promoter.update(promoter.id, {
        photo_url: null,
        photo_zoom: 1,
      });
      webStorage.removeItem('promoter_photo_' + promoter.id);
      webStorage.removeItem('promoter_photo_zoom_' + promoter.id);
      webStorage.removeItem('promoter_photo_offset_x_' + promoter.id);
      webStorage.removeItem('promoter_photo_offset_y_' + promoter.id);
      setShowPhotoDialog(false);
      setTimeout(() => webWindow.dispatchEvent(new Event('storage')), 100);
    } catch (error) {
      console.error('Errore eliminazione foto:', error);
    }
    setPhotoUploadingMe(false);
  };

  const totalMembers = activeTeam.length + bonusMembers.length;

  return (
    <Div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
      {/* Header */}
      <Div className="px-6 pt-5 pb-4 border-b border-border/50 flex items-center gap-4">
        {/* Logo team */}
        <Btn
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowLogoDialog(true)}
          accessibilityLabel="Modifica logo team"
        >
          {teamLogoUrl ? (
            <Img src={teamLogoUrl} alt="Logo team" className="w-full h-full object-contain" />
          ) : (
            <Div className="flex flex-col items-center gap-1 text-primary/50 bg-primary/5 w-full h-full items-center justify-center flex">
              <ImagePlus className="w-6 h-6" />
              <Span className="text-[8px] font-medium text-center leading-tight">Logo team</Span>
            </Div>
          )}
          <Div className="absolute bottom-1 right-1 p-1 rounded-full bg-primary text-primary-foreground">
            <Pencil className="w-2.5 h-2.5" />
          </Div>
        </Btn>

        {/* Dialog logo team */}
        <PhotoEditDialog
          open={showLogoDialog}
          onClose={() => setShowLogoDialog(false)}
          currentPhotoUrl={teamLogoUrl}
          currentZoom={1}
          onConfirm={handleLogoConfirm}
          onDelete={handleLogoDelete}
          uploading={logoUploading}
          promoterName="Logo Team"
        />

        {/* Nome team */}
        <Div className="flex items-center gap-2 flex-1 min-w-0">
          {editing ? (
            <HtmlInput
              autoFocus
              defaultValue={displayName}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveTeamName(); if (e.key === 'Escape') cancelEdit(); }}
              className="text-xl font-bold bg-transparent border-b border-primary outline-none text-foreground flex-1 min-w-0"
              maxLength={40}
            />
          ) : (
            <H className="text-xl font-bold truncate">{displayName}</H>
          )}
          {!editing && (
            <Btn
              button
              onClick={() => { setDraft(displayName); setEditing(true); }}
              className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all flex-shrink-0">
              <Pencil className="w-3.5 h-3.5" />
            </Btn>
          )}
          {editing && (
            <Div className="flex gap-1 flex-shrink-0">
              <Btn
                button
                onClick={saveTeamName}
                className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all"><Check className="w-3.5 h-3.5" /></Btn>
              <Btn
                button
                onClick={cancelEdit}
                className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-all"><X className="w-3.5 h-3.5" /></Btn>
            </Div>
          )}
        </Div>

        <Div className="flex-shrink-0 text-right">
          <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Membri</P>
          <P className="text-lg font-bold text-primary">{totalMembers}</P>
        </Div>
      </Div>

      {/* KPI */}
      <Div className="grid grid-cols-2 gap-3 px-6 py-4 border-b border-border/50">
        <Div className="rounded-xl bg-primary/8 border border-primary/15 p-3 flex items-center gap-3">
          <Div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Euro className="w-4 h-4 text-primary" />
          </Div>
          <Div>
            <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Fatturato Team</P>
            <P className="text-base font-bold text-primary">€{totalRevenue.toLocaleString('it-IT')}</P>
          </Div>
        </Div>
        <Div className="rounded-xl bg-secondary/40 border border-border p-3 flex items-center gap-3">
          <Div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
          </Div>
          <Div>
            <P className="text-[10px] text-muted-foreground uppercase tracking-wider">Tavoli Team</P>
            <P className="text-base font-bold">{totalTables.toFixed(1).replace('.', ',')}</P>
          </Div>
        </Div>
      </Div>

      {/* Avatar membri */}
      <Div className="px-6 py-5">
        <P className="text-[10px] text-muted-foreground uppercase tracking-wider mb-4">Membri Attivi</P>
        <Div className="flex flex-wrap gap-4">
          {activeTeam.map(p => (
            <MemberAvatar
              key={p.id}
              promoter={p}
              isMe={p.id === promoter.id}
              onEditPhoto={p.id === promoter.id ? () => setShowPhotoDialog(true) : undefined}
            />
          ))}
        </Div>
      </Div>

      <PhotoEditDialog
        open={showPhotoDialog}
        onClose={() => setShowPhotoDialog(false)}
        currentPhotoUrl={webStorage.getItem('promoter_photo_' + promoter.id) || promoter.photo_url}
        currentZoom={webStorage.getItem('promoter_photo_zoom_' + promoter.id) || promoter.photo_zoom}
        onConfirm={handlePhotoConfirm}
        onDelete={handlePhotoDelete}
        uploading={photoUploadingMe}
        promoterName={promoter.name}
      />

      {/* Ragazze immagine */}
      {bonusMembers.length > 0 && (
        <Div className="px-6 pb-5">
          <Div className="border-t border-pink-400/20 pt-4">
            <P className="text-[10px] text-pink-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Ragazze Immagine
            </P>
            <Div className="flex flex-wrap gap-4">
              {bonusMembers.map(p => (
                <MemberAvatar key={p.id} promoter={p} isBonus />
              ))}
            </Div>
          </Div>
        </Div>
      )}
    </Div>
  );
}