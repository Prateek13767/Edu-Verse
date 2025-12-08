import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    _id: { type: String, default: "global-settings" },
    isRegistrationOpen: { type: Boolean, default: false },
    areGradeSheetsVisible: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    announcementMessage: { type: String, default: "" }
});

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;