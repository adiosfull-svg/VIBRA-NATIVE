// Port di src/hooks/use-mobile.jsx (convertito da scripts/port/codemod.mjs).
import * as React from "react"

import { win as webWindow } from '@/web/shims/dom';

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // PORT: valore giusto già al primo disegno (innerWidth legge Dimensions in modo sincrono). Con
  // useState(undefined) + effect il primo disegno montava le versioni desktop (es. le PromoterCard, ~57
  // elementi l'una) poi sostituite dalle mobile.
  const [isMobile, setIsMobile] = React.useState(() => webWindow.innerWidth < MOBILE_BREAKPOINT)

  React.useEffect(() => {
    const mql = webWindow.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(webWindow.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // lo shim emette resize quando cambiano le Dimensions (matchMedia è finto)
    webWindow.addEventListener("resize", onChange)
    onChange()
    return () => { mql.removeEventListener("change", onChange); webWindow.removeEventListener("resize", onChange); };
  }, [])

  return !!isMobile
}
