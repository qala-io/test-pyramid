package io.qala.pyramid.domain

import spock.lang.Specification
import spock.lang.Unroll

import javax.validation.ConstraintViolation
import javax.validation.Validation
import javax.validation.Validator

import static io.qala.datagen.RandomShortApi.positiveInteger
import static io.qala.datagen.RandomValue.*

/**
 * While we use Hibernate Validator here and instantiate that object manually, it doesn't mean that our SUT will do the
 * same. But we still need to check that this happens - it will be tested in Component Tests.
 */
@SuppressWarnings("GroovyAssignabilityCheck")//doesn't recognize pipe (|) as Spock operator
class PyramidTest extends Specification {
    @Unroll
    def 'validation for name must pass if #valueDescription specified (#name)'() {
        given:
          Pyramid pyramid = Pyramid.random().setName(name)
          Set violations = validator().validate(pyramid)
        expect:
          pyramid && 0 == violations.size()
        where:
          name                            | valueDescription
          length(1).alphanumeric()        | 'min boundary value'
          between(2, 99).alphanumeric()   | 'typical happy path value'
          length(100).alphanumeric()      | 'max boundary value'
          between(1, 99).numeric()        | 'numbers only'
          between(1, 99).specialSymbols() | 'special symbols'
    }

    @Unroll
    def 'validation for name must fail if #valueDescription specified (#name)'() {
        given:
          Pyramid pyramid = Pyramid.random().setName(name)
          Set<ConstraintViolation> violations = validator().validate(pyramid)
        expect:
          pyramid && 1 == violations.size()
          pyramid && violations.first().messageTemplate.contains(expectedError)
        where:
          name                       | expectedError      | valueDescription
          ''                         | 'constraints.Size' | 'empty value'
          null                       | 'constraints.Size' | 'null value'
          length(101).alphanumeric() | 'constraints.Size' | 'more than max number of symbols'
    }

    @Unroll
    def 'validation for number of tests must pass if #valueDescription specified (#nOfTests)'() {
        given:
          Pyramid pyramid = Pyramid.random()
              .setnOfUnitTests(nOfTests)
              .setnOfComponentTests(nOfTests)
              .setnOfSystemTests(nOfTests);
          Set violations = validator().validate(pyramid)
        expect:
          pyramid && 0 == violations.size()
        where:
          nOfTests          | valueDescription
          0                 | 'min boundary value'
          positiveInteger() | 'typical happy path value'
          Integer.MAX_VALUE | 'max boundary value'

    }

    @Unroll
    def 'validation for number of tests must fail if #valueDescription specified (#nOfTests)'() {
        given:
          Pyramid pyramid = Pyramid.random()
              .setnOfUnitTests(nOfTests)
              .setnOfComponentTests(nOfTests)
              .setnOfSystemTests(nOfTests);
          Set<ConstraintViolation> violations = validator().validate(pyramid)
        expect:
          pyramid && 3 == violations.size()
          pyramid && violations.every { it.messageTemplate.contains(expectedError) }
        where:
          nOfTests | expectedError     | valueDescription
          -1       | 'constraints.Min' | 'negative value'
    }

    private static Validator validator() {
        return Validation.buildDefaultValidatorFactory().validator;
    }
}
