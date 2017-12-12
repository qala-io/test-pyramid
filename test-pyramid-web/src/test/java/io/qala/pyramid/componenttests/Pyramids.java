package io.qala.pyramid.componenttests;

import com.fasterxml.jackson.databind.ObjectMapper;
import groovy.json.JsonBuilder;
import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.web.TestCountStats;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals;

class Pyramids {
    private final MockMvc mockMvc;
    Pyramids(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    Pyramid create(Pyramid pyramid) {
        MvcResult result;
        try {
            result = mockMvc.perform(post("/pyramid")
                    .content(new JsonBuilder(pyramid).toPrettyString())
                    .contentType(MediaType.APPLICATION_JSON)).andReturn();
            assertNoErrors(result);
            String resultPyramidString = result.getResponse().getContentAsString();
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(resultPyramidString, Pyramid.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    Pyramid create() { return create(Pyramid.random()); }

    void assertPyramidExists(Pyramid pyramid) {
        try {
            MvcResult result = mockMvc.perform(get("/")).andReturn();
            String pyramidsString = (String) result.getModelAndView().getModel().get("savedPyramids");
            ObjectMapper mapper = new ObjectMapper();
            Pyramid[] fetched = mapper.readValue(pyramidsString, Pyramid[].class);
            Pyramid fetchedPyramid = null;
            for(Pyramid p: fetched) if(p.getId().equals(pyramid.getId())) {
                fetchedPyramid = p;
                break;
            }
            assertNotNull(fetchedPyramid);
            assertReflectionEquals(pyramid, fetchedPyramid);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    TestCountStats getTestCountStats() {
        try {
            return mockMvc.perform(get("/pyramid/test-count-stats")).andReturn();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void assertNoErrors(MvcResult mvcResult) {
        if (mvcResult.getResolvedException() != null) {
            throw new RuntimeException(mvcResult.getResolvedException());
        }
    }
}
