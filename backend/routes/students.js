const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const students = await User.find({role:'student'}).select('-password');
    res.json(students);
  } catch(err){ res.status(500).json({msg:err.message}); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {new:true}).select('-password');
    res.json(updated);
  } catch(err){ res.status(500).json({msg:err.message}); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({msg:'Student deleted'});
  } catch(err){ res.status(500).json({msg:err.message}); }
});

module.exports = router;
