package io.qala.pyramid.domain;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class TestCountStats {
    private double mean, median, mode;//leaving them non-final to demo anemic model

    TestCountStats() {}

    TestCountStats(Pyramid ... pyramids) {
        this(pyramids == null ? null: Arrays.asList(pyramids));
    }
    TestCountStats(List<Pyramid> pyramids) {
        if(pyramids == null || pyramids.isEmpty()) return;

        List<Integer> sums = new ArrayList<>(pyramids.size());
        for(Pyramid p: pyramids) sums.add(p.getSumOfTests());

        this.mean   = getMean(sums);
        this.mode   = getMode(sums);
        Collections.sort(sums);
        this.median = getMedian(sums);
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


    public double getMean()   {return mean  ;}
    public double getMedian() {return median;}
    public double getMode()   {return mode  ;}

    public void setMean(double mean)     {this.mean   = mean  ;}
    public void setMedian(double median) {this.median = median;}
    public void setMode(double mode)     {this.mode   = mode  ;}
}
