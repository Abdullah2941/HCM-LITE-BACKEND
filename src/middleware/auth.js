import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User, toItem } from '../models/index.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Session user not found.' });
    const safe = toItem(user);
    req.user = { id: safe.id, name: safe.name, email: safe.email, role: safe.role, department: safe.department };
    next();
  } catch (err) {
    if (err?.name === 'JsonWebTokenError' || err?.name === 'TokenExpiredError' || err?.name === 'CastError') return res.status(401).json({ message: 'Invalid or expired token.' });
    next(err);
  }
}
export function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: 'You do not have permission to perform this action.' });
}
