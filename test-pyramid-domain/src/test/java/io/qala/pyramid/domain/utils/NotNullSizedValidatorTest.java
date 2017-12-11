package io.qala.pyramid.domain.utils;

import org.junit.Test;

import javax.validation.Payload;
import java.lang.annotation.Annotation;

import static io.qala.datagen.RandomShortApi.alphanumeric;
import static io.qala.datagen.RandomShortApi.nullOrEmpty;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class NotNullSizedValidatorTest {
    @Test public void validationPasses_ifStringIsLongerOrEqualToMinBoundary() {
        assertTrue("equals to min boundary", min(10).isValid(alphanumeric(10), null));
        assertTrue("greater than min boundary", min(10).isValid(alphanumeric(11, 100), null));
        assertTrue("whitespaces greater than min boundary", min(0).isValid("", null));
    }

    @Test public void validationFails_ifStringIsShorterThanMinBoundary() {
        assertFalse("smaller than min boundary", min(10).isValid(alphanumeric(1, 9), null));
        assertFalse("null or empty string", min(1).isValid(nullOrEmpty(), null));
    }

    @Test public void validationPasses_ifStringIsShorterOrEqualToMaxBoundary() {
        assertTrue("equals to max boundary", max(10).isValid(alphanumeric(10), null));
        assertTrue("smaller than max boundary", max(10).isValid(alphanumeric(1, 9), null));
        assertTrue("empty string", max(0).isValid("", null));
    }

    @Test public void validationFails_ifStringIsLongerThanMaxBoundary() {
        assertFalse("longer than max boundary", max(10).isValid(alphanumeric(11, 20), null));
    }

    private NotNullSizedValidator min(int min) {
        NotNullSizedValidator result = new NotNullSizedValidator();
        result.initialize(new NotNullSizedImpl(min, Integer.MAX_VALUE));
        return result;
    }

    private NotNullSizedValidator max(int max) {
        NotNullSizedValidator result = new NotNullSizedValidator();
        result.initialize(new NotNullSizedImpl(0, max));
        return result;
    }

    @SuppressWarnings({"ClassExplicitlyAnnotation", "unchecked"})
    private static class NotNullSizedImpl implements NotNullSized {
        private int min, max;

        private NotNullSizedImpl(int min, int max) {
            this.min = min;
            this.max = max;
        }
        @Override public int min() { return min; }
        @Override public int max() { return max; }

        @Override public String message() { return null; }
        @Override public Class<?>[] groups() { return new Class[0]; }
        @Override public Class<? extends Payload>[] payload() { return new Class[0]; }
        @Override public Class<? extends Annotation> annotationType() { return null; }
    }
}
