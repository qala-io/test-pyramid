package io.qala.pyramid.componenttests

import io.qala.pyramid.domain.Pyramid
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.web.bind.MethodArgumentNotValidException

@RunWith(SpringJUnit4ClassRunner)
@WebAppConfiguration
@ContextConfiguration(locations = [
        //WEB-INF is not in the classpath actually, but we added it as a testResourceDirectory in Maven
        //to overcome the limitations
        'classpath:/io/qala/pyramid/domain/app-context-service.xml',
        'classpath:/spring-mvc-servlet.xml',
        'classpath:/app-context-component-tests.xml'])
class PyramidComponentTest {
    @Autowired Pyramids pyramids

    @Test
    void 'service must save a valid pyramid'() {
        Pyramid pyramid = pyramids.create()
        pyramids.assertPyramidExists(pyramid)
    }

    /**
     * We don't do massive validation checks - that was done on Unit Tests level. Here the only thing we need to check
     * is that validation is invoked. This ensures 100% coverage of the Back End validation.
     */
    @Test(expected = MethodArgumentNotValidException)
    void 'service must return errors if validation fails'() {
        pyramids.create(Pyramid.random().setName(""))
    }
}
