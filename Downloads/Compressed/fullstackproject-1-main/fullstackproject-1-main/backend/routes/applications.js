const router = require('express').Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');

router.get('/', auth, async (req, res) => {
  try {
    const apps = await Application.find().populate('student', 'name email').populate('job', 'title department');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const app = new Application({ ...req.body, student: req.user.id });
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(app);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
