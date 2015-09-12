package io.qala.pyramid.domain.utils

import org.apache.commons.lang3.RandomUtils

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric

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
        return randomAlphanumeric(nOfSymbols())
    }

    String numeric() {
        return randomNumeric(nOfSymbols())
    }

    private int nOfSymbols() {
        return RandomUtils.nextInt(from, to + 1)
    }
}
