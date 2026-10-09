// Port di src/components/programmazione/SeminaShareCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useEffect, useState } from 'react';
import useCachedImage from '@/web/hooks/useCachedImage';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { extractNameFromHandle } from '@/legacy/utils/seminaParse';

import { Div, Span } from '@/ui/html';
import { Img, Path, Svg, Table, Tbody, Td, Tr } from '@/ui/elements';

const STATUS_META = {
  nuovo: { label: 'Nuovo', bg: 'rgba(59,130,246,0.18)', color: '#60a5fa', border: 'rgba(59,130,246,0.4)' },
  contattato: { label: 'Contattato', bg: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: 'rgba(245,158,11,0.4)' },
  interessato: { label: 'Interessato', bg: 'rgba(16,185,129,0.18)', color: '#34d399', border: 'rgba(16,185,129,0.4)' },
  convertito: { label: 'Convertito', bg: 'rgba(161,161,170,0.18)', color: '#d4d4d8', border: 'rgba(161,161,170,0.4)' },
};

const initials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

// ─── SVG icons (html2canvas compatible, no flex needed) ───
function InstagramSvg({ size = 13, color = '#f472b6' }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ display: 'block' }}>
      <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </Svg>
  );
}

function TikTokSvg({ size = 13, color = '#fe2c55' }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ display: 'block' }}>
      <Path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.46-4.44c.3 0 .6.04.88.13V9.4a6.33 6.33 0 00-.88-.05A6.34 6.34 0 005 20.7a6.34 6.34 0 0010.86-4.43V8.59a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.02z"/>
    </Svg>
  );
}

// ─── Costanti di centratura verticale ───
// Il motore di rendering usato per esportare la card (html2canvas) non applica
// line-height/vertical-align in modo affidabile: il testo/icona tende a comparire
// più in basso del centro reale del box. Il fix robusto è avvolgere il contenuto
// in uno span con line-height = altezza del box e applicare un piccolo
// transform: translateY() di correzione, verificato empiricamente sul rendering
// reale (il transform, a differenza di vertical-align, viene applicato
// correttamente). Valori negativi spostano il contenuto verso l'alto.
const BADGE_TEXT_OFFSET = -7;  // per i chip "IG"/"TikTok", "Nuovo" e data (stessa altezza/font-size)
const CHIP_TEXT_OFFSET = -8;   // per le info chip centrali (età, zona, lavoro, locali, eventi) — regola se serve
const HANDLE_ICON_OFFSET = 8;  // abbassa l'icona IG/TikTok accanto alla chiocciola rispetto al testo

// Riga Recettività: la dimensione (RECETTIVITA_ROW_HEIGHT) e la correzione fine
// (RECETTIVITA_TEXT_OFFSET / RECETTIVITA_BAR_OFFSET) sono volutamente separate.
// Cambiare solo l'altezza NON corregge lo scarto reale (dato dai metrics del
// font/emoji), quindi serve un translateY indipendente per testo e per barra.
const RECETTIVITA_TEXT_OFFSET = -6; // negativo = testo/icona più in alto
const RECETTIVITA_BAR_OFFSET = 0;   // px aggiuntivi oltre al centraggio automatico della barra; negativo = più in alto

// Note (blocco 📝) — l'icona ha metrics diversi dal testo: offset indipendenti
const NOTES_ICON_OFFSET = -3; // negativo = icona più in alto
const NOTES_TEXT_OFFSET = -5; // negativo = testo più in alto

const CHIP_HEIGHT = 34;

