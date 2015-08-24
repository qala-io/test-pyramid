package io.qala.pyramid.web

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody

@Controller
@RequestMapping(consumes = 'application/json;charset=UTF-8', produces = 'application/json')
class PyramidService {

    @RequestMapping(value = '/pyramid', method = RequestMethod.POST)
    @ResponseBody
    Pyramid pyramid(@ModelAttribute Pyramid pyramid) {
        pyramids.add(pyramid)
        return pyramid
    }

    @RequestMapping(value = '/pyramid/list', method = RequestMethod.GET)
    @ResponseBody
    List<Pyramid> pyramids() { return pyramids }

    final List<Pyramid> pyramids = []
}