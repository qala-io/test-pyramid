package io.qala.pyramid.domain;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Arrays;
import java.util.List;

import static io.qala.datagen.RandomShortApi.positiveInteger;
import static io.qala.pyramid.domain.TestCountStatsTest.testCount;
import static org.junit.Assert.*;

/** Example of how bad architectural decisions (anemic model) impact testing. */
@DaoTest @RunWith(SpringJUnit4ClassRunner.class)
public class PyramidServiceComponentTest {
    @Autowired private PyramidDao dao;
    @Autowired private PyramidService service;

    @Test public void statsAreEmpty_ifNoPyramidsExist() {
        TestCountStats stats = service.getCountStats2();

        assertEquals(0, stats.getMean()  , .1);
        assertEquals(0, stats.getMedian(), .1);
        assertEquals(0, stats.getMode()  , .1);
    }
    @Test public void statsAreEqualForOnePyramid() {
        persist(Pyramid.random());
        TestCountStats stats = service.getCountStats2();

        assertNotEquals(0, stats.getMean(), .1);
        assertEquals(stats.getMean(), stats.getMode(), .1);
        assertEquals(stats.getMean(), stats.getMedian(), .1);
    }
    @Test public void statsCannotBeNegative() {
        persist(Pyramid.random(11));
        TestCountStats stats = service.getCountStats2();

        assertTrue(stats.getMean()   > 0);
        assertTrue(stats.getMedian() > 0);
        assertTrue(stats.getMode()   > 0);
    }

    @Test public void meanDividesSumByNumOfElements() {
        persist(testCount(0), testCount(100), testCount(200), testCount(300));
        TestCountStats stats = service.getCountStats2();
        assertEquals(150, stats.getMean(), .1);
    }
    @Test public void medianTakesMiddleElement() {
        persist(testCount(100), testCount(200), testCount(300));
        TestCountStats stats = service.getCountStats2();
        assertEquals(200, stats.getMedian(), .1);
    }
    @Test public void medianTakesMeanOfMiddleElements_ifCollectionSizeIsOdd() {
        persist(testCount(0), testCount(100), testCount(200), testCount(300));
        TestCountStats stats = service.getCountStats2();
        assertEquals(150, stats.getMedian(), .1);
    }
    @Test public void modeReturnsMostFrequentElement() {
        int mode1 = positiveInteger(), mode2 = positiveInteger();
        persist(testCount(mode1), testCount(mode2), testCount(mode1), testCount(mode2));
        TestCountStats stats = service.getCountStats2();
        assertEquals(mode1, stats.getMode(), .1);
    }
    @Test public void firstModeIsReturned_ifThereAreMoreThan1() {
        persist(testCount(100), testCount(100), testCount(200), testCount(200));
        TestCountStats stats = service.getCountStats2();
        assertEquals(100, stats.getMode(), .1);
    }

    private void persist(List<Pyramid> pyramids) {
        for(Pyramid p: pyramids) dao.save(p);
    }
    private void persist(Pyramid ... pyramids) {
        persist(Arrays.asList(pyramids));
    }
}