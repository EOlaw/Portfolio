const express = require('express');
const router = express.Router();
const courseControllers = require('../controllers/courseController');
const { isAuthenticated, isAdmin } = require('../controllers/authController')

// Courses
router.route('/new')
    .get(courseControllers.renderCourseCreationPage);
router.route('/')
    .post(courseControllers.createCourse)
    .get(courseControllers.getAllCourses)
router.route('/:id')
    .get(courseControllers.getCourseById)
    .put(courseControllers.updateCourse)
    .delete(courseControllers.deleteCourse)
router.route('/:id/edit')
    .get(courseControllers.editCourse)

/*

// Materials
router.post('/:id/materials', courseControllers.createMaterial);
router.get('/:id/materials/:materialId/edit', courseControllers.editMaterial);
router.put('/:id/materials/:materialId', courseControllers.updateMaterial);
router.delete('/:id/materials/:materialId', courseControllers.deleteMaterial);


// Syllabus
router.post('/:id/syllabus', courseControllers.createSyllabus);
router.get('/:id/syllabus/:syllabusId/edit', courseControllers.editSyllabus);
router.put('/:id/syllabus/:syllabusId', courseControllers.updateSyllabus);
router.delete('/:id/syllabus/:syllabusId', courseControllers.deleteSyllabus);

// Grade Criteria
router.post('/:id/grade-criteria', courseControllers.createGradeCriteria);
router.get('/:id/grade-criteria/:gradeCriteriaId/edit', courseControllers.editGradeCriteria);
router.put('/:id/grade-criteria/:gradeCriteriaId', courseControllers.updateGradeCriteria);
router.delete('/:id/grade-criteria/:gradeCriteriaId', courseControllers.deleteGradeCriteria);

*/

module.exports = router;
