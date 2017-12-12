package io.qala.pyramid.componenttests;

import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.web.ErrorResponse;
import io.qala.pyramid.web.TestCountStats;
import io.qala.pyramid.web.dto.PyramidDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {
        //WEB-INF is not in the classpath actually, but we added it as a testResourceDirectory in Maven
        //to overcome the limitations
        "classpath:/io/qala/pyramid/domain/app-context-service.xml",
        "classpath:/spring-mvc-servlet.xml",
        "classpath:/app-context-component-tests.xml"})
public class PyramidComponentTest {
    @Autowired private Pyramids pyramids;

    @Test public void savesValidPyramid() {
        PyramidDto pyramid = pyramids.create();
        pyramids.assertPyramidExists(pyramid);
    }

    /**
     * We don"t do massive validation checks - that was done on Unit Tests level. Here the only thing we need to check
     * is that validation is invoked. This ensures 100% coverage of the Back End validation.
     */
    @Test public void returnsErrorsIfValidationFails() {
        ErrorResponse errors = pyramids.createWithError(Pyramid.random().setName(""));
        ErrorResponse.ValidationError error = errors.getErrors().iterator().next();
        assertEquals(error.getField(), "name");
        assertTrue("Actual error: " + error, error.getMessage().contains("size must be between"));
    }
    @Test public void calculatesTestCountStats() {
        pyramids.create();
        TestCountStats stats = pyramids.getTestCountStats();
        assertNotEquals(0, stats.getMean());
        assertNotEquals(0, stats.getMedian());
        assertNotEquals(0, stats.getMode());
    }
}
