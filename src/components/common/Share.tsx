"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  X,
} from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { useAuth } from "../../context/AuthContext";
import type { ShareDropdownProps } from "../../interface/share";




export default function ShareDropdown({
  slug,
  title,
}: ShareDropdownProps) {
  const [showShare, setShowShare] = useState(false);
  const { token } = useAuth();

 

 const handleShare = async (platform: string) => {
  try {
    await apiClient(`/shares/posts/${slug}`, {
      method: "POST",
      token: token ?? undefined,
      body: {
        platform: platform,
      },
    });

    toast.success("Post shared successfully!");

    const postUrl = `${window.location.origin}/blog/${slug}`;
    const shareText = title;

    let shareLink = "";

    switch (platform) {
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          postUrl
        )}&text=${encodeURIComponent(shareText)}`;
        break;

      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          postUrl
        )}`;
        break;

      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(
          shareText + " " + postUrl
        )}`;
        break;

      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          postUrl
        )}`;
        break;

      case "copy_link":
        navigator.clipboard.writeText(postUrl);
        toast.success("Link copied!");
        setShowShare(false);
        return;
    }

    window.open(shareLink, "_blank");
    setShowShare(false);

  } catch (error) {
    toast.error("Failed to register share.");
  }
};
  return (
    <div className="relative">
      {/* Share Trigger */}
      <span
        className="flex gap-1 items-center cursor-pointer hover:text-blue-500 text-sm"
        onClick={() => setShowShare((prev) => !prev)}
      >
        <Share2 size={14} /> Share
      </span>

      {/* Dropdown */}
      {showShare && (
        <div className="absolute right-0 bottom-8 w-52 bg-white shadow-xl rounded-xl p-4 border z-50">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-sm">Share via</span>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => setShowShare(false)}
            />
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <button
              onClick={() => handleShare("twitter")}
              className="flex items-center gap-2 hover:text-blue-500"
            >
              <Twitter size={16} /> Twitter
            </button>

            <button
              onClick={() => handleShare("linkedin")}
              className="flex items-center gap-2 hover:text-blue-700"
            >
              <Linkedin size={16} /> LinkedIn
            </button>

            <button
              onClick={() => handleShare("whatsapp")}
              className="flex items-center gap-2 hover:text-green-500"
            >
              <Link2 size={16} /> WhatsApp
            </button>

            <button
              onClick={() => handleShare("facebook")}
              className="flex items-center gap-2 hover:text-blue-600"
            >
              <Facebook size={16} /> Facebook
            </button>

            <button
              onClick={() => handleShare("copy_link")}
              className="flex items-center gap-2 hover:text-gray-600"
            >
              <Link2 size={16} /> Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}