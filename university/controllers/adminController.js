const User = require('../models/userModel');
const Department = require('../models/departmentModel');
const Course = require('../models/courseModel');
const Announcement  = require('../models/announcementModel');
const Resource = require('../models/resourceModel');
const Document = require('../models/documentModel');
//const Administrator = require('../models/adminModels');

const adminControllers = {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// User Management ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Create a new user
  createUser: async (req, res) => {
    try {
        const user = new User(req.body);
        await user.setPassword(req.body.password);
        await user.save();
        req.login(user, err => {
          req.flash('success', 'Welcome to Education Website')
          //res.redirect('/')
          console.log(user)
          res.json({ message: 'User registered successfully'})
        })
    } catch (error) {
        req.flash('error', err.message);
        console.log(err)
        res.status(400).json({ error: error.message });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users: users })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
  },

  // Get a single user by ID
  getUser: async (req, res) => {
      try {
          const user = await User.findById(req.params.id);
          if (!user) {
              res.status(404).json({ message: 'User not found' });
          } else {
              res.status(200).json(user);
          }
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  },

  // Update a user by ID
  updateUser: async (req, res) => {
      try {
          const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
          if (!updatedUser) {
              res.status(404).json({ message: 'User not found' });
          } else {
              res.status(200).json(updatedUser);
          }
      } catch (error) {
          res.status(400).json({ error: error.message });
      }
  },

  // Delete a user by ID
  deleteUser: async (req, res, next) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Remove the deleted user from all courses
      const courseIdArray = deletedUser.enrolledCourses;
      await Course.updateMany(
        { _id: { $in: courseIdArray } },
        { $pull: { students: deletedUser._id } },
        { multi: true }
      );
      // If the course has an enrollment limit, increment the enrollment limit for each affected course
      const affectedCourses = await Course.find({ _id: { $in: courseIdArray } });
      for (const course of affectedCourses) {
        if (course.enrollmentLimit) {
          course.enrollmentLimit += 1;
          await course.save();
        }
      }
      res.status(200).json(deletedUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  // Block a user
  blockUser: async (req, res, next) => {
    try {
        const blockedUser = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
        if (!blockedUser) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.status(200).json(blockedUser)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
  },
  // Unblock a user
  unblockUser: async (req, res, next) => {
      try {
          const unblockedUser = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
          if (!unblockedUser) {
              return res.status(404).json({ error: 'User not found' })
          }
          res.status(200).json(unblockedUser)
      } catch (error) {
              res.status(400).json({ error: error.message })
      }
  },



///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// DEPARTMENT MANAGEMENT /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Create Department
  createDepartment: async (req, res, next) => {
    // Implement department creation logic
    try {
      const { departmentName } = req.body;
      const department = new Department({ departmentName });
      const savedDepartment = await department.save();
      res.status(201).json({ department: savedDepartment})
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Error creating department' });
    }
  },

  //Get Departments
  getDepartments: async (req, res, next) => {
    try {
      const departments = await Department.find();
      res.status(200).json({ departments: departments })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  //Get Department
  getDepartment: async (req, res, next) => {
    try {
      const departments = await Department.findById(req.params.id);
      res.status(200).json({ departments: departments })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

  //Update Department
  updateDepartment: async (req, res, next) => {
    try {
      const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedDepartment) {
        res.status(404).json({ message: 'Department not found '});
      } else {
        res.status(200).json(updatedDepartment)
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  //Delete Department
  deleteDepartment: async (req, res, next) => {
    try {
      const deletedDepartment = await Department.findByIdAndDelete(req.params.id)
      if (!deletedDepartment) {
        res.status(404).json({ message: 'Department not found' });
      } else {
        res.status(200).json(deletedDepartment)
      }
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// SEMESTER AND COURSE MANAGEMENT ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Create Course
  createCourse: async (req, res, next) => {
    // Implement course creation logic
    try {
      const course = new Course(req.body)
      const savedCourse = await course.save();
      //res.render('courses/createCourse', { course: savedCourse })
      res.status(201).json(savedCourse);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Error creating course' });
    }
  },
  // Get Courses
  getCourses: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
        const courses = await Course.find().populate('instructors', 'firstname lastname')
        const courseTags = await Course.distinct("tags"); // Get all unique tags
        res.render('courses/viewCourses', { courses: courses, courseTags: courseTags, user: user });
        //res.status(200).json({ courses: courses });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
  },

  // Get a course
  getCourse: async (req, res, next) => {
    try {
      // Fetch the course
      const course = await Course.findById(req.params.id)
        .populate('instructors', 'firstname lastname')
        .populate({
            path: 'ratings',
            populate: {
                path: 'student',
                select: 'firstname lastname' // Select only the fields you need
            }
        });
      if (!course) {
        return res.status(404).send({ error: 'Course not found' });
      }

      // Check if user is admin
      const isAdmin = req.user && req.user.isAdmin;

      // Render the viewCourse template with the course data
      res.render('courses/viewCourse', { course: course, isAdmin: isAdmin });
      //res.status(400).json({ course: course });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },


  editCourse: async (req, res, next) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' })
      } else {
        return res.render('courses/editCourse', { course: course })
      }
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  },
  //Update Course
  updateCourse: async (req, res, next) => {
      // Implement course update logic
      try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ error: 'Course not found.' });
        }
        // Parse paymentPlans string into an array of objects
        if (req.body.paymentPlans) {
          req.body.paymentPlans = req.body.paymentPlans.split(',').map(plan => {
              const [installmentAmount, frequency] = plan.trim().split(' ');
              return { installmentAmount: parseInt(installmentAmount), frequency };
          });
        }
        // Check if the instructor being assigned is indeed instructor
        if (req.body.instructors) {
          const { instructors } = req.body;
          const instructorUser = await User.findById(instructors);
          if (!instructorUser || instructorUser.role !== 'instructor') {

            return res.status(400).json({ error: 'Invalid instructor.' });
          }
        }

        // Update the course with the new data
        const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
        
        res.redirect(`/admin/course/${courseId}`)
        //res.status(200).json(updatedCourse)
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error updating course.' })
      }
  },
  //Delete Course
  deleteCourse: async (req, res, next) => {
      try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
          return res.status(404).json({ error: 'Course not found' });
        }
        res.redirect('/admin/courses')
        //res.status(200).json({ message: 'Course deleted successfully' })
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error deleting course' });
      }
  },
  // Get courses by tag
  getCoursesByTag: async (req, res, next) => {
    try {
        const tag = req.params.tag; // Get the tag from the request parameters
        const filteredCourses = await Course.find({ tags: tag }); // Query courses with the specified tag
        const courseTags = await Course.distinct("tags"); // Get all unique tags
        res.render('courses/coursesByTag', { courseTags: courseTags, filteredCourses: filteredCourses });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
  },


  
  // Create Schedule for Course
  createSchedule: async (req, res, next) => {
      try {
          const { semester, startDate, endDate, sessions } = req.body;

          // Find the course by its ID
          const course = await Course.findById(req.params.id);
          if (!course) {
              return res.status(404).json({ error: 'Course not found.' });
          }

          // Add the new schedule to the course's schedules array
          course.schedules.push({ semester, startDate, endDate, sessions });
          const updatedCourse = await course.save();
          res.status(201).json(updatedCourse);
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Error creating course schedule.' });
      }
  },

  // Update Schedule for Course
  updateSchedule: async (req, res, next) => {
      try {
          const courseId = req.params.courseId;
          const scheduleId = req.params.scheduleId;
          const { semester, startDate, endDate, sessions } = req.body;

          // Find the course by its ID
          const course = await Course.findById(req.params.id);
          if (!course) {
              return res.status(404).json({ error: 'Course not found.' });
          }

          // Find the index of the schedule to update
          const scheduleIndex = course.schedules.findIndex(schedule => schedule._id.equals(scheduleId));
          if (scheduleIndex === -1) {
              return res.status(404).json({ error: 'Schedule not found.' });
          }

          // Update the schedule properties
          const updatedSchedule = course.schedules[scheduleIndex];
          updatedSchedule.semester = semester;
          updatedSchedule.startDate = startDate;
          updatedSchedule.endDate = endDate;
          updatedSchedule.sessions = sessions;

          // Save the updated course
          await course.save();
          res.status(200).json(course);
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Error updating course schedule.' });
      }
  },

  // Delete Schedule for Course
  deleteSchedule: async (req, res, next) => {
      try {
          const courseId = req.params.courseId;
          const scheduleId = req.params.scheduleId;

          // Find the course by its ID
          const course = await Course.findById(req.params.id);
          if (!course) {
              return res.status(404).json({ error: 'Course not found.' });
          }

          // Find the index of the schedule to delete
          const scheduleIndex = course.schedules.findIndex(schedule => schedule._id.equals(scheduleId));
          if (scheduleIndex === -1) {
              return res.status(404).json({ error: 'Schedule not found.' });
          }

          // Remove the schedule from the array
          course.schedules.splice(scheduleIndex, 1);

          // Save the updated course
          await course.save();
          res.status(200).json(course);
      } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Error deleting course schedule.' });
      }
  },

  // Create Review
  createReview: async (req, res) => {
    try {
      const courseId = req.params.id;
      const { rating, comment } = req.body;

      // Find the course
      let course = await Course.findById(courseId).populate('ratings.student', 'firstname')
      if (!course) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      // Add the review
      course.ratings.push({
        student: req.user._id, // Assuming the user is authenticated
        rating,
        comment
      });
      await course.save();

      res.redirect(`/admin/course/${courseId}?reviewAdded=true&rating=${rating}&feedback=${comment}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  },

  // Update Review
  updateReview: async (req, res) => {
    try {
      const { courseId, reviewId } = req.params;
      const { rating, comment } = req.body;
      const user = req.user.id; // Get the logged-in user id

      // Find the course
      let course = await Course.findById(courseId).populate('ratings.student', 'firstname')
      if (!course) {
        return res.status(404).json({ error: 'Course not found.' });
      }

      // Find the review by reviewId
      const review = course.ratings.id(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Review not found.' });
      }

      // Check if the user is the author of the review
      if (!review.student.equals(user)) {
        return res.status(403).json({ error: 'Unauthorized access.' });
      }

      // Update the review
      review.rating = rating;
      review.comment = comment;

      // Save the updated course
      await course.save();

      res.redirect(`/admin/course/${courseId}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { courseId, reviewId } = req.params;
      //Find the course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: 'Course not found.' })
      }
      //Find and remove the review
      course.ratings.pull(reviewId);
      await course.save();
      //res.status(200).json({ message: 'Review deleted successfully.' })
      res.redirect(`/admin/course/${courseId}`)
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error.' })
    }
  },

  

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Events & Announcements //////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Create Announcement
  createAnnouncement: async (req, res, next) => {
    // Implement announcement creation logic
    try {
      const announcement = new Announcement(req.body);
      const savedAnnouncement =await announcement.save()
      res.status(201).json(savedAnnouncement);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Error creating announcement' })
    }
  },
  //Get Announcement by ID
  getAnnouncements: async (req, res, next) => {
      // Implement fetching all announcements logic
      try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
          return res.status(404).json({ error: 'Announcement not found' });
        }
        res.status(200).json({ announcement })
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error fetching announcement' });
      }
  },

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// Resource Allocation //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Create Resource
  createResource: async (req, res, next) => {
    // Implement resource creation logic
    try {
      const { name, type, capacity, equipment } = req.body;
      const resource = new Resource({ name, type, capacity, equipment });
      const savedResource = await resource.save();
      res.status(201).json(savedResource)
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Error creating resource.' })
    }
  },
  //Get Resource by ID
  getResources: async (req, res, next) => {
      // Implement fetching all resources logic
      try {
        const resourceId = req.params.resourceId;
        const resource = await Resource.findById(resourceId);
        if (!resource) {
          return res.status(404).json({ error: 'Resource not found.' })
        }
        res.status(200).json(resource);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error fetching resource.' })
      }
  },

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Document Management /////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Upload Document
  uploadDocument: async (req, res, next) => {
    // Implement document upload logic
      try {
        const { title, description, fileUrl } = req.body;
        const document = new Document({ title, description, fileUrl });
        const savedDocument = await document.save();
        res.status(201).json(savedDocument);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading document.' });
    }
  },
  //Get Document By ID
  getDocuments: async (req, res, next) => {
      // Implement fetching all documents logic
      try {
        const documentId = req.params.documentId;
        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found.' });
        }
        res.status(200).json(document);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching document.' });
    }
  }

}

