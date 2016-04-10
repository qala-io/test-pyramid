package io.qala.pyramid.domain

import io.qala.pyramid.domain.utils.NotNullSized
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner
import org.springframework.transaction.annotation.Transactional

import static io.qala.datagen.RandomValue.length
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

    @Test
    void 'must treat SQL as string to eliminate SQL Injections'() {
        Pyramid pyramid = sut.save(Pyramid.random([name: '\'" drop table']))
        sut.flush().clearCache()
        assertReflectionEquals(pyramid, sut.list()[0])
    }

    @Test
    void 'must allow to save max values of pyramid fields'() {
        int nameMaxBoundary = Pyramid.getDeclaredField('name').getAnnotation(NotNullSized).max()
        Pyramid pyramid = sut.save(new Pyramid(
                name: length(nameMaxBoundary).alphanumeric(),
                nOfUnitTests: Integer.MAX_VALUE,
                nOfComponentTests: Integer.MAX_VALUE,
                nOfSystemTests: Integer.MAX_VALUE))
        sut.flush().clearCache()
        assertReflectionEquals(pyramid, sut.list()[0])
    }

    @Test
    void 'must return an empty list of pyramids if there are actually none of them'() {
        assert 0 == sut.list().size()
    }
}
