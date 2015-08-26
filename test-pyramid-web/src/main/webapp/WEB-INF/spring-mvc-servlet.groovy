import org.apache.velocity.tools.generic.EscapeTool
import org.springframework.web.servlet.view.velocity.VelocityConfigurer
import org.springframework.web.servlet.view.velocity.VelocityViewResolver

beans {
    xmlns(context: 'http://www.springframework.org/schema/context')
    xmlns(mvc: 'http://www.springframework.org/schema/mvc')

    context.'component-scan'('base-package': 'io.qala.pyramid.web')

    mvc.'annotation-driven'()
    mvc.resources(mapping: '/css/**', location: 'css/')
    mvc.resources(mapping: '/js/**', location: 'js/')
    mvc.resources(mapping: '/vendor/**', location: 'vendor/')

    velocityConfigurer(VelocityConfigurer, resourceLoaderPath: '/WEB-INF/velocity/')
    viewResolver(VelocityViewResolver, contentType: 'text/html;charset=UTF-8',
            suffix: '.html.vm', attributesMap: [esc: new EscapeTool()])
}