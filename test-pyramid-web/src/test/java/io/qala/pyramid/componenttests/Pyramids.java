package io.qala.pyramid.componenttests;

import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.web.ErrorResponse;
import io.qala.pyramid.web.TestCountStats;
import io.qala.pyramid.web.dto.PyramidDto;
import io.restassured.http.ContentType;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import io.restassured.module.mockmvc.specification.MockMvcRequestSpecBuilder;
import org.springframework.web.context.WebApplicationContext;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.get;
import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.junit.Assert.assertNotNull;
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals;

class Pyramids {
    Pyramids(WebApplicationContext context) {
        RestAssuredMockMvc.webAppContextSetup(context);
        RestAssuredMockMvc.requestSpecification = new MockMvcRequestSpecBuilder().setContentType(ContentType.JSON).build();
    }

    PyramidDto create(Pyramid pyramid) {
        return given().body(pyramid).post("/pyramid").andReturn().as(PyramidDto.class);
    }
    ErrorResponse createWithError(Pyramid pyramid) {
        return given().body(pyramid).post("/pyramid").andReturn().as(ErrorResponse.class);
    }
    PyramidDto create() { return create(Pyramid.random()); }

    void assertPyramidExists(PyramidDto pyramid) {
        PyramidDto[] fetched = get("/pyramid").andReturn().as(PyramidDto[].class);
        PyramidDto fetchedPyramid = null;
        for (PyramidDto p : fetched) {
            if (p.getId().equals(pyramid.getId())) {
                fetchedPyramid = p;
                break;
            }
        }
        assertNotNull(fetchedPyramid);
        assertReflectionEquals(pyramid, fetchedPyramid);
    }

    TestCountStats getTestCountStats() {
        return get("/pyramid/test-count-stats").andReturn().as(TestCountStats.class);
    }
}
