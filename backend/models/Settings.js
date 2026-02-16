import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    _id: { type: String, default: "global-settings" },
    academicYear:{type:String,required:true},
    currentSem:{type:String,enum:['Odd','Even'],required:true},
    isRegistrationOpen: { type: Boolean, default: false },
    areGradeSheetsVisible: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    announcementMessage: { type: String, default: "" }
});

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;