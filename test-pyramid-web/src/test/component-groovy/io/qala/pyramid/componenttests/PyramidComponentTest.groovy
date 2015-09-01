package io.qala.pyramid.componenttests

import io.qala.pyramid.domain.Pyramid
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner

@RunWith(SpringJUnit4ClassRunner)
@ContextConfiguration(locations = [
        //WEB-INF is not in the classpath actually, but we added it as a testResourceDirectory in Maven
        //to overcome the limitations
        'classpath:spring-mvc-servlet.groovy',
        'classpath:/io/qala/pyramid/domain/app-context-service.groovy',
        'classpath:/io.qala.pyramid.componenttests/app-context-component-tests.groovy'])
class PyramidComponentTest {
    @Autowired Pyramids pyramids

    @Test
    void 'service must save a valid pyramid'() {
        Pyramid pyramid = pyramids.create()
        pyramids.assertPyramidExists(pyramid)
    }
}