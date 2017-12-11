package io.qala.pyramid.systemtests;

import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.web.ErrorResponse;
import io.restassured.response.Response;
import org.hibernate.validator.internal.engine.ConstraintViolationImpl;
import org.junit.BeforeClass;
import org.junit.Test;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
import io.restassured.RestAssured;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.http.ContentType;

import javax.validation.ConstraintViolation;

import static io.restassured.RestAssured.get;
import static io.restassured.RestAssured.given;
import static io.restassured.RestAssured.post;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals;

/**
 * The fact that on Component Tests level we configured MockMvc correctly doesn"t mean that our app will be configured
 * correctly in production. This includes configs like web.xml, app server descriptors, etc. Thus here we check whether
 * those configs were properly made for REST services. We don"t check the logic of the app itself - it was tested on
 * Component and Unit levels.
 * <p>Note, that we don"t test HTML page here - that will be done in UI tests.</p>
 */
public class PyramidRestSystemTest {

    @Test public void getsPyramidAfterSaving() {
        Pyramid original = Pyramid.random();
        Pyramid actualResponse = given().body(original).post("/pyramid").andReturn().as(Pyramid.class);
        Pyramid actualGet = find(actualResponse.getId());

        original.setId(actualResponse.getId());
        assertReflectionEquals(original, actualResponse);
        assertReflectionEquals(original, actualGet);
    }

    @Test public void invalidPyramidResultInValidationErrors() {
        Response response = given().body(Pyramid.random().setName("")).post("/pyramid").andReturn();
        assertEquals(400, response.getStatusCode());
        ErrorResponse error = response.as(ErrorResponse.class);
        assertTrue("Actual response: " + error,
                error.getErrors().iterator().next().getMessage().contains("size must be between"));
    }

    private static Pyramid find(String id) {
        Pyramid[] pyramids = get("/pyramid/list").andReturn().as(Pyramid[].class);
        for(Pyramid next: pyramids) if(next.getId().equals(id)) return next;
        throw new IllegalStateException("Couldn't find Pyramid with ID " + id);
    }

    @BeforeClass public static void initRestAssured() {
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
        RestAssured.config().getLogConfig().enablePrettyPrinting(true);
        RestAssured.port = 8080;
        RestAssured.baseURI = "http://localhost";
        RestAssured.requestSpecification = new RequestSpecBuilder().setContentType(ContentType.JSON).build();
    }

}
