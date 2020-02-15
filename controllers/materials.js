
const mongoose = require('mongoose');
//Material Model
const Material = require('../models/material');

//set host config
const port = 5001;
const server = 'localhost';
const host = `${server}:${port}`;

exports.get_all_materials = (req, res, next) => {
    Material.find()
        .sort({ date: -1 })
        .then(materials => {
            return res.status(200).json({
                count: materials.length,
                materials: materials.map(material => {
                    return {
                        // material
                        _id: material._id,
                        name: material.name,
                        description: material.description,
                        quantity: material.quantity,
                        unit: material.unit,
                        constrain: material.constrain,
                        remark: material.remark,
                        date: material.date,
                        request: {
                            type: 'GET',
                            url: `http://${host}/materials/${material._id}`
                        }
                    }
                })
            });
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                error: err
            })
        })
}

exports.get_material_by_id = (req, res, next) => {
    Material.findById(req.params.id)
        .then(material => {
            return res.json({
                count: material.length,
                material: material,
                request: {
                    type: 'GET',
                    url: `http://${host}/materials/`
                }
            })
        })
        .catch(err => {
            return res.status(404).json({
                success: false,
                error: err
            })
        })
}

exports.post_new_material = (req, res, next) => {
    const newMaterial = new Material({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        quantity: req.body.quantity,
        unit: req.body.unit,
        constrain: {
            status: req.body.constrain.status,
            constrain: req.body.constrain.constrain
        },
        remark: req.body.remark
    });
    newMaterial.save()
        .then(result => {
            return res.status(201).json({
                message: "Handling POST request to /materials",
                createdMaterial: {
                    _id: result._id,
                    name: result.name,
                    description: result.description,
                    quantity: result.quantity,
                    unit: result.unit,
                    constrain: result.constrain,
                    remark: result.remark,
                    date: result.date,
                    request: {
                        type: 'GET',
                        url: `http://${host}/materials/${result._id}`
                    }
                }
            })
        })
        .catch(err => {
            return res.status(500).json({
                success: false,
                error: err
            })
        });
}

exports.update_material_data = (req, res, next) => {
    const id = req.params.id
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    Material.updateMany({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            return res.status(200).json([
                { message: 'Material Updates' },
                { modifiedData: result.nModified },
                { parsedData: updateOps },
                { id },
                {
                    request: {
                        type: 'GET',
                        url: `http://${host}/materials/${id}`
                    }
                }
            ])
        })
        .catch(err => {
            console.log(err);

            return res.status(500).json({
                success: false,
                error: err
            })
        });
}

exports.delete_material_by_id = (req, res, next) => {
    Material.findById(req.params.id)
        .then(material => {
            material.deleteOne()
                .then(result => {
                    return res.status(200).json({
                        message: 'Material Deleted',
                        deletedMaterial: result,
                        request: [
                            {
                                type: 'GET',
                                url: `http://${host}/materials/`
                            },
                            {
                                type: 'POST',
                                url: `http://${host}/materials/`,
                                data: {
                                    name: String,
                                    description: String,
                                    quantity: Number,
                                    unit: String,
                                    constrain: { status: Boolean, constrain: String },
                                    remark: String,
                                    date: {
                                        date_created: Date,
                                        date_received: Date,
                                        date_updated: Date
                                    }
                                }
                            }
                        ]

                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        error: err
                    })
                })
        })
        .catch(err => {
            return res.status(404).json({
                success: false,
                error: err,
                message: "Item not found"
            })
        })
}