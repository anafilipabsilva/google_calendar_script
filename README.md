## GOOGLE CALENDAR SCRIPT

This script was created to fulfill the need of syncing multiple recurring events for different attendees, at once, on Google Calendar.
In this particular case, this was necessary to update an event, that happens every Wednesday, but with different people on it and different event's name.

![](sequence_diagram.png)


### GUIDE TO USE THIS SCRIPT

This is a step-by-step guide to use this script:

1. You need to have a client ID and a client secret for your Google account. You just need to create the OAuth 2.0 credentials on the [Google Cloud Platform > Credentials](https://console.cloud.google.com/apis/credentials). You also need to add the URI for the requests. This project uses Localtunnel to proxy all requests to your locally running webserver. So, the URI will be `https://<subdomain>.loca.lt/auth/callback` (<subdomain> must be defined in the .env file).

2. Add the client ID and client secret on the .env file.

3. You will need to have a list of names and emails separated by a comma (you can export a Google Sheet in csv format). You can see an example [here](./src/qa_data_example.csv).

4. Finally, you just need to have the ID of the calendar you want to update, and the title and description for the event. Just go to the settings of the calendar, and you will find the Calendar ID there. Add this Calendar ID on the .env file. Then, you just need to go to the [sync calendar interactor](./src/interactors/sync.calendar.js) and change the `eventName` and `description` variables to have the data you want.

5. And you're good to go! Just run `yarn start` on your terminal and open a browser tab with this endpoint: `https://<subdomain>.loca.lt/sync`. The magic will happen!
