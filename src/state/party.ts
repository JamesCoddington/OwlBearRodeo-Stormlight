import OBR from "@owlbear-rodeo/sdk";
import type { Player } from "@owlbear-rodeo/sdk";
import type { CharacterSheet } from "../models/character.ts";

const OBR_METADATA_KEY = "com.stormlight-sheet/character";

interface StorageEnvelope {
  version: number;
  timestamp: number;
  data: CharacterSheet;
}

export interface PartyMember {
  id: string;
  name: string;
  sheet: CharacterSheet | null;
}

export async function checkIsGM(): Promise<boolean> {
  return (await OBR.player.getRole()) === "GM";
}

export async function loadPartyMembers(excludeId?: string): Promise<PartyMember[]> {
  const players = await OBR.party.getPlayers();
  return players
    .filter((p) => !excludeId || p.id !== excludeId)
    .map(playerToMember);
}

export function onPartyChange(
  callback: (members: PartyMember[]) => void,
  excludeId?: string,
): void {
  OBR.party.onChange((players: Player[]) => {
    const filtered = excludeId ? players.filter((p) => p.id !== excludeId) : players;
    callback(filtered.map(playerToMember));
  });
}

function playerToMember(player: Player): PartyMember {
  const envelope = player.metadata[OBR_METADATA_KEY] as StorageEnvelope | undefined;
  return {
    id: player.id,
    name: player.name,
    sheet: envelope?.data ?? null,
  };
}
