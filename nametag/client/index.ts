import { useRebarClient } from '@Client/index.js';
import { useWebview } from '@Client/webview/index.js';
import { getDirectionFromRotation } from '@Client/utility/math/index.js';
import * as native from 'natives';
import * as alt from 'alt-client';
import { BagItem } from '@Plugins/inventory/server/index.js';
import { drawText2D } from '@Client/screen/textlabel.js';

const Rebar = useRebarClient();
const webview = Rebar.webview.useWebview();
const messenger = Rebar.messenger.useMessenger();

// Store nametags for each entity
const nameTags = new Map();

// Create nametag when a game entity is created
alt.on('gameEntityCreate', (entity) => {
    if (entity instanceof alt.Player && entity !== alt.Player.local) {
        const nametag = {
            id: entity.getStreamSyncedMeta('id') as number,
            name: entity.getStreamSyncedMeta('name') as string
        };
        nameTags.set(entity, nametag);
    }
});

// Remove nametag when a game entity is destroyed
alt.on('gameEntityDestroy', (entity) => {
    if (nameTags.has(entity)) {
        nameTags.delete(entity);
    }
});

// Draw nametags
alt.everyTick(() => {
    nameTags.forEach((nametag, player) => {
        if (!player || player.vehicle) {
            return;
        }

        const distance = alt.Player.local.pos.distanceTo(player.pos);

        if (distance > 15) {
            return;
        }

        const pos = { ...native.getPedBoneCoords(player.scriptID, 12844, 0, 0, 0) };
        pos.z += 0.75;

        let scale = 1 - (0.8 * distance) / 50;
        let size = scale * 0.42;

        const entity = player.scriptID;
        const vector = native.getEntityVelocity(entity);
        const frameTime = native.getFrameTime();

        const x = pos.x + vector.x * frameTime;
        const y = pos.y + vector.y * frameTime;
        const z = pos.z + vector.z * frameTime;

        drawText3D(`${nametag.id} -- ${nametag.name}`, { x, y, z }, size, new alt.RGBA(255, 255, 255));
    });
});


function drawText3D(text: string, pos: alt.IVector3, scale: number, color: alt.RGBA, offset = alt.Vector2.zero) {
    if (scale > 2) {
        scale = 2;
    }

    native.setDrawOrigin(pos.x, pos.y, pos.z, false);
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.setTextFont(1);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextColour(color.r, color.g, color.b, color.a);
    native.setTextOutline();
    native.setTextDropShadow();
    native.setTextJustification(0);
    native.endTextCommandDisplayText(offset.x, offset.y, 0);
    native.clearDrawOrigin();
}


alt.everyTick(() => {
    drawText2D(
        `X: ${alt.Player.local.pos.x.toFixed(2)}   Y: ${alt.Player.local.pos.y.toFixed(2)}   Z: ${alt.Player.local.pos.z.toFixed(2)}`,
        { x: 0.5, y: 0 },
        0.5,
        new alt.RGBA(255, 255, 255)
    );
});
