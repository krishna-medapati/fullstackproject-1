const router = require('express').Router();
const auth = require('../middleware/auth');
const Shift = require('../models/Shift');
router.get('/', auth, async (req, res) => {
  try { const shifts = await Shift.find().populate('student','name email').populate('job','title department'); res.json(shifts); }
  catch(err){ res.status(500).json({msg:err.message}); }
});
router.post('/', auth, async (req, res) => {
  try { const shift = new Shift(req.body); await shift.save(); res.json(shift); }
  catch(err){ res.status(500).json({msg:err.message}); }
});
router.put('/:id', auth, async (req, res) => {
  try { const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(shift); }
  catch(err){ res.status(500).json({msg:err.message}); }
});
router.delete('/:id', auth, async (req, res) => {
  try { await Shift.findByIdAndDelete(req.params.id); res.json({msg:'Shift deleted'}); }
  catch(err){ res.status(500).json({msg:err.message}); }
});
module.exports = router;
