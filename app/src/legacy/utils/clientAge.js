/**
 * Calcola l'età di un cliente dalla sua data di nascita.
 * Supporta due formati:
 * - "YYYY-MM-DD" → età precisa
 * - "YYYY" (solo anno) → range di due età possibili (es. "25/26 anni")
 *
 * @param {string} dataNascita - Data di nascita nel formato YYYY-MM-DD o YYYY
 * @returns {{ type: 'precise'|'range', label: string } | null}
 */
export function calculateAge(dataNascita) {
  if (!dataNascita) return null;
  const now = new Date();
  const currentYear = now.getFullYear();

  // Solo anno (4 cifre)
  if (/^\d{4}$/.test(dataNascita)) {
    const birthYear = parseInt(dataNascita, 10);
    if (birthYear < 1900 || birthYear > currentYear) return null;
    const age1 = currentYear - birthYear - 1;
    const age2 = currentYear - birthYear;
    return { type: 'range', min: age1, max: age2, label: `${age1}/${age2} anni` };
  }

  // Data completa YYYY-MM-DD
  const match = dataNascita.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const birthDate = new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
    let age = currentYear - birthDate.getFullYear();
    const thisYearBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (now < thisYearBirthday) age--;
    if (age < 0 || age > 120) return null;
    return { type: 'precise', age, label: `${age} anni` };
  }

  return null;
}