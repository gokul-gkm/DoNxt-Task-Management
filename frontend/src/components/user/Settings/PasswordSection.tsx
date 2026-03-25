import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { userService } from "../../../services/api/user.api";
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "../../../lib/validations/auth.z.validation";
import PasswordField from "../../ui/PasswordField";
import {
  ShieldIcon,
  LockIcon,
  KeyIcon,
  SaveIcon,
  SpinnerIcon,
} from "../../ui/icons";
import SettingCard from "./SettingCard";

const PasswordSection: FC = () => {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ChangePasswordSchemaType) => {
    setSaving(true);
    try {
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingCard
      title="Change Password"
      description="Update your password. Use a strong, unique password."
      icon={<ShieldIcon className="text-violet-600" />}
      iconBg="bg-violet-50"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4">
          <PasswordField
            id="currentPassword"
            label="Current Password"
            icon={<LockIcon />}
            placeholder="Enter current password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <PasswordField
            id="newPassword"
            label="New Password"
            icon={<KeyIcon />}
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm New Password"
            icon={<LockIcon />}
            placeholder="Re-enter new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Password requirements:</p>
          <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character (@$!%*?&#^)</li>
          </ul>
        </div>

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
          >
            {saving ? (
              <SpinnerIcon className="w-4 h-4 text-white" />
            ) : (
              <SaveIcon />
            )}
            Update Password
          </button>
        </div>
      </form>
    </SettingCard>
  );
};

export default PasswordSection;
