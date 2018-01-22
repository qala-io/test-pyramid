package io.qala.pyramid.domain;

import io.qala.pyramid.domain.utils.NotNullSized;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static io.qala.datagen.RandomValue.length;
import static org.junit.Assert.assertEquals;
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals;

@DaoTest @RunWith(SpringJUnit4ClassRunner.class)
public class PyramidDaoTest {

    @Test public void canRetrievePyramidFromDbAfterItIsSaved() {
        Pyramid pyramid = dao.save(Pyramid.random());
        dao.flush().clearCache();
        assertReflectionEquals(pyramid, dao.list().get(0));
    }

    @Test public void sqlIsTreatedAsStringToEliminateSqlInjections() {
        Pyramid pyramid = dao.save(Pyramid.random().setName("\"' drop table"));
        dao.flush().clearCache();
        assertReflectionEquals(pyramid, dao.list().get(0));
    }

    @Test public void allowsToSaveMaxValuesOfPyramidFields() {
        Pyramid pyramid = new Pyramid()
                .setName(length(getNameMaxBoundary()).alphanumeric())
                .setUnitTests(Integer.MAX_VALUE)
                .setComponentTests(Integer.MAX_VALUE)
                .setSystemTests(Integer.MAX_VALUE);
        dao.save(pyramid);
        dao.flush();
    }

    @Test public void returnsEmptyListIfThereAreNoPyramidsInDb() {
        assertEquals(0, dao.list().size());
    }

    private static int getNameMaxBoundary() {
        try {
            return Pyramid.class.getDeclaredField("name").getAnnotation(NotNullSized.class).max();
        } catch (NoSuchFieldException e) {
            throw new RuntimeException(e);
        }
    }

    @Autowired private PyramidDao dao;
}
