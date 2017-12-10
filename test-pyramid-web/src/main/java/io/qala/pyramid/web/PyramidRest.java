package io.qala.pyramid.web;

import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.domain.PyramidService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
class PyramidRest {

    PyramidRest(PyramidService pyramidService) {
        this.pyramidService = pyramidService;
    }

    @RequestMapping(value = "/pyramid", method = RequestMethod.POST)
    @ResponseBody
    Pyramid save(@Valid @RequestBody Pyramid pyramid) {
        pyramidService.save(pyramid);
        return pyramid;
    }

    @RequestMapping(value = "/pyramid/list", method = RequestMethod.GET)
    @ResponseBody
    List<Pyramid> pyramids() { return pyramidService.list(); }

    private final PyramidService pyramidService;
}