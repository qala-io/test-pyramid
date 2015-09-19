Some of the 3d-party NPM libs were copied directly as JS files included in the browser. It's hardly possible to use NPM 
packages in browser environment. There are means like using browserify, but that has significant drawbacks:

- crippled stack traces 
- not being able to Debug JS tests in IDE.