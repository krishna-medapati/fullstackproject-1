const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
