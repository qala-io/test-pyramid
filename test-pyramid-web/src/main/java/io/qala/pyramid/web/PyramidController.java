package io.qala.pyramid.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.qala.pyramid.domain.Pyramid;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
class PyramidController {
    PyramidController(PyramidRest pyramidRest) {
        this.pyramidService = pyramidRest;
        // fill with pre-defined data for presentations
        pyramidService.save(new Pyramid().setName("Straight Pyramid").
                setUnitTests(3).setComponentTests(2).setSystemTests(1));
        pyramidService.save(new Pyramid().setName("Ice-Cream Cone")
                .setUnitTests(1).setComponentTests(2).setSystemTests(3));
        pyramidService.save(new Pyramid().setName("Unit Square")
                .setUnitTests(1));
        pyramidService.save(new Pyramid().setName("Two Squares")
                .setUnitTests(1).setSystemTests(1));
        pyramidService.save(new Pyramid().setName("System Square")
                .setSystemTests(1));
        pyramidService.save(new Pyramid().setName("Diamond")
                .setUnitTests(1).setComponentTests(2).setSystemTests(1));
        pyramidService.save(new Pyramid().setName("Current Project Pyramid")
                .setUnitTests(83).setComponentTests(26).setSystemTests(5));
    }

    @GetMapping(value = "/")
    ModelAndView index() throws JsonProcessingException {
        ObjectMapper m = new ObjectMapper();
        String json = m.writeValueAsString(pyramidService.pyramids());
        return new ModelAndView("index", "savedPyramids", json);
    }

    private final PyramidRest pyramidService;
}
