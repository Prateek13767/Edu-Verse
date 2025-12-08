import mongoose from "mongoose";
import CourseOffering from "../models/CourseOffering.js";

// ADD COURSE OFFERING
const addCourseOffering = async (req, res) => {
    try {
        const { course, semester, year, branches, instructors, coordinator } = req.body;

        if (!course || !semester || !year || !coordinator) {
            return res.status(400).json({ success: false, message: "Required fields missing" });
        }

        const courseAdded = await CourseOffering.create({
            course,
            semester,
            year,
            branches: Array.isArray(branches) ? branches : [],
            instructors: Array.isArray(instructors) ? instructors : [],
            coordinator
        });

        return res.json({
            success: true,
            message: "Course Offering Added Successfully",
            courseAdded
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error adding course offering" });
    }
};

// GET ALL OFFERINGS
const getAllOfferings = async (req, res) => {
    try {
        const allOfferings = await CourseOffering.find()
            .populate("course")
            .populate("coordinator")
            .populate("instructors");

        return res.json({
            success: true,
            allOfferings,
            message: "Fetched Successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error fetching offerings" });
    }
};

// GET OFFERING BY ID
const getOfferingById = async (req, res) => {
    try {
        const { offeringId } = req.params;

        if (!offeringId)
            return res.status(400).json({ success: false, message: "Offering ID missing" });

        const offeringDetails = await CourseOffering.findById(offeringId)
            .populate("course")
            .populate("coordinator")
            .populate("instructors");

        if (!offeringDetails)
            return res.status(404).json({ success: false, message: "Invalid offering ID" });

        return res.json({
            success: true,
            offeringDetails,
            message: "Details fetched successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error fetching offering" });
    }
};

// UPDATE COURSE OFFERING
const updateCourseOffering = async (req, res) => {
    try {
        const { offeringId } = req.params;
        if (!offeringId)
            return res.status(400).json({ success: false, message: "Offering ID missing" });

        const updatedOffering = await CourseOffering.findByIdAndUpdate(
            offeringId,
            { $set: req.body },
            { new: true }
        );

        if (!updatedOffering)
            return res.status(404).json({ success: false, message: "Invalid offering ID" });

        return res.json({
            success: true,
            updatedOffering,
            message: "Offering updated successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error updating offering" });
    }
};

// DELETE COURSE OFFERING
const deleteCourseOffering = async (req, res) => {
    try {
        const { offeringId } = req.params;
        if (!offeringId)
            return res.status(400).json({ success: false, message: "Offering ID missing" });

        await CourseOffering.findByIdAndDelete(offeringId);
        return res.json({ success: true, message: "Course Offering Deleted Successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error deleting offering" });
    }
};

// FILTER OFFERINGS
const getOfferingByFilter = async (req, res) => {
    try {
        const { semester, year, branch, courseId, instructorId, coordinatorId } = req.body;

        let query = {};

        if (semester) query.semester = semester;
        if (year) query.year = year;
        if (courseId) query.course = courseId;
        if (coordinatorId) query.coordinator = coordinatorId;
        if (branch) query.branches = { $in: [branch] };
        if (instructorId) query.instructors = { $in: [instructorId] };

        if (Object.keys(query).length === 0)
            return res.status(400).json({
                success: false,
                message: "Provide at least one filter field"
            });

        const offerings = await CourseOffering.find(query)
            .populate("course")
            .populate("coordinator")
            .populate("instructors");

        return res.json({
            success: true,
            offerings,
            message: "Filtered offerings fetched successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error filtering offerings" });
    }
};

export {
    addCourseOffering,
    getAllOfferings,
    getOfferingById,
    updateCourseOffering,
    deleteCourseOffering,
    getOfferingByFilter
};
