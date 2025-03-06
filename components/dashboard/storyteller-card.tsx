import { cn } from "@/lib/utils";
import Image from "next/image";

interface StorytellerCardProps {
  storyteller: {
    id: string;
    name: string;
    title: string;
    style: string;
    avatar: string;
    backgroundColor: string;
    borderColor: string;
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function StorytellerCard({ storyteller, isSelected, onSelect }: StorytellerCardProps) {
  return (
    <div
      className={cn(
        "group relative w-[128px] h-[179px] cursor-pointer rounded-lg border-2 transition-transform duration-200 hover:-translate-y-2 overflow-hidden",
        storyteller.backgroundColor,
        isSelected ? "border-black" : storyteller.borderColor,
      )}
      onClick={() => onSelect(storyteller.id)}
    >
      {/* Full-size background image */}
      <div className="absolute inset-0">
        <Image
          src={storyteller.avatar}
          alt={storyteller.name}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
} 