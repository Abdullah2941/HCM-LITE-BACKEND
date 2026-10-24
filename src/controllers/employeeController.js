import { Employee, toItem } from '../models/index.js';
import { recordAudit } from '../services/auditService.js';
export async function listEmployees(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    const filter = req.user.role === 'Employee' ? { email: req.user.email } : {};
    if (q) filter.$or = ['name', 'email', 'department', 'role'].map(k => ({ [k]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }));
    const docs = await Employee.find(filter).sort({ createdAt: -1 }); const items = docs.map(toItem);
    res.json({ items, total: items.length });
  } catch (err) { next(err); }
}
export async function createEmployee(req, res, next) {
  try {
    const name = String(req.body?.name || '').trim(), email = String(req.body?.email || '').trim().toLowerCase(), department = String(req.body?.department || '').trim(), role = String(req.body?.role || '').trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !department || !role) return res.status(400).json({ message: 'Valid name, email, department and role are required.' });
    if (await Employee.exists({ email })) return res.status(409).json({ message: 'An employee with this email already exists.' });
    const item = toItem(await Employee.create({ name, email, department, role, status: 'Active' }));
    await recordAudit({ actor: req.user, action: 'CREATE', entity: 'employee', entityId: item.id }); res.status(201).json({ item });
  } catch (err) { if (err.code === 11000) return res.status(409).json({ message: 'An employee with this email already exists.' }); next(err); }
}

export async function updateEmployee(req,res,next){try{const fields={};for(const key of ['name','email','role','department','status'])if(req.body?.[key]!==undefined)fields[key]=String(req.body[key]).trim();if(fields.email)fields.email=fields.email.toLowerCase();if(fields.name!==undefined&&fields.name.length<2)return res.status(400).json({message:'Name must be at least 2 characters.'});if(fields.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))return res.status(400).json({message:'Valid email is required.'});const doc=await Employee.findByIdAndUpdate(req.params.id,fields,{new:true,runValidators:true});if(!doc)return res.status(404).json({message:'Employee not found.'});await recordAudit({actor:req.user,action:'UPDATE',entity:'employee',entityId:String(doc._id)});res.json({item:toItem(doc)});}catch(e){if(e.code===11000)return res.status(409).json({message:'An employee with this email already exists.'});if(e.name==='CastError')return res.status(404).json({message:'Employee not found.'});next(e)}}
export async function deleteEmployee(req,res,next){try{const doc=await Employee.findByIdAndDelete(req.params.id);if(!doc)return res.status(404).json({message:'Employee not found.'});await recordAudit({actor:req.user,action:'DELETE',entity:'employee',entityId:String(doc._id)});res.json({ok:true});}catch(e){if(e.name==='CastError')return res.status(404).json({message:'Employee not found.'});next(e)}}
