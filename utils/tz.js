const moment = require("moment-timezone");

// Middleware function to set the timezone
const getCurrentDate = (date) => {
  const currentDate = moment(date).tz("Africa/Lagos").format();
  return currentDate;
};

// const desiredTimezone = "Africa/Nairobi";
//   moment.tz.setDefault(desiredTimezone);

// const currentMoment = moment(currentDate).tz("Africa/Lagos");
// const formattedDateTime = currentMoment.format("YYYY-MM-DDTHH:mm:ss");

console.log(getCurrentDate(new Date()));
