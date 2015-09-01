package io.qala.pyramid.domain

import com.mchange.v2.c3p0.ComboPooledDataSource
import org.springframework.jdbc.datasource.LazyConnectionDataSourceProxy
import org.springframework.orm.hibernate4.HibernateTransactionManager
import org.springframework.orm.hibernate4.LocalSessionFactoryBean

beans {
    xmlns aop: 'http://www.springframework.org/schema/aop'
    xmlns tx: 'http://www.springframework.org/schema/tx'

    aop.config('proxy-target-class': true) {
        pointcut(id: 'txPointcut', expression: 'within(io.qala.pyramid.domain.*Service)')
        advisor('advice-ref': 'txAdvice', 'pointcut-ref': 'txPointcut')
    }
    tx.advice(id: 'txAdvice') {
        attributes {
            method(name: '*', isolation: 'READ_COMMITTED', 'rollback-for': 'java.lang.Exception')
        }
    }

    c3p0(ComboPooledDataSource) {
        it.destroyMethod = 'close'
        jdbcUrl = 'jdbc:hsqldb:mem:test_pyramid'
        driverClass = 'org.hsqldb.jdbcDriver'
        user = 'root'
        password = 'root'
        acquireRetryAttempts = 1
        idleConnectionTestPeriod = 3600
        checkoutTimeout = 10000
    }
    dataSource(LazyConnectionDataSourceProxy) {
        defaultTransactionIsolationName = 'TRANSACTION_READ_COMMITTED'
        defaultAutoCommit = false
        targetDataSource = ref('c3p0')
    }
    sessionFactory(LocalSessionFactoryBean) {
        dataSource = ref('dataSource')
        mappingResources = ['/io/qala/pyramid/domain/Pyramid.hbm.xml']
        hibernateProperties = ['hibernate.format_sql'      : true,
                               'hibernate.use_sql_comments': true,
                               'hibernate.dialect'         : 'org.hibernate.dialect.HSQLDialect',
                               'hibernate.hbm2ddl.auto'    : 'create-drop']
    }
    transactionManager(HibernateTransactionManager) {
        sessionFactory = ref('sessionFactory')
        validateExistingTransaction = true
    }
    pyramidDao(PyramidDao, ref('sessionFactory'))
    pyramidService(PyramidService, ref('pyramidDao'))
}