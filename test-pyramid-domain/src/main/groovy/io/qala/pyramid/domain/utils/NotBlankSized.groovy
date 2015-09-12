package io.qala.pyramid.domain.utils

import org.hibernate.validator.constraints.NotBlank;

import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.ReportAsSingleViolation;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * Validate that the annotated string is not {@code null} or empty ignore whitespaces.
 * The annotated element size must be between the specified boundaries (included).
 *
 * We can't annotate field with both of {@link NotBlank} and {@link javax.validation.constraints.Size}
 * annotations because if both of them are violated at the same time, the order of error messages will be random - there
 * is no annotation order in hibernate validator
 *
 * @see <a href="https://hibernate.atlassian.net/browse/HV-462">HV-462</a>
 * @see NotBlankSizedValidator
 *
 * @author Mikhail Stryzhonok
 */
@Constraint(validatedBy = NotBlankSizedValidator.class)
@Target([METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER])
@Retention(RUNTIME)
@ReportAsSingleViolation
@NotBlank
@interface NotBlankSized {

    String message() default "{javax.validation.constraints.Size.message}";

    Class<?>[] groups() default [];

    Class<? extends Payload>[] payload() default [];

    /** @return size the element must be higher or equal to   */
    int min() default 0;

    /** @return size the element must be lower or equal to   */
    int max() default 0x7fffffff;
}
