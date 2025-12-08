import AcademicCalendar from "../models/AcademicCalendar.js";

/**
 * Create a new academic calendar entry
 */
export const createCalendar = async (req, res) => {
  try {
    const calendar = new AcademicCalendar(req.body);
    await calendar.save();
    res.status(201).json({
      success: true,
      message: "Academic Calendar created successfully",
      calendar
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error creating calendar", error });
  }
};

/**
 * Update calendar by ID
 */
export const updateCalendar = async (req, res) => {
  try {
    const calendar = await AcademicCalendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!calendar)
      return res.status(404).json({ success: false, message: "Calendar not found" });

    res.json({ success: true, message: "Academic Calendar updated", calendar });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating calendar", error });
  }
};

/**
 * Fetch calendar by semester & year
 * ex: /academic-calendar/2024/odd
 */
export const getCalendarByYearSem = async (req, res) => {
  try {
    const { year, semester } = req.body;
    const calendar = await AcademicCalendar.findOne({ year, semester });

    if (!calendar)
      return res.status(404).json({ success: false, message: "Calendar not found" });

    res.json({ success: true, calendar });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching calendar", error });
  }
};

/**
 * Get the currently active academic calendar
 * Based on today's date falling in semesterStart → semesterEnd
 */
export const getActiveCalendar = async (req, res) => {
  try {
    const today = new Date();

    const calendar = await AcademicCalendar.findOne({
      semesterStart: { $lte: today },
      semesterEnd: { $gte: today }
    });

    if (!calendar)
      return res.status(404).json({ success: false, message: "No active semester right now" });

    res.json({ success: true, calendar });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching active calendar", error });
  }
};

export const checkRegistrationStatus = async (req, res) => {
  try {
    const today = Date.now();

    // Get the active academic calendar based on semester dates
    const calendar = await AcademicCalendar.findOne({
      courseRegStart: { $exists: true },
      courseRegEnd: { $exists: true }
    }).sort({ createdAt: -1 }); // latest entry

    if (!calendar) {
      return res.json({ open: false, message: "No academic calendar found." });
    }

    if (today < calendar.courseRegStart)
      return res.json({
        open: false,
        message: `Registration will open on ${calendar.courseRegStart.toDateString()}`
      });

    if (today > calendar.courseRegEnd)
      return res.json({
        open: false,
        message: `Registration closed on ${calendar.courseRegEnd.toDateString()}`
      });

    return res.json({
      open: true,
      message: "Course registration is currently open."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ open: false, message: "Server Error", error });
  }
};

export const checkGradeSheetStatus = async (req, res) => {
  try {
    const today = Date.now();

    // Fetch the latest calendar stored
    const calendar = await AcademicCalendar.findOne({
      resultReleaseDate: { $exists: true }
    }).sort({ createdAt: -1 });

    if (!calendar) {
      return res.json({ open: false, message: "No academic calendar found." });
    }

    if (today < calendar.resultReleaseDate) {
      return res.json({
        open: false,
        message: `Results will be published on ${calendar.resultReleaseDate.toDateString()}`
      });
    }

    return res.json({
      open: true,
      message: "Results are now available."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ open: false, message: "Server error", error });
  }
};


/**
 * Delete calendar by ID (optional / admin)
 */
export const deleteCalendar = async (req, res) => {
  try {
    const deleted = await AcademicCalendar.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Calendar not found" });

    res.json({ success: true, message: "Academic Calendar removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting calendar", error });
  }
};
