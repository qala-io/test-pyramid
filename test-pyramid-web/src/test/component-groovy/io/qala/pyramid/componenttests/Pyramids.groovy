package io.qala.pyramid.componenttests

import groovy.json.JsonSlurper
import io.qala.pyramid.domain.Pyramid
import io.qala.pyramid.domain.PyramidService
import io.qala.pyramid.web.PyramidController
import org.springframework.beans.factory.annotation.Autowired

import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals

class Pyramids {
    @Autowired PyramidController pyramidController
    @Autowired PyramidService pyramidService
    Pyramid create(Pyramid pyramid = Pyramid.random()) {
        pyramidService.save(pyramid)
        return pyramid
    }

    void assertPyramidExists(Pyramid pyramid) {
        String pyramidsString = pyramidController.index().getModel()['savedPyramids']
        List fetched = new JsonSlurper().parseText(pyramidsString) as List
        assertReflectionEquals(pyramid, fetched[0] as Pyramid)
    }
}
