import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, addProjectMember } from '../controllers/project.controller.js';
import { archiveProject, restoreProject } from "../controllers/project.controller.js";
const router = express.Router();

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/members', addProjectMember);
router.patch("/:id/archive", archiveProject);
router.patch("/:id/restore", restoreProject);

export default router;
