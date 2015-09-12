package io.qala.pyramid.componenttests

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import io.qala.pyramid.domain.Pyramid
import io.qala.pyramid.domain.PyramidService
import io.qala.pyramid.web.PyramidController
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.web.bind.MethodArgumentNotValidException

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals

class Pyramids {
    @Autowired PyramidController pyramidController
    @Autowired MockMvc mockMvc

    Pyramid create(Pyramid pyramid = Pyramid.random()) {
        MvcResult result = mockMvc.perform(post('/pyramid')
                .content(new JsonBuilder(pyramid).toPrettyString())
                .contentType(MediaType.APPLICATION_JSON)).andReturn()
        assertNoErrors(result)
        String resultPyramidString = result.response.content
        Pyramid resultPyramid = new JsonSlurper().parseText(resultPyramidString) as Pyramid
        return resultPyramid
    }

    List<Map> validate(Pyramid pyramid = Pyramid.random()) {
        MvcResult result = mockMvc.perform(post('/pyramid/validate')
                .content(new JsonBuilder(pyramid).toPrettyString())
                .contentType(MediaType.APPLICATION_JSON)).andReturn()
        assertNoErrors(result)
        String resultPyramidString = result.response.content
        return new JsonSlurper().parseText(resultPyramidString) as List
    }

    void assertPyramidExists(Pyramid pyramid) {
        String pyramidsString = pyramidController.index().getModel()['savedPyramids']
        List fetched = new JsonSlurper().parseText(pyramidsString) as List
        assertReflectionEquals(pyramid, fetched[0] as Pyramid)
    }

    static assertNoErrors(MvcResult mvcResult) {
        if(mvcResult.resolvedException) {
            throw mvcResult.resolvedException
        }
    }
}
