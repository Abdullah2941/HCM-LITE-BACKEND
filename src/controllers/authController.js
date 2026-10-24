import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, toItem } from '../models/index.js';
import { config } from '../config/env.js';
import { recordAudit } from '../services/auditService.js';

export async function login(req, res, next) {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Email or password is incorrect.' });
    const safeUser = toItem(user);
    const token = jwt.sign({ sub: safeUser.id, role: safeUser.role }, config.jwtSecret, { expiresIn: '8h' });
    await recordAudit({ actor: safeUser, action: 'LOGIN', entity: 'session', entityId: safeUser.id });
    res.json({ token, user: safeUser });
  } catch (err) { next(err); }
}
export function me(req, res) { res.json({ user: req.user }); }
