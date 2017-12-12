package io.qala.pyramid.domain;

import io.qala.pyramid.domain.utils.NotNullSized;

import javax.validation.constraints.Min;

import static io.qala.datagen.RandomShortApi.alphanumeric;
import static io.qala.datagen.RandomShortApi.positiveInteger;

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
                .setName(alphanumeric(100))
                .setComponentTests(positiveInteger())
                .setUnitTests(positiveInteger())
                .setSystemTests(positiveInteger());
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
