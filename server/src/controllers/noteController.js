import Note from "../models/note.model.js";
import User from "../models/user.model.js";

// helper
const getIdString = (value) => {
  if (!value) return null;
  if (value._id) return value._id.toString();
  return value.toString();
};

const getUserPermission = (note, userId) => {
  const currentUserId = userId.toString();

  if (getIdString(note.owner) === currentUserId) {
    return "owner";
  }

  const collaborator = note.collaborators.find(
    (c) => getIdString(c.user) === currentUserId
  );

  return collaborator ? collaborator.role : null;
};

// GET /api/notes
export const getNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search = "", tab = "notes" } = req.query;

    const filter = {
      $or: [{ owner: userId }, { "collaborators.user": userId }],
    };

    if (tab === "archive") {
      filter.archived = true;
      filter.trashed = false;
    } else if (tab === "trash") {
      filter.trashed = true;
    } else {
      filter.archived = false;
      filter.trashed = false;
    }

    let notes;

    if (search.trim()) {
      notes = await Note.find({
        ...filter,
        $text: { $search: search.trim() },
      }).sort({ pinned: -1, updatedAt: -1 });
    } else {
      notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
    }

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

// POST /api/notes
export const createNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title = "", content = "" } = req.body;

    const note = await Note.create({
      owner: userId,
      title,
      content,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note" });
  }
};

// PUT /api/notes/:id
export const updateNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const permission = getUserPermission(note, userId);

    if (!permission) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (permission === "viewer") {
      return res.status(403).json({ message: "View-only access" });
    }

    const { title, content } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note" });
  }
};

// PATCH /api/notes/:id/toggle-pin
export const togglePin = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const permission = getUserPermission(note, userId);

    if (!permission) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (permission === "viewer") {
      return res.status(403).json({ message: "View-only access" });
    }

    note.pinned = !note.pinned;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to update pin" });
  }
};

// PATCH /api/notes/:id/archive
export const toggleArchive = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const permission = getUserPermission(note, userId);

    if (!permission) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (permission === "viewer") {
      return res.status(403).json({ message: "View-only access" });
    }

    note.archived = !note.archived;
    if (note.archived) note.pinned = false;

    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to archive note" });
  }
};

// PATCH /api/notes/:id/trash
export const moveToTrash = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const permission = getUserPermission(note, userId);

    if (!permission) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (permission === "viewer") {
      return res.status(403).json({ message: "View-only access" });
    }

    note.trashed = true;
    note.pinned = false;
    note.archived = false;

    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to move note to trash" });
  }
};

// PATCH /api/notes/:id/restore
export const restoreFromTrash = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const permission = getUserPermission(note, userId);

    if (!permission) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (permission === "viewer") {
      return res.status(403).json({ message: "View-only access" });
    }

    note.trashed = false;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to restore note" });
  }
};

// DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const permission = getUserPermission(note, userId);

    if (permission !== "owner") {
      return res
        .status(403)
        .json({ message: "Only owner can permanently delete" });
    }

    await Note.findByIdAndDelete(id);

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};

// GET collaborators
export const getCollaborators = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(id)
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const permission = getUserPermission(note, userId);

    if (!permission) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({
      owner: note.owner,
      collaborators: note.collaborators || [],
      permission,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load collaborators" });
  }
};

// ADD collaborator
export const addCollaborator = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { email, role = "viewer" } = req.body;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (getIdString(note.owner) !== userId.toString()) {
      return res.status(403).json({ message: "Only owner can add collaborators" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === getIdString(note.owner)) {
      return res.status(400).json({ message: "Owner already has access" });
    }

    const exists = note.collaborators.some(
      (c) => getIdString(c.user) === user._id.toString()
    );

    if (exists) {
      return res.status(400).json({ message: "Collaborator already added" });
    }

    note.collaborators.push({
      user: user._id,
      role: role === "editor" ? "editor" : "viewer",
    });

    await note.save();

    const updatedNote = await Note.findById(id)
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    res.status(200).json({
      owner: updatedNote.owner,
      collaborators: updatedNote.collaborators,
      permission: "owner",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add collaborator" });
  }
};

// REMOVE collaborator
export const removeCollaborator = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { id, userId } = req.params;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (getIdString(note.owner) !== ownerId.toString()) {
      return res.status(403).json({ message: "Only owner can remove collaborators" });
    }

    note.collaborators = note.collaborators.filter(
      (c) => getIdString(c.user) !== userId
    );

    await note.save();

    const updatedNote = await Note.findById(id)
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    res.status(200).json({
      owner: updatedNote.owner,
      collaborators: updatedNote.collaborators,
      permission: "owner",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove collaborator" });
  }
};

// UPDATE collaborator role
export const updateCollaboratorRole = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { id, userId } = req.params;
    const { role } = req.body;

    if (!["viewer", "editor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (getIdString(note.owner) !== ownerId.toString()) {
      return res.status(403).json({ message: "Only owner can update collaborator roles" });
    }

    const collaborator = note.collaborators.find(
      (c) => getIdString(c.user) === userId
    );

    if (!collaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    collaborator.role = role;
    await note.save();

    const updatedNote = await Note.findById(id)
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    res.status(200).json({
      owner: updatedNote.owner,
      collaborators: updatedNote.collaborators,
      permission: "owner",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update collaborator role" });
  }
};