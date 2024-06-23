const {Course, Material, Syllabus, GradeCriteria } = require('../models/courseModel')
const User = require('../models/userModel')


const courseControllers = {
    
}








/*

// Administrator Routes

const courseControllers = {
    ////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////  COURSE /////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Render the page for creating a new course
    renderCourseCreationPage: (req, res) => {
        res.render('courses/new');
    },
    // Create a new course
    createCourse: async (req, res, next) => {
        try {
            // Extract necessary data from request body
            
            //const { courseCode, courseName, instructors, students, schedules } = req.body;  
            //const slug = slugify(courseName);
            //const newCourse = new Course({
            //    courseCode,
            //    courseName,
            //    instructors,
            //    students,
            //    schedules,
            //    slug //Include the generated slug
            //})
            //await newCourse.save();
            
            const newCourse = new Course(req.body);
            await newCourse.save();
            res.redirect('/courses')
        } catch (err) {
            res.status(400).json({ err: err.message})
        }
    },
    // Get all courses
    getAllCourses: async (req, res, next) => {
        try {
            // Fetch all courses from the database
            const courses = await Course.find();
            // Render the courses page with the fetched courses
            res.render('courses/all', { courses });
        } catch (error) {
            // Handle errors
            res.status(500).json({ error: error.message });
        }
    },
    // Get a single course by its ID
    getCourseById: async (req, res, next) => {
        try {
            // Extract the course ID from the request parameters
            const courseId = req.params.id;
            // Find the course by its ID in the database
            const course = await Course.findById(courseId);
            // Render the course page with the fetched course
            res.render('courses/single', { course });
        } catch (error) {
            // Handle errors
            res.status(404).json({ error: 'Course not found' });
        }
    },
    // Edit a course by its ID
    editCourse: async (req, res, next) => {
        try {
            // Extract the course ID from the request parameters
            const courseId = req.params.id;

            // Find the course by its ID in the database
            const course = await Course.findById(courseId);

            // Render the edit course page with the fetched course data
            res.render('courses/edit', { course });
        } catch (error) {
            // Handle errors
            res.status(404).json({ error: 'Course not found' });
        }
    },
    // Update a course by its ID
    updateCourse: async (req, res, next) => {
        try {
            // Extract the course ID from the request parameters
            const courseId = req.params.id;
            // Find the course by its ID in the database and update its details
            const updatedCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true });
            // Redirect to the updated course page
            res.redirect(`/courses/${courseId}`);
        } catch (error) {
            // Handle errors
            res.status(400).json({ error: error.message });
        }
    },
    // Delete a course by its ID
    deleteCourse: async (req, res, next) => {
        try {
            // Extract the course ID from the request parameters
            const courseId = req.params.id;
            // Find the course by its ID in the database and delete it
            await Course.findByIdAndDelete(courseId);
            // Redirect to the courses page
            res.redirect('/courses');
        } catch (error) {
            // Handle errors
            res.status(400).json({ error: error.message });
        }
    },



    ////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////  MATERIALS //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Material CRUD operations
    createMaterial: async (req, res, next) => {
        try {
        const newMaterial = new Material(req.body);
        await newMaterial.save();
        res.redirect(`/courses/${req.body.courseId}`);
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    },
    editMaterial: async (req, res, next) => {
        try {
        const material = await Material.findById(req.params.id);
        res.render('materials/edit', { material });
        } catch (error) {
        res.status(404).json({ error: 'Material not found' });
        }
    },
    updateMaterial: async (req, res, next) => {
        try {
        await Material.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/courses/${req.body.courseId}`);
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    },
    deleteMaterial: async (req, res, next) => {
        try {
        await Material.findByIdAndRemove(req.params.id);
        res.redirect(`/courses/${req.query.courseId}`);
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////  SYLLABUS //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    createSyllabus: async (req, res, next) => {
        try {
          const newSyllabus = new Syllabus(req.body);
          await newSyllabus.save();
          res.redirect(`/courses/${req.body.courseId}`);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
    },
    editSyllabus: async (req, res, next) => {
        try {
          const syllabus = await Syllabus.findById(req.params.id);
          res.render('syllabus/edit', { syllabus });
        } catch (error) {
          res.status(404).json({ error: 'Syllabus not found' });
        }
    },
    updateSyllabus: async (req, res, next) => {
        try {
          await Syllabus.findByIdAndUpdate(req.params.id, req.body);
          res.redirect(`/courses/${req.body.courseId}`);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
    },
    deleteSyllabus: async (req, res, next) => {
        try {
          await Syllabus.findByIdAndRemove(req.params.id);
          res.redirect(`/courses/${req.query.courseId}`);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
    },
    
    ////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////  GRADECRITERIA //////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Grade Criteria CRUD operations
    createGradeCriteria: async (req, res, next) => {
        try {
        const newGradeCriteria = new GradeCriteria(req.body);
        await newGradeCriteria.save();
        res.redirect(`/courses/${req.body.courseId}`);
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    },
    editGradeCriteria: async (req, res, next) => {
        try {
        const gradeCriteria = await GradeCriteria.findById(req.params.id);
        res.render('gradeCriteria/edit', { gradeCriteria });
        } catch (error) {
        res.status(404).json({ error: 'Grade Criteria not found' });
        }
    },
    updateGradeCriteria: async (req, res, next) => {
        try {
        await GradeCriteria.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/courses/${req.body.courseId}`);
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    },
    deleteGradeCriteria: async (req, res, next) => {
        try {
        await GradeCriteria.findByIdAndRemove(req.params.id);
        res.redirect(`/courses/${req.query.courseId}`);
        } catch (err) {
        res.status(400).json({ error: err.message });
        }
    }


};

// Export the courseControllers object containing all controller functions
module.exports = courseControllers;

*/