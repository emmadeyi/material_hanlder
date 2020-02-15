const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth');

//Material Model
const Material = require('../../models/material');

//Import controllers
const MaterialController = require('../../controllers/materials');

//set host config
const port = 5001;
const server = 'localhost';
const host = `${server}:${port}`

// @route GET api/materials
// @desc Get All materials
// @access Public
router.get('/', MaterialController.get_all_materials);

// @route POST api/materials
// @desc Create an material request
// @access Public
router.post('/', checkAuth, MaterialController.post_new_material);

// @route GET api/materials/:id
// @desc Get material by ID
// @access Public
router.get('/:id', MaterialController.get_material_by_id);

// @route PATCH api/materials/:id
// @desc Update material by ID
// @access Public
router.patch('/:id', checkAuth, MaterialController.update_material_data);

// @route DELETE api/materials/:id
// @desc Delete an material request
// @access Public
router.delete('/:id', checkAuth, MaterialController.delete_material_by_id);

module.exports = router;