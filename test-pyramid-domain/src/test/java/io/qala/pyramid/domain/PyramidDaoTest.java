package io.qala.pyramid.domain;

import io.qala.pyramid.domain.utils.NotNullSized;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import static io.qala.datagen.RandomValue.length;
import static org.junit.Assert.assertEquals;
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals;

@DaoTest @RunWith(SpringJUnit4ClassRunner.class)
public class PyramidDaoTest {

    @Test public void canRetrievePyramidFromDbAfterItIsSaved() {
        Pyramid pyramid = sut.save(Pyramid.random());
        sut.flush().clearCache();
        assertReflectionEquals(pyramid, sut.list().get(0));
    }

    @Test public void SqlIsTreatedAsStringToEliminateSqlInjections() {
        Pyramid pyramid = sut.save(Pyramid.random().setName("\"' drop table"));
        sut.flush().clearCache();
        assertReflectionEquals(pyramid, sut.list().get(0));
    }

    @Test public void allowsToSaveMaxValuesOfPyramidFields() {
        Pyramid pyramid = new Pyramid()
                .setName(length(getNameMaxBoundary()).alphanumeric())
                .setUnitTests(Integer.MAX_VALUE)
                .setComponentTests(Integer.MAX_VALUE)
                .setSystemTests(Integer.MAX_VALUE);
        sut.save(pyramid);
        sut.flush();
    }

    @Test public void returnsEmptyListIfThereAreNoPyramidsInDb() {
        assertEquals(0, sut.list().size());
    }

    private static int getNameMaxBoundary() {
        try {
            return Pyramid.class.getDeclaredField("name").getAnnotation(NotNullSized.class).max();
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
    }

    @Autowired private PyramidDao sut;
}
