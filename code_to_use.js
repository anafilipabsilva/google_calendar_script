

// google_calendar.events.delete('c_q8vcr6cfaj42unb0iusvk4jmog@group.calendar.google.com', '5j2rev1ak2nfl6vt1rc1chboeo', {}, (err, result) => {
//     console.dir(err);
//     console.dir(result);

//     res.send('Event deleted')
// })

// const body = {
//     start: {
//         date: "2021-02-01"
//     },
//     end: {
//         date: "2021-02-01"
//     },
//     attendees: [
//         {
//             email: "ana.brandao@talkdesk.com"
//         },
//         {
//             email: "nuno.morais@talkdesk.com"
//         },
//     ],
//     description: "https://talkdesk.atlassian.net/wiki/spaces/QC/pages/1954022223/QA+Firedrill+Procedure",
//     guestsCanInviteOthers: true,
//     guestsCanModify: true,
//     summary: "Firedrill Ana Brandão"
// }
// const queryParams = {
//     sendUpdates: "all"
// }
// google_calendar.events.insert(`c_q8vcr6cfaj42unb0iusvk4jmog@group.calendar.google.com`, body, queryParams, (err, response) => {
//     console.dir(response);
//     console.dir(err);
//     res.send(`Event sent`)
// });
