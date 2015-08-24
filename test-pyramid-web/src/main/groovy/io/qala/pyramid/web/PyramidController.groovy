package io.qala.pyramid.web

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.servlet.ModelAndView

@Controller
class PyramidController {
    @RequestMapping(value = '/', method = RequestMethod.GET)
    ModelAndView index() {
        return new ModelAndView('index', [savedPyramids: pyramidService.pyramids])
    }

    @Autowired PyramidService pyramidService
}
