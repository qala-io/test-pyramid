package io.qala.pyramid.domain

import io.qala.pyramid.domain.utils.NotBlankSized
import org.hibernate.validator.constraints.NotBlank

import javax.validation.constraints.Size

import static io.qala.pyramid.domain.utils.RandomValue.from
import static org.apache.commons.lang3.RandomUtils.nextInt

class Pyramid {
    Long id
    @NotBlankSized(min = 1, max = 100)
    String name
    int nOfUnitTests
    int nOfComponentTests
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
                name             : from(1).to(100).alphanumeric(),
                nOfUnitTests     : nextInt(0, 1000),
                nOfComponentTests: nextInt(0, 1000),
                nOfSystemTests   : nextInt(0, 1000)]
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
