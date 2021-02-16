const gcal = require('google-calendar');
const moment = require('moment');

const { Utilities } = require('./../utils/utilities')
const utilities = new Utilities();

class SyncCalendar {

    async sync(accessToken) {

        const google_calendar = new gcal.GoogleCalendar(accessToken.token.access_token);
        const calendarId = 'calendar_id';

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
        console.log(events.length, newEmailsList.length)

        const indexToDelete = utilities.findFirstIndexToDelete(newEmailsList, events);
        if(indexToDelete == events.length && newEmailsList.length == events.length) {
            console.log("There were no events to update")
            return;
        }

        for (let i = indexToDelete; i < events.length; i++) {
            console.log(`Deleting ${events[i].attendees[0].email}`)
            await new Promise((resolve, reject) => {
                google_calendar.events.delete(calendarId, events[i].id, {}, (err, response) => {
                    if(err != null) {
                        reject(err);
                    }  else {
                        resolve(response);
                    }
                });
            })
            console.log(`${events[i].attendees[0].email} deleted`)
        }
        console.log("The events were deleted")

        let startDate;
        let endDate;

        if(indexToDelete == events.length) {
            startDate = moment(events[indexToDelete-1].start.date).add(7, 'days');

            endDate = moment(events[indexToDelete-1].end.date).add(7, 'days');
        } else {
            startDate = events[indexToDelete].start.date;
            endDate = events[indexToDelete].end.date;
        }

        let indexToMultiply = 0;

        for (let i = indexToDelete; i < newEmailsList.length; i++) {
            let newStartDate = moment(startDate).add(7*indexToMultiply, 'days').format("YYYY-MM-DD");
            let newEndDate = moment(endDate).add(7*indexToMultiply, 'days').format("YYYY-MM-DD");
            indexToMultiply++;

            let guestEmail = newEmailsList[i].Email;
            console.log(`Creating event for ${guestEmail}`)
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
                description: 'description',
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
            console.log(`Event created for ${guestEmail}`)
        }
        console.log("Synchronization completed")
    }
}

module.exports.SyncCalendar = SyncCalendar;
