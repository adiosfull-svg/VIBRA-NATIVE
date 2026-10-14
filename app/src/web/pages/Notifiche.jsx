// Port di src/pages/Notifiche.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useRef } from 'react';
import { useNavigate } from '@/web/router';
import { Bell, CheckCheck, Trash2, ArrowLeft, X } from '@/ui/icons.generated';
import { useNotifications } from '@/web/hooks/useNotifications';
import { formatDistanceToNow, format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Button } from '@/ui/button';
import { parseUTC, toRome } from '@/legacy/utils/dateUtils';

import { win as webWindow } from '@/web/shims/dom';
import { Btn, Div, H, P, Span } from '@/ui/html';
import { HtmlText } from '@/ui/htmlText';

// Il backend salva created_date senza 'Z' ma è UTC — lo forziamo UTC aggiungendo 'Z'


const TYPE_COLORS = {
  new_event:       'bg-blue-500/15 border-blue-500/30 text-blue-300',
  achievement:     'bg-yellow-500/15 border-yellow-500/30 text-yellow-300',
  vibra_vs:        'bg-violet-500/15 border-violet-500/30 text-violet-300',
  inactive_client: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  new_goal:        'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  weekly_reminder: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
  system:          'bg-secondary/40 border-border text-muted-foreground',
};

const TYPE_LABEL = {
  new_event:       'Nuova Serata',
  achievement:     'Achievement',
  vibra_vs:        'Vibra VS',
  inactive_client: 'Cliente Inattivo',
  new_goal:        'Nuovo Obiettivo',
  weekly_reminder: 'Promemoria Settimanale',
  system:          'Sistema',
};

// ─── SwipeableNotif ───────────────────────────────────────────────────────────
const SWIPE_THRESHOLD = 80; // px

function SwipeableNotif({ children, onDelete }) {
  const [offsetX, setOffsetX] = useState(0);
  const [deleted, setDeleted] = useState(false);
  const startX = useRef(null);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) setOffsetX(Math.max(dx, -140));
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (offsetX < -SWIPE_THRESHOLD) {
      setDeleted(true);
      setTimeout(onDelete, 250);
    } else {
      setOffsetX(0);
    }
    startX.current = null;
  };

  if (deleted) return null;

  return (
    <Div className="relative overflow-hidden rounded-2xl">
      {/* Sfondo rosso con icona trash */}
      <Div className="absolute inset-0 flex items-center justify-end pr-5 bg-destructive/80 rounded-2xl">
        <Trash2 className="w-5 h-5 text-white" />
      </Div>
      {/* Contenuto scorrevole */}
      <Div
        style={{ transform: `translateX(${offsetX}px)`, transition: isDragging.current ? 'none' : 'transform 0.25s ease' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </Div>
    </Div>
  );
}

export default function Notifiche() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAllRead } = useNotifications();

  const handleClick = (n) => {
    if (!n.is_read) markAsRead(n.id);
    if (n.action_url) {
      if (/^https?:\/\//i.test(n.action_url) || n.action_url.startsWith('wa.me')) {
        webWindow.open(n.action_url, '_blank', 'noopener,noreferrer');
      } else {
        navigate(n.action_url);
      }
    }
  };

  return (
    <Div className="max-w-2xl mx-auto space-y-4 pb-12">
      {/* Header */}
      <Div className="flex items-center gap-3 mb-2">
        <Btn
          button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Btn>
        <Div className="flex-1">
          <H className="text-2xl font-bold">Notifiche</H>
          {unreadCount > 0 && (
            <P className="text-xs text-muted-foreground">{unreadCount} non {unreadCount === 1 ? 'letta' : 'lette'}</P>
          )}
        </Div>
        <Div className="flex gap-2">
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllAsRead} className="h-8 text-xs gap-1.5">
              <CheckCheck className="w-3.5 h-3.5" /> Segna tutte lette
            </Button>
          )}
          {notifications.some(n => n.is_read) && (
            <Button size="sm" variant="ghost" onClick={deleteAllRead} className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" /> Cancella lette
            </Button>
          )}
        </Div>
      </Div>

      {/* Lista */}
      {notifications.length === 0 ? (
        <Div className="rounded-2xl bg-card border border-border px-6 py-16 text-center space-y-3">
          <Bell className="w-12 h-12 text-muted-foreground/20 mx-auto" />
          <P className="font-semibold text-muted-foreground">Nessuna notifica</P>
          <P className="text-sm text-muted-foreground/60">Tutte le notifiche appariranno qui.</P>
        </Div>
      ) : (
        <Div className="space-y-2">
          {notifications.map(n => (
            <SwipeableNotif key={n.id} onDelete={() => deleteNotification(n.id)}>
            <Div
              className={`rounded-2xl border bg-card transition-colors ${!n.is_read ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
            >
              <Div className="flex items-start gap-4 px-4 pt-4 pb-3">
                {/* Icona */}
                <Div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border ${TYPE_COLORS[n.type] || TYPE_COLORS.system}`}>
                  {n.icon || '🔔'}
                </Div>

                {/* Contenuto */}
                <Div className="flex-1 min-w-0">
                  <Div className="flex items-start justify-between gap-2">
                    <Div className="flex-1 min-w-0">
                      <Div className="flex items-center gap-2 flex-wrap">
                        {!n.is_read && <Span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                        <HtmlText className="text-sm font-bold leading-snug" html={n.title} />
                      </Div>
                      <Span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_COLORS[n.type] || TYPE_COLORS.system}`}>
                        {TYPE_LABEL[n.type] || 'Notifica'}
                      </Span>
                    </Div>
                    <Btn
                      button
                      onClick={() => deleteNotification(n.id)}
                      className="shrink-0 text-muted-foreground/40 hover:text-destructive transition-colors mt-0.5">
                      <X className="w-4 h-4" />
                    </Btn>
                  </Div>

                  {/* Messaggio */}
                  <HtmlText
                    className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap"
                    html={n.message} />

                  {/* Footer */}
                  <Div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                    <Div className="space-y-0.5">
                      <P className="text-[11px] text-muted-foreground/60">
                        {format(toRome(n.created_date), "d MMMM yyyy 'alle' HH:mm", { locale: it })}
                      </P>
                      <P className="text-[11px] text-muted-foreground/40">
                        {formatDistanceToNow(parseUTC(n.created_date), { locale: it, addSuffix: true })}
                      </P>
                    </Div>
                    <Div className="flex items-center gap-2">
                      {n.action_url && (
                        <Button size="sm" variant="outline" onClick={() => handleClick(n)} className="h-7 text-xs">
                          Apri →
                        </Button>
                      )}
                      {!n.is_read && (
                        <Btn
                          button
                          onClick={() => markAsRead(n.id)}
                          className="text-[11px] text-primary hover:text-primary/70 flex items-center gap-1">
                          <CheckCheck className="w-3.5 h-3.5" /> Letta
                        </Btn>
                      )}
                    </Div>
                  </Div>
                </Div>
              </Div>
            </Div>
            </SwipeableNotif>
          ))}
        </Div>
      )}
    </Div>
  );
}