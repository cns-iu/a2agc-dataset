import { ProjectSerializer, DefaultGraphicSymbol, DefaultRawData } from '@dvl-fw/core';
import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';

async function read(inData: string, baseRef: string, externalizeData = false) {
    try {
        const fileContents = readFileSync(inData, 'utf8');
        const fileName = basename(inData);
        const project = await ProjectSerializer.createProject('csv', fileContents, fileName);

        // adds a `GraphicSymbol`in the `Project` object with all the graphic-variable mappings.
        project.graphicSymbols.push(
            new DefaultGraphicSymbol({
                id: 'opioidDeaths',
                type: 'area',
                recordStream: 'csvData1',
                graphicVariables: {
                    identifier: {
                        recordSet: 'csvData1',
                        dataVariable: 'CASE_NUMBER',
                        graphicVariableType: 'identifier',
                        graphicVariableId: 'identifier'
                    },
                    latitude: {
                        recordSet: 'csvData1',
                        dataVariable: 'latitude',
                        graphicVariableType: 'latitude',
                        graphicVariableId: 'latitude'
                    },
                    longitude: {
                        recordSet: 'csvData1',
                        dataVariable: 'longitude',
                        graphicVariableType: 'longitude',
                        graphicVariableId: 'longitude'
                    },
                    tooltip: {
                        recordSet: 'csvData1',
                        dataVariable: 'N_OPIOID_PRESCRIPTIONS',
                        graphicVariableType: 'tooltip',
                        graphicVariableId: 'tooltip'
                    },
                    areaSize: {
                        recordSet: 'csvData1',
                        dataVariable: 'N_OPIOID_PRESCRIPTIONS',
                        graphicVariableType: 'areaSize',
                        graphicVariableId: 'areaSize'
                    },
                    color: {
                        recordSet: 'csvData1',
                        dataVariable: 'SEX',
                        graphicVariableType: 'color',
                        graphicVariableId: 'color'
                    },
                    shape: {
                        recordSet: 'csvData1',
                        dataVariable: 'HOME_STATE',
                        graphicVariableType: 'shape',
                        graphicVariableId: 'shape'
                    },
                    transparency: {
                        recordSet: 'csvData1',
                        dataVariable: 'Fixed',
                        graphicVariableType: 'transparency',
                        graphicVariableId: 'transparency'
                    },
                    strokeColor: {
                        recordSet: 'csvData1',
                        dataVariable: 'HOME_STATE',
                        graphicVariableType: 'color',
                        graphicVariableId: 'color'
                    },
                    strokeWidth: {
                        recordSet: 'csvData1',
                        dataVariable: 'Fixed',
                        graphicVariableType: 'strokeWidth',
                        graphicVariableId: 'strokeWidth'
                    },
                    strokeTransparency: {
                        recordSet: 'csvData1',
                        dataVariable: 'Fixed',
                        graphicVariableType: 'strokeTransparency',
                        graphicVariableId: 'strokeTransparency'
                    }
                }
            }, project),
        )

        /* adds a `GeomapVisualization` object as an attribute of the `Project`,
        with all the options needed to be enabled for the visualization. */
        project.visualizations.push(
            await ProjectSerializer.createVisualization('geomap', {
                id: 'GM01',
                template: 'geomap',
                properties: {
                    basemapZoomLevels: [
                        {
                            selector: ['world', 'united states', 'states'],
                            projection: 'albersUsa',
                            label: 'United States',
                            class: 'us-icon'
                        },
                        {
                            selector: ['world', 'united states', 'IN', 'counties'],
                            projection: 'albersUsa',
                            label: 'Indiana',
                            class: 'state-icon'
                        },
                        {
                            selector: [
                                ['world', 'united states', 'IN', 'Marion'],
                                ['world', 'united states', 'IN', 'Boone'],
                                ['world', 'united states', 'IN', 'Hamilton'],
                                ['world', 'united states', 'IN', 'Hancock'],
                                ['world', 'united states', 'IN', 'Shelby'],
                                ['world', 'united states', 'IN', 'Johnson'],
                                ['world', 'united states', 'IN', 'Morgan'],
                                ['world', 'united states', 'IN', 'Hendricks'],
                              ],
                              projection: 'albersUsa',
                              label: 'Marion County Area',
                              class: 'county-icon'
                        }
                    ],
                    basemapSelectedZoomLevel: 3,
                    basemapDefaultColor: 'white',
                    basemapDefaultStrokeColor: '#bebebe',
                    basemapDefaultStrokeWidth: '0.1%'
                },
                graphicSymbols: {
                    nodes: 'opioidDeaths' as any
                }
            }, project)
        )

        // Either embeds the csv content or a url to the csv content
        // embedding the data allows it to run in MaV without a complex setup,
        // but the tradeoff is a larger yml file.
        const rawDataId = 'csvData1';
        const rawData = new DefaultRawData({
            id: rawDataId, template: 'csv', 
            url: externalizeData ? baseRef + fileName : undefined,
            data: externalizeData ? undefined : fileContents
        });
        project.rawData[0] = rawData;
        project.dataSources[0].properties.rawData = rawDataId; // assigns the right rawDataId to the dataSources
 
        // makes a yaml string
        const yamlString = await ProjectSerializer.toYAML(project);
        return [yamlString, fileName.split('.').slice(0, -1).join('.')];
    } catch (e) {
        console.error(e);
        return [];
    }
}

// input arguments - 1) this script 2) path to csv 3) output directory path 4) basepath
read(process.argv[2],process.argv[4]).then((ret: string[]) => {
    writeFileSync(process.argv[3] + ret[1] + '.yml', ret[0], 'utf8'); // writes the yml file
    process.exit()
});