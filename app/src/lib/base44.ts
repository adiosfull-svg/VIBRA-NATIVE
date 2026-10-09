// Oggetto `base44` usato da tutto il codice portato (base44.entities.X.filter(...),
// base44.functions.invoke(...), base44.integrations.Core...), identico all'app web originale.
//  - default: il vero backend Base44 (base44Remote.ts), in sola lettura finché non si toglie la modalità prova;
//  - EXPO_PUBLIC_BACKEND=local: stack di prova con dati sintetici (localBackend.ts), per i confronti grafici.
import { BACKEND } from './backend';

// Tipo: quello dell'adattatore di prova, che ricalca l'interfaccia dello SDK usata dall'app.
type Base44 = typeof import('./localBackend').localBase44;

/* eslint-disable @typescript-eslint/no-require-imports */
export const base44: Base44 = BACKEND === 'local'
  ? require('./localBackend').localBase44
  : require('./base44Remote').remoteBase44;
