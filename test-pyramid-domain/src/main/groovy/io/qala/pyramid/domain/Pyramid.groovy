package io.qala.pyramid.domain

import io.qala.pyramid.domain.utils.NotNullSized

import javax.validation.constraints.Min

import static io.qala.datagen.RandomShortApi.alphanumeric
import static io.qala.datagen.RandomShortApi.positiveInteger

class Pyramid {
    Long id
    @NotNullSized(min = 1, max = 100)
    String name
    @Min(0L)
    int nOfUnitTests
    @Min(0L)
    int nOfComponentTests
    @Min(0L)
    int nOfSystemTests

    /**
     * Returns a pyramid with randomly generated data. This class is needed for testing only. This is not a typical
     * decision to put test-only logic into production code, but it looks nice here and apart from additional dependency
     * (which may be needed for production in the future anyway) it doesn't hurt. So decided to leave it here for
     * simplicity.
     * @param overrideDefaults you can override some properties that would be generated randomly with your own values
     * @return a pyramid with randomly generated properties
     */
    static Pyramid random(Map<String, Object> overrideDefaults = [:]) {
        Map<String, Object> defaults = [
            name             : alphanumeric(1, 100),
            nOfUnitTests     : positiveInteger(),
            nOfComponentTests: positiveInteger(),
            nOfSystemTests   : positiveInteger()]
        defaults.putAll(overrideDefaults)
        return new Pyramid(defaults)
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
