package io.qala.pyramid.servicetests

import groovy.json.JsonBuilder
import groovyx.net.http.RESTClient
import org.apache.commons.lang3.RandomUtils
import org.apache.http.HttpRequest
import org.apache.http.HttpRequestInterceptor
import org.apache.http.protocol.HttpContext
import org.junit.Before
import org.junit.Test

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric

class PyramidRestSystemTest {

    @Test
    void 'add pyramid should allow to successfully retrieve the pyramid'() {
        def json = pyramid()
        rest.post(path: '/pyramid', body: json.toString())

        def expected = json.content
        def pyramid = rest.get(path: '/pyramid/list').data.find { it.name == expected.name }
        assert pyramid
        assert pyramid.nOfUnitTests == expected.nOfUnitTests
        assert pyramid.nOfComponentTests == expected.nOfComponentTests
        assert pyramid.nOfSystemTests == expected.nOfSystemTests
    }

    private static Object pyramid() {
        def builder = new JsonBuilder()
        builder {
            name randomAlphanumeric(15)
            nOfUnitTests RandomUtils.nextInt(0, 1000)
            nOfComponentTests RandomUtils.nextInt(0, 1000)
            nOfSystemTests RandomUtils.nextInt(0, 1000)
        }
        builder
    }
    // in reality we'd have it configurable, not hardcoded
    RESTClient rest = new RESTClient('http://localhost:8080/', 'application/json;charset=UTF-8')

    @Before
    void init() {
        rest.client.addRequestInterceptor(new HttpRequestInterceptor() {
            void process(HttpRequest httpRequest, HttpContext httpContext) {
                httpRequest.addHeader('Content-Type', 'application/json;charset=UTF-8')
            }
        })
    }
}
