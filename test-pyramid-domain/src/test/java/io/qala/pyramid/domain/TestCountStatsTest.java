package io.qala.pyramid.domain;

import org.junit.Test;

import java.util.Collections;
import java.util.List;

import static io.qala.datagen.RandomShortApi.*;
import static org.junit.Assert.*;

public class TestCountStatsTest {
    @Test public void statsAreEmpty_ifNoPyramidsExist() {
        TestCountStats stats = sample(
                new TestCountStats(),
                new TestCountStats(Collections.emptyList()),
                new TestCountStats((Pyramid[]) null),
                new TestCountStats((List<Pyramid>) null));

        assertEquals(0, stats.getMean()  , .1);
        assertEquals(0, stats.getMedian(), .1);
        assertEquals(0, stats.getMode()  , .1);
    }
    @Test public void statsAreEqualForOnePyramid() {
        TestCountStats stats = new TestCountStats(Pyramid.random());
        assertNotEquals(0, stats.getMean(), .1);
        assertEquals(stats.getMean(), stats.getMode(), .1);
        assertEquals(stats.getMean(), stats.getMedian(), .1);
    }
    @Test public void statsCannotBeNegative() {
        TestCountStats stats = new TestCountStats(Pyramid.random(11));
        assertTrue(stats.getMean()   > 0);
        assertTrue(stats.getMedian() > 0);
        assertTrue(stats.getMode()   > 0);
    }

    @Test public void meanDividesSumByNumOfElements() {
        TestCountStats stats = new TestCountStats(testCount(0), testCount(100), testCount(200), testCount(300));
        assertEquals(150, stats.getMean(), .1);
    }
    @Test public void medianTakesMiddleElement() {
        TestCountStats stats = new TestCountStats(testCount(100), testCount(200), testCount(300));
        assertEquals(200, stats.getMedian(), .1);
    }
    @Test public void medianTakesMeanOfMiddleElements_ifCollectionSizeIsOdd() {
        TestCountStats stats = new TestCountStats(testCount(0), testCount(100), testCount(200), testCount(300));
        assertEquals(150, stats.getMedian(), .1);
    }
    @Test public void modeReturnsMostFrequentElement() {
        int mode1 = positiveInteger(), mode2 = positiveInteger();
        TestCountStats stats = new TestCountStats(testCount(mode1), testCount(mode2), testCount(mode1), testCount(mode2));
        assertEquals(mode1, stats.getMode(), .1);
    }
    @Test public void firstModeIsReturned_ifThereAreMoreThan1() {
        TestCountStats stats = new TestCountStats(testCount(100), testCount(100), testCount(200), testCount(200));
        assertEquals(100, stats.getMode(), .1);
    }

    static Pyramid testCount(int sumOfTests) {
        Pyramid pyramid = Pyramid.random().setUnitTests(0).setComponentTests(0).setSystemTests(0);//needed for anemic model demo
        callOneOf(
                ()-> pyramid.setUnitTests     (sumOfTests),
                ()-> pyramid.setComponentTests(sumOfTests),
                ()-> pyramid.setSystemTests   (sumOfTests));
        return pyramid;
    }
}