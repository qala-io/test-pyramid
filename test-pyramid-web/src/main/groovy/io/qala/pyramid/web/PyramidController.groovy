package io.qala.pyramid.web

import groovy.json.JsonBuilder
import io.qala.pyramid.domain.Pyramid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.servlet.ModelAndView

@Controller
class PyramidController {
    @Autowired
    PyramidController(PyramidRest pyramidRest) {
        this.pyramidService = pyramidRest
        // fill with pre-defined data for presentations
        pyramidService.save(new Pyramid(name: 'Straight Pyramid', nOfUnitTests: 3, nOfComponentTests: 2, nOfSystemTests: 1))
        pyramidService.save(new Pyramid(name: 'Ice-Cream Cone', nOfUnitTests: 1, nOfComponentTests: 2, nOfSystemTests: 3))
        pyramidService.save(new Pyramid(name: 'Unit Square', nOfUnitTests: 1))
        pyramidService.save(new Pyramid(name: 'Two Squares', nOfUnitTests: 1, nOfSystemTests: 1))
        pyramidService.save(new Pyramid(name: 'System Square', nOfSystemTests: 1))
        pyramidService.save(new Pyramid(name: 'Diamond', nOfUnitTests: 1, nOfComponentTests: 2, nOfSystemTests: 1))
        pyramidService.save(new Pyramid(name: 'Current Project Pyramid', nOfUnitTests: 67, nOfComponentTests: 26, nOfSystemTests: 4))
    }

    @RequestMapping(value = '/', method = RequestMethod.GET)
    ModelAndView index() {
        return new ModelAndView('index', [savedPyramids: new JsonBuilder(pyramidService.pyramids()).toString()])
    }

    final PyramidRest pyramidService
}
