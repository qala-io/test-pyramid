package io.qala.pyramid.componenttests

import groovy.json.JsonSlurper
import io.qala.pyramid.domain.Pyramid
import io.qala.pyramid.domain.PyramidService
import io.qala.pyramid.web.PyramidController
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner
import org.unitils.reflectionassert.ReflectionAssert

import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals

@RunWith(SpringJUnit4ClassRunner)
@ContextConfiguration(locations = [
        //WEB-INF is not in the classpath actually, but we added it as a testResourceDirectory in Maven
        //to overcome the limitations
        'classpath:spring-mvc-servlet.groovy',
        'classpath:/io/qala/pyramid/domain/app-context-service.groovy'])
class PyramidComponentTest {
    @Autowired PyramidService pyramidService
    @Autowired PyramidController pyramidController

    @Test
    void 'service must save a valid pyramid'() {
        Pyramid pyramid = Pyramid.random()
        pyramidService.save(pyramid)

        String pyramidsString = pyramidController.index().getModel()['savedPyramids']
        List fetched = new JsonSlurper().parseText(pyramidsString) as List
        assertReflectionEquals(pyramid, fetched[0] as Pyramid)
    }
}
