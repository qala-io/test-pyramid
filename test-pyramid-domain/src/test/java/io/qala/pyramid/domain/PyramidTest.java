package io.qala.pyramid.domain;

import org.junit.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;

import java.util.Set;

import static io.qala.datagen.RandomShortApi.*;
import static io.qala.datagen.RandomValue.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * While we use Hibernate Validator here and instantiate that object manually, it doesn"t mean that our SUT will do the
 * same. But we still need to check that this happens - it will be tested in Component Tests.
 */
public class PyramidTest {

    @Test public void scoreWorsensIfThereAreMoreSystemTests() {
        Pyramid p = Pyramid.random();
        double initialScore = p.getScore();
        double eventualScore = p.setSystemTests(p.getSumOfTests()).getScore();
        assertTrue("Initial: " + initialScore + ", eventual: " + eventualScore, initialScore > eventualScore);
    }
    @Test public void scoreWorsensIfThereAreMoreComponentTestsComparedToUnitTests() {
        Pyramid p = Pyramid.random().setSystemTests(0);
        double initialScore = p.getScore();
        double eventualScore = p.setComponentTests(p.getSumOfTests()).getScore();
        assertTrue("Initial: " + initialScore + ", eventual: " + eventualScore, initialScore > eventualScore);
    }
    @Test public void scoreWorsensIfThereAreLessComponentTestsComparedToSystemTests() {
        Pyramid p = Pyramid.random().setUnitTests(0);
        double initialScore = p.getScore();
        double eventualScore = p.setComponentTests(0).getScore();
        assertTrue("Initial: " + initialScore + ", eventual: " + eventualScore, initialScore > eventualScore);
    }
    @Test public void scoreIs0_ifNoTestsAtAll() {
        Pyramid p = Pyramid.random().setUnitTests(0).setComponentTests(0).setSystemTests(0);
        assertEquals(0D, p.getScore(), .0001);
    }
    @Test public void scoreIs1_ifThereAreManyUnitAndLessOfComponentTests() {
        Pyramid p = Pyramid.random().setUnitTests(1000).setComponentTests(112).setSystemTests(5);
        assertEquals(1D, p.getScore(), .0001);
    }
    @Test public void scoreIsAlwaysBetween0And1() {
        Pyramid p = Pyramid.random();
        assertTrue(1D >= p.getScore());
        assertTrue(0 <= p.getScore());
    }

    @Test public void validationPasses_forValidNames() {
        Pyramid pyramid = Pyramid.random();
        assertValidationPassed("min boundary"            , pyramid.setName(length(1).alphanumeric()));
        assertValidationPassed("typical happy path value", pyramid.setName(between(2, 99).alphanumeric()));
        assertValidationPassed("max boundary value"      , pyramid.setName(length(100).alphanumeric()));
        assertValidationPassed("numbers only"            , pyramid.setName(between(1, 99).numeric()));
        assertValidationPassed("special symbols"         , pyramid.setName(between(1, 99).specialSymbols()));
    }
    @Test public void validationFails_forInvalidNames() {
        Pyramid pyramid = Pyramid.random();
        assertValidationFailed("constraints.Size", pyramid.setName(nullOrEmpty()));
        assertValidationFailed("constraints.Size", pyramid.setName(length(101).alphanumeric()));
    }

    @Test public void validationPasses_forValidTestCounts() {
        assertValidationPassed("min boundary"      , getPyramidWithAllTestCount(0));
        assertValidationPassed("typical happy path", getPyramidWithAllTestCount(positiveInteger()));
    }
    @Test public void validationFails_forNegativeTestCount() {
        int testCount = sample(-1, integer(Integer.MIN_VALUE, -1));
        Pyramid pyramid = Pyramid.random();
        callOneOf(
                ()-> pyramid.setUnitTests(testCount),
                ()-> pyramid.setComponentTests(testCount),
                ()-> pyramid.setSystemTests(testCount));
        assertValidationFailed("constraints.Min", pyramid);
    }
    @Test public void sumOfTests_addsAllTestTypesTogether() {
        Pyramid pyramid = Pyramid.random();
        int expected = pyramid.getUnitTests() + pyramid.getComponentTests() + pyramid.getSystemTests();
        assertEquals(expected, pyramid.getSumOfTests());
    }

    private static Pyramid getPyramidWithAllTestCount(int nOfTests) {
        return Pyramid.random()
                .setUnitTests(nOfTests)
                .setComponentTests(nOfTests)
                .setSystemTests(nOfTests);
    }
    private static void assertValidationPassed(String caseName, Pyramid pyramid) {
        Set<ConstraintViolation<Pyramid>> violations = VALIDATOR.validate(pyramid);
        assertEquals(caseName, 0, violations.size());
    }
    private static void assertValidationFailed(String errorTxtPiece, Pyramid pyramid) {
        Set<ConstraintViolation<Pyramid>> violations = VALIDATOR.validate(pyramid);
        assertEquals(1, violations.size());
        String actualTxt = violations.iterator().next().getMessageTemplate();
        assertTrue("Error had to contain [" + errorTxtPiece + "], but actual value was: [" + actualTxt + "]",
                actualTxt.contains(errorTxtPiece));
    }

    private static final Validator VALIDATOR = Validation.buildDefaultValidatorFactory().getValidator();
}
