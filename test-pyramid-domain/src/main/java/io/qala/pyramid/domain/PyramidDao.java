package io.qala.pyramid.domain;

import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.util.List;

class PyramidDao {
    PyramidDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    Pyramid save(Pyramid pyramid) {
        getSession().save(pyramid);
        return pyramid;
    }

    List<Pyramid> list() {
        return getSession().createQuery("from Pyramid").list();
    }

    Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    PyramidDao flush() {
        getSession().flush();
        return this;
    }

    void clearCache() {
        getSession().clear();
    }
    private final SessionFactory sessionFactory;
}
