# ReactJS application with realtime updates  

ReactJS application with user login and dashboard realtime updates with websockets.

Demo [here](http://sgoran.github.io/reactjs-app)
user: admin
pass: admin

I can't reveal API data.
Instead I simulated set of metrics and websocket updates.

I used [ReactJS](https://github.com/facebook/react) + [Redux](https://github.com/reactjs/redux) 
and a few smaller modules for cookie and date managment.

For the UI, [react-mdl](https://github.com/tleunen/react-mdl) is used. A ReactJS
port of [Google Material Design Lite](http://www.getmdl.io/)

I googled for examples of React applications with login, 
auth and other common problems. So app has those begginer problems solved.

Also it's a nice way to use ReactJS with material design.

## Development 

Application is bundled already with webpack so it can be run immediately with some local server.

If you want to edit project, next should be done

1. you need to have nodejs and npm installed
2. navigate to project folder via console and run:
  ```npm install```
   and after a few min project dependencies should be installed
3. you can now build application with prepared npm script that uses webpack
	development build (unminified)
	```npm run dev```
	or production build (minified)
	```npm run build ```
	any of above will pack project source into build/bundle.js

	```npm run watch``` 
	can be used for auto build when you save and of .jsx files
