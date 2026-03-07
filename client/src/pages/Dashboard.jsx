import { useContext, useEffect, useMemo, useRef, useState } from "react";
import API from "../api/axios";
import {
  Search,
  Pin,
  Bell,
  Archive,
  Trash2,
  Tag,
  Menu,
  LogOut,
  Users,
  Eye,
  Pencil,
  SquarePen,
  ChevronDown,
  Clock3,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import NoteEditorModal from "../components/NoteEditorModal.jsx";
import ProfileSettingsModal from "../components/ProfileSettingsModal.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";

const NavItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={[
      "w-full flex items-center gap-3 px-4 py-3 rounded-full transition",
      "focus:outline-none",
      active
        ? "bg-yellow-500/10 text-yellow-200 border border-yellow-500/20"
        : "text-slate-200/80 hover:bg-white/5 hover:text-white",
      collapsed ? "justify-center px-0" : "",
    ].join(" ")}
  >
    <Icon
      size={18}
      className={active ? "text-yellow-300" : "text-slate-300/80"}
    />
    {!collapsed && <span className="text-sm font-medium">{label}</span>}
  </button>
);

const getPermissionMeta = (note) => {
  const permission = note?.permission || "owner";

  if (permission === "viewer") {
    return {
      label: "Read only",
      icon: Eye,
      className: "text-sky-300 border-sky-400/20 bg-sky-500/10",
    };
  }

  if (permission === "editor") {
    return {
      label: "Can edit",
      icon: Pencil,
      className: "text-violet-300 border-violet-400/20 bg-violet-500/10",
    };
  }

  return null;
};

const getCollaboratorAvatars = (note) => {
  const collaborators = Array.isArray(note?.collaborators)
    ? note.collaborators
    : [];

  return collaborators.slice(0, 3).map((c, index) => {
    const user = c?.user || c;
    const name = user?.name || user?.email || `U${index + 1}`;
    const initial = name.trim().charAt(0).toUpperCase() || "?";

    return {
      id: user?._id || `${name}-${index}`,
      initial,
      name,
    };
  });
};

