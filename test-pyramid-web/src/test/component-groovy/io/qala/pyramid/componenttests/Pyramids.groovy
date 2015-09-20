package io.qala.pyramid.componenttests

import groovy.json.JsonBuilder
import groovy.json.JsonSlurper
import io.qala.pyramid.domain.Pyramid
import io.qala.pyramid.web.PyramidController
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals

class Pyramids {
    @Autowired PyramidController pyramidController
    @Autowired MockMvc mockMvc

    Pyramid create(Pyramid pyramid = Pyramid.random()) {
        MvcResult result = mockMvc.perform(post('/pyramid')
                .content(new JsonBuilder(pyramid).toPrettyString())
                .contentType(MediaType.APPLICATION_JSON)).andReturn()
        assertNoErrors(result)
        String resultPyramidString = result.response.contentAsString
        Pyramid resultPyramid = new JsonSlurper().parseText(resultPyramidString) as Pyramid
        return resultPyramid
    }

    void assertPyramidExists(Pyramid pyramid) {
        MvcResult result = mockMvc.perform(get('/')).andReturn()
        String pyramidsString = result.modelAndView.model['savedPyramids']
        List fetched = new JsonSlurper().parseText(pyramidsString) as List
        Pyramid fetchedPyramid = fetched.find { it.id == pyramid.id } as Pyramid
        assert fetchedPyramid
        assertReflectionEquals(pyramid, fetchedPyramid)
    }

    static void assertNoErrors(MvcResult mvcResult) {
        if (mvcResult.resolvedException) {
            throw mvcResult.resolvedException
        }
    }
}
