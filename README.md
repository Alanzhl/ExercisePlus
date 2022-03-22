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
3. install the following packages: `pip install flask flask-cors`;

## Step 3: Compilation and Running

1. for the frontend: 
    npm run compile    // compile all the .jsx files into their .js counterpart in one turn
    npm run watch      // compile all the .jsx files in real-time
    npm start      // start the frontend server (visit it on port 3000)
2. for the backend (ensure you've activated the virtual env): `python3 server.py`


## References (for learning and sharing)
- [Writing React with Hook](https://zh-hans.reactjs.org/docs/hooks-overview.html): official introduction to React with Hook
- [Ant Design](https://ant.design/components/overview-cn/): frontend UI library (learn from "代码演示" and "API" part)
- [Flask-cors](https://flask-cors.readthedocs.io/en/latest/): Cross Origin Resource Sharing (request proxy from frontend to backend)