Test Pyramid
----

Demonstrates how to build tests of different levels (unit, component, system) for apps with rich client. Technologies:
 
- Spring MVC, Hibernate; Groovy JUnit, Spock, Spring Test
- AngularJS; Karma, Protractor

TBD:

- Data validation on back end
 + REST endpoint for validation
 + Validate name and write component test for it
 - Send validation requests to BE every time focus is lost on field
 - Parse validation responses in JS
 - Component test that checks how UI works with validation endpoint
 - System tests to be updated to new behaviour
 - Validate all other fields in the same manner
- Add System Test that checks if validation is applied and regexps are filled
- Color the validation errors
- Add restrictions on how many digits it is possible to put into test counts

(c) [Qala](http://qala.io)