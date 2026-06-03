import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface NameCellProps {
  name: string;
  image?: string;
}

export function NameCell({ name, image }: NameCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <span className="font-medium text-foreground">{name || "—"}</span>
    </div>
  );
}
