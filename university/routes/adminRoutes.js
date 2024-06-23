const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/adminController')
const { isAuthenticated, isAdmin } = require('../controllers/authController')

// User Management Routes
router.route('/create')
    .post(isAuthenticated, isAdmin, adminControllers.createUser)
router.route('/users')
    .get(isAuthenticated, isAdmin, adminControllers.getAllUsers)
router.route('/users/:id')
    .get(isAuthenticated, isAdmin, adminControllers.getUser)
    .put(isAuthenticated, isAdmin, adminControllers.updateUser)
    .delete(isAuthenticated, isAdmin, adminControllers.deleteUser)
    .put(isAuthenticated, isAdmin, adminControllers.blockUser)
    .put(isAuthenticated, isAdmin, adminControllers.unblockUser)

// Department Management Routes
router.route('/departments/create')
    .post(isAuthenticated, isAdmin, adminControllers.createDepartment)
router.route('/departments')
    .get(isAuthenticated, isAdmin, adminControllers.getDepartments)
router.route('/departments/:id')
    .get(isAuthenticated, isAdmin, adminControllers.getDepartment)
    .put(isAuthenticated, isAdmin, adminControllers.updateDepartment)
    .delete(isAuthenticated, isAdmin, adminControllers.deleteDepartment)

// Semester and Course Management Routes
router.route('/courses/create')
    .post(isAuthenticated, isAdmin, adminControllers.createCourse)
router.route('/courses')
    .get(adminControllers.getCourses)
router.route('/course/:id')
    .get(adminControllers.getCourse)
router.route('/course/:id/edit')
    .get(isAuthenticated, isAdmin, adminControllers.editCourse)
router.route('/course/:id/update')
    .put(adminControllers.updateCourse)
router.route('/course/:id/delete')
    .get(adminControllers.deleteCourse)
    
router.route('/course/tag/:tag')
    .get(adminControllers.getCoursesByTag);

router.route('/courses/:id/schedule/create')
    .post(isAuthenticated, isAdmin, adminControllers.createSchedule)
router.route('/courses/:id/schedule/:scheduleId')
    .put(isAuthenticated, isAdmin, adminControllers.updateSchedule)
    .delete(isAuthenticated, isAdmin, adminControllers.deleteSchedule)

router.route('/course/:id/reviews')
    .post(isAuthenticated, adminControllers.createReview)
router.route('/course/:courseId/reviews/:reviewId/update')
    .put(isAuthenticated, adminControllers.updateReview)
router.route('/course/:courseId/reviews/:reviewId/delete')
    .get(isAuthenticated, adminControllers.deleteReview)

// Events & Announcements Routes
router.route('/announcements/create')
    .post(isAuthenticated, isAdmin, adminControllers.createAnnouncement)
router.route('/announcements/:id')
    .get(isAuthenticated, isAdmin, adminControllers.getAnnouncements)



// Resource Allocation Routes
router.route('/resources/create')
    .post(isAuthenticated, isAdmin, adminControllers.createResource)
router.route('/resources/:resourceId')
    .get(isAuthenticated, isAdmin, adminControllers.getResources)


// Document Management Routes
router.route('/docuements/upload')
    .post(isAuthenticated, isAdmin, adminControllers.uploadDocument)
router.route('/documents/:documentId')
    .get(isAuthenticated, isAdmin, adminControllers.getDocuments)


module.exports = router;




/*
// Administrator Routes for Courses
router.get('/admin/courses', isAuthenticated, isAdmin, adminController.getAllCourses);
router.post('/admin/courses', isAuthenticated, isAdmin, adminController.createCourse);
router.get('/admin/courses/:id', isAuthenticated, isAdmin, adminController.getCourseById);
router.put('/admin/courses/:id', isAuthenticated, isAdmin, adminController.updateCourse);
router.delete('/admin/courses/:id', isAuthenticated, isAdmin, adminController.deleteCourse);

// Administrator Routes for Instructors
router.get('/admin/instructors', isAuthenticated, isAdmin, adminController.getAllInstructors);
router.get('/admin/instructors/:id', isAuthenticated, isAdmin, adminController.getInstructorById);
router.put('/admin/instructors/:id', isAuthenticated, isAdmin, adminController.updateInstructor);
router.post('/admin/instructors/:courseId/:instructorId', isAdmin, adminController.enrollInstructorToCourse);  // Admin route to enroll an instructor to a course for teaching

// Administrator Routes for Students
router.get('/admin/students', isAuthenticated, isAdmin, adminController.getAllStudents);
router.get('/admin/students/:id', isAuthenticated, isAdmin, adminController.getStudentById);
router.put('/admin/students/:id', isAuthenticated, isAdmin, adminController.updateStudent);
router.delete('/admin/students/:id', isAuthenticated, isAdmin, adminController.deleteStudent);

module.exports = router;
*/







/*

//Define a route to get all courses
router.get('/', isAuthenticated, courseControllers.courseCatalog);

//Define a route to create a new course
router.get('/new', isAuthenticated, isAdmin, courseControllers.newCourse);

//Define a route to post new course
router.post('/', isAuthenticated, isAdmin, courseControllers.createCourse);

//Define a route to get a course by ID
router.get('/:id/details', isAuthenticated, courseControllers.getCourseDetails);

router.get('/:id/edit', isAuthenticated, isAdmin, courseControllers.editCourse);

//Define a route to update a course by ID
router.put('/:id/update', isAuthenticated, isAdmin, courseControllers.updateCourse);

//Define a route to delete a course by ID
router.get('/:id/delete', isAuthenticated, isAdmin, courseControllers.deleteCourse);





//Course enrollment route
router.get('/enroll/:id', courseControllers.courseEnrollment);

//Assignment route
router.get('/assignments/:id', courseControllers.viewAssignments);

//Gradebook route
router.get('/gradebook/:id', courseControllers.viewGradebook)


module.exports = router;

*/