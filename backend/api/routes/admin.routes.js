import express from 'express';
import { getAllDbData, deleteRecord, seedDb, resetDb, getRoles, createRole, updateRole, deleteRole, assignRoleToUser, getUserRole } from '../controllers/admin.controller.js';

const router = express.Router();

// DB endpoints
router.get('/db', getAllDbData);
router.delete('/db/:table/:id', deleteRecord);
router.post('/db/seed', seedDb);
router.post('/db/reset', resetDb);

// Role management endpoints
router.get('/roles', getRoles);
router.post('/roles', createRole);
router.put('/roles/:roleName', updateRole);
router.delete('/roles/:roleName', deleteRole);
router.post('/roles/assign', assignRoleToUser);
router.get('/users/:userId/role', getUserRole);

export default router;
