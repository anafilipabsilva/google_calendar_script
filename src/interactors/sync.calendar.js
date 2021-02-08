const { json } = require('express');
const gcal = require('google-calendar');
const { Utilities } = require('./../utils/utilities')

const utilities = new Utilities();

class SyncCalendar {

    async sync(accessToken) {

        const google_calendar = new gcal.GoogleCalendar(accessToken.token.access_token);

        const jsonArray = await utilities.getData();

        const date = new Date().toISOString();
        const queryParamsList = {
            singleEvents: true,
            orderBy: "startTime",
            timeMin: date
        }
        const eventsList = await new Promise((resolve, reject) => {
            google_calendar.events.list('c_q8vcr6cfaj42unb0iusvk4jmog@group.calendar.google.com', queryParamsList, function(err, calendarList) {
                if(err != null) {
                    reject(err);
                }  else {
                    resolve(calendarList);
                }
            });
        })

        const commonEmailIndex = utilities.findFirstCommonEmail(jsonArray, eventsList.items);

        const newEmaislList = utilities.orderEmailsList(jsonArray, commonEmailIndex);

        const indexToDelete = utilities.findFirstIndexToDelete(newEmaislList, eventsList.items);
        console.log(indexToDelete);





    }
}

module.exports.SyncCalendar = SyncCalendar;