const EmptyState = ({ tab }) => {
  const config = {
    notes: {
      title: "Nothing here yet",
      text: "Create your first note to start capturing ideas, tasks, and shared updates.",
      icon: Sparkles,
    },
    archive: {
      title: "No archived notes",
      text: "Archived notes will appear here when you move them out of your main workspace.",
      icon: Archive,
    },
    trash: {
      title: "Trash is empty",
      text: "Deleted notes will appear here before they are removed permanently.",
      icon: Trash2,
    },
  };

  const current = config[tab] || config.notes;
  const Icon = current.icon;

  return (
    <div className="mx-auto mt-14 max-w-2xl">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-8 py-12 text-center shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Icon size={24} className="text-white/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/90">{current.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/45">
          {current.text}
        </p>
      </div>
    </div>
  );
};

const NoteCard = ({ note, onOpen, onPin, onArchive, onTrash, tab }) => {
  const permissionMeta = getPermissionMeta(note);
  const PermissionIcon = permissionMeta?.icon;

  const collaborators = Array.isArray(note?.collaborators)
    ? note.collaborators
    : [];

  const avatarItems = getCollaboratorAvatars(note);
  const isShared = collaborators.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={[
        "break-inside-avoid mb-4 rounded-2xl border transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.35)] cursor-pointer overflow-hidden",
        isShared
          ? "border-cyan-400/15 bg-cyan-500/5 hover:bg-cyan-500/10 hover:shadow-[0_18px_40px_rgba(34,211,238,0.08)]"
          : "border-white/10 bg-white/5 hover:bg-white/7 hover:shadow-[0_18px_40px_rgba(0,0,0,0.42)]",
      ].join(" ")}
      onClick={() => onOpen(note)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white/90 leading-snug break-words">
              {note.title || "Untitled"}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isShared && (
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300">
                  <Users size={12} />
                  Shared
                </span>
              )}

              {permissionMeta && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${permissionMeta.className}`}
                >
                  <PermissionIcon size={12} />
                  {permissionMeta.label}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin(note);
            }}
            className="p-2 rounded-xl hover:bg-white/5 transition shrink-0"
            title={note.pinned ? "Unpin" : "Pin"}
          >
            <Pin
              size={16}
              className={note.pinned ? "text-yellow-300" : "text-white/60"}
            />
          </button>
        </div>

        <div
          className="mt-3 text-sm text-white/70 leading-relaxed line-clamp-6 break-words"
          dangerouslySetInnerHTML={{
            __html:
              note.content || "<span class='text-white/40'>No content</span>",
          }}
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {isShared && (
              <>
                <div className="flex -space-x-2">
                  {avatarItems.map((avatar) => (
                    <div
                      key={avatar.id}
                      title={avatar.name}
                      className="h-7 w-7 rounded-full border border-[#0b1220] bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center text-[11px] font-semibold text-white shadow"
                    >
                      {avatar.initial}
                    </div>
                  ))}
                </div>

                {collaborators.length > 3 && (
                  <span className="text-xs text-white/50">
                    +{collaborators.length - 3}
                  </span>
                )}
              </>
            )}
          </div>

          {tab !== "trash" && (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(note);
                }}
                className="px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 transition"
              >
                {note.archived ? "Unarchive" : "Archive"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTrash(note);
                }}
                className="px-3 py-2 rounded-xl text-xs text-red-200/80 hover:bg-red-500/10 transition"
              >
                Trash
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [tab, setTab] = useState("notes");
  const [query, setQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  const [user, setUser] = useState(null);

  const profileRef = useRef(null);
  const remindersRef = useRef(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/notes", {
        params: { tab, search: query },
      });
      setNotes(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const fetchMe = async () => {
    try {
      const { data } = await API.get("auth/me");
      setUser(data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchNotes, 250);
    return () => clearTimeout(t);
  }, [tab, query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (remindersRef.current && !remindersRef.current.contains(e.target)) {
        setRemindersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pinned = useMemo(() => notes.filter((n) => n.pinned), [notes]);
  const others = useMemo(() => notes.filter((n) => !n.pinned), [notes]);

  const visibleNotes = useMemo(() => {
    if (tab === "trash") return notes;
    if (pinned.length > 0) return others;
    return notes;
  }, [tab, notes, pinned, others]);

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleCreate = async (payload) => {
    try {
      await API.post("/notes", {
        title: payload.title,
        content: payload.content,
      });

      setComposeOpen(false);
      toast.success("Note created");
      fetchNotes();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create note");
    }
  };

  const onOpen = (note) => {
    setSelected(note);
    setEditorOpen(true);
  };

  const saveNote = async (updated) => {
    try {
      await API.put(`/notes/${updated._id}`, {
        title: updated.title,
        content: updated.content,
      });
      await fetchNotes();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save note");
    }
  };

  const onPin = async (note) => {
    try {
      await API.patch(`/notes/${note._id}/toggle-pin`);
      fetchNotes();
    } catch (e) {
      toast.error(e.response?.data?.message || "Pin failed");
    }
  };

  const onArchive = async (note) => {
    try {
      await API.patch(`/notes/${note._id}/archive`);
      fetchNotes();
    } catch (e) {
      toast.error(e.response?.data?.message || "Archive failed");
    }
  };

  const onTrash = async (note) => {
    try {
      if (tab === "trash") {
        await API.delete(`/notes/${note._id}`);
        toast.success("Deleted permanently");
      } else {
        await API.patch(`/notes/${note._id}/trash`);
        toast.success("Moved to trash");
      }
      fetchNotes();
    } catch (e) {
      toast.error(e.response?.data?.message || "Action failed");
    }
  };

  const onRestore = async (note) => {
    try {
      await API.patch(`/notes/${note._id}/restore`);
      toast.success("Restored");
      fetchNotes();
    } catch (e) {
      toast.error(e.response?.data?.message || "Restore failed");
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-white">
      <ToastContainer position="top-right" theme="dark" />

      <NoteEditorModal
        open={editorOpen}
        note={selected}
        mode="edit"
        onClose={() => setEditorOpen(false)}
        onSave={saveNote}
        onTogglePin={onPin}
        onToggleArchive={onArchive}
        onTrash={onTrash}
      />

      <NoteEditorModal
        open={composeOpen}
        mode="create"
        onClose={() => setComposeOpen(false)}
        onCreate={handleCreate}
      />

      <ProfileSettingsModal
        open={profileSettingsOpen}
        user={user}
        onClose={() => setProfileSettingsOpen(false)}
        onUpdated={(updatedUser) => setUser(updatedUser)}
      />

      <div className="pointer-events-none fixed -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none fixed top-[-140px] right-[-140px] h-[560px] w-[560px] rounded-full bg-purple-500/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070a12]/70 backdrop-blur-xl">
        <div className="h-16 px-4 md:px-6 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="p-2 rounded-xl hover:bg-white/5 transition"
            title="Toggle sidebar"
          >
            <Menu size={20} className="text-white/80" />
          </button>

          <div className="flex items-center gap-3">
            <img src={logo} alt="Collab Notes" className="h-10 w-10 rounded-2xl" />

            <div className="hidden sm:flex flex-col leading-none">
              <span
                className="text-[14px] font-semibold tracking-wider text-cyan-400"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                Collab <span className="text-fuchsia-400">Notes</span>
              </span>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl hover:bg-white/5 transition"
                title="Search"
              >
                <Search size={18} className="text-white/70" />
              </button>
            ) : (
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes..."
                  onBlur={() => {
                    if (!query) setSearchOpen(false);
                  }}
                  className="w-[220px] rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-sky-400/50 transition"
                />
              </div>
            )}

            <div className="relative" ref={remindersRef}>
              <button
                onClick={() => setRemindersOpen((s) => !s)}
                className="p-2 rounded-xl hover:bg-white/5 transition"
                title="Reminders"
              >
                <Bell size={18} className="text-white/70" />
              </button>

              <AnimatePresence>
                {remindersOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Clock3 size={16} className="text-cyan-300" />
                      <p className="text-sm font-semibold text-white/90">
                        Reminders
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                      <p className="text-sm text-white/70">
                        No reminders yet
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        Reminder support will be added soon to keep track of important notes.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="h-10 rounded-full border border-white/10 bg-white/10 px-2 pl-1.5 pr-3 flex items-center gap-2 hover:bg-white/15 transition"
                title="Profile"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name || "User"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-[11px] font-bold text-white">
                    {initials}
                  </div>
                )}
                <ChevronDown size={14} className="text-white/60" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0b1220]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.name || "User"}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white">
                            {initials}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-white/90">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-white/45">
                            {user?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          setProfileSettingsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-white/75 hover:bg-white/5 transition"
                      >
                        Profile settings
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-300 hover:bg-red-500/10 transition"
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={[
            "hidden md:block px-4 py-6 sticky top-16 h-[calc(100vh-4rem)] transition-all duration-300",
            sidebarOpen ? "w-72" : "w-20",
          ].join(" ")}
        >
          <nav className="space-y-2">
            <NavItem
              collapsed={!sidebarOpen}
              icon={Tag}
              label="Notes"
              active={tab === "notes"}
              onClick={() => setTab("notes")}
            />
            <NavItem
              collapsed={!sidebarOpen}
              icon={Archive}
              label="Archive"
              active={tab === "archive"}
              onClick={() => setTab("archive")}
            />
            <NavItem
              collapsed={!sidebarOpen}
              icon={Trash2}
              label="Trash"
              active={tab === "trash"}
              onClick={() => setTab("trash")}
            />
          </nav>
        </aside>

        <main className="flex-1 px-4 md:px-6 py-6">
          {tab === "notes" && (
            <div className="mx-auto max-w-2xl">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setComposeOpen(true)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.04] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/15 via-violet-500/10 to-cyan-400/10 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                      <SquarePen size={20} className="text-fuchsia-300" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white/90">
                        Create a new note
                      </p>
                      <p className="text-xs text-white/45">
                        Capture an idea, task, or shared update
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          <section className="mt-10">
            {loading && (
              <p className="text-white/50 text-sm mx-auto max-w-6xl px-1">
                Loading...
              </p>
            )}

            {tab === "trash" && (
              <p className="text-white/45 text-sm mx-auto max-w-6xl px-1 mb-4">
                Items in Trash can be deleted permanently.
              </p>
            )}

            {!loading && notes.length === 0 && <EmptyState tab={tab} />}

            {!loading &&
              notes.length > 0 &&
              tab !== "trash" &&
              pinned.length > 0 && (
                <>
                  <div className="mx-auto max-w-6xl px-1 mb-3">
                    <p className="text-xs tracking-widest text-white/45 uppercase">
                      Pinned
                    </p>
                  </div>

                  <div className="mx-auto max-w-6xl columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
                    {pinned.map((n) => (
                      <NoteCard
                        key={n._id}
                        note={n}
                        tab={tab}
                        onOpen={onOpen}
                        onPin={onPin}
                        onArchive={onArchive}
                        onTrash={onTrash}
                      />
                    ))}
                  </div>

                  <div className="mx-auto max-w-6xl px-1 mt-8 mb-3">
                    <p className="text-xs tracking-widest text-white/45 uppercase">
                      Others
                    </p>
                  </div>
                </>
              )}

            {!loading && visibleNotes.length > 0 && (
              <div className="mx-auto max-w-6xl columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
                {(tab !== "trash" ? visibleNotes : notes).map((n) => (
                  <motion.div key={n._id} className="break-inside-avoid mb-4">
                    <NoteCard
                      note={n}
                      tab={tab}
                      onOpen={onOpen}
                      onPin={onPin}
                      onArchive={onArchive}
                      onTrash={onTrash}
                    />
                    {tab === "trash" && (
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          onClick={() => onRestore(n)}
                          className="px-3 py-2 rounded-xl text-xs text-white/70 hover:bg-white/5 transition"
                        >
                          Restore
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}