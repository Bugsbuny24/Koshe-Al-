"use client";

import Image from "next/image";
import type { Mentor, MentorState } from "@/lib/data/mentors";
import {
  MENTOR_STATE_DOT,
  MENTOR_STATE_LABELS,
  MENTOR_STATE_RING,
  MENTOR_STATE_TEXT,
} from "@/lib/data/mentors";

type MentorCardProps = {
  mentor: Mentor;
  state: MentorState;
  className?: string;
  /** compact = small inline chip; default = full card row */
  size?: "compact" | "default";
};

export default function MentorCard({
  mentor,
  state,
  className = "",
  size = "default",
}: MentorCardProps) {
  const ringClass = MENTOR_STATE_RING[state];
  const dotClass = MENTOR_STATE_DOT[state];
  const textClass = MENTOR_STATE_TEXT[state];
  const stateLabel = MENTOR_STATE_LABELS[state];

  const isAnimating = state !== "idle";

  if (size === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${mentor.gradientFrom} ${mentor.gradientTo} text-xs font-bold text-white ring-2 ${ringClass} ${isAnimating ? "animate-pulse" : ""}`}
        >
          {mentor.avatarImageUrl ? (
            <Image
              src={mentor.avatarImageUrl}
              alt={mentor.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            mentor.avatarInitials
          )}
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#050816] ${dotClass}`}
          />
        </div>
        <div>
          <span className="text-sm font-medium text-white">{mentor.name}</span>
          <span className={`ml-2 text-xs ${textClass}`}>{stateLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Avatar */}
      <div
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${mentor.gradientFrom} ${mentor.gradientTo} text-lg font-bold text-white ring-2 ${ringClass} transition-all duration-300 ${isAnimating ? "animate-pulse" : ""}`}
      >
        {mentor.avatarImageUrl ? (
          <Image
            src={mentor.avatarImageUrl}
            alt={mentor.name}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          mentor.avatarInitials
        )}
        {/* Status dot */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#050816] ${dotClass} transition-colors duration-300`}
        />
      </div>

      {/* Info */}
      <div>
        <div className="font-semibold text-white">{mentor.name}</div>
        <div className="text-xs text-slate-400">{mentor.title}</div>
        <div className={`mt-0.5 text-xs font-medium ${textClass} transition-colors duration-300`}>
          {stateLabel}
        </div>
      </div>
    </div>
  );
}
