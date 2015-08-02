import org.springframework.web.servlet.view.InternalResourceViewResolver

beans {
    xmlns(context: 'http://www.springframework.org/schema/context')
    xmlns(mvc: 'http://www.springframework.org/schema/mvc')

    context.'component-scan'('base-package': 'io.qala.pyramid.web')

    mvc.'view-controller'(path: '/', 'view-name': 'index')
    mvc.resources(mapping: '/static/**', location: 'static/')

    viewResolver(InternalResourceViewResolver, prefix: '/WEB-INF/jsp/', suffix: '.html.jsp')
}