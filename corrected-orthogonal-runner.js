/**
 * ARREGLO ORTOGONAL L9(3⁴) CORREGIDO CON AMBOS CAMPOS OBLIGATORIOS
 * 
 * CAMPOS OBLIGATORIOS CONFIRMADOS:
 * - Etiqueta (Label): Campo de texto obligatorio
 * - Hilo de la tarea (Task Parent): SELECT obligatorio
 * 
 * Esto cambia completamente qué casos deben ser válidos vs no válidos
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

class CorrectedOrthogonalTestRunner {
    constructor() {
        this.driver = null;
        this.results = [];
    }

    // Casos rediseñados con conocimiento de AMBOS campos obligatorios
    getTestCases() {
        return [
            // CASOS NO VÁLIDOS (deben fallar por campos obligatorios)
            {
                id: 1,
                name: "TC01_NO_VÁLIDO",
                expectation: "NO VÁLIDO",
                inputs: {
                    label: "Tarea Básica",
                    task_parent: "",  // VACÍO - debe fallar (obligatorio)
                    userid: "",
                    progress: ""
                },
                description: "Label válido + Task Parent vacío → debe fallar por campo obligatorio"
            },
            {
                id: 2, 
                name: "TC02_VÁLIDO",
                expectation: "VÁLIDO",
                inputs: {
                    label: "Desarrollo Sistema ERP",
                    task_parent: "first_available", // PRESENTE - debe funcionar
                    userid: "select_superadmin",
                    progress: "50"
                },
                description: "Ambos obligatorios presentes + campos opcionales → debe funcionar"
            },
            {
                id: 3,
                name: "TC03_VÁLIDO", 
                expectation: "VÁLIDO",
                inputs: {
                    label: "Tarea Corta",
                    task_parent: "second_available", // PRESENTE - debe funcionar
                    userid: "type_superadmin", 
                    progress: "100"
                },
                description: "Ambos obligatorios presentes → debe funcionar"
            },
            {
                id: 4,
                name: "TC04_NO_VÁLIDO",
                expectation: "NO VÁLIDO", 
                inputs: {
                    label: "Tarea Media",
                    task_parent: "", // VACÍO - debe fallar (obligatorio)
                    userid: "select_superadmin",
                    progress: "100"
                },
                description: "Label válido + Task Parent vacío → debe fallar por campo obligatorio"
            },
            {
                id: 5,
                name: "TC05_VÁLIDO",
                expectation: "VÁLIDO",
                inputs: {
                    label: "Tarea con Acentós y Ñoños",
                    task_parent: "first_available", // PRESENTE - debe funcionar
                    userid: "type_superadmin",
                    progress: ""
                },
                description: "Caracteres especiales válidos + ambos obligatorios → debe funcionar"
            },
            {
                id: 6,
                name: "TC06_VÁLIDO",
                expectation: "VÁLIDO",
                inputs: {
                    label: "Implementación Media",
                    task_parent: "second_available", // PRESENTE - debe funcionar
                    userid: "",
                    progress: "50"
                },
                description: "Ambos obligatorios presentes, usuario vacío (opcional) → debe funcionar"
            },
            {
                id: 7,
                name: "TC07_NO_VÁLIDO",
                expectation: "NO VÁLIDO",
                inputs: {
                    label: "Implementación Completa del Sistema de Gestión Empresarial",
                    task_parent: "", // VACÍO - debe fallar (obligatorio)
                    userid: "type_superadmin",
                    progress: "50"
                },
                description: "Label válido + Task Parent vacío → debe fallar por campo obligatorio"
            },
            {
                id: 8,
                name: "TC08_VÁLIDO", 
                expectation: "VÁLIDO",
                inputs: {
                    label: "Sistema Final",
                    task_parent: "first_available", // PRESENTE - debe funcionar
                    userid: "",
                    progress: "100"
                },
                description: "Ambos obligatorios presentes → debe funcionar"
            },
            {
                id: 9,
                name: "TC09_NO_VÁLIDO",
                expectation: "NO VÁLIDO", 
                inputs: {
                    label: "", // VACÍO - debe fallar (obligatorio)
                    task_parent: "second_available",
                    userid: "select_superadmin", 
                    progress: ""
                },
                description: "Label vacío + Task Parent válido → debe fallar por campo obligatorio"
            }
        ];
    }

    async runCorrectedTests() {
        console.log('🔄 EJECUTANDO PRUEBAS CORREGIDAS CON AMBOS CAMPOS OBLIGATORIOS');
        console.log('===============================================================');
        console.log('Campos obligatorios: Label + Task Parent');
        console.log('Expectativa: 5 casos VÁLIDOS, 4 casos NO VÁLIDOS\n');
        
        const BaseTest = require('./tests/base-test');
        const baseTest = new BaseTest();
        
        try {
            await baseTest.setupDriver();
            await baseTest.login();
            
            const testCases = this.getTestCases();
            
            for (let testCase of testCases) {
                console.log(`\n📋 ${testCase.name}: ${testCase.description}`);
                console.log(`🎯 EXPECTATIVA: ${testCase.expectation}`);
                console.log(`📝 Label: "${testCase.inputs.label}"`);
                console.log(`📝 Task Parent: "${testCase.inputs.task_parent}"`);
                
                const result = await this.executeTestCase(baseTest, testCase);
                this.results.push(result);
                
                // Mostrar resultado inmediato
                const match = result.actualResult === testCase.expectation;
                const icon = match ? '✅' : '❌';
                console.log(`📊 RESULTADO: ${result.actualResult} ${icon}`);
                console.log(`💬 ${result.details}`);
                
                await baseTest.driver.sleep(3000);
            }
            
        } catch (error) {
            console.error('❌ Error general:', error.message);
        } finally {
            await baseTest.tearDown();
        }
        
        this.generateCorrectedReport();
    }

    async executeTestCase(baseTest, testCase) {
        try {
            await baseTest.navigateToNewTask();
            
            const beforeScreenshot = await baseTest.takeScreenshot(`${testCase.name}_before`);
            
            // Llenar formulario
            await baseTest.fillTaskForm(testCase.inputs);
            
            // Enviar formulario  
            await baseTest.submitTaskForm();
            
            const afterScreenshot = await baseTest.takeScreenshot(`${testCase.name}_after`);
            
            // Validación específica para campos obligatorios
            const validation = await this.validateWithObligatoryFields(baseTest, testCase);
            
            return {
                testCase: testCase,
                actualResult: validation.isValid ? "VÁLIDO" : "NO VÁLIDO",
                expectation: testCase.expectation,
                match: (validation.isValid ? "VÁLIDO" : "NO VÁLIDO") === testCase.expectation,
                details: validation.message,
                screenshots: { before: beforeScreenshot, after: afterScreenshot }
            };
            
        } catch (error) {
            return {
                testCase: testCase,
                actualResult: "ERROR",
                expectation: testCase.expectation, 
                match: false,
                details: `Error técnico: ${error.message}`,
                screenshots: {}
            };
        }
    }

    async validateWithObligatoryFields(baseTest, testCase) {
        try {
            await baseTest.driver.sleep(4000);
            
            const currentUrl = await baseTest.driver.getCurrentUrl();
            const pageSource = await baseTest.driver.getPageSource();
            
            // Verificar si hay mensaje específico de campo obligatorio
            const obligatoryFieldError = 
                pageSource.includes("campo") && pageSource.includes("obligatorio") ||
                pageSource.includes("required") ||
                pageSource.includes("El campo 'Hilo de la tarea' es obligatorio") ||
                pageSource.includes("El campo 'Etiqueta' es obligatorio");
            
            // Si seguimos en página de creación, probablemente falló
            const stillInCreatePage = currentUrl.includes('action=create');
            
            // Si hay error de campo obligatorio, es NO válido (como esperamos)
            if (obligatoryFieldError) {
                return { 
                    isValid: false, 
                    message: "Campo obligatorio detectado correctamente - formulario rechazado" 
                };
            }
            
            // Si seguimos en crear pero no hay error explícito, también falló
            if (stillInCreatePage) {
                return { 
                    isValid: false, 
                    message: "Formulario rechazado - permanece en página de creación" 
                };
            }
            
            // Si salimos de la página de crear, probablemente fue exitoso
            const isValid = !stillInCreatePage && !obligatoryFieldError;
            
            const message = isValid 
                ? "Tarea creada exitosamente - ambos campos obligatorios presentes"
                : "Tarea rechazada - falta campo obligatorio";
            
            return { isValid, message };
            
        } catch (error) {
            return { 
                isValid: false, 
                message: `Error en validación: ${error.message}` 
            };
        }
    }

    generateCorrectedReport() {
        console.log('\n📊 REPORTE CORREGIDO - AMBOS CAMPOS OBLIGATORIOS');
        console.log('=================================================');
        
        const total = this.results.length;
        const matches = this.results.filter(r => r.match).length;
        const validResults = this.results.filter(r => r.actualResult === 'VÁLIDO').length;
        const invalidResults = this.results.filter(r => r.actualResult === 'NO VÁLIDO').length;
        const errors = this.results.filter(r => r.actualResult === 'ERROR').length;
        
        console.log(`\n📈 ESTADÍSTICAS CORREGIDAS:`);
        console.log(`Total casos: ${total}`);
        console.log(`Expectativas cumplidas: ${matches}/${total} (${(matches/total*100).toFixed(1)}%)`);
        console.log(`Casos que resultaron VÁLIDOS: ${validResults}`);
        console.log(`Casos que resultaron NO VÁLIDOS: ${invalidResults}`);
        console.log(`Casos con ERROR: ${errors}`);
        
        console.log('\n📋 DETALLE POR CASO CORREGIDO:');
        this.results.forEach(result => {
            const icon = result.match ? '✅' : '❌';
            const obligatorios = this.analyzeObligatoryFields(result.testCase.inputs);
            console.log(`${icon} ${result.testCase.name}: ${obligatorios.analysis}`);
            console.log(`   Esperado: ${result.expectation} → Obtuvo: ${result.actualResult}`);
            console.log(`   ${result.details}\n`);
        });
        
        console.log('🎯 ANÁLISIS FINAL:');
        if (matches >= total * 0.9) {
            console.log('✅ EXCELENTE: Las expectativas con campos obligatorios se cumplieron');
        } else if (matches >= total * 0.7) {
            console.log('🟡 BUENO: La mayoría de expectativas se cumplieron');
        } else {
            console.log('🔴 REVISAR: Expectativas no cumplidas - revisar lógica de campos obligatorios');
        }
    }

    analyzeObligatoryFields(inputs) {
        const hasLabel = inputs.label && inputs.label.trim() !== "";
        const hasTaskParent = inputs.task_parent && inputs.task_parent !== "";
        
        if (hasLabel && hasTaskParent) {
            return { analysis: "Ambos obligatorios presentes → DEBE SER VÁLIDO" };
        } else if (!hasLabel && !hasTaskParent) {
            return { analysis: "Ambos obligatorios ausentes → DEBE SER NO VÁLIDO" };
        } else if (!hasLabel) {
            return { analysis: "Label vacío → DEBE SER NO VÁLIDO" };
        } else if (!hasTaskParent) {
            return { analysis: "Task Parent vacío → DEBE SER NO VÁLIDO" };
        }
    }
}

// Ejecutar pruebas corregidas
const correctedRunner = new CorrectedOrthogonalTestRunner();
correctedRunner.runCorrectedTests().catch(console.error);