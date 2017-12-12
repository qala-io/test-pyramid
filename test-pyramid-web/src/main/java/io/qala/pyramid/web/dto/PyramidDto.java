package io.qala.pyramid.web.dto;

import io.qala.pyramid.domain.Pyramid;
import io.qala.pyramid.domain.utils.NotNullSized;

import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

public class PyramidDto {
    private String id;
    @NotNullSized(min = 1, max = 100)
    private String name;
    @Min(0L)
    private int unitTests, componentTests, systemTests;

    private PyramidDto() {}//for Jackson
    public PyramidDto(Pyramid entity) {
        this.id             = entity.getId();
        this.name           = entity.getName();
        this.unitTests      = entity.getUnitTests();
        this.componentTests = entity.getComponentTests();
        this.systemTests    = entity.getSystemTests();
    }

    public static List<PyramidDto> fromEntities(List<Pyramid> pyramids){
        List<PyramidDto> result = new ArrayList<>(pyramids.size());
        for(Pyramid p: pyramids) result.add(new PyramidDto(p));
        return result;
    }

    public Pyramid toEntity() {
        return new Pyramid()
                .setId(id).setName(name)
                .setUnitTests(unitTests).setComponentTests(componentTests).setSystemTests(systemTests);
    }

    public String getId()          { return id; }
    public String getName()        { return name; }
    public int getUnitTests()      { return unitTests; }
    public int getComponentTests() { return componentTests; }
    public int getSystemTests()    { return systemTests; }

    // these are private because they are accessed only by Jackson
    private void setId            (String id)          { this.id = id; }
    private void setName          (String name)        { this.name = name; }
    private void setUnitTests     (int unitTests)      { this.unitTests = unitTests; }
    private void setComponentTests(int componentTests) { this.componentTests = componentTests; }
    private void setSystemTests   (int systemTests)    { this.systemTests = systemTests; }
}
