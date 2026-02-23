"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HeartPlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";

export type ReactionType = "like" | "love" | "fire" | "insightful";

type Breakdown = Record<ReactionType, number>;

interface ReactionPopoverProps {
  targetType: string;
  targetId: string;
  totalCount: number;
  breakdown?: Partial<Breakdown>;
  initialReaction: ReactionType | null;
  reactions: any[];
  token: string | null;
  isAuthenticated: boolean;
  onReactionChange?: (reaction: ReactionType | null, newCount: number) => void;
}

export default function ReactionPopover({
  targetType,
  targetId,
  totalCount,
  breakdown,
  initialReaction,
  reactions,
  token,
  isAuthenticated,
  onReactionChange,
}: ReactionPopoverProps) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(totalCount);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(
    initialReaction,
  );

  const [breakdownState, setBreakdownState] = useState<Breakdown>({
    like: breakdown?.like ?? 0,
    love: breakdown?.love ?? 0,
    fire: breakdown?.fire ?? 0,
    insightful: breakdown?.insightful ?? 0,
  });

  /* Sync with parent */
  useEffect(() => {
    setCount(totalCount);
  }, [totalCount]);

  useEffect(() => {
    setUserReaction(initialReaction);
  }, [initialReaction]);

  const handleReaction = async (reaction: ReactionType) => {
    if (!isAuthenticated) {
      toast.error("Please login to react");
      setTimeout(() => navigate("/signin"), 1200);
      return;
    }

    const previousReaction = userReaction;
    const isRemoving = previousReaction === reaction;

    const previousCount = count;
    const previousBreakdown = { ...breakdownState };

    // Optimistic update
    setBreakdownState((prev) => {
      const updated = { ...prev };

      if (previousReaction) {
        updated[previousReaction] = Math.max(updated[previousReaction] - 1, 0);
      }

      if (!isRemoving) {
        updated[reaction] += 1;
      }

      return updated;
    });

    const newCount =
      !previousReaction && !isRemoving
        ? count + 1
        : previousReaction && isRemoving
          ? count - 1
          : count;

    const newReaction = isRemoving ? null : reaction;

    setCount(newCount);
    setUserReaction(newReaction);
    onReactionChange?.(newReaction, newCount);

    try {
      await apiClient(API_ENDPOINTS.reactions, {
        method: "POST",
        token: token ?? undefined,
        body: {
          targetType,
          targetId,
          reaction: newReaction,
        },
      });
    } catch {
      setCount(previousCount);
      setBreakdownState(previousBreakdown);
      setUserReaction(previousReaction);
      onReactionChange?.(previousReaction, previousCount);
    }

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {userReaction ? (
            <div className="bg-blue-100 border rounded-full p-1 shadow-sm">
              {(() => {
                const Icon = reactions.find(
                  (r) => r.type === userReaction,
                )?.icon;
                return Icon ? (
                  <Icon size={16} className="text-blue-600" />
                ) : null;
              })()}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-full p-2">
              <HeartPlus size={16} />
            </div>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        className="flex gap-4 px-4 py-3 rounded-2xl shadow-xl bg-white border"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {reactions.map((r) => (
          <button
            key={r.type}
            onClick={() => handleReaction(r.type)}
            className={`flex flex-col items-center gap-1 transition ${
              userReaction === r.type
                ? "scale-125 text-blue-600"
                : "hover:scale-125"
            }`}
          >
            <r.icon size={14} />
            <span className="text-xs text-gray-500">
              {breakdownState[r.type as keyof Breakdown]}{" "}
            </span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
