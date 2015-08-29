package io.qala.pyramid.domain

import static io.qala.pyramid.domain.utils.RandomValue.from
import static org.apache.commons.lang3.RandomUtils.nextInt

class Pyramid {
    String name
    int nOfUnitTests
    int nOfComponentTests
    int nOfSystemTests


    static Pyramid random() {
        return new Pyramid(name: from(1).to(100).alphanumeric(),
                nOfUnitTests: nextInt(0, 1000),
                nOfComponentTests: nextInt(0, 1000),
                nOfSystemTests: nextInt(0, 1000))
    }
}
