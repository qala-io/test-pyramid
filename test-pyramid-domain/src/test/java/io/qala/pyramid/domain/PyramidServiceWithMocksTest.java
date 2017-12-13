package io.qala.pyramid.domain;

import org.junit.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.Collections;

import static io.qala.datagen.RandomShortApi.positiveInteger;
import static io.qala.pyramid.domain.TestCountStatsTest.testCount;
import static org.junit.Assert.*;
import static org.mockito.Mockito.doReturn;

/** Example of how bad architectural decisions (anemic model) impact testing. */
public class PyramidServiceWithMocksTest {
    private final PyramidDao dao = Mockito.mock(PyramidDao.class);
    private final PyramidService service = new PyramidService(dao);

    @Test public void statsAreEmpty_ifNoPyramidsExist() {
        doReturn(Collections.emptyList()).when(dao).list();
        TestCountStats stats = service.getCountStats2();

        assertEquals(0, stats.getMean()  , .1);
        assertEquals(0, stats.getMedian(), .1);
        assertEquals(0, stats.getMode()  , .1);
    }
    @Test public void statsAreEqualForOnePyramid() {
        doReturn(Pyramid.random(1)).when(dao).list();
        TestCountStats stats = service.getCountStats2();

        assertNotEquals(0, stats.getMean(), .1);
        assertEquals(stats.getMean(), stats.getMode(), .1);
        assertEquals(stats.getMean(), stats.getMedian(), .1);
    }
    @Test public void statsCannotBeNegative() {
        doReturn(Pyramid.random(11)).when(dao).list();
        TestCountStats stats = service.getCountStats2();

        assertTrue(stats.getMean()   > 0);
        assertTrue(stats.getMedian() > 0);
        assertTrue(stats.getMode()   > 0);
    }

    @Test public void meanDividesSumByNumOfElements() {
        doReturn(Arrays.asList(testCount(0), testCount(100), testCount(200), testCount(300))).when(dao).list();
        TestCountStats stats = service.getCountStats2();
        assertEquals(150, stats.getMean(), .1);
    }
    @Test public void medianTakesMiddleElement() {
        doReturn(Arrays.asList(testCount(100), testCount(200), testCount(300))).when(dao).list();
        TestCountStats stats = service.getCountStats2();
        assertEquals(200, stats.getMedian(), .1);
    }
    @Test public void medianTakesMeanOfMiddleElements_ifCollectionSizeIsOdd() {
        doReturn(Arrays.asList(testCount(0), testCount(100), testCount(200), testCount(300))).when(dao).list();
        TestCountStats stats = service.getCountStats2();
        assertEquals(150, stats.getMedian(), .1);
    }
    @Test public void modeReturnsMostFrequentElement() {
        int mode1 = positiveInteger(), mode2 = positiveInteger();
        doReturn(Arrays.asList(testCount(mode1), testCount(mode2), testCount(mode1), testCount(mode2))).when(dao).list();
        TestCountStats stats = service.getCountStats2();
        assertEquals(mode1, stats.getMode(), .1);
    }
    @Test public void firstModeIsReturned_ifThereAreMoreThan1() {
        doReturn(Arrays.asList(testCount(100), testCount(100), testCount(200), testCount(200))).when(dao).list();
        TestCountStats stats = service.getCountStats2();
        assertEquals(100, stats.getMode(), .1);
    }
}