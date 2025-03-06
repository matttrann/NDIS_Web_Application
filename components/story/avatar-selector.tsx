import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarOption {
  id: number;
  src: string;
  alt: string;
}

const avatarOptions: AvatarOption[] = [
  { id: 1, src: "/avatars/avatar1.gif", alt: "Avatar 1" },
  { id: 2, src: "/avatars/avatar2.gif", alt: "Avatar 2" },
  { id: 3, src: "/avatars/avatar3.gif", alt: "Avatar 3" },
  { id: 4, src: "/avatars/avatar4.gif", alt: "Avatar 4" },
  { id: 5, src: "/avatars/avatar5.gif", alt: "Avatar 5" },
];

interface AvatarSelectorProps {
  selectedAvatar: number | null;
  onSelectAvatar: (id: number) => void;
}

export function AvatarSelector({ selectedAvatar, onSelectAvatar }: AvatarSelectorProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      {avatarOptions.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelectAvatar(avatar.id)}
          className={cn(
            "relative w-16 h-16 rounded-full overflow-hidden border-2",
            selectedAvatar === avatar.id ? "border-primary" : "border-transparent"
          )}
        >
          <Image
            src={avatar.src}
            alt={avatar.alt}
            fill
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
} 