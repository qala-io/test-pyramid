package io.qala.pyramid.domain;

import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

import java.lang.annotation.*;

@ContextConfiguration(locations = "classpath:/io/qala/pyramid/domain/app-context-service.xml")
@Transactional(transactionManager = "transactionManager")
@Rollback

@Inherited
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface DaoTest {
}
