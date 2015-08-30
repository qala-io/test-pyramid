package io.qala.pyramid.domain

class PyramidDao {
    void save(Pyramid pyramid) {
        pyramids.add(pyramid);
    }
    List<Pyramid> list() {
        return pyramids;
    }
    final List<Pyramid> pyramids = []
}
