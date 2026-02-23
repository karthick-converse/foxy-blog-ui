import type { Breakdown, ReactionType } from "../types/reaction.type";

export interface ReactionItem {
  type: ReactionType;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  count: number;
}

export interface ReactionPopoverProps {
  targetType: string;
  targetId: string;
  totalCount: number;
  breakdown?: Partial<Breakdown>;
  initialReaction: ReactionType | null;
  reactions: ReactionItem[];
  token: string | null;
  isAuthenticated: boolean;
  onReactionChange?: (reaction: ReactionType | null, newCount: number) => void;
}