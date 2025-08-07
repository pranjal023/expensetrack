function ensureAuthenticated(req, _res, next) {
  if (req.session && req.session.userId) return next();
  return _res.status(401).json({ success:false, message:'Unauthorized' });
}
module.exports = { ensureAuthenticated };
