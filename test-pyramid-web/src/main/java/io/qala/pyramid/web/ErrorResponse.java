package io.qala.pyramid.web;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class ErrorResponse {
    private Set<ValidationError> errors = new HashSet<>();

    public ErrorResponse() { }

    ErrorResponse(BindingResult validationError) {
        for (ObjectError err : validationError.getAllErrors()) {
            DefaultMessageSourceResolvable arg = ((DefaultMessageSourceResolvable) err.getArguments()[0]);
            errors.add(new ValidationError(err.getObjectName(), arg.getCode(), err.getDefaultMessage()));
        }

    }

    public static class ValidationError {
        private String object, field, message;

        public ValidationError() { }

        ValidationError(String object, String field, String message) {
            this.object = object;
            this.field = field;
            this.message = message;
        }

        public ValidationError setObject(String object) {
            this.object = object;
            return this;
        }

        public ValidationError setField(String field) {
            this.field = field;
            return this;
        }

        public ValidationError setMessage(String message) {
            this.message = message;
            return this;
        }

        public String getObject() {
            return object;
        }

        public String getField() {
            return field;
        }

        public String getMessage() {
            return message;
        }

        @Override public String toString() {
            return "ValidationError{" +
                    "object='" + object + '\'' +
                    ", field='" + field + '\'' +
                    ", message='" + message + '\'' +
                    '}';
        }
    }

    public Set<ValidationError> getErrors() {
        return errors;
    }

    public ErrorResponse setErrors(Set<ValidationError> errors) {
        this.errors = errors;
        return this;
    }

    @Override public String toString() {
        return errors.toString();
    }
}
