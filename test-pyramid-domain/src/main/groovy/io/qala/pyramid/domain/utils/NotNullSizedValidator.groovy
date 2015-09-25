package io.qala.pyramid.domain.utils

import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext

/**
 * Validator for {@link NotNullSized} annotation
 *
 * @author Mikhail Stryzhonok
 */
public class NotNullSizedValidator implements ConstraintValidator<NotNullSized, String> {
    int min
    int max

    /** {@inheritDoc} */
    @Override
    public void initialize(NotNullSized constraintAnnotation) {
        min = constraintAnnotation.min()
        max = constraintAnnotation.max()
    }

    /**
     * Validates input string size
     *
     * @param value string with {@link NotNullSized} annotation
     * @param context validation context
     *
     * @return true if string not null and has size between the specified boundaries (included).
     *         false otherwise
     */
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.length() >= min && value.length() <= max
    }
}
