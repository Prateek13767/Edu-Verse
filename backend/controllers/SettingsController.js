import Settings from "../models/Settings.js"; // adjust the path if needed

export const updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;   // key = setting name, value = updated value

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Setting 'key' is required",
      });
    }

    // Fetch document or create if it doesn't exist
    let settings = await Settings.findById("global-settings");
    if (!settings) {
      settings = new Settings({ _id: "global-settings" });
    }

    // Update the requested field dynamically
    settings[key] = value;
    await settings.save();

    return res.status(200).json({
      success: true,
      message: `${key} updated successfully`,
      settings,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating setting",
      error: error.message,
    });
  }
};

export const getSettings= async (req, res) => {
  const settings = await Settings.findById("global-settings");
  res.json({ success: true, settings });
}
