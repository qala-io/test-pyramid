package io.qala.pyramid.domain

import static io.qala.pyramid.domain.utils.RandomValue.from
import static org.apache.commons.lang3.RandomUtils.nextInt

class Pyramid {
    String name
    int nOfUnitTests
    int nOfComponentTests
    int nOfSystemTests

    /**
     * Returns a pyramid with randomly generated data. This class is needed for testing only. This is not a typical
     * decision to put test-only logic into production code, but looks nice here and apart from additional dependency
     * (which may be needed for production in the future anyway) it doesn't hurt. So decided to leave it here for
     * simplicity.
     * @return a pyramid with randomly generated properties
     */
    static Pyramid random() {
        return new Pyramid(name: from(1).to(100).alphanumeric(),
                nOfUnitTests: nextInt(0, 1000),
                nOfComponentTests: nextInt(0, 1000),
                nOfSystemTests: nextInt(0, 1000))
    }
}