module.exports = adminControllers


/*

// Administrator Routes for Courses
module.exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
    .populate('instructor', 'firstName lastName username email') // Populate instructor with user info (firstName, lastName, username, email)
    .populate('student', 'firstName lastName username email'); // Populate students with user info (firstName, lastName, username, email)
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching courses.' });
  }
};

module.exports.createCourse = async (req, res, next) => {
    try {
      const { title, description, instructor } = req.body;
      const newCourse = new Course({ title, description, instructor });
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while creating the course.' });
    }
};
  
module.exports.getCourseById = async (req, res, next) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId).populate('instructor', 'username').populate('student', 'username');
      if (!course) {
        return res.status(404).json({ error: 'Course not found.' });
      }
      res.status(200).json(course);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching course details.' });
    }
};
  
module.exports.updateCourse = async (req, res, next) => {
    try {
      const courseId = req.params.id;
      const { title, description, instructor } = req.body;
      const updatedCourse = await Course.findByIdAndUpdate(courseId, { title, description, instructor }, { new: true });
      if (!updatedCourse) {
        return res.status(404).json({ error: 'Course not found.' });
      }
      res.status(200).json(updatedCourse);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the course.' });
    }
};
  
module.exports.deleteCourse = async (req, res, next) => {
    try {
      const courseId = req.params.id;
      const deletedCourse = await Course.findByIdAndDelete(courseId);
      if (!deletedCourse) {
        return res.status(404).json({ error: 'Course not found.' });
      }
      res.status(200).json({ message: 'Course deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the course.' });
    }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
// Administrator Routes for Instructors
module.exports.getAllInstructors = async (req, res, next) => {
    try {
      const instructors = await User.find({ role: 'instructor' });
      res.status(200).json(instructors);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching instructors.' });
    }
};
  
module.exports.getInstructorById = async (req, res, next) => {
    try {
      const instructorId = req.params.id;
      const instructor = await User.findById(instructorId);
      if (!instructor || instructor.role !== 'instructor') {
        return res.status(404).json({ error: 'Instructor not found.' });
      }
      res.status(200).json(instructor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching instructor details.' });
    }
};
  
module.exports.updateInstructor = async (req, res, next) => {
    try {
      const instructorId = req.params.id;
      // Update any instructor-specific fields here if needed
      const updatedInstructor = await User.findByIdAndUpdate(instructorId, req.body, { new: true }); // Find the instructor by their ID and update their data with the data from the request body
      if (!updatedInstructor || updatedInstructor.role !== 'instructor') {
        return res.status(404).json({ error: 'Instructor not found.' });
      }
      res.status(200).json(updatedInstructor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the instructor.' });
    }
};

module.exports.deleteInstructor = async (req, res, next) => {
  try {
    const instructorId = req.params.id;
    const deletedInstructor = await User.findByIdAndDelete(instructorId);
    if (!deletedInstructor || deletedInstructor.role !== 'instructor') {  // If the instructor is not found or their role is not 'instructor', send a 404 error
      return res.status(404).json({ error: 'Instructor not found.' });
    }
    res.status(200).json({ message: 'Instructor deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the instructor.' });
  }
};

module.exports.enrollInstructorToCourse = async (req, res, next) => {
  try {
    const { courseId, instructorId } = req.params;
    //Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' })
    }
    //Check if the instructor exists and has the role 'instructor'
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(404).json({ error: 'Instructor not found.' })
    }
    //Enroll the instructor to the course for teaching
    if (!course.instructor.includes(instructorId)) {
      course.instructor.push(instructorId);
      await course.save();
    }
    res.status(200).json({ message: 'Instructor enrolled in the course for teaching.' })
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while enrolling the instructoor.'})
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Administrator Routes for Students
module.exports.getAllStudents = async (req, res, next) => {
    try {
      const students = await User.find({ role: 'student' });
      res.status(200).json(students);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching students.' });
    }
};
  
module.exports.getStudentById = async (req, res, next) => {
    try {
      const studentId = req.params.id;
      const student = await User.findById(studentId);
      if (!student || student.role !== 'student') {
        return res.status(404).json({ error: 'Student not found.' });
      }
      res.status(200).json(student);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching student details.' });
    }
};
  
module.exports.updateStudent = async (req, res, next) => {
    try {
      const studentId = req.params.id;
      // Update any student-specific fields here if needed
      const updatedStudent = await User.findByIdAndUpdate(studentId, req.body, { new: true });
      if (!updatedStudent || updatedStudent.role !== 'student') {
        return res.status(404).json({ error: 'Student not found.' });
      }
      res.status(200).json(updatedStudent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the student.' });
    }
};
  
module.exports.deleteStudent = async (req, res, next) => {
    try {
      const studentId = req.params.id;
      const deletedStudent = await User.findByIdAndDelete(studentId);
      if (!deletedStudent || deletedStudent.role !== 'student') {
        return res.status(404).json({ error: 'Student not found.' });
      }
      res.status(200).json({ message: 'Student deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the student.' });
    }
};
  


*/








