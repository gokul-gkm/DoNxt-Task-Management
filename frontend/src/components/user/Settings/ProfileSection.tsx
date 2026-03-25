import { useState, useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { userService, type UserProfile } from "../../../services/api/user.api";
import {
  updateProfileSchema,
  type UpdateProfileSchemaType,
} from "../../../lib/validations/auth.z.validation";
import SettingsField from "../../ui/SettingsField";
import {
  PersonIcon,
  UserIcon,
  EmailIcon,
  EditIcon,
  CancelIcon,
  SaveIcon,
  SpinnerIcon,
} from "../../ui/icons";
import SettingCard from "./SettingCard";

interface ProfileSectionProps {
  profile: UserProfile | null;
  onSaved: (p: UserProfile) => void;
}

const ProfileSection: FC<ProfileSectionProps> = ({ profile, onSaved }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileSchemaType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({ firstName: profile.firstName, lastName: profile.lastName });
    }
  }, [profile, reset]);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    reset({ firstName: profile?.firstName ?? "", lastName: profile?.lastName ?? "" });
    setEditing(false);
  };

  const onSubmit = async (data: UpdateProfileSchemaType) => {
    setSaving(true);
    try {
      const res = await userService.updateProfile({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
      });
      const updated = res?.user;
      if (updated?.firstName) {
        onSaved(updated as UserProfile);
      }
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingCard
      title="Profile Information"
      description="Update your personal details. Email cannot be changed."
      icon={<PersonIcon className="text-indigo-600" />}
      iconBg="bg-indigo-50"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField
            id="firstName"
            label="First Name"
            icon={<UserIcon />}
            readOnly={!editing}
            placeholder="First name"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <SettingsField
            id="lastName"
            label="Last Name"
            icon={<UserIcon />}
            readOnly={!editing}
            placeholder="Last name"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
          <div className="sm:col-span-2">
            <SettingsField
              id="email"
              label="Email Address"
              icon={<EmailIcon />}
              locked
              value={profile?.email ?? ""}
              readOnly
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-5">
          {!editing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              <EditIcon />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors cursor-pointer"
              >
                <CancelIcon />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
              >
                {saving ? (
                  <SpinnerIcon className="w-4 h-4 text-white" />
                ) : (
                  <SaveIcon />
                )}
                Save Changes
              </button>
            </>
          )}
        </div>
      </form>
    </SettingCard>
  );
};

export default ProfileSection;
