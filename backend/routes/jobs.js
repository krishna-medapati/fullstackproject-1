const router = require('express').Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

router.get('/', async (req, res) => {
  try { res.json(await Job.find()); } catch(err){ res.status(500).json({msg:err.message}); }
});
router.post('/', auth, async (req, res) => {
  try { const job = new Job({...req.body,postedBy:req.user.id}); await job.save(); res.json(job); }
  catch(err){ res.status(500).json({msg:err.message}); }
});
router.put('/:id', auth, async (req, res) => {
  try { const job = await Job.findByIdAndUpdate(req.params.id,req.body,{new:true}); res.json(job); }
  catch(err){ res.status(500).json({msg:err.message}); }
});
router.delete('/:id', auth, async (req, res) => {
  try { await Job.findByIdAndDelete(req.params.id); res.json({msg:'Deleted'}); }
  catch(err){ res.status(500).json({msg:err.message}); }
});
module.exports = router;
