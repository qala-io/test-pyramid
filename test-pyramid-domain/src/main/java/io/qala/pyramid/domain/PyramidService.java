package io.qala.pyramid.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PyramidService {
    PyramidService(PyramidDao pyramidDao) {
        this.pyramidDao = pyramidDao;
    }

    public void save(Pyramid pyramid) { pyramidDao.save(pyramid); }
    public List<Pyramid> list()       { return pyramidDao.list(); }

    public TestCountStats getCountStats2() {//Anemic Model demo - example of bad architectural decisions
        TestCountStats result = new TestCountStats();
        List<Pyramid> pyramids = pyramidDao.list();
        if(pyramids.isEmpty()) return result;

        List<Integer> testCounts = new ArrayList<>(pyramids.size());
        for(Pyramid p: pyramids) testCounts.add(p.getUnitTests() + p.getComponentTests() + p.getSystemTests());

        result.setMean(getMean(testCounts));
        result.setMode(getMode(testCounts));
        Collections.sort(testCounts);
        result.setMedian(getMedian(testCounts));
        return result;
    }
    private static double getMean(List<Integer> ints) {
        int sum = 0;
        for (Integer next: ints) sum += next;
        return sum / ints.size();
    }
    private static double getMedian(List<Integer> ints) {
        int middle = ints.size() / 2;
        if(ints.size() % 2 == 1) return ints.get(middle);
        else                     return (ints.get(middle) + ints.get(middle-1)) / 2.;
    }
    private static int getMode(List<Integer> ints) {
        int maxValue = 0, maxCount = 0;
        for (int i = 0; i < ints.size(); ++i) {
            int count = 0;
            for (Integer anInt : ints)//O=n^2, but it's just a demo so no one cares
                if (anInt.equals(ints.get(i))) ++count;
            if (count > maxCount) {
                maxCount = count;
                maxValue = ints.get(0);
            }
        }
        return maxValue;
    }

    public TestCountStats getCountStats() {//Rich Model demo
        return new TestCountStats(pyramidDao.list());
    }

    private final PyramidDao pyramidDao;
}
