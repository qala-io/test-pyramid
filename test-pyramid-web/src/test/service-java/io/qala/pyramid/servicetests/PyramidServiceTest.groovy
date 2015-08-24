package io.qala.pyramid.servicetests

import groovy.json.JsonBuilder
import groovyx.net.http.RESTClient
import io.qala.pyramid.web.Pyramid
import org.apache.commons.lang3.RandomUtils
import org.junit.Test

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric

class PyramidServiceTest {

    @Test
    void test() {
        def builder = new JsonBuilder()
        def json = builder {
            name randomAlphanumeric(15)
            nOfUnitTests RandomUtils.nextInt(0, 1000)
            nOfComponentTests RandomUtils.nextInt(0, 1000)
            nOfSystemTests RandomUtils.nextInt(0, 1000)
        }
        rest.post(path: '/pyramid', body: json.toString())

        def pyramids = rest.get(path: '/pyramid/list')
        println pyramids
    }

    RESTClient rest = new RESTClient('http://localhost:8080/', 'application/json')
}
