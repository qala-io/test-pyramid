package io.qala.pyramid.componenttests

import org.springframework.beans.factory.FactoryBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

class MockMvcFactoryBean implements FactoryBean<MockMvc> {
    @Autowired WebApplicationContext applicationContext

    @Override
    MockMvc getObject() throws Exception {
        return MockMvcBuilders.webAppContextSetup(applicationContext).build()
    }

    @Override
    Class<?> getObjectType() {
        return MockMvc
    }

    @Override
    boolean isSingleton() {
        return true
    }
}
