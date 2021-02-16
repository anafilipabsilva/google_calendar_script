const gcal = require('google-calendar');
const moment = require('moment');

const { Utilities } = require('./../utils/utilities')
const utilities = new Utilities();

class SyncCalendar {

    async sync(accessToken) {

        const google_calendar = new gcal.GoogleCalendar(accessToken.token.access_token);
        const calendarId = 'calendarId';

        const jsonArray = await utilities.getData();

        const date = new Date().toISOString();
        const queryParamsList = {
            singleEvents: true,
            orderBy: "startTime",
            timeMin: date
        }
        const eventsList = await new Promise((resolve, reject) => {
            google_calendar.events.list(calendarId, queryParamsList, function(err, calendarList) {
                if(err != null) {
                    reject(err);
                }  else {
                    resolve(calendarList);
                }
            });
        })

        const events = eventsList.items;

        const commonEmailIndex = utilities.findFirstCommonEmail(jsonArray, events);

        const newEmailsList = utilities.orderEmailsList(jsonArray, commonEmailIndex);

        const indexToDelete = utilities.findFirstIndexToDelete(newEmailsList, events);

        for (let i = indexToDelete; i < events.length; i++) {
            await new Promise((resolve, reject) => {
                google_calendar.events.delete(calendarId, events[i].id, {}, (err, response) => {
                    if(err != null) {
                        reject(err);
                    }  else {
                        resolve(response);
                    }
                });
            })
        }

        const startDate = events[indexToDelete].start.date;
        const endDate = events[indexToDelete].end.date;
        let indexToMultiply = 0;

        for (let i = indexToDelete; i < newEmailsList.length; i++) {
            let newStartDate = moment(startDate).add(7*indexToMultiply, 'days').format("YYYY-MM-DD");
            let newEndDate = moment(endDate).add(7*indexToMultiply, 'days').format("YYYY-MM-DD");
            indexToMultiply++;

            let guestEmail = newEmailsList[i].Email;
            let eventName =  `Firedrill ${newEmailsList[i].Name}`;

            const body = {
                start: {
                    date: newStartDate
                },
                end: {
                    date: newEndDate
                },
                attendees: [
                    {
                        email: guestEmail
                    }
                ],
                description: "https://talkdesk.atlassian.net/wiki/spaces/QC/pages/1954022223/QA+Firedrill+Procedure",
                guestsCanInviteOthers: true,
                guestsCanModify: true,
                summary: eventName
            }
            const queryParams = {
                //sendUpdates: "all"
            }
            await new Promise((resolve, reject) => {
                google_calendar.events.insert(calendarId, body, queryParams, (err, response) => {
                    if(err != null) {
                        reject(err);
                    }  else {
                        resolve(response);
                    }
                });
            })
        }
    }
}

module.exports.SyncCalendar = SyncCalendar;
