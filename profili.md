
## Profilo JS scorrimento

177568 campioni (uno ogni ~10.9 ms), 1 cambi di tab segnati; finestra 600 ms dopo il rilascio

- rilascio a 273.5 s: JS occupato 119 ms su 600 (ultimo campione occupato a 545 ms)

### Funzioni (inclusivo: la funzione o chi ha chiamato), 11 campioni occupati

| campioni | % | funzione |
|---|---|---|
| 9 | 82 | `:7908` |
| 9 | 82 | `performWorkOnRoot:11663` |
| 9 | 82 | `flushSyncWorkAcrossRoots_impl:7811` |
| 9 | 82 | `processRootScheduleInMicrotask:7837` |
| 6 | 55 | `beginWork:10298` |
| 6 | 55 | `workLoopSync:11900` |
| 6 | 55 | `renderRootSync:11851` |
| 4 | 36 | `bailoutOnAlreadyFinishedWork:10228` |
| 4 | 36 | `propagateParentContextChanges:7703` |
| 3 | 27 | `propagateContextChanges:7657` |
| 3 | 27 | `commitRoot:12086` |
| 2 | 18 | `updateMemoComponent:9847` |
| 2 | 18 | `updateSimpleMemoComponent:9869` |
| 2 | 18 | `commitMutationEffectsOnFiber:11144` |
| 2 | 18 | `flushMutationEffects:12126` |
| 2 | 18 | `[HostFunction] completeRoot` |
| 1 | 9 | `[Native] hermesBuiltinCopyDataProperties` |
| 1 | 9 | `finishClassComponent:10020` |
| 1 | 9 | `updateClassComponent:9975` |
| 1 | 9 | `render:52679` |
| 1 | 9 | `:35945` |
| 1 | 9 | `[HostFunction] addAnimatedEventToView` |
| 1 | 9 | `recursivelyTraverseLayoutEffects:11241` |
| 1 | 9 | `:34013` |
| 1 | 9 | `:32486` |
| 1 | 9 | `addAnimatedEventToView:32507` |
| 1 | 9 | `__attach:34050` |
| 1 | 9 | `:35946` |
| 1 | 9 | `safelyAttachRef:10848` |
| 1 | 9 | `commitLayoutEffectOnFiber:10956` |
| 1 | 9 | `[Native] hermesBuiltinApply` |
| 1 | 9 | `[Native] arrayPrototypeForEach` |
| 1 | 9 | `[Native] arrayPrototypeMap` |
| 1 | 9 | `:35685` |
| 1 | 9 | `flushLayoutEffects:12149` |
| 1 | 9 | `:35567` |
| 1 | 9 | `attachNativeEventImpl:33991` |
| 1 | 9 | `reconcileChildFibersImpl:8256` |
| 1 | 9 | `:8328` |
| 1 | 9 | `` |
| 1 | 9 | `step` |
| 1 | 9 | `tryCallOne` |
| 1 | 9 | `[HostFunction] requestAnimationFrame` |
| 1 | 9 | `[HostFunction] RN$rafFn` |
| 1 | 9 | `onFrame:174878` |

### In cima allo stack (esclusivo)

| campioni | % | funzione |
|---|---|---|
| 3 | 27 | `propagateContextChanges:7657` |
| 2 | 18 | `[HostFunction] completeRoot` |
| 1 | 9 | `[Native] hermesBuiltinCopyDataProperties` |
| 1 | 9 | `[HostFunction] addAnimatedEventToView` |
| 1 | 9 | `propagateParentContextChanges:7703` |
| 1 | 9 | `reconcileChildFibersImpl:8256` |
| 1 | 9 | `` |
| 1 | 9 | `[HostFunction] requestAnimationFrame` |
