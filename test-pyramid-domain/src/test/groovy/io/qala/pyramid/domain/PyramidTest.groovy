package io.qala.pyramid.domain

import org.apache.commons.lang.RandomStringUtils
import org.junit.Test
import spock.lang.Specification
import spock.lang.Unroll

import javax.validation.ConstraintViolation
import javax.validation.Validation
import javax.validation.Validator
import javax.validation.ValidatorFactory

import static org.apache.commons.lang.RandomStringUtils.randomAlphanumeric

class PyramidTest extends Specification {
    @Test
    void 'validation'() {
        Pyramid pyramid = Pyramid.random()
        Set<ConstraintViolation<Pyramid>> violations = validator().validate(pyramid)

        assert violations.isEmpty()
    }

    @Unroll
    def 'validation for name must fail if #valueDescription specified (#name)'() {
        given:
          Pyramid pyramid = Pyramid.random([name: name])
          Set<ConstraintViolation<Pyramid>> violations = validator().validate(pyramid)
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
