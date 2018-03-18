package io.qala.pyramid.domain;

import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.io.Serializable;
import java.util.List;

class PyramidDao {
    PyramidDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    Pyramid save(Pyramid pyramid) {
        getSession().saveOrUpdate(pyramid);
        return pyramid;
    }

    List<Pyramid> list() {
        //noinspection unchecked
        return getSession().createQuery("from Pyramid").list();
    }
    Pyramid get(Serializable id) {
        return (Pyramid) getSession().get(Pyramid.class, id);
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
