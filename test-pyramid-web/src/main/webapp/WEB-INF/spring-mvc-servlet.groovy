import org.springframework.web.servlet.view.InternalResourceViewResolver

beans {
    xmlns(context: 'http://www.springframework.org/schema/context')
    xmlns(mvc: 'http://www.springframework.org/schema/mvc')

    context.'component-scan'('base-package': 'io.qala.pyramid.web')

    mvc.'view-controller'(path: '/', 'view-name': 'index')
    mvc.resources(mapping: '/css/**', location: 'css/')
    mvc.resources(mapping: '/js/**', location: 'js/')
    mvc.resources(mapping: '/vendor/**', location: 'vendor/')

    viewResolver(InternalResourceViewResolver, prefix: '/WEB-INF/jsp/', suffix: '.html.jsp')
}