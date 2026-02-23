import { useEffect, useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import {
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
  Pencil,
} from "lucide-react";
import ProfileActivitySection from "./ProfileActivitySection";
import { apiClient } from "../../lib/apiClient";
import { API_ENDPOINTS } from "../../lib/endpoints";
import { colors } from "../../theme/colors";
import type { User } from "../../interface/User";
import type { Profile } from "../../interface/profile";
import type { SocialKey } from "../../types/share";

export default function ProfilePage() {
  const { token } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const defaultProfile = {
    bio: "",
    avatarUrl: "",
    coverUrl: "",
    website: "",
    socials: {
      twitter: "",
      github: "",
      linkedin: "",
      youtube: "",
      facebook: "",
      instagram: "",
    },
  };

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [tempProfile, setTempProfile] = useState<Profile>(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient(API_ENDPOINTS.users, {
          method: "GET",
          token: token ?? undefined,
        });
        if (data.user) setUser(data.user);

        if (data.profile) {
          setProfile(data.profile);
          setTempProfile(data.profile);
        }
      } catch {
        toast.error("Failed to load profile");
      }
    };

    if (token) fetchProfile();
  }, [token]);

  /* ================= AUTO SAVE ================= */
  const autoSave = async (updatedProfile: Profile) => {
    try {
      await apiClient(API_ENDPOINTS.users + "/profile", {
        method: "PUT",
        token: token ?? undefined,
        body: updatedProfile as unknown as Record<string, unknown>,
      });
    } catch {
      toast.error("Auto save failed");
    }
  };

  /* ================= IMAGE UPLOAD ================= */
  const uploadImage = async (file: File, type: "avatar" | "cover") => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const endpoint =
        type === "cover"
          ? "http://localhost:5000/api/images/upload/userCover"
          : "http://localhost:5000/api/images/upload/avatar";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error();

      const updatedProfile = {
        ...profile,
        [`${type}Url`]: data.url,
      };

      setProfile(updatedProfile);
      setTempProfile(updatedProfile);

      await autoSave(updatedProfile);

      toast.success("Image updated 🎉");
    } catch {
      toast.error("Image upload failed");
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      await apiClient(API_ENDPOINTS.users + "/profile", {
        method: "PUT",
        token: token ?? undefined,
        body: tempProfile as unknown as Record<string, unknown>,
      });

      setProfile(tempProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully 🎉");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  if (!user) return null;
  const socialItems: {
    key: SocialKey;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      key: "twitter",
      icon: <Twitter size={18} />,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      key: "github",
      icon: <Github size={18} />,
      color: "bg-gray-900 hover:bg-black",
    },
    {
      key: "linkedin",
      icon: <Linkedin size={18} />,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      key: "youtube",
      icon: <Youtube size={18} />,
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      key: "facebook",
      icon: <Facebook size={18} />,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      key: "instagram",
      icon: <Instagram size={18} />,
      color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= COVER ================= */}
      <div className="relative h-40 sm:h-56 md:h-64 lg:h-72 w-full bg-gray-300">
        {profile.coverUrl ? (
          <img
            src={profile.coverUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm sm:text-base">
            No Cover Photo
          </div>
        )}

        <input
          type="file"
          hidden
          ref={coverInputRef}
          onChange={(e) =>
            e.target.files && uploadImage(e.target.files[0], "cover")
          }
        />

        <Button
          size="sm"
          onClick={() => coverInputRef.current?.click()}
          className={`absolute right-4 sm:right-6 bottom-4 sm:bottom-6   ${colors.primary.base}
  ${colors.primary.hover}
  ${colors.primary.text}`}
        >
          <Pencil />
        </Button>
      </div>

      {/* ================= PROFILE CONTENT ================= */}
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 sm:py-9 lg:px-5 pb-12">
        {/* ================= HEADER SECTION ================= */}
        <div className="-mt-14 sm:-mt-20 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
          {/* AVATAR */}
          <div className="flex justify-center sm:justify-start">
            <div className="relative inline-block">
              {/* Avatar */}
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="User Avatar"
                  className="
          h-24 w-24
          sm:h-28 sm:w-28
          md:h-32 md:w-32
          lg:h-36 lg:w-36
          rounded-full
          border-4 border-white
          object-cover
          shadow-xl
        "
                />
              ) : (
                <div
                  className="
          h-24 w-24
          sm:h-28 sm:w-28
          md:h-32 md:w-32
          lg:h-36 lg:w-36
          rounded-full
          border-4 border-white
          bg-gray-200
          flex items-center justify-center
          text-gray-500 text-sm
          shadow-xl
        "
                >
                  No Photo
                </div>
              )}

              {/* Hidden Input */}
              <input
                type="file"
                hidden
                ref={avatarInputRef}
                onChange={(e) =>
                  e.target.files && uploadImage(e.target.files[0], "avatar")
                }
              />

              {/* Edit Button */}
              <Button
                size="icon"
                onClick={() => avatarInputRef.current?.click()}
                className={`
  absolute
  bottom-0
  right-0
  translate-x-1
  translate-y-1
  rounded-full
  h-8 w-8
  shadow-md
  ${colors.primary.base}
  ${colors.primary.hover}
  ${colors.primary.text}
`}
              >
                <Pencil size={14} />
              </Button>
            </div>
          </div>

          {/* USER INFO */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-semibold">{user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          {/* EDIT BUTTON */}
          {!isEditing && (
            <div className="flex justify-center sm:justify-end">
              <Button
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-2 ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
              >
                <Pencil size={16} />
                Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* ================= PROFILE CARD ================= */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-5 sm:p-8 space-y-8">
          {/* BIO */}
          <div>
            <label className="text-sm font-semibold text-gray-900">Bio</label>

            {isEditing ? (
              <Textarea
                rows={3}
                className="mt-2"
                value={tempProfile.bio}
                onChange={(e) =>
                  setTempProfile({
                    ...tempProfile,
                    bio: e.target.value,
                  })
                }
              />
            ) : (
              <p className="mt-2 text-gray-700">
                {profile.bio || "No bio added."}
              </p>
            )}
          </div>

          {/* WEBSITE */}
          <div>
            <label className="text-sm font-medium text-gray-900">Website</label>

            {isEditing ? (
              <Input
                className="mt-2"
                value={tempProfile.website}
                onChange={(e) =>
                  setTempProfile({
                    ...tempProfile,
                    website: e.target.value,
                  })
                }
              />
            ) : profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-blue-600 hover:underline break-all"
              >
                {profile.website}
              </a>
            ) : (
              <p className="mt-2 text-gray-700">No website added.</p>
            )}
          </div>

          {/* SOCIALS */}
          <div>
            <label className="text-sm font-medium text-gray-900">
              Social Links
            </label>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {Object.keys(tempProfile.socials).map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm capitalize font-small text-gray-900">
                      {key}
                    </label>
                    <Input
                      className="w-full"
                      value={tempProfile.socials[key as SocialKey]}
                      onChange={(e) =>
                        setTempProfile({
                          ...tempProfile,
                          socials: {
                            ...tempProfile.socials,
                            [key]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 mt-6 flex-wrap justify-center sm:justify-start">
                {socialItems
                  .filter((s) => profile.socials?.[s.key])
                  .map((s) => (
                    <a
                      key={s.key}
                      href={profile.socials[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition transform hover:scale-110 shadow-sm ${s.color}`}
                    >
                      {s.icon}
                    </a>
                  ))}

                {!Object.values(profile.socials || {}).some(Boolean) && (
                  <p className="text-gray-500 text-sm">
                    No social links added.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className={`w-full sm:w-auto ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={loading}
                className={`w-full sm:w-auto ${colors.primary.base} ${colors.primary.hover} ${colors.primary.text}`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>
      <ProfileActivitySection />
    </div>
  );
}
