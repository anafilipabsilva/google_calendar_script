const csvFilePath = '/Users/ana.brandao/projects/google_calendar_script/src/qa_data.csv';
const csv = require('csvtojson')

class Utilities {

    async getData() {

        return await csv().fromFile(csvFilePath)
            .then(result => result)
            .catch((e) => {
                console.error(e);
                return;
            });
    }

    findFirstCommonEmail(jsonArray, events) {
        for (const event of events) {
            const email = event.attendees[0].email;
            const index = jsonArray.findIndex(person => person.Email == email);
            if(index != -1) {
                return index;
            }
        }
        return -1;
    }

    orderEmailsList(jsonArray, commonEmailIndex) {
        if(commonEmailIndex == -1) {
            console.error('There was no match between the two lists');
            return;
        }

        if(commonEmailIndex > 0) {
            return (jsonArray.slice(commonEmailIndex)).concat((jsonArray.slice(0, commonEmailIndex)));
        } else {
            return jsonArray;
        }
    }

    findFirstIndexToDelete(emailsList, events) {
        console.dir(emailsList);
        console.dir(events);
        for (const index in events) {
            if (emailsList[index] == null) {
                return index;
            }
            if(emailsList[index].Email != events[index].attendees[0].email) {
                return index;
            }
        }
        return events.length;
    }
}

module.exports.Utilities = Utilities;