function InfoChip({ icon, color, children }) {
  return (
    <Div style={{
      height: CHIP_HEIGHT,
      padding: '0 12px',
      borderRadius: 999,
      background: 'rgba(255,255,255,0.08)',
      boxSizing: 'border-box',
      marginBottom: 6,
      overflow: 'hidden',
    }}>
      <Table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <Tbody>
          <Tr>
            <Td style={{ width: 22, textAlign: 'center', fontSize: 12, color, height: CHIP_HEIGHT, padding: 0, overflow: 'hidden' }}>
              <Span style={{
                display: 'block',
                lineHeight: `${CHIP_HEIGHT}px`,
                transform: `translateY(${CHIP_TEXT_OFFSET}px)`,
              }}>
                {icon}
              </Span>
            </Td>
            <Td style={{ fontSize: 11, color: '#e4e4e7', height: CHIP_HEIGHT, paddingLeft: 8, overflow: 'hidden' }}>
              <Span style={{
                display: 'block',
                lineHeight: `${CHIP_HEIGHT}px`,
                transform: `translateY(${CHIP_TEXT_OFFSET}px)`,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {children}
              </Span>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Div>
  );
}

/**
 * Scheda riepilogativa semina per la condivisione (html2canvas → navigator.share).
 * Layout interamente con inline-block + tabelle + altezze/line-height fisse:
 * NESSUN flexbox e NESSUNA dipendenza da vertical-align, perché html2canvas non
 * li renderizza in modo affidabile (testo non centrato, elementi storti).
 */
export default function SeminaShareCard({ semina, cardRef }) {
  const photoUrl = useCachedImage(semina?.photo_url || '');
  const { logoDataUrl: vibraLogo } = useVibraLogo();

  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => { setImgLoaded(false); }, [photoUrl]);

  const platform = semina?.platform || 'instagram';
  const isTikTok = platform === 'tiktok';
  const handle = isTikTok ? (semina?.tiktok || '') : (semina?.instagram || '');
  const handleDisplay = handle.replace('@', '');

  const displayName = (() => {
    const n = (semina?.name || '').trim();
    const h = handleDisplay || '';
    if (n && h && (n === h || n.replace(/[@]/g, '') === h || n.toLowerCase() === h.toLowerCase())) {
      return extractNameFromHandle(h) || n;
    }
    return n || h;
  })();

  const createdDate = semina?.created_date
    ? format(new Date(semina.created_date), 'd MMM yy', { locale: it })
    : '';
  const status = semina?.status || 'nuovo';
  const statusMeta = STATUS_META[status] || STATUS_META.nuovo;
  const isRecent = !semina?.created_date || (Date.now() - new Date(semina.created_date).getTime()) / 86400000 < 7;
  const showStatusBadge = status !== 'nuovo' || isRecent;
  const displayAge = semina?.eta != null ? semina.eta : (semina?.ai_data?.eta || 0);
  const ai = semina?.ai_data || {};

  const bannerGradient = isTikTok
    ? 'linear-gradient(135deg, #25f4ee, #fe2c55)'
    : 'linear-gradient(135deg, #ec4899, rgba(236,72,153,0.4))';

  const hasAiData = displayAge > 0 || semina?.provenienza || ai.zona || ai.usual_promoter || ai.work?.role || ai.study?.school || ai.venues_attended?.length > 0 || ai.invited_events?.length > 0 || ai.is_driver;

  // ─── Dimensioni cerchio foto profilo ───
  const AVATAR_SIZE = 72;
  const AVATAR_BORDER = 3;
  const CARD_WIDTH = 340;
  const AVATAR_LEFT = (CARD_WIDTH - AVATAR_SIZE) / 2;
  const AVATAR_BOTTOM = -(AVATAR_SIZE / 2);
  const AVATAR_INNER = AVATAR_SIZE - AVATAR_BORDER * 2;
  const BODY_PADDING_TOP = (AVATAR_SIZE + AVATAR_BOTTOM) + 10;

  const BADGE_HEIGHT = 22; // altezza dei chip "Nuovo" e data
  const PLATFORM_BADGE_HEIGHT = 22; // altezza del chip "IG"/"TikTok" (isolata, regolabile a parte)

  // Altezza di riferimento per la riga Recettività (icona + testo + barra allineati)
  const RECETTIVITA_ROW_HEIGHT = 16;

  return (
    <Div ref={cardRef} style={{
      width: CARD_WIDTH,
      background: 'linear-gradient(180deg, #1a0e2e 0%, #140a26 100%)',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
      boxSizing: 'border-box',
    }}>
      {/* ─── Banner ─── */}
      <Div style={{ height: 80, position: 'relative', background: bannerGradient }}>
        <Div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.2, background: 'radial-gradient(circle at 30% 20%, white, transparent 60%)' }} />

        {/* Platform badge */}
        <Div style={{
          position: 'absolute', top: 8, left: 10,
          height: PLATFORM_BADGE_HEIGHT,
          padding: '0 10px', borderRadius: 999,
          background: 'rgba(0,0,0,0.35)', color: '#fff',
          fontSize: 10, fontWeight: 700, textAlign: 'center',
          whiteSpace: 'nowrap', boxSizing: 'border-box',
          overflow: 'hidden',
        }}>
          <Span style={{
            display: 'block',
            lineHeight: `${PLATFORM_BADGE_HEIGHT}px`,
            transform: `translateY(${BADGE_TEXT_OFFSET}px)`,
          }}>
            {isTikTok ? '♪ TikTok' : 'IG'}
          </Span>
        </Div>

        {/* Profile photo */}
        <Div style={{
          position: 'absolute', bottom: AVATAR_BOTTOM, left: AVATAR_LEFT,
          width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: '50%',
          boxSizing: 'border-box',
          border: `${AVATAR_BORDER}px solid rgba(236,72,153,0.3)`,
          background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(196,181,253,0.15))',
          overflow: 'hidden',
        }}>
          <Span style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'block', textAlign: 'center',
            lineHeight: `${AVATAR_INNER}px`,
            fontSize: 20, fontWeight: 700, color: '#f9a8d4',
          }}>
            {initials(displayName)}
          </Span>
          {photoUrl && (
            <Img
              src={photoUrl}
              onLoad={() => setImgLoaded(true)}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center',
                borderRadius: '50%',
                opacity: imgLoaded ? 1 : 0,
              }} />
          )}
        </Div>
      </Div>

      {/* ─── Body ─── */}
      <Div style={{ padding: `${BODY_PADDING_TOP}px 20px 16px`, boxSizing: 'border-box' }}>
        {/* Name + handle */}
        <Div style={{ textAlign: 'center', marginBottom: 10 }}>
          <Span style={{
            display: 'block',
            fontSize: 17,
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: '26px',
            paddingTop: 2,
            overflow: 'visible',
            whiteSpace: 'nowrap',
          }}>
            {displayName}
          </Span>

          {handleDisplay && (
            <Div style={{ marginTop: 4 }}>
              {/* Icona IG/TikTok — HANDLE_ICON_OFFSET la abbassa rispetto al testo accanto */}
              <Span style={{
                display: 'inline-block', verticalAlign: 'middle', lineHeight: 0,
                transform: `translateY(${HANDLE_ICON_OFFSET}px)`,
              }}>
                {isTikTok
                  ? <TikTokSvg size={12} color="#fe2c55" />
                  : <InstagramSvg size={12} color="#f472b6" />
                }
              </Span>
              <Span style={{ display: 'inline-block', verticalAlign: 'middle', fontSize: 12, color: '#f472b6', lineHeight: '16px', paddingLeft: 4 }}>
                @{handleDisplay}
              </Span>
            </Div>
          )}
        </Div>

        {/* Status + date badges */}
        <Div style={{ textAlign: 'center', marginBottom: 12 }}>
          {showStatusBadge && (
            <Span style={{
              display: 'inline-block',
              height: BADGE_HEIGHT,
              padding: '0 12px', borderRadius: 999,
              background: statusMeta.bg, color: statusMeta.color, border: `1px solid ${statusMeta.border}`,
              fontSize: 10, fontWeight: 600, textAlign: 'center',
              whiteSpace: 'nowrap', boxSizing: 'border-box',
              marginRight: 6, verticalAlign: 'middle', overflow: 'hidden',
            }}>
              <Span style={{
                display: 'block',
                lineHeight: `${BADGE_HEIGHT}px`,
                transform: `translateY(${BADGE_TEXT_OFFSET}px)`,
              }}>
                {statusMeta.label}
              </Span>
            </Span>
          )}
          {createdDate && (
            <Span style={{
              display: 'inline-block',
              height: BADGE_HEIGHT,
              padding: '0 12px', borderRadius: 999,
              background: 'rgba(139,92,246,0.15)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.3)',
              fontSize: 10, fontWeight: 600, textAlign: 'center',
              whiteSpace: 'nowrap', boxSizing: 'border-box',
              verticalAlign: 'middle', overflow: 'hidden',
            }}>
              <Span style={{
                display: 'block',
                lineHeight: `${BADGE_HEIGHT}px`,
                transform: `translateY(${BADGE_TEXT_OFFSET}px)`,
              }}>
                📅 {createdDate}
              </Span>
            </Span>
          )}
        </Div>

        {/* AI info chips */}
        {hasAiData && (
          <Div style={{ marginBottom: 10 }}>
            {displayAge > 0 && (
              <InfoChip icon="📅" color="#60a5fa">{displayAge} anni</InfoChip>
            )}
            {(semina?.provenienza || ai.zona) && (
              <InfoChip icon="📍" color="#34d399">{capitalize(semina?.provenienza || ai.zona)}</InfoChip>
            )}
            {ai.usual_promoter && (
              <InfoChip icon="👤" color="#fbbf24">
                <Span style={{ color: 'rgba(255,255,255,0.55)' }}>Entra con </Span>{capitalize(ai.usual_promoter)}
              </InfoChip>
            )}
            {ai.work?.role && (
              <InfoChip icon="💼" color="#22d3ee">{capitalize(ai.work.role)}</InfoChip>
            )}
            {ai.study?.school && (
              <InfoChip icon="🎓" color="#818cf8">{capitalize(ai.study.school)}</InfoChip>
            )}
            {ai.venues_attended?.length > 0 && (
              <InfoChip icon="🎶" color="#f472b6">
                <Span style={{ color: 'rgba(255,255,255,0.55)' }}>Frequenta </Span>{ai.venues_attended.map(capitalize).join(', ')}
              </InfoChip>
            )}
            {ai.invited_events?.length > 0 && (
              <InfoChip icon="✨" color="#a78bfa">
                <Span style={{ color: 'rgba(255,255,255,0.55)' }}>Invitata al </Span>{ai.invited_events.map(capitalize).join(', ')}
              </InfoChip>
            )}
            {ai.is_driver && (
              <InfoChip icon="🚗" color="#f97316">
                <Span style={{ color: 'rgba(255,255,255,0.55)' }}>Guidatrice</Span>
              </InfoChip>
            )}
          </Div>
        )}

        {/* Note — icona e testo con offset indipendenti (NOTES_ICON_OFFSET / NOTES_TEXT_OFFSET)
            per compensare i metrics diversi tra emoji e testo */}
        {semina?.notes && (
          <Div style={{
            padding: '8px 12px', borderRadius: 10, marginBottom: 10,
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
            boxSizing: 'border-box',
          }}>
            <Span style={{ display: 'inline-block', verticalAlign: 'top', fontSize: 12, lineHeight: '16px', overflow: 'hidden' }}>
              <Span style={{ display: 'block', transform: `translateY(${NOTES_ICON_OFFSET}px)` }}>📝</Span>
            </Span>
            <Span style={{ display: 'inline-block', verticalAlign: 'top', fontSize: 11, color: 'rgba(254,243,199,0.9)', lineHeight: '15px', paddingLeft: 6, maxWidth: 248, overflow: 'hidden' }}>
              <Span style={{ display: 'block', transform: `translateY(${NOTES_TEXT_OFFSET}px)` }}>{semina.notes}</Span>
            </Span>
          </Div>
        )}

        {/* Recettivita — icona, testo e barra allineati sulla stessa altezza di riga
            (RECETTIVITA_ROW_HEIGHT), con correzione fine indipendente per testo
            (RECETTIVITA_TEXT_OFFSET) e barra (RECETTIVITA_BAR_OFFSET) */}
        {semina?.recettivita != null && semina.recettivita > 0 && (
          <Table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10, tableLayout: 'fixed' }}>
            <Tbody>
              <Tr>
                <Td style={{ width: 24, height: RECETTIVITA_ROW_HEIGHT, textAlign: 'center', fontSize: 13, overflow: 'hidden' }}>
                  <Span style={{ display: 'block', lineHeight: `${RECETTIVITA_ROW_HEIGHT}px`, transform: `translateY(${RECETTIVITA_TEXT_OFFSET}px)` }}>
                    🔥
                  </Span>
                </Td>
                <Td style={{ width: 110, height: RECETTIVITA_ROW_HEIGHT, fontSize: 11, color: '#c4b5fd', fontWeight: 600, whiteSpace: 'nowrap', paddingRight: 10, overflow: 'hidden' }}>
                  <Span style={{ display: 'block', lineHeight: `${RECETTIVITA_ROW_HEIGHT}px`, transform: `translateY(${RECETTIVITA_TEXT_OFFSET}px)` }}>
                    Recettività: {semina.recettivita}/3
                  </Span>
                </Td>
                <Td style={{ height: RECETTIVITA_ROW_HEIGHT, position: 'relative' }}>
                  <Div style={{
                    position: 'absolute', top: '50%', left: 0, right: 0,
                    transform: `translateY(calc(-50% + ${RECETTIVITA_BAR_OFFSET}px))`,
                    height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.12)', overflow: 'hidden',
                  }}>
                    <Div style={{
                      width: `${(semina.recettivita / 3) * 100}%`, height: 5,
                      background: 'linear-gradient(90deg, #a78bfa, #ec4899)', borderRadius: 3,
                    }} />
                  </Div>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        )}
      </Div>

      {/* ─── Footer ─── */}
      <Div style={{ padding: '0 20px 16px', boxSizing: 'border-box' }}>
        <Div style={{ textAlign: 'center', marginBottom: 10 }}>
          <Span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 500, lineHeight: '14px' }}>
            {format(new Date(), 'd MMM yyyy', { locale: it })}
          </Span>
        </Div>
        {vibraLogo && (
          <Div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
            <Table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
              <Tbody>
                <Tr>
                  <Td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <Img
                      src={vibraLogo}
                      style={{ height: 44, objectFit: 'contain', display: 'block' }}
                      alt="Vibra" />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Div>
        )}
      </Div>
    </Div>
  );
}