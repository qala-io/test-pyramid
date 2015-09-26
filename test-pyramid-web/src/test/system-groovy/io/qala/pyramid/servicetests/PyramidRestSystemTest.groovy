package io.qala.pyramid.servicetests

import groovy.json.JsonBuilder
import groovyx.net.http.HttpResponseException
import groovyx.net.http.RESTClient
import org.apache.commons.lang3.RandomUtils
import org.apache.http.HttpRequest
import org.apache.http.HttpRequestInterceptor
import org.apache.http.protocol.HttpContext
import org.junit.Before
import org.junit.Test

import static groovy.test.GroovyAssert.shouldFail
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric

/**
 * The fact that on Component Tests level we configured MockMvc correctly doesn't mean that our app will be configured
 * correctly in production. This includes configs like web.xml, app server descriptors, etc. Thus here we check whether
 * those configs were properly made for REST services. We don't check the logic of the app itself - it was tested on
 * Component and Unit levels.
 * <p>Note, that we don't test HTML page here - that will be done in UI tests.</p>
 */
class PyramidRestSystemTest {

    @Test void 'add pyramid should allow to successfully retrieve the pyramid'() {
        def json = pyramid()
        rest.post(path: '/pyramid', body: json.toString())

        def expected = json.content
        def pyramid = rest.get(path: '/pyramid/list').data.find { it.name == expected.name }
        assert pyramid
        assert pyramid.nOfUnitTests == expected.nOfUnitTests
        assert pyramid.nOfComponentTests == expected.nOfComponentTests
        assert pyramid.nOfSystemTests == expected.nOfSystemTests
    }
    @Test
    void 'add invalid pyramid should result in validation errors'() {
        def json = pyramid([name: ''])
        Throwable error = shouldFail(HttpResponseException) {
            rest.post(path: '/pyramid', body: json.toString())
        }
        assert error.message.contains('Bad Request')
    }

    private static Object pyramid(Map<String, Object> props = [:]) {
        def builder = new JsonBuilder()
        builder {
            name props.get('name', randomAlphanumeric(15))
            nOfUnitTests props.get('nOfUnitTests', RandomUtils.nextInt(0, 1000))
            nOfComponentTests props.get('nOfComponentTests', RandomUtils.nextInt(0, 1000))
            nOfSystemTests props.get('nOfSystemTests', RandomUtils.nextInt(0, 1000))
        }
        builder
    }
    // in reality we'd have it configurable, not hardcoded
    RESTClient rest = new RESTClient('http://localhost:8080/', 'application/json;charset=UTF-8')

    @Before void init() {
        rest.client.addRequestInterceptor(new HttpRequestInterceptor() {
            void process(HttpRequest httpRequest, HttpContext httpContext) {
                httpRequest.addHeader('Content-Type', 'application/json;charset=UTF-8')
            }
        })
    }
}
