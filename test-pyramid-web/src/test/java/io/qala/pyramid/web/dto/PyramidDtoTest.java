package io.qala.pyramid.web.dto;

import io.qala.pyramid.domain.Pyramid;
import org.junit.Test;

import static io.qala.datagen.RandomShortApi.alphanumeric;
import static org.unitils.reflectionassert.ReflectionAssert.assertReflectionEquals;

public class PyramidDtoTest {
    @Test public void convertsToDtoAndBack() {
        Pyramid original = Pyramid.random().setId(alphanumeric(5));
        Pyramid converted = new PyramidDto(original).toEntity();
        assertReflectionEquals(original, converted);
    }
}