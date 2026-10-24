import { AuditLog } from '../models/index.js';
export async function recordAudit({ actor, action, entity, entityId }) {
  try {
    await AuditLog.create({ actor: actor?.email || 'system', action, entity, entityId: String(entityId || ''), timestamp: new Date().toISOString() });
    const old = await AuditLog.find().sort({ createdAt: -1 }).skip(250).select('_id').lean();
    if (old.length) await AuditLog.deleteMany({ _id: { $in: old.map(x => x._id) } });
  } catch (err) { console.error('Audit log write failed:', err.message); }
}
