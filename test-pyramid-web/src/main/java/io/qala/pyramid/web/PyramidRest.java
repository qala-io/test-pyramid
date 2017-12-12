package io.qala.pyramid.web;

import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.domain.PyramidService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@SuppressWarnings("UnusedReturnValue")
@RestController @Controller
@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
class PyramidRest {
    PyramidRest(PyramidService pyramidService) { this.pyramidService = pyramidService; }

    @PostMapping("/pyramid")
    Pyramid save(@Valid @RequestBody Pyramid pyramid) {
        pyramidService.save(pyramid);
        return pyramid;
    }

    @GetMapping("/pyramid/list")
    List<Pyramid> pyramids() { return pyramidService.list(); }

    @GetMapping("/pyramid/test-count-stats")
    TestCountStats getStatistics() {
        return new TestCountStats();
    }

    private final PyramidService pyramidService;
}