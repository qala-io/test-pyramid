package io.qala.pyramid.web;

import groovy.json.JsonBuilder;
import io.qala.pyramid.domain.Pyramid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
class PyramidController {
    @Autowired
    PyramidController(PyramidRest pyramidRest) {
        this.pyramidService = pyramidRest;
        // fill with pre-defined data for presentations
        pyramidService.save(new Pyramid().setName("Straight Pyramid").
                setnOfUnitTests(3).setnOfComponentTests(2).setnOfSystemTests(1));
        pyramidService.save(new Pyramid().setName("Ice-Cream Cone")
                .setnOfUnitTests(1).setnOfComponentTests(2).setnOfSystemTests(3));
        pyramidService.save(new Pyramid().setName("Unit Square")
                .setnOfUnitTests(1));
        pyramidService.save(new Pyramid().setName("Two Squares")
                .setnOfUnitTests(1).setnOfSystemTests(1));
        pyramidService.save(new Pyramid().setName("System Square")
                .setnOfSystemTests(1));
        pyramidService.save(new Pyramid().setName("Diamond")
                .setnOfUnitTests(1).setnOfComponentTests(2).setnOfSystemTests(1));
        pyramidService.save(new Pyramid().setName("Current Project Pyramid")
                .setnOfUnitTests(83).setnOfComponentTests(26).setnOfSystemTests(5));
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    ModelAndView index() {
        return new ModelAndView("index", "savedPyramids", new JsonBuilder(pyramidService.pyramids()).toString());
    }

    private final PyramidRest pyramidService;
}
