// Port di src/components/ilmiovibra/PromoterRecordShareCard.jsx (convertito da scripts/port/codemod.mjs).
import React, { useEffect, useState } from 'react';
import useCachedImage from '@/web/hooks/useCachedImage';
import { useVibraLogo } from '@/web/hooks/useVibraLogo';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

import { Div, Span } from '@/ui/html';
import { Img, Table, Tbody, Td, Tr } from '@/ui/elements';

/**
 * Scheda "Promoter Record" per la condivisione (html2canvas → navigator.share).
 *
 * Layout interamente con inline style + tabelle + altezze/line-height fisse
 * e translateY offset per ogni elemento.
 *
 * Gli offset e le altezze dei contenitori sono concentrati all'inizio
 * del file per facilitare la regolazione manuale del rendering.
 */

// ─────────────────────────────────────────────────────────────────────────────
// OFFSET GLOBALI DI CENTRATURA VERTICALE
// ─────────────────────────────────────────────────────────────────────────────

const O = {
  // Header
  headerLabel: 2,
  promoterName: -7,
  badgeText: -8,
  prPointsText: -5,

  // Promoter da / achievements
  promoterSinceText: -7,
  achEmoji: 0,
  achText: -6,

  // Stat tile
  tileEmoji: 0,
  tileLabel: 0,
  tileValue: -10,
  tileSub: -14,

  // Banner Vibra VS
  vsIcon: -8,
  vsLabel: -3,
  vsValue: -4,
  vsSuffix: 0,

  // Sezione Streak
  sectionTitleEmoji: 0,
  sectionTitleText: -6,
  streakEmoji: -2,
  streakRowLabel: -2,
  streakRecordBadge: -2,
  streakRecordValue: 0,
  streakRecordLabel: -2,
  streakCurrentValue: -2,

  // Footer
  footerText: -5,
  footerLogo: 0,

  // Avatar
  avatarInitials: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// ALTEZZE DEI CONTENITORI REGOLABILI
// ─────────────────────────────────────────────────────────────────────────────

// Altezza contenitore nome promoter
const NAME_H = 45;

// Altezza contenitore dei valori centrali
const TILE_VALUE_H = 40;

// Altezza contenitore del testo sotto il valore
const TILE_SUB_H = 20;

// Altezza comune di tutte le 4 StatBox
const TILE_H = 112;

// ─────────────────────────────────────────────────────────────────────────────

const CARD_WIDTH = 380;
const CARD_PAD = 20;
const INNER = CARD_WIDTH - CARD_PAD * 2;

const initials = (name) => {
  if (!name) return '?';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
};

const fmtEuro = (v) =>
  `€${Number(v || 0).toLocaleString('it-IT')}`;

// ─────────────────────────────────────────────────────────────────────────────
// PILL
// ─────────────────────────────────────────────────────────────────────────────

function Pill({
  children,
  bg,
  color,
  border,
  height = 22,
  offset = O.badgeText,
  fontWeight = 700,
  fontSize = 10,
  paddingLeft = 10,
  paddingRight = 10,
}) {
  return (
    <Span
      style={{
        display: 'inline-block',
        height,
        paddingLeft,
        paddingRight,
        borderRadius: 999,
        background: bg,
        color,
        border: `1px solid ${border}`,
        fontSize,
        fontWeight,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        verticalAlign: 'middle',
        overflow: 'visible',
      }}
    >
      <Span
        style={{
          display: 'block',
          lineHeight: `${height}px`,
          transform: `translateY(${offset}px)`,
          overflow: 'visible',
        }}
      >
        {children}
      </Span>
    </Span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RIGA DI TESTO CENTRATA
// ─────────────────────────────────────────────────────────────────────────────

function CenteredRow({
  height,
  offset,
  style,
  children,
}) {
  return (
    <Span
      style={{
        display: 'block',
        lineHeight: `${height}px`,
        transform: `translateY(${offset}px)`,
        overflow: 'visible',
        ...style,
      }}
    >
      {children}
    </Span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT BOX
// ─────────────────────────────────────────────────────────────────────────────

function StatBox({
  emoji,
  emojiColor,
  label,
  value,
  sub,
  accent,
}) {
  const ROW_H = 22;

  return (
    <Div
      style={{
        height: TILE_H,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 10,
        border: '1px solid rgba(255,255,255,0.06)',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          opacity: 0.6,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* ICONA + LABEL                                                   */}
      {/* ─────────────────────────────────────────────────────────────── */}

      <Table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          marginBottom: 6,
        }}
      >
        <Tbody>
          <Tr>
            <Td
              style={{
                width: 22,
                height: ROW_H,
                textAlign: 'center',
                fontSize: 13,
                color: emojiColor,
                padding: 0,
                overflow: 'visible',
              }}
            >
              <CenteredRow
                height={ROW_H}
                offset={O.tileEmoji}
              >
                {emoji}
              </CenteredRow>
            </Td>

            <Td
              style={{
                height: ROW_H,
                fontSize: 9,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                paddingLeft: 6,
                overflow: 'visible',
              }}
            >
              <CenteredRow
                height={ROW_H}
                offset={O.tileLabel}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {label}
              </CenteredRow>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* VALORE CENTRALE                                                 */}
      {/* ─────────────────────────────────────────────────────────────── */}

      <Div
        style={{
          height: TILE_VALUE_H,
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Span
          style={{
            display: 'block',
            height: TILE_VALUE_H,
            lineHeight: `${TILE_VALUE_H}px`,
            fontSize: 19,
            fontWeight: 800,
            color: accent,
            transform: `translateY(${O.tileValue}px)`,
            whiteSpace: 'nowrap',
            overflow: 'visible',
            boxSizing: 'border-box',
          }}
        >
          {value}
        </Span>
      </Div>

      {/* ─────────────────────────────────────────────────────────────── */}
      {/* TESTO SECONDARIO                                                */}
      {/* ─────────────────────────────────────────────────────────────── */}

      {sub && (
        <Div
          style={{
            height: TILE_SUB_H,
            position: 'relative',
            overflow: 'visible',
            marginTop: 2,
          }}
        >
          <Span
            style={{
              display: 'block',
              height: TILE_SUB_H,
              lineHeight: `${TILE_SUB_H}px`,
              fontSize: 9,
              color: 'rgba(255,255,255,0.45)',
              transform: `translateY(${O.tileSub}px)`,
              whiteSpace: 'nowrap',
              overflow: 'visible',
              boxSizing: 'border-box',
            }}
          >
            {sub}
          </Span>
        </Div>
      )}
    </Div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RIGA STREAK
// ─────────────────────────────────────────────────────────────────────────────

function StreakRowShare({
  emoji,
  label,
  current,
  record,
  accent,
  isRecord,
}) {
  const ROW_H = 18;
  const RECORD_H = 28;

  const pct =
    record > 0
      ? Math.min(
          100,
          Math.round((current / record) * 100)
        )
      : current > 0
        ? 100
        : 0;

  return (
    <Div style={{ marginBottom: 10 }}>
      {/* Riga 1: emoji + label + badge RECORD */}
      <Table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          marginBottom: 2,
        }}
      >
        <Tbody>
          <Tr>
            <Td
              style={{
                width: 18,
                height: ROW_H,
                textAlign: 'center',
                fontSize: 12,
                padding: 0,
                overflow: 'visible',
              }}
            >
              <CenteredRow height={ROW_H} offset={O.streakEmoji}>
                {emoji}
              </CenteredRow>
            </Td>

            <Td
              style={{
                height: ROW_H,
                fontSize: 11,
                fontWeight: 600,
                color: '#ffffff',
                paddingRight: 6,
                overflow: 'visible',
              }}
            >
              <CenteredRow
                height={ROW_H}
                offset={O.streakRowLabel}
                style={{ whiteSpace: 'nowrap', overflow: 'visible' }}
              >
                {label}
              </CenteredRow>
            </Td>

            {isRecord && (
              <Td
                style={{
                  width: 52,
                  height: ROW_H,
                  overflow: 'visible',
                }}
              >
                <CenteredRow
                  height={ROW_H}
                  offset={O.streakRecordBadge}
                  style={{
                    fontSize: 8,
                    fontWeight: 800,
                    color: '#34d399',
                    textAlign: 'center',
                  }}
                >
                  RECORD!
                </CenteredRow>
              </Td>
            )}
          </Tr>
        </Tbody>
      </Table>

      {/* Riga 2: record grande + corrente a destra */}
      <Table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          marginBottom: 6,
        }}
      >
        <Tbody>
          <Tr>
            <Td
              style={{
                height: RECORD_H,
                padding: 0,
                overflow: 'visible',
                whiteSpace: 'nowrap',
              }}
            >
              <Span
                style={{
                  display: 'inline-block',
                  fontSize: 22,
                  fontWeight: 800,
                  color: accent,
                  lineHeight: `${RECORD_H}px`,
                  transform: `translateY(${O.streakRecordValue}px)`,
                }}
              >
                {record}
              </Span>
              <Span
                style={{
                  display: 'inline-block',
                  fontSize: 8,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'rgba(255,255,255,0.45)',
                  marginLeft: 4,
                  transform: `translateY(${O.streakRecordLabel}px)`,
                }}
              >
                record
              </Span>
            </Td>

            <Td
              style={{
                height: RECORD_H,
                textAlign: 'right',
                padding: 0,
                overflow: 'visible',
                whiteSpace: 'nowrap',
              }}
            >
              <CenteredRow
                height={RECORD_H}
                offset={O.streakCurrentValue}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                {current}{' '}
                <Span style={{ fontWeight: 400 }}>
                  attuali
                </Span>
              </CenteredRow>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      {/* Barra percentuale */}
      <Div
        style={{
          position: 'relative',
          width: '100%',
          height: 10,
          borderRadius: 5,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <Div
          style={{
            width: `${pct}%`,
            height: 10,
            borderRadius: 5,
            background: `linear-gradient(90deg, ${accent}cc, ${accent}66)`,
            boxShadow: `0 0 8px ${accent}80`,
          }}
        />
      </Div>
    </Div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function PromoterRecordShareCard({
  promoter,
  records,
  rank,
  cardRef,
}) {
  const photoUrl = useCachedImage(
    promoter?.photo_url || ''
  );

  const { logoDataUrl: vibraLogo } = useVibraLogo();

  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
  }, [photoUrl]);

  const accent = rank?.color || '#a78bfa';
  const name = promoter?.name || 'Promoter';

  const tablesIsRecord =
    (records?.tablesStreakCurrent ?? 0) > 0 &&
    (records?.tablesStreakCurrent ?? 0) ===
      (records?.tablesStreakRecord ?? 0) &&
    (records?.tablesStreakRecord ?? 0) > 0;

  const revIsRecord =
    (records?.revenueStreakCurrent ?? 0) > 0 &&
    (records?.revenueStreakCurrent ?? 0) ===
      (records?.revenueStreakRecord ?? 0) &&
    (records?.revenueStreakRecord ?? 0) > 0;

  const vsIsRecord =
    (records?.vibraVsStreakCurrent ?? 0) > 0 &&
    (records?.vibraVsStreakCurrent ?? 0) ===
      (records?.vibraVsStreakRecord ?? 0) &&
    (records?.vibraVsStreakRecord ?? 0) > 0;

  const AVATAR_SIZE = 68;
  const HEADER_LABEL_H = 14;
  const PR_H = 22;

  return (
    <Div
      ref={cardRef}
      style={{
        width: CARD_WIDTH,
        background:
          'linear-gradient(135deg, #140a26 0%, #2a1551 45%, #1a0e36 100%)',
        borderRadius: 20,
        padding: CARD_PAD,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Accent top */}
      <Div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Decorazione superiore */}
      <Div
        style={{
          position: 'absolute',
          top: -48,
          right: -48,
          width: 128,
          height: 128,
          borderRadius: '50%',
          background: `${accent}0d`,
        }}
      />

      {/* Decorazione inferiore */}
      <Div
        style={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: `${accent}0a`,
        }}
      />

      {/* Glow */}
      <Div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.06,
          background: `radial-gradient(ellipse at 50% -20%, ${accent}, transparent 70%)`,
        }}
      />

      <Div style={{ position: 'relative' }}>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* HEADER                                                        */}
        {/* ───────────────────────────────────────────────────────────── */}

        <Table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            marginBottom: 14,
          }}
        >
          <Tbody>
            <Tr>
              {/* Avatar */}
              <Td
                style={{
                  width: AVATAR_SIZE + 14,
                  verticalAlign: 'top',
                  padding: 0,
                }}
              >
                <Div
                  style={{
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
                    border: `1px solid ${accent}55`,
                    boxSizing: 'border-box',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `0 6px 24px -6px ${accent}88`,
                  }}
                >
                  <Span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      fontWeight: 800,
                      color: accent,
                    }}
                  >
                    <Span
                      style={{
                        display: 'block',
                        transform: `translateY(${O.avatarInitials}px)`,
                      }}
                    >
                      {initials(name)}
                    </Span>
                  </Span>

                  {photoUrl && (
                    <Img
                      src={photoUrl}
                      onLoad={() => setImgLoaded(true)}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: imgLoaded ? 1 : 0,
                      }} />
                  )}
                </Div>
              </Td>

              {/* Testi header */}
              <Td
                style={{
                  verticalAlign: 'top',
                  padding: 0,
                  height: AVATAR_SIZE,
                  overflow: 'visible',
                }}
              >
                <Table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <Tbody>

                    {/* Label */}
                    <Tr>
                      <Td
                        style={{
                          height: HEADER_LABEL_H,
                          padding: 0,
                          overflow: 'visible',
                        }}
                      >
                        <CenteredRow
                          height={HEADER_LABEL_H}
                          offset={O.headerLabel}
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 1.5,
                            color: 'rgba(255,255,255,0.45)',
                          }}
                        >
                          La tua Card Record
                        </CenteredRow>
                      </Td>
                    </Tr>

                    {/* Nome */}
                    <Tr>
                      <Td
                        style={{
                          height: NAME_H,
                          padding: 0,
                          overflow: 'visible',
                        }}
                      >
                        <CenteredRow
                          height={NAME_H}
                          offset={O.promoterName}
                          style={{
                            maxWidth:
                              INNER - AVATAR_SIZE - 14,
                            overflow: 'visible',
                          }}
                        >
                          <Span
                            style={{
                              display: 'block',
                              width: '100%',
                              height: NAME_H,
                              lineHeight: `${NAME_H}px`,
                              fontSize: 20,
                              fontWeight: 800,
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              boxSizing: 'border-box',
                            }}
                          >
                            {name}
                          </Span>
                        </CenteredRow>
                      </Td>
                    </Tr>

                    {/* Rank */}
                    <Tr>
                      <Td
                        style={{
                          paddingTop: 8,
                          padding: 0,
                        }}
                      >
                        <Div style={{ paddingTop: 8 }}>
                          {rank && (
                            <Pill
                              bg={`${accent}12`}
                              color={accent}
                              border={`${accent}40`}
                              height={22}
                              offset={O.badgeText}
                            >
                              <Span style={{ fontSize: 13 }}>
                                {rank.emoji}
                              </Span>{' '}
                              {rank.label}
                            </Pill>
                          )}

                          {rank && (
                            <Span
                              style={{
                                display: 'inline-block',
                                height: PR_H,
                                fontSize: 10,
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.5)',
                                marginLeft: 8,
                                verticalAlign: 'middle',
                                overflow: 'hidden',
                              }}
                            >
                              <CenteredRow
                                height={PR_H}
                                offset={O.prPointsText}
                              >
                                {rank.prPoints.toLocaleString(
                                  'it-IT'
                                )}{' '}
                                PR
                              </CenteredRow>
                            </Span>
                          )}
                        </Div>
                      </Td>
                    </Tr>

                  </Tbody>
                </Table>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* PROMOTER DA / ACHIEVEMENTS                                   */}
        {/* ───────────────────────────────────────────────────────────── */}

        {records?.promoterSinceLabel && (
          <Table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              marginBottom: 14,
            }}
          >
            <Tbody>
              <Tr>
                <Td
                  style={{
                    height: 18,
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.55)',
                    padding: 0,
                    overflow: 'visible',
                  }}
                >
                  <CenteredRow
                    height={18}
                    offset={O.promoterSinceText}
                  >
                    📅 Promoter da{' '}
                    <Span
                      style={{
                        fontWeight: 700,
                        color: '#ffffff',
                      }}
                    >
                      {records.promoterSinceLabel}
                    </Span>
                  </CenteredRow>
                </Td>

                {records?.achievementsTotal > 0 && (
                  <Td
                    style={{
                      width: 90,
                      height: 18,
                      textAlign: 'right',
                      fontSize: 11,
                      padding: 0,
                      overflow: 'visible',
                    }}
                  >
                    <CenteredRow
                      height={18}
                      offset={O.achText}
                    >
                      <Span
                        style={{
                          transform: `translateY(${O.achEmoji}px)`,
                          display: 'inline-block',
                        }}
                      >
                        🏆
                      </Span>{' '}
                      <Span
                        style={{
                          fontWeight: 700,
                          color: accent,
                        }}
                      >
                        {records.achievementsUnlocked}
                      </Span>
                      <Span
                        style={{
                          color: 'rgba(255,255,255,0.45)',
                        }}
                      >
                        {' / '}
                        {records.achievementsTotal} ach
                      </Span>
                    </CenteredRow>
                  </Td>
                )}
              </Tr>
            </Tbody>
          </Table>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STATISTICHE 2x2                                               */}
        {/* ───────────────────────────────────────────────────────────── */}

        <Table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 0',
            tableLayout: 'fixed',
            marginBottom: 10,
          }}
        >
          <Tbody>
            <Tr>
              <Td
                style={{
                  width: '50%',
                  padding: 0,
                  paddingRight: 5,
                  verticalAlign: 'top',
                }}
              >
                <StatBox
                  emoji="💰"
                  emojiColor="#a78bfa"
                  label="Fatturato Totale"
                  value={fmtEuro(records?.totalRevenue)}
                  accent="#a78bfa"
                />
              </Td>

              <Td
                style={{
                  width: '50%',
                  padding: 0,
                  paddingLeft: 5,
                  verticalAlign: 'top',
                }}
              >
                <StatBox
                  emoji="👑"
                  emojiColor="#fbbf24"
                  label="Top Serata"
                  value={
                    records?.topEvent
                      ? fmtEuro(records.topEvent.revenue)
                      : '—'
                  }
                  sub={
                    records?.topEvent
                      ? records.topEvent.name
                      : undefined
                  }
                  accent="#fbbf24"
                />
              </Td>
            </Tr>

            {/* SPAZIO TRA LE DUE RIGHE */}
            <Tr>
              <Td
                colSpan={2}
                style={{
                  height: 14,
                  padding: 0,
                  lineHeight: 0,
                  fontSize: 0,
                }}
              />
            </Tr>

            <Tr>
              <Td
                style={{
                  width: '50%',
                  padding: 0,
                  paddingRight: 5,
                  verticalAlign: 'top',
                }}
              >
                <StatBox
                  emoji="👥"
                  emojiColor="#34d399"
                  label="Clienti"
                  value={String(
                    records?.totalClients ?? 0
                  )}
                  accent="#34d399"
                />
              </Td>

              <Td
                style={{
                  width: '50%',
                  padding: 0,
                  paddingLeft: 5,
                  verticalAlign: 'top',
                }}
              >
                <StatBox
                  emoji="🪑"
                  emojiColor="#60a5fa"
                  label="Tavoli Totali"
                  value={String(
                    Math.round(records?.totalTables ?? 0)
                  )}
                  accent="#60a5fa"
                />
              </Td>
            </Tr>
          </Tbody>
        </Table>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* VIBRA VS                                                       */}
        {/* ───────────────────────────────────────────────────────────── */}

        <Div
          style={{
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            boxSizing: 'border-box',
            border: `1px solid ${accent}30`,
            background: `linear-gradient(135deg, ${accent}14, ${accent}06)`,
          }}
        >
          <Table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
            }}
          >
            <Tbody>
              <Tr>
                <Td
                  style={{
                    width: 40,
                    height: 40,
                    verticalAlign: 'middle',
                    padding: 0,
                  }}
                >
                  <Div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `${accent}1a`,
                      textAlign: 'center',
                      fontSize: 20,
                      overflow: 'hidden',
                    }}
                  >
                    <CenteredRow
                      height={40}
                      offset={O.vsIcon}
                    >
                      ⚔️
                    </CenteredRow>
                  </Div>
                </Td>

                <Td
                  style={{
                    verticalAlign: 'middle',
                    padding: 0,
                    paddingLeft: 12,
                  }}
                >
                  <Table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                    }}
                  >
                    <Tbody>
                      <Tr>
                        <Td
                          style={{
                            height: 13,
                            padding: 0,
                            overflow: 'hidden',
                          }}
                        >
                          <CenteredRow
                            height={13}
                            offset={O.vsLabel}
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                              color:
                                'rgba(255,255,255,0.5)',
                            }}
                          >
                            Vibra VS — Vittorie settimanali
                          </CenteredRow>
                        </Td>
                      </Tr>

                      <Tr>
                        <Td
                          style={{
                            height: 26,
                            paddingTop: 2,
                            padding: 0,
                            overflow: 'hidden',
                          }}
                        >
                          <CenteredRow
                            height={26}
                            offset={O.vsValue}
                            style={{
                              fontSize: 22,
                              fontWeight: 800,
                              color: accent,
                            }}
                          >
                            {records?.vibraVsWins ?? 0}

                            <Span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color:
                                  'rgba(255,255,255,0.5)',
                                marginLeft: 6,
                                display: 'inline-block',
                                transform: `translateY(${O.vsSuffix}px)`,
                              }}
                            >
                              {(records?.vibraVsWins ?? 0) ===
                              1
                                ? 'vittoria'
                                : 'vittorie'}
                            </Span>
                          </CenteredRow>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* STREAK RECORD                                                  */}
        {/* ───────────────────────────────────────────────────────────── */}

        <Div
          style={{
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            border:
              '1px solid rgba(255,255,255,0.06)',
            background:
              'rgba(255,255,255,0.02)',
            boxSizing: 'border-box',
          }}
        >
          <Div
            style={{
              height: 14,
              marginBottom: 10,
              overflow: 'hidden',
            }}
          >
            <CenteredRow
              height={14}
              offset={O.sectionTitleText}
              style={{
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <Span
                style={{
                  display: 'inline-block',
                  transform: `translateY(${O.sectionTitleEmoji}px)`,
                }}
              >
                🔥
              </Span>{' '}
              Streak Record
            </CenteredRow>
          </Div>

          <StreakRowShare
            emoji="🪑"
            label="Tavoli consecutivi"
            current={
              records?.tablesStreakCurrent ?? 0
            }
            record={
              records?.tablesStreakRecord ?? 0
            }
            accent="#60a5fa"
            isRecord={tablesIsRecord}
          />

          <Div style={{ height: 2 }} />

          <StreakRowShare
            emoji="📈"
            label="Serate con fatturato"
            current={
              records?.revenueStreakCurrent ?? 0
            }
            record={
              records?.revenueStreakRecord ?? 0
            }
            accent="#a78bfa"
            isRecord={revIsRecord}
          />

          <Div style={{ height: 2 }} />

          <StreakRowShare
            emoji="⚔️"
            label="Vibra VS vinti di fila"
            current={
              records?.vibraVsStreakCurrent ?? 0
            }
            record={
              records?.vibraVsStreakRecord ?? 0
            }
            accent={accent}
            isRecord={vsIsRecord}
          />
        </Div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* FOOTER                                                        */}
        {/* ───────────────────────────────────────────────────────────── */}

        <Table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
        >
          <Tbody>
            <Tr>
              <Td
                style={{
                  height: 16,
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 500,
                  padding: 0,
                  overflow: 'visible',
                }}
              >
                <CenteredRow
                  height={16}
                  offset={O.footerText}
                >
                  {format(
                    new Date(),
                    'd MMM yyyy',
                    { locale: it }
                  )}
                </CenteredRow>
              </Td>

              <Td
                style={{
                  height: 26,
                  textAlign: 'right',
                  padding: 0,
                }}
              >
                {vibraLogo && (
                  <Img
                    src={vibraLogo}
                    style={{
                      height: 36,
                      objectFit: 'contain',
                      display: 'inline-block',
                      transform: `translateY(${O.footerLogo}px)`,
                    }}
                    alt="Vibra" />
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Div>
    </Div>
  );
}