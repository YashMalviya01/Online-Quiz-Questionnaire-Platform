module.exports = (...roles) => (req, res, next) => {
  // ⚠️ ROLE AUTHORIZATION TEMPORARILY DISABLED FOR DEVELOPMENT ⚠️
  console.log('⚠️ WARNING: Role authorization is bypassed - for development only!');
  return next();

  /* ORIGINAL CODE - UNCOMMENT TO RE-ENABLE ROLE AUTHORIZATION
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
  */
};
