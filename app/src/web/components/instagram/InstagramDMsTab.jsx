// Port di src/components/instagram/InstagramDMsTab.jsx (convertito da scripts/port/codemod.mjs).
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useProgressiveList } from '@/web/hooks/useProgressiveList';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44';
import { fetchIgMessages } from '@/web/lib/igMessages';
import { useAuth } from '@/lib/auth';
import { useViewAsPromoter } from '@/lib/viewAs';
import { RefreshCw, Inbox, ChevronDown, Link2, ExternalLink, UserPlus, Pin, PinOff, Mic, Image as ImageIcon, Video, Paperclip, Ban, Send, Trash2, Search, X, Instagram as InstagramIcon, Lock } from '@/ui/icons.generated';
import SectionHeader from '@/web/components/shared/SectionHeader';
import InstagramProfileCard from '@/web/components/instagram/InstagramProfileCard';
import InstagramConnectScreen from '@/web/components/instagram/InstagramConnectScreen';
import { format, formatDistanceToNow, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { cn } from '@/ui/cn';
import InstagramChatContextMenu from '@/web/components/instagram/InstagramChatContextMenu';
import { wasRecentScroll } from '@/web/lib/scrollGuard';
import { useNavigate } from '@/web/router';
import CachedImage from '@/web/components/shared/CachedImage';
import { preloadImages } from '@/legacy/utils/imageCache';

import { doc as webDocument, nav as webNavigator, win as webWindow } from '@/web/shims/dom';
import { Btn, Div, P, Span } from '@/ui/html';
import { HtmlInput } from '@/ui/elements';

// riquadro della chat: aggiungendo messaggi in cima la riga visibile resta ferma (ScrollView di RN)
const KEEP_VISIBLE_ROW = { minIndexForVisible: 0 };

export default function InstagramDMsTab({ semine = [], onAddToSemine, upcomingDates, addToPlan, onAddCustom }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('semine');
  const [syncing, setSyncing] = useState(false);
  const [expandedConvId, setExpandedConvId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [search, setSearch] = useState('');
  const messagesScrollRef = useRef(null);
  const touchOpenedRef = useRef(0);
  const convsRef = useRef(new Map());

  const isAdmin = user?.role === 'admin';
  const showPrivacyLock = isAdmin && !user?.promoter_id;
  const { effectivePromoterId: promoterId, isViewingAs } = useViewAsPromoter();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['instagram-messages', promoterId],
    queryFn: () => fetchIgMessages({ isAdmin, promoterId }),
    enabled: !!user,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fetch clients for the promoter to show matched client photos/names
  const { data: clients = [] } = useQuery({
    queryKey: ['clients', promoterId],
    queryFn: () => base44.entities.Client.filter({ promoter_id: promoterId }),
    enabled: !!promoterId,
    staleTime: 2 * 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Fetch ignored chats to filter them out
  const { data: ignoredChats = [] } = useQuery({
    queryKey: ['ignored-ig-chats', promoterId],
    queryFn: () => isAdmin && !promoterId
      ? base44.entities.IgnoredInstagramChat.list()
      : base44.entities.IgnoredInstagramChat.filter({ promoter_id: promoterId }),
    enabled: !!user,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const ignoredConvIds = useMemo(() => new Set(ignoredChats.map(c => c.conversation_id)), [ignoredChats]);

  // Cold-start: precarica le foto profilo Instagram dei mittenti (CDN scontent.cdninstagram.com)
  // così gli avatar delle conversazioni non flashano al primo caricamento. Le foto delle semine
  // e dei clienti abbinati sono già precaricate dai rispettivi preloader globali; qui aggiungiamo
  // solo le sender_profile_pic_url (Instagram CDN) non coperte altrove. Dedup per conversation.
  useEffect(() => {
    if (!messages.length) return;
    const seen = new Set();
    const urls = [];
    for (const m of messages) {
      const u = m.sender_profile_pic_url;
      if (u && !seen.has(u)) { seen.add(u); urls.push(u); }
    }
    if (urls.length) preloadImages(urls);
  }, [messages]);

  // Stato connessione IG: se non collegato → schermata pulita con solo il bottone
  const { data: igStatus, isLoading: igStatusLoading } = useQuery({
    queryKey: ['my-ig-connection', promoterId],
    queryFn: async () => {
      const res = await base44.functions.invoke('getMyIGConnectionStatus', { promoter_id: promoterId });
      return res.data;
    },
    enabled: !!user && !!promoterId,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Auto-center chat card (slide into focus) + scroll messages to bottom
  useEffect(() => {
    setReplyText('');
    setReplyError(null);
    if (expandedConvId) {
      const card = webDocument.querySelector(`[data-ig-conv-id="${expandedConvId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (messagesScrollRef.current) {
        messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
      }
    }
  }, [expandedConvId]);

  const seminaMap = useMemo(() => {
    const map = new Map();
    semine.forEach(s => map.set(s.id, s));
    return map;
  }, [semine]);

  const clientMap = useMemo(() => {
    const map = new Map();
    clients.forEach(c => map.set(c.id, c));
    return map;
  }, [clients]);

  // Group messages by conversation_id, sort chronologically within each conversation
  const conversations = useMemo(() => {
    const grouped = {};
    messages.forEach(msg => {
      if (ignoredConvIds.has(msg.conversation_id)) return;
      if (!grouped[msg.conversation_id]) grouped[msg.conversation_id] = [];
      grouped[msg.conversation_id].push(msg);
    });

    const result = Object.values(grouped).map(msgs => {
      const sorted = [...msgs].sort((a, b) => new Date(a.message_timestamp) - new Date(b.message_timestamp));
      const lastMsg = sorted[sorted.length - 1];
      const firstIncoming = sorted.find(m => !m.is_outgoing);
      const matchedSemina = sorted.find(m => m.matched_semina_id);
      const matchedClient = sorted.find(m => m.matched_client_id);
      return {
        conversationId: sorted[0].conversation_id,
        messages: sorted,
        lastMessage: lastMsg,
        senderHandle: firstIncoming?.sender_handle || sorted[0].sender_handle || '',
        senderUsername: firstIncoming?.sender_username || sorted[0].sender_username || '',
        senderProfilePic: firstIncoming?.sender_profile_pic_url || sorted[0].sender_profile_pic_url || '',
        matchedSeminaId: matchedSemina?.matched_semina_id || null,
        matchedClientId: matchedClient?.matched_client_id || null,
        isPinned: sorted.some(m => m.is_pinned),
        hasUnread: sorted.some(m => !m.is_read && !m.is_outgoing),
      };
    });

    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastMessage.message_timestamp) - new Date(a.lastMessage.message_timestamp);
    });

    return result;
  }, [messages]);

  // Deep-link from Semina card: ?semina_id=<id> → switch to "Semine" tab and expand the matched chat
  useEffect(() => {
    const params = new URLSearchParams(webWindow.location.search);
    const seminaId = params.get('semina_id');
    if (!seminaId || !conversations.length) return;
    const conv = conversations.find(c => c.matchedSeminaId === seminaId);
    if (conv) {
      setActiveSubTab('semine');
      setExpandedConvId(conv.conversationId);
      const u = new URL(webWindow.location.href);
      u.searchParams.delete('semina_id');
      const qs = u.searchParams.toString();
      webWindow.history.replaceState({}, '', u.pathname + (qs ? `?${qs}` : ''));
    }
  }, [conversations]);

  // Split into Semine / Clienti / Non abbinati
  const filteredConversations = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter(c =>
      (c.senderHandle || '').toLowerCase().includes(q) ||
      (c.senderUsername || '').toLowerCase().includes(q) ||
      (c.lastMessage?.message_text || '').toLowerCase().includes(q) ||
      c.messages.some(m => (m.message_text || '').toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const semineConvs = filteredConversations.filter(c => c.matchedSeminaId);
  const clientiConvs = filteredConversations.filter(c => !c.matchedSeminaId && c.matchedClientId);
  const unmatchedConvs = filteredConversations.filter(c => !c.matchedSeminaId && !c.matchedClientId);

  const tabConfigs = [
    { key: 'semine', label: 'Semine', convs: semineConvs },
    { key: 'clienti', label: 'Clienti', convs: clientiConvs },
    { key: 'non-abbinati', label: 'Esclusi', convs: unmatchedConvs },
  ];
  const activeConfig = tabConfigs.find(t => t.key === activeSubTab) || tabConfigs[0];
  const displayConvs = activeConfig.convs;
  // PORT: molte conversazioni: montaggio progressivo (hooks/useProgressiveList)
  const { count: shownConvs, sentinelRef: convsSentinelRef } = useProgressiveList(displayConvs.length);
  // PORT: la chat aperta parte dal fondo e può avere centinaia di messaggi: si montano gli ultimi 40 e
  // gli altri a blocchi scorrendo verso l'alto (useProgressiveList box 'top'; il riquadro tiene ferma la
  // riga visibile con maintainVisibleContentPosition). REGOLE-PRESTAZIONI §3
  const expandedMessages = useMemo(() => conversations.find(c => c.conversationId === expandedConvId)?.messages.length ?? 0, [conversations, expandedConvId]);
  const chatList = useProgressiveList(expandedMessages, { initial: 40, step: 40, box: 'top', ahead: 1, resetKey: expandedConvId });
  const unreadCount = messages.filter(m => !m.is_read && !m.is_outgoing).length;

  const handleSync = async () => {
    setSyncing(true);
    try {
      await base44.functions.invoke('syncInstagramDMs', {});
      qc.invalidateQueries({ queryKey: ['instagram-messages'] });
      qc.invalidateQueries({ queryKey: ['promoter'] });
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setSyncing(false);
    }
  };

  const handleMarkConvRead = async (conv) => {
    const unread = conv.messages.filter(m => !m.is_read);
    if (unread.length === 0) return;
    await base44.entities.InstagramMessage.bulkUpdate(
      unread.map(m => ({ id: m.id, is_read: true }))
    );
    qc.invalidateQueries({ queryKey: ['instagram-messages'] });
  };

  const handleTogglePin = async (conv) => {
    const newPinned = !conv.isPinned;
    await base44.entities.InstagramMessage.bulkUpdate(
      conv.messages.map(m => ({ id: m.id, is_pinned: newPinned }))
    );
    qc.invalidateQueries({ queryKey: ['instagram-messages'] });
  };

  const handleAddToSemine = async (conv) => {
    const handle = conv.senderHandle;
    if (!handle) return;
    try {
      await base44.entities.Semina.create({
        name: conv.senderUsername || handle,
        platform: 'instagram',
        instagram: handle,
        instagram_profile_url: `https://instagram.com/${handle}`,
        promoter_id: promoterId,
      });
      qc.invalidateQueries({ queryKey: ['semine'] });
      qc.invalidateQueries({ queryKey: ['instagram-messages'] });
    } catch (e) {
      console.error('Create semina failed:', e);
    }
  };

  const handleRemoveFromSemina = async (conv) => {
    if (!conv.matchedSeminaId) return;
    try {
      await base44.entities.Semina.delete(conv.matchedSeminaId);
      qc.invalidateQueries({ queryKey: ['semine'] });
      qc.invalidateQueries({ queryKey: ['instagram-messages'] });
    } catch (e) {
      console.error('Remove semina failed:', e);
    }
  };

  const handlePasteSeminaPhoto = async (seminaId, url) => {
    qc.setQueriesData({ queryKey: ['semine'] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(s => s.id === seminaId ? { ...s, photo_url: url } : s);
    });
    try {
      await base44.entities.Semina.update(seminaId, { photo_url: url });
      qc.invalidateQueries({ queryKey: ['semine'] });
    } catch (e) {
      qc.invalidateQueries({ queryKey: ['semine'] });
    }
  };

  const handlePasteClientPhoto = async (clientId, url) => {
    qc.setQueriesData({ queryKey: ['clients', promoterId] }, (old) => {
      if (!Array.isArray(old)) return old;
      return old.map(c => c.id === clientId ? { ...c, photo_url: url } : c);
    });
    try {
      await base44.entities.Client.update(clientId, { photo_url: url });
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
    } catch (e) {
      qc.invalidateQueries({ queryKey: ['clients', promoterId] });
    }
  };

  const buildClientObj = (conv) => {
    const profile = getMatchedProfile(conv);
    if (profile?.type === 'semina') {
      const s = seminaMap.get(conv.matchedSeminaId);
      return { id: s.id, name: s.name, isSemina: true, igHandle: s.instagram || conv.senderHandle };
    } else if (profile?.type === 'client') {
      const c = clientMap.get(conv.matchedClientId);
      return { id: c.id, name: c.name, isSemina: false, igHandle: c.instagram || conv.senderHandle };
    } else {
      return { id: 'ig-' + conv.senderHandle, name: conv.senderUsername || '@' + conv.senderHandle, isSemina: true, igHandle: conv.senderHandle };
    }
  };

  const handleAddToPlan = (conv, dateItem) => {
    if (!dateItem || !addToPlan) return;
    const clientObj = buildClientObj(conv);
    let subtitle;
    try { subtitle = format(dateItem.dateObj, 'd MMM yyyy', { locale: it }); } catch { subtitle = dateItem.dateStr; }
    if (dateItem.venueName) subtitle += ` · ${dateItem.venueName}`;
    else if (dateItem.dow === null) subtitle += ' · Extra';
    addToPlan(dateItem.dateStr, { title: `${dateItem.dayLabel}${dateItem.venueName ? ' · ' + dateItem.venueName : ''}`, subtitle }, clientObj);
  };

  const handleAddCustom = (conv, name, dateStr) => {
    if (!onAddCustom) return;
    const clientObj = buildClientObj(conv);
    onAddCustom(clientObj, name, dateStr);
  };

  const handleIgnore = async (conv) => {
    // Create ignored record
    await base44.entities.IgnoredInstagramChat.create({
      promoter_id: promoterId,
      conversation_id: conv.conversationId,
      handle: conv.senderHandle,
      username: conv.senderUsername,
      ignored_at: new Date().toISOString(),
    });
    // Delete existing messages for this conversation so they disappear immediately
    const convMessages = messages.filter(m => m.conversation_id === conv.conversationId);
    if (convMessages.length > 0) {
      await base44.entities.InstagramMessage.deleteMany({ conversation_id: conv.conversationId });
    }
    setExpandedConvId(null);
    qc.invalidateQueries({ queryKey: ['instagram-messages'] });
    qc.invalidateQueries({ queryKey: ['ignored-ig-chats'] });
  };

  const handleSendReply = async (conv) => {
    const text = replyText.trim();
    if (!text || sending) return;
    setSending(true);
    setReplyError(null);
    try {
      await base44.functions.invoke('sendInstagramMessage', {
        conversation_id: conv.conversationId,
        text,
      });
      setReplyText('');
      qc.invalidateQueries({ queryKey: ['instagram-messages'] });
    } catch (e) {
      const msg = e?.details?.error?.message || e?.message || 'Errore invio';
      setReplyError(msg.includes('24') || msg.toLowerCase().includes('window')
        ? 'Non puoi rispondere: sono passate più di 24h dall\'ultimo messaggio'
        : 'Errore: ' + msg);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (msg) => {
    try {
      await base44.entities.InstagramMessage.delete(msg.id);
      qc.invalidateQueries({ queryKey: ['instagram-messages'] });
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleContextMenu = (e, conv) => {
    e.preventDefault();
    setContextMenu({ conv, x: e.clientX, y: e.clientY });
  };

  // Keep convsRef updated so the delegated touch handler can resolve conv by id
  useEffect(() => {
    convsRef.current = new Map(conversations.map(c => [c.conversationId, c]));
  }, [conversations]);

  // Delegated long-press: same pattern as ClientSerateMenu (global touch listeners
  // on document, finds [data-ig-conv-id] via closest). Per-element onPointerDown/
  // onPointerUp don't work reliably on mobile because the inner <button> captures
  // the pointer and the timer gets canceled prematurely.
  useEffect(() => {
    let timer = null;
    let startX = 0, startY = 0;
    const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };

    const onCtx = (e) => {
      const el = e.target.closest && e.target.closest('[data-ig-conv-id]');
      if (el) {
        e.preventDefault();
        if (Date.now() - touchOpenedRef.current < 800) return;
        const conv = convsRef.current.get(el.getAttribute('data-ig-conv-id'));
        if (conv) setContextMenu({ conv, x: e.clientX, y: e.clientY });
        return;
      }
      if (e.target.closest('input, textarea, a[href], [contenteditable]')) return;
      e.preventDefault();
    };

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      const el = t.target.closest && t.target.closest('[data-ig-conv-id]');
      if (!el) return;
      if (wasRecentScroll(150)) return;
      startX = t.clientX; startY = t.clientY;
      const startRect = el.getBoundingClientRect();
      const hasScrolled = () => {
        const r = el.getBoundingClientRect();
        return Math.abs(r.top - startRect.top) > 2 || Math.abs(r.left - startRect.left) > 2;
      };
      clear();
      timer = setTimeout(() => {
        if (hasScrolled()) { clear(); return; }
        timer = null;
        touchOpenedRef.current = Date.now();
        const conv = convsRef.current.get(el.getAttribute('data-ig-conv-id'));
        if (conv) {
          setContextMenu({ conv, x: startX, y: startY });
          if (webNavigator.vibrate) webNavigator.vibrate(15);
        }
      }, 500);
    };

    const onTouchMove = (e) => {
      if (!timer) return;
      const t = e.touches[0];
      if (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10) clear();
    };

    const onScroll = () => { if (timer) clear(); };

    const onClickGuard = (e) => {
      if (Date.now() - touchOpenedRef.current > 600) return;
      if (e.target.closest && e.target.closest('[data-ig-conv-id]')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const onTouchEnd = () => { clear(); };
    const onTouchCancel = () => { clear(); };

    webDocument.addEventListener('contextmenu', onCtx);
    webDocument.addEventListener('touchstart', onTouchStart, { passive: true });
    webDocument.addEventListener('touchmove', onTouchMove, { passive: true });
    webDocument.addEventListener('touchend', onTouchEnd, { passive: true });
    webDocument.addEventListener('touchcancel', onTouchCancel, { passive: true });
    webDocument.addEventListener('click', onClickGuard, true);
    webWindow.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      clear();
      webDocument.removeEventListener('contextmenu', onCtx);
      webDocument.removeEventListener('touchstart', onTouchStart);
      webDocument.removeEventListener('touchmove', onTouchMove);
      webDocument.removeEventListener('touchend', onTouchEnd);
      webDocument.removeEventListener('touchcancel', onTouchCancel);
      webDocument.removeEventListener('click', onClickGuard, true);
      webWindow.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, []);

  const handleOpenProfile = (conv) => {
    if (conv.senderHandle) {
      webWindow.open(`https://instagram.com/${conv.senderHandle}`, '_blank');
    }
  };

  const handleShowCard = (conv) => {
    if (conv.matchedSeminaId) {
      navigate(`/semine?highlight_semina=${conv.matchedSeminaId}`);
    }
  };

  const toggleExpand = (conv) => {
    if (expandedConvId === conv.conversationId) {
      setExpandedConvId(null);
    } else {
      setExpandedConvId(conv.conversationId);
      if (conv.hasUnread) handleMarkConvRead(conv);
    }
  };

  // Resolve the matched profile (semina or client) for avatar/name display
  const getMatchedProfile = (conv) => {
    if (conv.matchedSeminaId) {
      const s = seminaMap.get(conv.matchedSeminaId);
      if (s) return { type: 'semina', name: s.name, photo: s.photo_url };
    }
    if (conv.matchedClientId) {
      const c = clientMap.get(conv.matchedClientId);
      if (c) return { type: 'client', name: c.name, photo: c.photo_url };
    }
    return null;
  };

  const formatPreviewTime = (ts) => {
    return formatDistanceToNow(new Date(ts), { addSuffix: true, locale: it });
  };

  const formatDateSeparator = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(date, today)) return 'Oggi';
    if (isSameDay(date, yesterday)) return 'Ieri';
    return format(date, 'd MMM yyyy', { locale: it });
  };

  const renderMessageIcon = (msgType) => {
    switch (msgType) {
      case 'voice': return <Mic className="w-3.5 h-3.5 shrink-0" />;
      case 'image': return <ImageIcon className="w-3.5 h-3.5 shrink-0" />;
      case 'video': return <Video className="w-3.5 h-3.5 shrink-0" />;
      case 'media': return <Paperclip className="w-3.5 h-3.5 shrink-0" />;
      default: return null;
    }
  };

  // Non collegato (e query completata senza errori) → schermata minimale
  if (!igStatusLoading && igStatus && !igStatus.connected) {
    return <InstagramConnectScreen authUrl={igStatus.authUrl} />;
  }

  return (
    <Div className="space-y-3">
      {/* Header card */}
      <Div className="relative overflow-hidden rounded-2xl border border-pink-500/15 bg-card p-4" style={{ boxShadow: '0 4px 24px -6px rgba(236,72,153,0.10)' }}>
        <Div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-50" style={{ background: 'linear-gradient(90deg, transparent, #ec4899, transparent)' }} />
        <Div className="flex items-center justify-between">
          <SectionHeader icon={InstagramIcon} title="Messaggi Instagram" color="#ec4899" size="lg" />
          <Div className="flex items-center gap-2">
            <Span className="text-xs font-semibold text-muted-foreground px-2.5 py-1 rounded-full bg-secondary/40">{conversations.length} conversazioni · {unreadCount} non letti</Span>
            <Btn
              button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-pink-500/30 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 disabled:opacity-50 transition-colors">
              <RefreshCw className={cn('w-3.5 h-3.5', syncing && 'animate-spin')} />
              {syncing ? 'Sincronizzazione…' : 'Aggiorna'}
            </Btn>
          </Div>
        </Div>
        {/* Barra di ricerca */}
        <Div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <HtmlInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per nome, handle, messaggio…"
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-secondary/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-pink-400/50"
          />
          {search && (
            <Btn
              button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary shrink-0"
              accessibilityLabel="Pulisci ricerca">
              <X className="w-3.5 h-3.5" />
            </Btn>
          )}
        </Div>
      </Div>

      {/* Bacheca profilo Instagram: foto, follower, seguiti */}
      <InstagramProfileCard promoterId={promoterId} />

      {/* Sub-tabs: Semine / Clienti / Non abbinati — pill chips allineati all'header */}
      <Div className="flex gap-2 p-1.5 rounded-2xl border border-pink-500/15 bg-card" style={{ boxShadow: '0 2px 12px -4px rgba(236,72,153,0.08)' }}>
        {tabConfigs.map(tab => (
          <Btn
            button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            className={cn(
              'flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all',
              activeSubTab === tab.key
                ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
                : 'text-muted-foreground hover:text-foreground border border-transparent hover:bg-secondary/40'
            )}>
            {tab.label} ({tab.convs.length})
          </Btn>
        ))}
      </Div>

      {/* Conversations */}
      {isLoading ? (
        <Div className="flex items-center justify-center h-40">
          <Div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </Div>
      ) : (showPrivacyLock && conversations.length === 0) ? (
        <Div className="flex flex-col items-center justify-center h-48 text-center px-6">
          <Div className="w-12 h-12 rounded-full bg-secondary/40 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-muted-foreground/60" />
          </Div>
          <P className="text-sm font-medium text-foreground/80">I DM sono privati</P>
          <P className="text-xs text-muted-foreground/70 mt-1.5 max-w-xs">
            Ogni promoter vede solo le proprie conversazioni Instagram. L'admin può sincronizzare ma non leggere i messaggi altrui.
          </P>
        </Div>
      ) : displayConvs.length === 0 ? (
        <Div className="flex flex-col items-center justify-center h-40 text-center">
          <Inbox className="w-10 h-10 text-muted-foreground/40 mb-2" />
          <P className="text-sm text-muted-foreground">
            Nessuna conversazione in "{activeConfig.label}"
          </P>
          <P className="text-xs text-muted-foreground/70 mt-1">
            Clicca "Aggiorna" per sincronizzare nuovi DM
          </P>
        </Div>
      ) : (
        <Div className="space-y-2">
          {displayConvs.slice(0, shownConvs).map(conv => {
            const isExpanded = expandedConvId === conv.conversationId;
            const profile = getMatchedProfile(conv);
            const isMatched = conv.matchedSeminaId || conv.matchedClientId;
            const avatarSrc = profile?.photo || conv.senderProfilePic;
            const displayName = profile?.name || `@${conv.senderHandle}`;
            return (
              <Div
                key={conv.conversationId}
                className={cn(
                  'rounded-xl border transition-colors overflow-hidden',
                  conv.isPinned ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'
                )}>
                {/* Conversation header (collapsed) */}
                <Btn
                  button
                  onClick={() => {
                    if (Date.now() - touchOpenedRef.current < 600) return;
                    toggleExpand(conv);
                  }}
                  className="w-full flex items-start gap-3 p-3 text-left hover:bg-secondary/30 transition-colors">
                  {/* Avatar */}
                  <Div className="shrink-0 relative">
                    <Div className="w-11 h-11 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
                      {avatarSrc ? (
                        <CachedImage src={avatarSrc} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Span className="text-sm font-semibold text-muted-foreground">
                          {conv.senderHandle?.[0]?.toUpperCase() || '?'}
                        </Span>
                      )}
                    </Div>
                    {isMatched && (
                      <Div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                        <Link2 className="w-2.5 h-2.5 text-white" />
                      </Div>
                    )}
                  </Div>

                  {/* Content */}
                  <Div className="flex-1 min-w-0">
                    <Div className="flex items-center justify-between gap-2">
                      <P className="text-sm font-medium truncate">
                        {displayName}
                        {conv.senderUsername && conv.senderUsername !== conv.senderHandle && conv.senderUsername !== displayName && (
                          <Span className="text-muted-foreground ml-1 font-normal">· {conv.senderUsername}</Span>
                        )}
                      </P>
                      <Div className="flex items-center gap-1.5 shrink-0">
                        {conv.isPinned && <Pin className="w-3.5 h-3.5 text-primary" />}
                        {conv.hasUnread && <Span className="w-2 h-2 rounded-full bg-primary" />}
                        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
                      </Div>
                    </Div>
                    <P className="text-xs text-muted-foreground mt-0.5">
                      {formatPreviewTime(conv.lastMessage.message_timestamp)}
                      {' · '}
                      {conv.messages.length} messaggi
                    </P>
                    <P className="text-sm text-foreground/80 mt-1 line-clamp-1 flex items-center gap-1">
                      {conv.lastMessage.is_outgoing && <Span className="text-primary/60">Tu: </Span>}
                      {conv.lastMessage.message_type !== 'text' && renderMessageIcon(conv.lastMessage.message_type)}
                      <Span className="truncate">{conv.lastMessage.message_text}</Span>
                    </P>
                  </Div>
                </Btn>

                {/* Expanded chat thread */}
                {isExpanded && (
                  <Div className="border-t border-border bg-background/50">
                    {/* Chat messages */}
                    <Div ref={isExpanded ? messagesScrollRef : null} className="p-3 space-y-2 max-h-[400px] overflow-y-auto"
                      onScroll={chatList.onBoxScroll} maintainVisibleContentPosition={KEEP_VISIBLE_ROW}>
                      {conv.messages.slice(Math.max(0, conv.messages.length - chatList.count)).map((msg, k) => {
                        const idx = Math.max(0, conv.messages.length - chatList.count) + k;
                        const msgDate = new Date(msg.message_timestamp);
                        const prevMsg = idx > 0 ? conv.messages[idx - 1] : null;
                        const showDateSeparator = !prevMsg || !isSameDay(msgDate, new Date(prevMsg.message_timestamp));

                        return (
                          <React.Fragment key={msg.id}>
                            {showDateSeparator && (
                              <Div className="flex items-center justify-center my-3">
                                <Span className="text-[10px] text-muted-foreground bg-secondary/60 px-2.5 py-1 rounded-full">
                                  {formatDateSeparator(msgDate)}
                                </Span>
                              </Div>
                            )}
                            <Div className={cn('flex group/msg relative', msg.is_outgoing ? 'justify-end' : 'justify-start')}>
                              <Div className={cn(
                                'max-w-[75%] rounded-2xl px-3 py-2',
                                msg.is_outgoing
                                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                                  : 'bg-secondary text-foreground rounded-bl-sm'
                              )}>
                                <Div className="flex items-center gap-1.5">
                                  {msg.message_type !== 'text' && renderMessageIcon(msg.message_type)}
                                  <P className="text-sm whitespace-pre-wrap break-words">{msg.message_text}</P>
                                </Div>
                                <P className={cn(
                                  'text-[10px] mt-0.5',
                                  msg.is_outgoing ? 'text-primary-foreground/60' : 'text-muted-foreground'
                                )}>
                                  {format(msgDate, 'HH:mm', { locale: it })}
                                </P>
                              </Div>
                              <Btn
                                button
                                onClick={() => handleDeleteMessage(msg)}
                                className="absolute -top-1.5 opacity-60 sm:opacity-0 sm:group-hover/msg:opacity-100 transition-opacity p-1 rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110"
                                style={msg.is_outgoing ? { right: '-6px' } : { left: '-6px' }}
                                accessibilityLabel="Elimina messaggio">
                                <Trash2 className="w-2.5 h-2.5" />
                              </Btn>
                            </Div>
                          </React.Fragment>
                        );
                      })}
                    </Div>

                    {/* Actions */}
                    <Div className="flex items-center gap-3 px-3 py-2 border-t border-border bg-card/50">
                      <Btn
                        button
                        onClick={() => handleTogglePin(conv)}
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                        {conv.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                        {conv.isPinned ? 'Rimuovi' : 'Fissa'}
                      </Btn>
                      {!isMatched && (
                        <Btn
                          button
                          onClick={() => handleAddToSemine(conv)}
                          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                          <UserPlus className="w-3 h-3" />
                          Aggiungi a Semine
                        </Btn>
                      )}
                      <Btn
                        button
                        onClick={() => handleOpenProfile(conv)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors ml-auto">
                        <ExternalLink className="w-3 h-3" />
                        Profilo
                      </Btn>
                      {!isMatched && (
                        <Btn
                          button
                          onClick={() => handleIgnore(conv)}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                          <Ban className="w-3 h-3" />
                          Ignora
                        </Btn>
                      )}
                    </Div>

                    {/* Reply input */}
                    <Div className="px-3 py-2.5 border-t border-border bg-card">
                      {replyError && (
                        <P className="text-[11px] text-red-400 mb-1.5">{replyError}</P>
                      )}
                      <Div className="flex items-center gap-2">
                        <HtmlInput
                          type="text"
                          value={isExpanded ? replyText : ''}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendReply(conv);
                            }
                          }}
                          placeholder="Rispondi…"
                          className="flex-1 px-3 py-2 rounded-xl bg-secondary/40 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                        />
                        <Btn
                          button
                          onClick={() => handleSendReply(conv)}
                          disabled={!replyText.trim() || sending}
                          className="shrink-0 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-colors">
                          {sending ? (
                            <Div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </Btn>
                      </Div>
                    </Div>
                  </Div>
                )}
              </Div>
            );
          })}
          {shownConvs < displayConvs.length && <Div ref={convsSentinelRef} />}
        </Div>
      )}

      {contextMenu && (
        <InstagramChatContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          conv={contextMenu.conv}
          onClose={() => setContextMenu(null)}
          onOpenProfile={handleOpenProfile}
          onIgnore={handleIgnore}
          onAddToProspetto={handleAddToSemine}
          onRemoveFromSemina={handleRemoveFromSemina}
          onShowCard={handleShowCard}
          onPasteSeminaPhoto={handlePasteSeminaPhoto}
          onPasteClientPhoto={handlePasteClientPhoto}
          upcomingDates={upcomingDates}
          onAddToPlan={handleAddToPlan}
          onAddCustom={handleAddCustom}
          touchOpenedAt={touchOpenedRef.current}
        />
      )}
    </Div>
  );
}