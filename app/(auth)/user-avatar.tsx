import AvatarPlaceHolder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";
interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size = 48,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || AvatarPlaceHolder}
      alt="User avatar"
      width={size}
      height={size}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  );
}
