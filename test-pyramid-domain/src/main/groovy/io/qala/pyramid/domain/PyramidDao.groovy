package io.qala.pyramid.domain

import org.hibernate.Session
import org.hibernate.SessionFactory

class PyramidDao {
    PyramidDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory
    }
    Pyramid save(Pyramid pyramid) {
        session.save(pyramid);
        return pyramid
    }
    List<Pyramid> list() {
        return session.createQuery('from Pyramid').list()
    }
    Session getSession() {
        return sessionFactory.currentSession
    }
    PyramidDao flush() {
        session.flush()
        return this
    }
    PyramidDao clearCache() {
        session.clear()
        return this
    }
    final SessionFactory sessionFactory
}
