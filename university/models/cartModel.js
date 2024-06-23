const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who owns the cart
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Array of courses in the cart
});

cartSchema.methods.calculateTotalPrice = async function() {
    const Course = require('./courseModel');
    let totalPrice = 0;
    for (const courseId of this.courses) {
      const course = await Course.findById(courseId);
      totalPrice += course.price;
    }
    return totalPrice;
};

const Cart  = mongoose.model('Cart', cartSchema);

module.exports = Cart;

