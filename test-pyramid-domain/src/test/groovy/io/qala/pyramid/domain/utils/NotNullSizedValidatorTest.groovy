package io.qala.pyramid.domain.utils

import spock.lang.Specification
import spock.lang.Unroll

import static io.qala.datagen.RandomShortApi.alphanumeric
import static io.qala.datagen.RandomShortApi.numeric

@SuppressWarnings("GroovyAssignabilityCheck") //doesn't recognize pipe (|) as Spock operator
public class NotNullSizedValidatorTest extends Specification {

    @Unroll
    def 'validator must pass at min boundary if #caseDescription'() {
        given:
          NotNullSizedValidator validator = new NotNullSizedValidator(min: minBoundary, max: Integer.MAX_VALUE)
        expect:
          validator.isValid(valueToValidate, null)
        where:
          minBoundary | valueToValidate       | caseDescription
          10          | alphanumeric(10)      | 'value equals to min boundary'
          10          | alphanumeric(11, 100) | 'value is greater than min boundary'
          10          | numeric(11, 100)      | 'numeric string greater than min boundary'
          0           | ''                    | 'value is empty string with min boundary equal to 0'
    }

    @Unroll
    def 'validator must fail at min boundary if #caseDescription'() {
        given:
          NotNullSizedValidator validator = new NotNullSizedValidator(min: minBoundary, max: Integer.MAX_VALUE)
        expect:
          !validator.isValid(valueToValidate, null)
        where:
          minBoundary | valueToValidate    | caseDescription
          10          | alphanumeric(1, 9) | 'value smaller than min boundary'
          10          | numeric(1, 9)      | 'numeric string smaller than min boundary'
          10          | null               | 'value is null'
          10          | ''                 | 'value is empty while boundary is non-0'
    }

    @Unroll
    def 'validator must pass at max boundary if #caseDescription'() {
        given:
          NotNullSizedValidator validator = new NotNullSizedValidator(min: 0, max: maxBoundary)
        expect:
          validator.isValid(valueToValidate, null)
        where:
          maxBoundary | valueToValidate    | caseDescription
          10          | alphanumeric(10)   | 'value equals to max boundary'
          10          | alphanumeric(1, 9) | 'value is smaller than max boundary'
          10          | numeric(1, 9)      | 'numeric string is smaller than max boundary'
          10          | ''                 | 'empty value'
    }

    @Unroll
    def 'validator must fail at max boundary if #caseDescription'() {
        given:
          NotNullSizedValidator validator = new NotNullSizedValidator(min: 0, max: maxBoundary)
        expect:
          !validator.isValid(valueToValidate, null)
        where:
          maxBoundary | valueToValidate       | caseDescription
          10          | alphanumeric(11, 100) | 'value larger than max boundary'
          10          | numeric(11, 100)      | 'numeric string larger than max boundary'
    }
}
