import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  togglePin,
  toggleArchive,
  moveToTrash,
  restoreFromTrash,
  deleteNote,
  getCollaborators,
  addCollaborator,
  updateCollaboratorRole,
  removeCollaborator,
} from "../controllers/noteController.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Notes
router.get("/", protect, getNotes);
router.post("/", protect, createNote);
router.put("/:id", protect, updateNote);

router.patch("/:id/toggle-pin", protect, togglePin);
router.patch("/:id/archive", protect, toggleArchive);
router.patch("/:id/trash", protect, moveToTrash);
router.patch("/:id/restore", protect, restoreFromTrash);

router.delete("/:id", protect, deleteNote);

// Collaborators
router.get("/:id/collaborators", protect, getCollaborators);
router.post("/:id/collaborators", protect, addCollaborator);
router.patch("/:id/collaborators/:userId", protect, updateCollaboratorRole);
router.delete("/:id/collaborators/:userId", protect, removeCollaborator);

export default router;