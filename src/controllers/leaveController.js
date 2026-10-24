import { LeaveRequest, toItem } from '../models/index.js';
import { recordAudit } from '../services/auditService.js';
export async function listLeave(req, res, next) {
  try { const filter = req.user.role === 'Employee' ? { employeeName: req.user.name } : {}; const docs = await LeaveRequest.find(filter).sort({ createdAt: -1 }); const items = docs.map(toItem); res.json({ items, total: items.length }); } catch (err) { next(err); }
}
export async function createLeave(req, res, next) {
  try {
    const type = String(req.body?.type || '').trim(), startDate = String(req.body?.startDate || ''), endDate = String(req.body?.endDate || '');
    if (!type || !startDate || !endDate || Number.isNaN(Date.parse(startDate)) || Number.isNaN(Date.parse(endDate)) || startDate > endDate) return res.status(400).json({ message: 'Provide a leave type and valid start/end dates.' });
    const item = toItem(await LeaveRequest.create({ employeeName: req.user.name, type, startDate, endDate, status: 'Pending' }));
    await recordAudit({ actor: req.user, action: 'CREATE', entity: 'leave', entityId: item.id }); res.status(201).json({ item });
  } catch (err) { next(err); }
}
export async function updateLeaveStatus(req, res, next) {
  try {
    const status = String(req.body?.status || ''); if (!['Approved', 'Rejected', 'Pending'].includes(status)) return res.status(400).json({ message: 'Status must be Approved, Rejected, or Pending.' });
    const doc = await LeaveRequest.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: 'Leave request not found.' }); const item = toItem(doc);
    await recordAudit({ actor: req.user, action: 'UPDATE_STATUS', entity: 'leave', entityId: item.id }); res.json({ item });
  } catch (err) { if (err.name === 'CastError') return res.status(404).json({ message: 'Leave request not found.' }); next(err); }
}