/*

// Course CRUD - Read (Course catalog)
module.exports.courseCatalog = async (req, res) => {
    try {
        const courses = await Course.find();
        res.render('courseCatalog', { courses });
        //res.json(courses);
    } catch (err) {
        console.log('Error fetching course catalog: ', err)
        res.redirect('/user/dashboard');
    }
};
//Create a new course
module.exports.newCourse =  (req, res) => {
    res.render('newCourse')
}

//Course CRUD - Post a course
module.exports.createCourse = async (req, res) => {
    try {
        const { title, description, instructor } = req.body;
        // Check if all required fields are present
        if (!title || !description || !instructor) {
            return res.status(400).json({ message: 'Title, description, and instructor are required fields.' });
        }
        const newCourse = new Course({ title, description, instructor });
        await newCourse.save();
        res.redirect('/course')
        console.log(newCourse)
        //res.status(201).json(newCourse);
    } catch (err) {
        console.log('Error creating course: ', err);
        res.status(500).json({ message: 'Failed to create course' });
    }
}



// Course CRUD - Read (Individual course details)
module.exports.getCourseDetails = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.render('courseDetails', { course , isAuthenticated : true });
        //res.json(course);
    } catch (err) {
        console.log('Error fetching course details:', err);
        res.status(500).json({ message: 'Failed to fetch course details' })
    }
}

module.exports.editCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.render('updateCourse', { course })
    } catch (err) {
        console.log('Error fetching course details:', err);
        res.status(500).json({ message: 'Failed to fetch course details '})
    }
}


//Course CRUD - Update
module.exports.updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, description, instructor } = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(courseId, { title, description, instructor }, { new: true});
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found'});
        }
        res.redirect('/course/' + courseId + '/details'); // Redirect to the updated course details page
        //res.json(updatedCourse)
    } catch (err) {
        console.log('Error updating course', err);
        res.status(500).json({ message: 'Failed to update course' })
    }
}

//Course CRUD - DELETE
module.exports.deleteCourse = async (req, res) => {
    try {
        //Check if the user is an administrator
        const courseId = req.params.id;
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        console.log(`This movie is now deleted ${deletedCourse.title}`)
        res.redirect('/course/'); // Redirect to the course catalog page or any other appropriate page
        //res.json(deletedCourse);
    } catch (err) {
        console.log('Error deleting course:', err);
        res.status(500).json({ message: 'Failed to delete course' })
    }
}








//Course enrollment handler
module.exports.courseEnrollment = async (req, res) => {
    const courseId = req.paramas.id;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            res.redirect('/course/catalog');
        } else {
            const user = req.user;
            user.enrolledCourses.push(course);
            await user.save();
            res.redirect('/user/dashboard')
        }
    } catch (err) {
        console.log('Error enrolling in a course: ', err);
        res.redirect('/course/catalog');
    }
}

//Assignment handler
module.exports.viewAssignments = (req, res) => {
    const courseId = req.params.id;
    //Fetch gradebook data for the given courseId
    //Render the gradebook page with the fetched data
    res.render('assignment', { courseId })
}


//Gradebook handler
module.exports.viewGradebook = (req, res) => {
    const courseId = req.params.id;
    //Fetch gradebook data for the given courseId
    //Render the gradebook page with the fetched data
    res.render('gradebook', { courseId })
}

*/