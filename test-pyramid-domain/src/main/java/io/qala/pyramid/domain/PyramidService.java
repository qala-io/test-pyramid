package io.qala.pyramid.domain;

import java.util.List;

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

    private final PyramidDao pyramidDao;
}
