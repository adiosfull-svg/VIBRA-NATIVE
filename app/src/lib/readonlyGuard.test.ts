import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readOnlyClient, ReadOnlyError } from './readonlyGuard.ts';

function fakeClient() {
  const calls: string[] = [];
  const entity = (name: string) => ({
    list: async () => { calls.push(`${name}.list`); return [1]; },
    filter: async () => { calls.push(`${name}.filter`); return [2]; },
    get: async () => { calls.push(`${name}.get`); return { id: 'x' }; },
    subscribe: () => { calls.push(`${name}.subscribe`); return () => {}; },
    create: async () => { calls.push(`${name}.create`); },
    update: async () => { calls.push(`${name}.update`); },
    delete: async () => { calls.push(`${name}.delete`); },
    bulkCreate: async () => { calls.push(`${name}.bulkCreate`); },
  });
  const client = {
    entities: { Client: entity('Client'), Event: entity('Event') },
    auth: {
      me: async () => { calls.push('me'); return { id: 'u' }; },
      setToken: () => { calls.push('setToken'); },
      updateMe: async () => { calls.push('updateMe'); },
    },
    functions: { invoke: async (n: string) => { calls.push(`fn:${n}`); return { data: 1 }; } },
    integrations: { Core: { UploadFile: async () => { calls.push('upload'); }, InvokeLLM: async () => { calls.push('llm'); } } },
    agents: { createConversation: async () => { calls.push('agent'); } },
  };
  return { client, calls };
}

test('le letture passano', async () => {
  const { client, calls } = fakeClient();
  const ro = readOnlyClient(client);
  assert.deepEqual(await ro.entities.Client.list(), [1]);
  assert.deepEqual(await ro.entities.Event.filter(), [2]);
  await ro.entities.Client.get();
  ro.entities.Client.subscribe();
  await ro.auth.me();
  ro.auth.setToken();
  assert.deepEqual(calls, ['Client.list', 'Event.filter', 'Client.get', 'Client.subscribe', 'me', 'setToken']);
});

test('le scritture sono bloccate senza chiamare il server', async () => {
  const { client, calls } = fakeClient();
  const blocked: string[] = [];
  const ro = readOnlyClient(client, (w) => blocked.push(w));
  await assert.rejects(ro.entities.Client.create(), ReadOnlyError);
  await assert.rejects(ro.entities.Client.update(), ReadOnlyError);
  await assert.rejects(ro.entities.Event.delete(), ReadOnlyError);
  await assert.rejects(ro.entities.Event.bulkCreate(), ReadOnlyError);
  await assert.rejects(ro.auth.updateMe(), ReadOnlyError);
  await assert.rejects(ro.functions.invoke('recomputeCumulativeStats'), ReadOnlyError);
  await assert.rejects(ro.integrations.Core.UploadFile(), ReadOnlyError);
  await assert.rejects(ro.integrations.Core.InvokeLLM(), ReadOnlyError);
  await assert.rejects(ro.agents.createConversation(), ReadOnlyError);
  assert.deepEqual(calls, []);
  assert.equal(blocked.length, 9);
  assert.equal(blocked[0], 'Client.create');
});
