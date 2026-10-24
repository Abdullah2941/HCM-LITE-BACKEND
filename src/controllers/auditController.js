import { AuditLog, toItem } from '../models/index.js';
export async function listAudit(req, res, next) { try { const docs = await AuditLog.find().sort({ createdAt: -1 }).limit(100); res.json({ items: docs.map(toItem) }); } catch (err) { next(err); } }
