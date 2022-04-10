# Directory Structure

- api: directory for backend logics (**resides remotely in AWS Lambda, not in use locally**)
    - ExercisePlus_GetSearchOptions: retrieve possible matching results with location and description in real-time
    - ExercisePlus_SearchFunction: generate location for decided search destination, generate parks and gyms recommendation and provide weather forecast for nearby areas
    - ExercisePlus_BulkInsert: import script that retrieves, processes and inserts data into DynamoDB tables following an upload event in S3 storage.
- public: public resources (icons, images) for the frontend, and the server entry (index.html)
- src: directory for frontend designs
    - .babelrc: reduce redundancy for npm compilation commands
    - xxx.jsx: jsx codes for design purpose, can be compiled with `npm run compile` (one-time compilation) or `npm run watch` (real-time compilation, needs a separate screen/terminal). "App.jsx" and "App.css" contains the main components for the frontend, and are exported to "index.js", which is the project entry.
    - xxx.js: js code compiled from xxx.jsx (except for index.js)
    - xxx.css: stylesheets for xxx.js/xxx.jsx
- package.json: node packages and configs
- README.md: Description of the project


# Deployed Application URL
[Click here](https://dev.d286e2j1zvdll3.amplifyapp.com/) to visit the deployed service!


# Local Setup Guidance (for Linux)

This guidance might only be useful for users wanting to test the application locally.

## Step 0: Preparation

make sure that Git is installed within the system.

## Step 1: Node and React

1. install npm: `sudo apt install npm`;
2. install nvm: `sudo npm install -g n`;
3. install node: `sudo n v16.14.2`;
4. restore the dependencies: `sudo npm install`;

## Step 2: Compilation and Running

```
npm run compile    // compile all the .jsx files into their .js counterpart in one turn
npm run watch      // compile all the .jsx files in real-time
npm start          // start the frontend server (visit it on port 3000)
```

## Step 3: Simple Illustration

The template page displays as follows:
![template snapshot](/template_snapshot.jpg)
- The page can be visited locally on port 3000. 
- The right top of the page includes some options to register/login/logout from the service, which are empowered by AWS Cognito.
- The left side of the page contains a search bar at the top with a map below. Click on the search bar and start searching for a place where you decide to do a workout! Possible matching results would be displayed in real-time when there is a change in the text field, which can also be selected.
- The map on the left shows resulting positions in Singapore. The search destination would be marked red, and would be surrounded by blue marks (representing gyms) and green marks (representing parks) nearby. The map can be zoomed in/out, and the marks can be clicked for names and desciptions.
- The right side should contain the search results. It would suggest the name of the search result, followed by a list of nearby weather forecast, a list of nearby gyms and a list of parks filtered by distances and ordered by number of favors as priorities.