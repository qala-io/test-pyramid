package io.qala.pyramid.web;

import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.domain.PyramidService;
import io.qala.pyramid.domain.TestCountStats;
import io.qala.pyramid.web.dto.PyramidDto;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@SuppressWarnings("UnusedReturnValue"/*everything is used here by Spring MVC*/)
@RestController @Controller
@RequestMapping(value = "/pyramid", consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
class PyramidRest {
    PyramidRest(PyramidService pyramidService) { this.pyramidService = pyramidService; }

    @PostMapping
    PyramidDto save(@Valid @RequestBody PyramidDto pyramid) {
        Pyramid result = pyramid.toEntity();
        pyramidService.save(result);
        return new PyramidDto(result);
    }

    @GetMapping
    List<PyramidDto> pyramids() { return PyramidDto.fromEntities(pyramidService.list()); }

    @GetMapping("test-count-stats")
    TestCountStats getStatistics() { return pyramidService.getCountStats(); }

    private final PyramidService pyramidService;
}