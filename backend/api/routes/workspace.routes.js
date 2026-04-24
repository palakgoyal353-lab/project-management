import express from 'express';
import { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace, inviteMember } from '../controllers/workspace.controller.js';

const router = express.Router();

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.put('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);
router.post('/:id/invite', inviteMember);

export default router;
