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
    private int nOfUnitTests;
    @Min(0L)
    private int nOfComponentTests;
    @Min(0L)
    private int nOfSystemTests;

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
                .setnOfComponentTests(positiveInteger())
                .setnOfUnitTests(positiveInteger())
                .setnOfSystemTests(positiveInteger());
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

    public int getnOfUnitTests() {
        return nOfUnitTests;
    }

    public Pyramid setnOfUnitTests(int nOfUnitTests) {
        this.nOfUnitTests = nOfUnitTests;
        return this;
    }

    public int getnOfComponentTests() {
        return nOfComponentTests;
    }

    public Pyramid setnOfComponentTests(int nOfComponentTests) {
        this.nOfComponentTests = nOfComponentTests;
        return this;
    }

    public int getnOfSystemTests() {
        return nOfSystemTests;
    }

    public Pyramid setnOfSystemTests(int nOfSystemTests) {
        this.nOfSystemTests = nOfSystemTests;
        return this;
    }

    @Override
    public String toString() {
        return "Pyramid{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", nOfUnitTests=" + nOfUnitTests +
                ", nOfComponentTests=" + nOfComponentTests +
                ", nOfSystemTests=" + nOfSystemTests +
                '}';
    }
}
