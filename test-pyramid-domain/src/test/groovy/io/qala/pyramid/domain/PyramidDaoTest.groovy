package io.qala.pyramid.domain

import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner
import org.springframework.transaction.annotation.Transactional

import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals

@ContextConfiguration(locations = 'classpath:/io/qala/pyramid/domain/app-context-service.groovy')
@Transactional(transactionManager = 'transactionManager')
@Rollback
@RunWith(SpringJUnit4ClassRunner)
class PyramidDaoTest {
    @Autowired PyramidDao sut

    @Test
    void 'must be possible to retrieve the Pyramid from DB after it was saved'() {
        Pyramid pyramid = sut.save(Pyramid.random())
        sut.flush().clearCache()
        assertReflectionEquals(pyramid, sut.list()[0])
    }
}
