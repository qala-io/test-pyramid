package io.qala.pyramid.domain;

import io.qala.pyramid.domain.utils.NotNullSized;

import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

import static io.qala.datagen.RandomShortApi.alphanumeric;
import static io.qala.datagen.RandomShortApi.integer;

public class Pyramid {
    private String id;
    @NotNullSized(min = 1, max = 100)
    private String name;
    @Min(0L)
    private int unitTests, componentTests, systemTests;
    /**
     * Returns a pyramid with randomly generated data. This class is needed for testing only. This is not a typical
     * decision to put test-only logic into production code, but it looks nice here and apart from additional dependency
     * (which may be needed for production in the future anyway) it doesn't hurt. So decided to leave it here for
     * simplicity.
     * @return a pyramid with randomly generated properties
     */
    public static Pyramid random() {
        return new Pyramid()
                .setName          (alphanumeric(100))
                .setUnitTests     (integer(0, 1000000))
                .setComponentTests(integer(0, 1000000))
                .setSystemTests   (integer(0, 1000000));
    }
    public static List<Pyramid> random(int n) {
        List<Pyramid> result = new ArrayList<>(n);
        for(int i = 0; i < n; i++) result.add(Pyramid.random());
        return result;
    }

    public String getId() {
        return id;
    }

    public Pyramid setId(String id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public Pyramid setName(String name) {
        this.name = name;
        return this;
    }

    public int getUnitTests() {
        return unitTests;
    }

    public Pyramid setUnitTests(int unitTests) {
        this.unitTests = unitTests;
        return this;
    }

    public int getComponentTests() {
        return componentTests;
    }

    public Pyramid setComponentTests(int componentTests) {
        this.componentTests = componentTests;
        return this;
    }

    public int getSystemTests() {
        return systemTests;
    }

    public Pyramid setSystemTests(int systemTests) {
        this.systemTests = systemTests;
        return this;
    }

    public int getSumOfTests() {
        return unitTests + componentTests + systemTests;
    }

    /**
     * Value from 0 to 1 which tells how good the pyramid is.
     *
     * @return 0 - for worse pyramid ever, 1 - for the best pyramid
     */
    public double getScore() {
        double unitTestScore = unitTests, componentTestScore = componentTests;
        if(componentTests + systemTests != 0) unitTestScore /= (componentTests + systemTests);
        if(systemTests != 0)                  componentTestScore /= systemTests;

        if(componentTestScore == 0 && unitTestScore == 0) return 0;
        //   1
        //-------- where s is score which gets bigger if pyramid is better. This allows the score to be between 0 and 1.
        // 1 + e⁻ˢ
        double firstHalf = 1./((1 + Math.exp(-1 * componentTestScore)));
        double secondHalf = 1./((1 + Math.exp(-1 * unitTestScore)));
        return (firstHalf+secondHalf)/2;
    }

    @Override
    public String toString() {
        return "Pyramid{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", unitTests=" + unitTests +
                ", componentTests=" + componentTests +
                ", systemTests=" + systemTests +
                '}';
    }
}
