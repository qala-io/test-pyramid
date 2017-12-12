package io.qala.pyramid.domain;

import java.util.List;

import static io.qala.datagen.RandomShortApi.positiveDouble;

public class PyramidService {
    PyramidService(PyramidDao pyramidDao) {
        this.pyramidDao = pyramidDao;
    }

    public void save(Pyramid pyramid) {
        pyramidDao.save(pyramid);
    }
    public List<Pyramid> list() {
        return pyramidDao.list();
    }
    public TestCountStats getCountStats() {//Rich Model demo
        return new TestCountStats(pyramidDao.list());
    }
//    public TestCountStats getCountStats2() {//Anemic Model demo
//
//    }

    private final PyramidDao pyramidDao;
}
