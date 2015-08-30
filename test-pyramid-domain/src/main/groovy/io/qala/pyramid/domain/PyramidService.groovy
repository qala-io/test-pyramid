package io.qala.pyramid.domain

class PyramidService {
    PyramidService(PyramidDao pyramidDao) {
        this.pyramidDao = pyramidDao
    }

    void save(Pyramid pyramid) {
        pyramidDao.save(pyramid)
    }
    List<Pyramid> list() {
        return pyramidDao.list()
    }

    final PyramidDao pyramidDao
}
