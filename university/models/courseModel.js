const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseCode: { type: Number, required: true },
  courseName: { type: String, required: true },
  description: { type: String }, // Additional field: Description of the course
  prerequisites: [{ type: String }], // Additional field: Prerequisites for the course
  duration: { type: String }, // Additional field: Duration of the course
  location: { type: String }, // Additional field: Location of the course
  tags: [{ type: String }], // Additional field: Tags or categories for the course
  images: [{ public_id: String, url: String }], // Additional field: Image or thumbnail for the course
  enrollmentLimit: { type: Number }, // Additional field: Maximum number of students allowed to enroll
  availability: { type: String, enum: ['Active', 'Inactive', 'Upcoming'], default: 'Active' }, // Additional field: Status of the course
  instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  schedules: [{
    year: { type: String, enum: ['Freshman', 'Sophomore', 'Junior', 'Senior'] }, // Add year field
    semester: String,
    startDate: Date,
    endDate: Date,
    sessions: [{ day: String, time: String }],
  }],
  discounts: [{ 
    code: String, 
    percentage: Number, 
    expirationDate: Date 
  }], // Array of discount objects
  paymentPlans: [{
    installmentAmount: { type: Number, required: true }, // Example of a required field
    frequency: { type: String, required: true }, // Example of a required field
  }],
  materials: [{ 
    title: String, 
    url: String 
  }], // Array of course materials
  certification: { 
    type: String, 
    required: true 
  }, // Certification type
  level: { 
    type: String 
  }, // Level or track of the course
  progress: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedModules: [{ type: String }],
    grade: Number,
  }], // Array of student progress objects
  ratings: [{ 
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String
  }],
  resources: [{ 
    title: String, 
    url: String 
  }],
  // Additional field: Additional resources related to the course
  price: { type: Number, required: true }, // New field: Price of the course
  refundPolicy: { type: String, required: true } // New field: Refund policy for the course
});

// Method to enroll a student in the course
courseSchema.methods.enrollStudent = async function(userId) {
  try {
      // Check if the user is already enrolled in the course
      if (this.students.includes(userId)) {
          throw new Error('User is already enrolled in this course');
      }

      // Add the user to the list of enrolled students
      this.students.push(userId);

      // Save the updated course
      await this.save();

      // Optionally, update the user model to reflect the enrollment
      const user = await User.findById(userId);
      if (!user) {
          throw new Error('User not found');
      }
      user.enrolledCourses.push(this._id);
      await user.save();

      return this; // Return the updated course document
  } catch (error) {
      throw error;
  }
};



// Course Materials
const materialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Additional field: Author of the material
    createdAt: { type: Date, default: Date.now }, // Additional field: Date and time when the material was created
  });
  
  // Course Syllabus
  const syllabusSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Additional field: User who created the syllabus
    createdAt: { type: Date, default: Date.now }, // Additional field: Date and time when the syllabus was created
  });
  
  // Course Grade Criteria
  const gradeCriteriaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    criteria: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Additional field: User who created the grade criteria
    createdAt: { type: Date, default: Date.now }, // Additional field: Date and time when the grade criteria was created
  });

const Course = mongoose.model('Course', courseSchema);
const Material = mongoose.model('Material', materialSchema);
const Syllabus = mongoose.model('Syllabus', syllabusSchema);
const GradeCriteria = mongoose.model('GradeCriteria', gradeCriteriaSchema);

module.exports = Course

/*
module.exports = {
  Course,
  Material,
  Syllabus,
  GradeCriteria,
};
*/