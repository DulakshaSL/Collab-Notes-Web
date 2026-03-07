import { useEffect, useState } from "react";
import API from "../api/axios";
import { UserPlus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function CollaboratorPanel({ note, open }) {
  const [data, setData] = useState({
    owner: null,
    collaborators: [],
    permission: null,
  });

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);

  const fetchCollaborators = async () => {
    if (!note?._id || !open) return;

    try {
      setLoading(true);

      const res = await API.get(`/notes/${note._id}/collaborators`);

      setData({
        owner: res.data?.owner || null,
        collaborators: Array.isArray(res.data?.collaborators)
          ? res.data.collaborators
          : Array.isArray(res.data)
          ? res.data
          : [],
        permission: res.data?.permission || null,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load collaborators"
      );
      setData({
        owner: null,
        collaborators: [],
        permission: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, [note?._id, open]);

  const handleInvite = async () => {
    if (!email.trim()) return;

    try {
      await API.post(`/notes/${note._id}/collaborators`, {
        email: email.trim(),
        role,
      });

      setEmail("");
      setRole("viewer");
      toast.success("Collaborator added");
      fetchCollaborators();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add collaborator"
      );
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.patch(`/notes/${note._id}/collaborators/${userId}`, {
        role: newRole,
      });

      toast.success("Role updated");
      fetchCollaborators();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update role"
      );
    }
  };

  const handleRemove = async (userId) => {
    try {
      await API.delete(`/notes/${note._id}/collaborators/${userId}`);
      toast.success("Collaborator removed");
      fetchCollaborators();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove collaborator"
      );
    }
  };

  if (!open) return null;

  const collaborators = Array.isArray(data.collaborators)
    ? data.collaborators
    : [];

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="mb-4 text-sm font-semibold text-white/90">
        Collaborators
      </h3>

      {loading ? (
        <p className="text-sm text-white/50">Loading...</p>
      ) : (
        <>
          {data.owner && (
            <div className="mb-4 rounded-lg border border-white/10 bg-black/20 p-3">
              <p className="mb-1 text-xs uppercase tracking-wider text-white/40">
                Owner
              </p>
              <p className="text-sm text-white/90">{data.owner.name}</p>
              <p className="text-xs text-white/55">{data.owner.email}</p>
            </div>
          )}

          {data.permission === "owner" && (
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Invite by email"
                  className="flex-1 rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-white outline-none focus:border-sky-400/60"
                />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>

                <button
                  onClick={handleInvite}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 px-3 py-2 text-sm font-medium text-white"
                >
                  <UserPlus size={16} />
                  Invite
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {collaborators.length === 0 ? (
              <p className="text-sm text-white/50">No collaborators yet.</p>
            ) : (
              collaborators.map((c, index) => {
                const user = c?.user || c;
                const userId = user?._id;
                const userName = user?.name || "Unknown User";
                const userEmail = user?.email || "No email";
                const userRole = c?.role || "viewer";

                return (
                  <div
                    key={userId || index}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3"
                  >
                    <div>
                      <p className="text-sm text-white/90">{userName}</p>
                      <p className="text-xs text-white/55">{userEmail}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {data.permission === "owner" ? (
                        <>
                          <select
                            value={userRole}
                            onChange={(e) =>
                              handleRoleChange(userId, e.target.value)
                            }
                            className="rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-xs text-white outline-none"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                          </select>

                          <button
                            onClick={() => handleRemove(userId)}
                            className="rounded-lg p-2 text-red-300 hover:bg-red-500/10"
                            title="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2 text-xs text-white/80">
                          {userRole}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}