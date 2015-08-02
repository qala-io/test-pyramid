package io.qala.pyramid.web

import groovy.transform.CompileStatic
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import static org.springframework.web.bind.annotation.RequestMethod.GET

@CompileStatic
@Controller
@RequestMapping("/")
class HtmlController {
    @RequestMapping(value = "/", method = GET)
    String index() {
        return 'index'
    }
}

