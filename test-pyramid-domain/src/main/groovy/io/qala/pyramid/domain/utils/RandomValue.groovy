package io.qala.pyramid.domain.utils

import org.apache.commons.lang3.RandomStringUtils
import org.apache.commons.lang3.RandomUtils

import static org.apache.commons.lang3.RandomStringUtils.random
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric
import static org.apache.commons.lang3.RandomStringUtils.randomNumeric

class RandomValue {
    static final String SPECIAL_SYMBOLS = '!@#$%^&*()_+{}[]\'"|:?><~`§\\'
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

    String specialSymbols() {
        return random(nOfSymbols(), SPECIAL_SYMBOLS.toCharArray())
    }

    int integer() {
        return RandomUtils.nextInt(from, to);
    }

    private int nOfSymbols() {
        return RandomUtils.nextInt(from, to + 1)
    }
}
