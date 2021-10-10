require('dotenv').config();

const csvFilePath = process.env.CSV_FILE_PATH;
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
        for (const index in events) {
            console.log(events[index].attendees[0]);
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
