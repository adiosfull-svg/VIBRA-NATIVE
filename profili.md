
## Profilo JS scorrimento

60415 campioni (uno ogni ~10.6 ms), 1 cambi di tab segnati; finestra 600 ms dopo il rilascio

- rilascio a 281.1 s: JS occupato 127 ms su 600 (ultimo campione occupato a 270 ms)

### Funzioni (inclusivo: la funzione o chi ha chiamato), 12 campioni occupati

| campioni | % | funzione |
|---|---|---|
| 9 | 75 | `flushSyncWorkAcrossRoots_impl:7811` |
| 9 | 75 | `processRootScheduleInMicrotask:7837` |
| 9 | 75 | `:7908` |
| 9 | 75 | `performWorkOnRoot:11663` |
| 8 | 67 | `workLoopSync:11900` |
| 8 | 67 | `renderRootSync:11851` |
| 7 | 58 | `beginWork:10298` |
| 4 | 33 | `bailoutOnAlreadyFinishedWork:10228` |
| 3 | 25 | `updateMemoComponent:9847` |
| 3 | 25 | `propagateParentContextChanges:7703` |
| 3 | 25 | `renderWithHooks:8668` |
| 2 | 17 | `propagateContextChanges:7657` |
| 1 | 8 | `applyStyles:50418` |
| 1 | 8 | `metroRequire:38` |
| 1 | 8 | `:13123` |
| 1 | 8 | `reducer:50194` |
| 1 | 8 | `component:49429` |
| 1 | 8 | `interop:50172` |
| 1 | 8 | `_loop:50205` |
| 1 | 8 | `rerenderReducer:8903` |
| 1 | 8 | `get:96517` |
| 1 | 8 | `Screen:134532` |
| 1 | 8 | `useSafeAreaInsets:96645` |
| 1 | 8 | `completeUnitOfWork:12045` |
| 1 | 8 | `[HostFunction] appendChild` |
| 1 | 8 | `appendAllChildren:10435` |
| 1 | 8 | `_handleAnimatedStylesUpdate:52549` |
| 1 | 8 | `recursivelyTraverseLayoutEffects:11241` |
| 1 | 8 | `commitLayoutEffectOnFiber:10956` |
| 1 | 8 | `componentDidUpdate:52604` |
| 1 | 8 | `_updateAnimatedStylesAndProps:52600` |
| 1 | 8 | `commitHookEffectListMount:10776` |
| 1 | 8 | `recursivelyTraversePassiveMountEffects:11357` |
| 1 | 8 | `:241649` |
| 1 | 8 | `bindSharedValues:239787` |
| 1 | 8 | `reactNativeGestureHandler_reanimatedUtilsTs2Factory:239796` |
| 1 | 8 | `commitPassiveMountOnFiber:11360` |
| 1 | 8 | `TextImpl:30164` |
| 1 | 8 | `flushPassiveEffects:12219` |
| 1 | 8 | `flushSpawnedWork:12171` |
| 1 | 8 | `flushPendingEffects:12213` |
| 1 | 8 | `commitPassiveUnmountOnFiber:11510` |
| 1 | 8 | `commitRoot:12086` |
| 1 | 8 | `[Native] functionPrototypeApply` |
| 1 | 8 | `[HostFunction] configureRelations` |

### In cima allo stack (esclusivo)

| campioni | % | funzione |
|---|---|---|
| 2 | 17 | `propagateContextChanges:7657` |
| 1 | 8 | `propagateParentContextChanges:7703` |
| 1 | 8 | `metroRequire:38` |
| 1 | 8 | `get:96517` |
| 1 | 8 | `[HostFunction] appendChild` |
| 1 | 8 | `_handleAnimatedStylesUpdate:52549` |
| 1 | 8 | `reactNativeGestureHandler_reanimatedUtilsTs2Factory:239796` |
| 1 | 8 | `TextImpl:30164` |
| 1 | 8 | `commitPassiveUnmountOnFiber:11510` |
| 1 | 8 | `bailoutOnAlreadyFinishedWork:10228` |
| 1 | 8 | `[HostFunction] configureRelations` |
