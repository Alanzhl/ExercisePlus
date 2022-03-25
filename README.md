# Directory Structure

- api: directory for backend logics
    - controllers: controller logics that handles proxied requests from the frontend
        - controller_main: includes the responding data for a search (data are extracted from our datasets; modify them if needed)
    - models (not in use): initialization of SQLAlchemy handler (db) and definition of database tables
    - init: methods that configures the flask app instance and SQLAlchemy handler (db)
    - config: all static and global configs for the backend
- public: public resources (icons, images) for the frontend, and the server entry (index.html)
- src: directory for frontend designs
    - .babelrc: reduce redundancy for npm compilation commands
    - xxx.jsx: jsx codes for design purpose, can be compiled with `npm run compile` (one-time compilation) or `npm run watch` (real-time compilation, needs a separate screen/terminal). "App.jsx" and "App.css" contains the main components for the frontend, and are exported to "index.js", which is the project entry.
    - xxx.js: js code compiled from xxx.jsx (except for index.js)
    - xxx.css: stylesheets for xxx.js/xxx.jsx
- package.json: node packages and configs
- README.md: Description of the project
- server.py: used to manually start the backend server (only used in dev stage!)



# Setup Guidance (for Linux)

## Step 0: Preparation

make sure that Git and Python3 are installed within the system.

## Step 1: Node and React

1. install npm: `sudo apt install npm`;
2. install nvm: `sudo npm install -g n`;
3. install node: `sudo n v16.14.2`;
4. restore the dependencies: `sudo npm install`;

## Step 2: Python API

1. under the root directory, create the virtual environment for Python with: `python3 -m venv venv`;
2. enter the virtual environment with: `source venv/bin/activate`;
3. install the following packages (only flask and flask-cors are needed if db is not tested): 
```pip install flask flask-cors sqlalchemy sqlalchemy_utils pymysql cryptography passlib flask_sqlalchemy bcrypt```

## Step 3: Compilation and Running

1. starting the frontend: 
```
npm run compile    // compile all the .jsx files into their .js counterpart in one turn
npm run watch      // compile all the .jsx files in real-time
npm start          // start the frontend server (visit it on port 3000)
```
2. starting the backend (ensure you've activated the virtual env): `python3 server.py`. If things go wrong with the database configs, you can [manually create](https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql) the database "exercise_plus" and a user with the name and password specified in "/api/config.py", granting all privileges to "exercise_plus".

## Step 4: Illustration (for the template version only)

The template page displays as follows:
![template snapshot](/template_snapshot.JPG)
- The page can be visited on port 3000. 
- The left side of the page contains a search bar at the top with a map below. As we don't have enough data in the database at this stage, the search bar would only work as a trigger for constant results for tests.
- The map on the left is simply a static image. It should be replaced by a map that can be marked with the recommendations of a search.
- The right side should contain the search results. Again, as we don't have enough data right away, it would always return the same results on a search. You can always refer to "/api/controllers/controller_main.py" to add / change the results in your required format.
- The only thing to adjust at the backend should be the "/api/controllers/controller_main.py". All the logics concerning database connections have been commented out.

## References (for learning and sharing)

- [Writing React with Hook](https://zh-hans.reactjs.org/docs/hooks-overview.html): official introduction to React with Hook
- [Ant Design](https://ant.design/components/overview-cn/): frontend UI library (learn from "代码演示" and "API" part)
- [Flask-cors](https://flask-cors.readthedocs.io/en/latest/) (probably not used): Cross Origin Resource Sharing (request proxy from frontend to backend)
- [SQLAlchemy-core](https://docs.sqlalchemy.org/en/14/core/) (not in use): basics for SQLAlchemy
- [SQLAlchemy-ORM](https://docs.sqlalchemy.org/en/14/orm/) (not in use): using ORM model to interact and manage MySQL