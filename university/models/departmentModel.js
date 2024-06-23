const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true, unique: true },
    facultyMemembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    staffMemembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;