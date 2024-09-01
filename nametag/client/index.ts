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



alt.everyTick(() => {
    drawText2D(`X: ${(alt.Player.local.pos.x).toFixed(2)}   Y: ${(alt.Player.local.pos.y).toFixed(2)}   Z: ${(alt.Player.local.pos.z).toFixed(2)}`, { x: 0.5, y: 0 }, 0.5, new alt.RGBA(255, 255, 255));
})




alt.everyTick(() => {
    alt.Player.all.forEach((player) => {
        if(player === alt.Player.local) {
            return;
        }

        if (!player) {
            return;
        }
        const id = player.getStreamSyncedMeta('id') as number;
        const name = player.getStreamSyncedMeta('name') as string;
        const distance = alt.Player.local.pos.distanceTo(player.pos);

        if (distance > 15) {
            return;
        }
        const isinvehicle: boolean = player.vehicle ? true : false;

        if (isinvehicle) {
            return;
        }

        const pos = { ...native.getPedBoneCoords(player.scriptID, 12844, 0, 0, 0) };
        pos.z += 0.75;

        let scale = 1 - (0.8 * distance) / 50;
        let size = scale * 0.42;

        const entity = player.vehicle ? player.vehicle.scriptID : player.scriptID;
        const vector = native.getEntityVelocity(entity);
        const frameTime = native.getFrameTime();

        const x = pos.x + vector.x * frameTime;
        const y = pos.y + vector.y * frameTime;
        const z = pos.z + vector.z * frameTime;

        native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false);
        drawText3D(`${id} -- ${name}`, { x: x, y: y, z: z }, size, new alt.RGBA(255, 255, 255),);
    })
});





/**
 * Draw stable text in a 3D position with an every tick.
 * @param  {string} text
 * @param  {alt.Vector3} pos
 * @param  {number} scale
 * @param  {alt.RGBA} color
 */
export function drawText3D(text: string, pos: alt.IVector3, scale: number, color: alt.RGBA, offset = alt.Vector2.zero) {
    if (scale > 2) {
        scale = 2;
    }

    native.setDrawOrigin(pos.x, pos.y, pos.z, false); // Used to stabalize text, sprites, etc. in a 3D Space.
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
