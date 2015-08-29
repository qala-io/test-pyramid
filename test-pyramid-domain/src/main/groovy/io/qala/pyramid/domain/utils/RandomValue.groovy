package io.qala.pyramid.domain.utils

import org.apache.commons.lang3.RandomStringUtils
import org.apache.commons.lang3.RandomUtils

class RandomValue {
    int from
    int to

    static RandomValue from(int from) {
        return new RandomValue(from: from)
    }

    RandomValue to(int to) {
        this.to = to
        return this
    }

    String alphanumeric() {
        int nOfSymbols = RandomUtils.nextInt(from, to + 1)
        return RandomStringUtils.randomAlphanumeric(nOfSymbols)
    }
}
