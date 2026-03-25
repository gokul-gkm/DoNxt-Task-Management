import { useState, useEffect, type FC } from "react";
import { gsap } from "gsap";
import { userService, type UserProfile } from "../../services/api/user.api";
import { useAuthStore } from "../../store/auth.store";
import { SpinnerIcon } from "../../components/ui/icons";
import ProfileSection from "../../components/user/Settings/ProfileSection";
import PasswordSection from "../../components/user/Settings/PasswordSection";
import AvatarCard from "../../components/user/Settings/AvatarCard";

const SettingsPage: FC = () => {
  const { userName, email } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        const data = res?.user ?? null;
        if (data) {
          setProfile(data as UserProfile);
        } else {
          throw new Error("No user data");
        }
      } catch {
        if (userName && email) {
          const [firstName, ...rest] = (userName || "User").split(" ");
          setProfile({
            _id: "",
            firstName,
            lastName: rest.join(" "),
            email: email,
            is_verified: true,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userName, email]);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".settings-section",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [loading]);

  const handleProfileSaved = (updated: UserProfile) => {
    setProfile(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <SpinnerIcon className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="settings-section">
        <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      <div className="settings-section">
        <AvatarCard profile={profile} />
      </div>

      <div className="settings-section">
        <ProfileSection profile={profile} onSaved={handleProfileSaved} />
      </div>

      <div className="settings-section pb-8">
        <PasswordSection />
      </div>
    </div>
  );
};

export default SettingsPage;
