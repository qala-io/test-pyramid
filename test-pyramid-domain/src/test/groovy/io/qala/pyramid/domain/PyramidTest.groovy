package io.qala.pyramid.domain

import org.junit.Test
import spock.lang.Specification
import spock.lang.Unroll

import javax.validation.ConstraintViolation
import javax.validation.Validation
import javax.validation.Validator

import static io.qala.pyramid.domain.utils.RandomValue.from
import static org.apache.commons.lang.RandomStringUtils.randomAlphanumeric

class PyramidTest extends Specification {
    @Test
    void 'validation for name must pass if #valueDescription specified (#name)'() {
        given:
          Pyramid pyramid = Pyramid.random([name: name])
          Set violations = validator().validate(pyramid)
        expect:
          pyramid && 0 == violations.size()
        where:
          name                            | valueDescription
          randomAlphanumeric(1)           | 'min boundary value'
          from(2).to(99).alphanumeric()   | 'typical happy path value'
          randomAlphanumeric(100)         | 'max boundary value'
          from(2).to(99).numeric()        | 'numbers only'
          from(2).to(99).specialSymbols() | 'special symbols'
    }

    @Unroll
    def 'validation for name must fail if #valueDescription specified (#name)'() {
        given:
          Pyramid pyramid = Pyramid.random([name: name])
          Set<ConstraintViolation> violations = validator().validate(pyramid)
        expect:
          pyramid && 1 == violations.size()
          pyramid && violations.first().messageTemplate.contains(expectedError)
        where:
          name                    | expectedError      | valueDescription
          ''                      | 'constraints.Size' | 'empty value'
          null                    | 'constraints.Size' | 'null value'
          randomAlphanumeric(101) | 'constraints.Size' | 'more than max number of symbols'
    }

    private static Validator validator() {
        return Validation.buildDefaultValidatorFactory().validator;
    }
}
