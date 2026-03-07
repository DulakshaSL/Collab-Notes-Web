import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function ProfileSettingsModal({
  open,
  user,
  onClose,
  onUpdated,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setProfilePicture(user.profilePicture || "");
    setCurrentPassword("");
    setNewPassword("");
  }, [user, open]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { data } = await API.put("auth/me", {
        name,
        email,
        profilePicture,
      });
      toast.success("Profile updated");
      onUpdated?.(data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);
      await API.put("auth/change-password", {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.();
          }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.65)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Profile settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-white/70"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/85">Profile</h3>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
                />

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
                />

                <input
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  placeholder="Profile picture URL"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
                />

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white font-medium disabled:opacity-50"
                >
                  Save profile
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/85">Change password</h3>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
                />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none"
                />

                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white font-medium disabled:opacity-50"
                >
                  Update password
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}