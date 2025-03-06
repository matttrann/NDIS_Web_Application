import Image from "next/image";

interface StoryBubbleProps {
  avatarSrc: string;
  text: string;
}

export function StoryBubble({ avatarSrc, text }: StoryBubbleProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-16 h-16 relative rounded-full overflow-hidden shrink-0">
        <Image
          src={avatarSrc}
          alt="Story Avatar"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 bg-muted rounded-lg p-4 relative">
        <div className="absolute left-[-8px] top-4 w-4 h-4 bg-muted transform rotate-45" />
        <div className="prose max-w-none">
          {text.split('\n').map((para, index) => (
            <p key={index} className="mb-2 last:mb-0">{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
} 