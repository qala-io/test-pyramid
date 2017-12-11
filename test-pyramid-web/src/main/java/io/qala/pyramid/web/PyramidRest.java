package io.qala.pyramid.web;

import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.domain.PyramidService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller @RestController
@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
class PyramidRest {

    PyramidRest(PyramidService pyramidService) {
        this.pyramidService = pyramidService;
    }

    @PostMapping(value = "/pyramid")
    Pyramid save(@Valid @RequestBody Pyramid pyramid) {
        pyramidService.save(pyramid);
        return pyramid;
    }

    @GetMapping(value = "/pyramid/list")
    List<Pyramid> pyramids() { return pyramidService.list(); }

    private final PyramidService pyramidService;
}