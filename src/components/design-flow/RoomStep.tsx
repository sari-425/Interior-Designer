import { ROOM_TYPES, type RoomTypeId } from "@/modules/rooms/room-types";
import { ChoiceCard } from "./ChoiceCard";

export function RoomStep({ value, onChange }: { value: RoomTypeId | null; onChange: (v: RoomTypeId) => void }) {
  return (
    <fieldset>
      <legend className="font-display text-3xl">Welcher Raum ist es?</legend>
      <p className="mt-3 text-muted">So wissen wir, welche Möbel sinnvoll sind.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ROOM_TYPES.map((room) => (
          <ChoiceCard
            key={room.id}
            name="roomType"
            value={room.id}
            selected={value === room.id}
            onSelect={() => onChange(room.id)}
            className="min-h-20 justify-center px-5 py-4"
          >
            <span className="pr-6 text-lg">{room.name}</span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  );
}
