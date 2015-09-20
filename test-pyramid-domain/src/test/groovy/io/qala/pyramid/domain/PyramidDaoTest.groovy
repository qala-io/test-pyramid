package io.qala.pyramid.domain

import io.qala.pyramid.domain.utils.NotBlankSized
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner
import org.springframework.transaction.annotation.Transactional

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals

@ContextConfiguration(locations = 'classpath:/io/qala/pyramid/domain/app-context-service.groovy')
@Transactional(transactionManager = 'transactionManager')
@Rollback
@RunWith(SpringJUnit4ClassRunner)
class PyramidDaoTest {
    @Autowired PyramidDao sut

    @Test void 'must be possible to retrieve the Pyramid from DB after it was saved'() {
        Pyramid pyramid = sut.save(Pyramid.random())
        sut.flush().clearCache()
        assertReflectionEquals(pyramid, sut.list()[0])
    }
    @Test void 'must treat SQL as string to eliminate SQL Injections'() {
        Pyramid pyramid = sut.save(Pyramid.random([name: '\'" drop table']))
        sut.flush().clearCache()
        assertReflectionEquals(pyramid, sut.list()[0])
    }
    @Test void 'must allow to save max length name'() {
        int maxBoundary = Pyramid.getDeclaredField('name').getAnnotation(NotBlankSized).max()
        Pyramid pyramid = sut.save(Pyramid.random([name: randomAlphanumeric(maxBoundary)]))
        sut.flush().clearCache()
        assertReflectionEquals(pyramid, sut.list()[0])
    }
    @Test void 'must return an empty list of pyramids if there are actually none of them'() {
        assert 0 == sut.list().size()
    }
}
