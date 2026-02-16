// exportData.js

import { hostelWithRooms } from "./collectRooms.js";
import { finalData } from "./collectStudentWillingnesses.js";

const run = async () => {
  try {
    const hostelRoomsData = await hostelWithRooms({
      hostel: "693987ff30c98fddae666d6b",
      vacantOnly: "true",
    });

    const willingnessData = await finalData(2025);

    // ✅ ONLY JSON — NOTHING ELSE
    process.stdout.write(
      JSON.stringify({
        hostelRoomsData,
        willingnessData
      })
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

run();