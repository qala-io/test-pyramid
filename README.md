Test Pyramid
----

Demonstrates how to build tests of different levels 
([unit, component, system](http://qala.io/blog/holes-in-test-terminology.html)) for apps with rich client. Technologies:
 
- Spring MVC, Hibernate; Groovy JUnit, Spock, Spring Test
- AngularJS; Karma, Protractor

If you want to read more about the ideology behind it, have a look at 
[Building Test Pyramid to optimize automated testing](http://qala.io/blog/test-pyramid.html). Basic vocabulary:

- Unit Tests - check how functions and classes work in isolation
- Component Tests - initialize a big chunk of an app to test them together. Doesn't require real middleware like 
 Application Servers.
- System Tests run against fully deployed app.

# App functionality

- Can create new Pyramids
- Can list created Pyramids
- Can draw different kinds of Pyramid

# Project Structure

- `test-pyramid-domain` contains logic to store/retrieve data to/from DB
- `test-pyramid-web` contains Controllers and REST Services that listen to UI. It also contains the UI itself: Velocity
 page (it's a template HTML is generated from) and JS (AngularJS folders _mostly_ follow 
 [generally accepted conventions](https://github.com/johnpapa/angular-styleguide)). 

Both `test-pyramid-domain` and `test-pyramid-web` contain `src/test` folders with Groovy and JS tests. In IDE you should
mark sub-folders of those as test sources if you want those to be treated respectively:

- `test-pyramid-domain/src/test` contains Unit and Component tests
- `test-pyramid-web/src/test` contains Unit, Component and System tests for both Back End and UI

# Running

All the tests can be run via Maven (you need to have it installed):

- `mvn test` would run Unit and Component tests. It will also run UI Component Tests for which you should need to
 start Selenium WebDriver (sorry for that, maybe in the future it will get started automatically).
- `mvn test -DrunSystemTests` will trigger Back End and UI System Tests, but before you run it you need to deploy the
 app at http://localhost:8080 and run Selenium WebDriver. Issue `mvn package` from root folder to generate 
 `test-pyramid-web/target/test-pyramid-web***.war` that can be deployed onto Tomcat. Or use IDE.

To work with UI separately and run its tests separately you should treat `tests-pyramid-web` as your home - it contains
`package.json` which points to other test configs.

# TBD

- Write 
- Mock to be started at random port when running component tests
- Create Allure reports
- Generate coverage metrics
- Create sample CD Pipeline in Jenkins

(c) [Qala](http://qala.io)