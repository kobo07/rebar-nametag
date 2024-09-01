import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { Character } from '@Shared/types/character.js';
import { useWebview } from '@Server/player/webview.js';


const Rebar = useRebar();
const serverConfig = Rebar.useServerConfig();
const Keybinder = Rebar.systems.useKeybinder();


const SyncedBinder = Rebar.systems.useStreamSyncedBinder();
SyncedBinder.syncCharacterKey('name')

