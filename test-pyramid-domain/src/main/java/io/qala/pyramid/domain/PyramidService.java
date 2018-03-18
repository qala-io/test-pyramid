package io.qala.pyramid.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class PyramidService {
    PyramidService(PyramidDao pyramidDao) {
        this.pyramidDao = pyramidDao;
    }

    public void save(Pyramid pyramid) { pyramidDao.save(pyramid); }
    public List<Pyramid> list()       { return pyramidDao.list(); }

    /**
     * Value from 0 to 1 which tells how good the pyramid is.
     *
     * @return 0 - for worse pyramid ever, 1 - for the best pyramid
     */
    public double getScore2(Serializable pyramidId) {//Anemic Model demo - example of bad architectural decisions
        Pyramid p = pyramidDao.get(pyramidId);
        double unitTestScore = p.getUnitTests(),
               componentTestScore = p.getComponentTests();
        if(p.getComponentTests() + p.getSystemTests() != 0)
            unitTestScore /= (p.getComponentTests() + p.getSystemTests());
        if(p.getSystemTests() != 0)
            componentTestScore /= p.getSystemTests();

        if(componentTestScore == 0 && unitTestScore == 0) return 0;
        //   1
        //-------- where s is score which gets bigger if pyramid is better. This allows the score to be between 0 and 1.
        // 1 + e⁻ˢ
        double firstHalf = 1./((1 + Math.exp(-1 * componentTestScore)));
        double secondHalf = 1./((1 + Math.exp(-1 * unitTestScore)));
        return (firstHalf+secondHalf)/2;
    }

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

    public double getScore(Serializable pyramidId) {//Rich Model demo
        Pyramid pyramid = pyramidDao.get(pyramidId);
        if(pyramid != null) return pyramid.getScore();
        throw new IllegalArgumentException("There is no pyramid with such ID: " + pyramidId);
    }
    public TestCountStats getCountStats() {//Rich Model demo
        return new TestCountStats(pyramidDao.list());
    }

    private final PyramidDao pyramidDao;
}
