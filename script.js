// --- DATA & CONFIG ---
const questions = [
    // Pregunta 1: Orientada a las 7 carreras principales
    {
        category: 'Brújula de Intereses',
        text: 'Si pudieras elegir un gran proyecto para liderar, ¿cuál te emocionaría más?',
        answers: [
            { text: 'Armar el plan para que un producto nuevo la rompa en el mercado.', scores: { 0: 5 } }, // Administración
            { text: 'Descifrar el mercado para hacer una inversión ganadora.', scores: { 1: 5 } }, // Finanzas
            { text: 'Cerrar un trato clave con gente de otra cultura.', scores: { 2: 5 } }, // Negocios Int.
            { text: 'Darle vida al primer modelo de un gadget increíble.', scores: { 3: 5 } }, // Diseño
            { text: 'Crear una campaña para redes que se vuelva viral.', scores: { 4: 5 } }, // Marketing
            { text: 'Hacer que una fábrica funcione más rápido y sin errores.', scores: { 5: 5 } }, // Ing. Industrial
            { text: 'Crear una app desde cero que le solucione la vida a la gente.', scores: { 6: 5 } }  // Ing. Software
        ]
    },
    // Pregunta 2: Intereses (RIASEC) - Mejorada y ampliada
    {
        category: 'Brújula de Intereses',
        text: 'En tu tiempo libre, ¿qué te suena más divertido?',
        answers: [
            { text: 'Crear un filtro de Instagram o un sticker pack para WhatsApp.', scores: { 3: 4, 4: 3 } }, // Diseño, Marketing
            { text: 'Planear la logística de un viaje para que todo salga perfecto.', scores: { 5: 4, 8: 3, 0: 3 } }, // Ing. Industrial, Prod. Industrial, Admin
            { text: 'Aprender a automatizar tareas en tu compu con un script.', scores: { 6: 4, 5: 3 } }, // Ing. Software, Ing. Industrial
            { text: 'Mediar en un conflicto entre amigos para que todos queden bien.', scores: { 9: 5, 2: 3 } }, // Talento Humano, Negocios Int.
            { text: "Vender productos online y encontrar la forma de atraer más clientes.", scores: { 7: 5, 4: 3 } } // Gestión Comercial, Marketing
        ]
    },
    // Pregunta 3: Intereses (RIASEC) - Mejorada y ampliada
    {
        category: 'Brújula de Intereses',
        text: 'Cuando tienes un reto en frente, ¿qué prefieres?',
        answers: [
            { text: 'Entender el problema a fondo, desarmándolo pieza por pieza.', scores: { 3: 3, 5: 3, 6: 4, 8: 3 } }, // Diseño, Industrial, Software, Prod. Industrial
            { text: 'Organizar al equipo, repartir tareas y motivar a todos para ganar.', scores: { 0: 4, 2: 3, 9: 3 } }, // Admin, Negocios Int., Talento Humano
            { text: 'Buscar la forma más directa y práctica de vender la solución.', scores: { 7: 4, 4: 3 } }, // Gestión Comercial, Marketing
            { text: 'Analizar los datos y las cifras para encontrar la respuesta más lógica.', scores: { 1: 4, 5: 3 } } // Finanzas, Industrial
        ]
    },
    // Personalidad (OCEAN)
    { category: 'Blueprint de Personalidad', text: 'Soy de los que hacen listas para todo y se aseguran de cumplir.', type: 'scale', scores: { 0: 2, 1: 3, 5: 3, 6: 2, 8: 3 } }, // Admin, Finanzas, I. Ind, Software, Prod. Ind.
    { category: 'Blueprint de Personalidad', text: 'Me recargo de energía estando con mucha gente en un evento.', type: 'scale', scores: { 0: 2, 2: 2, 4: 3, 7: 3, 9: 2 } }, // Admin, Negocios, Marketing, G. Comercial, T. Humano
    { category: 'Blueprint de Personalidad', text: 'Me encanta hablar de ideas locas y conceptos abstractos.', type: 'scale', scores: { 2: 2, 3: 3, 4: 1, 6: 3 } }, // Negocios, Diseño, Marketing, Software
    { category: 'Blueprint de Personalidad', text: 'Me aseguro de que nadie en el grupo se sienta por fuera.', type: 'scale', scores: { 0: 1, 2: 3, 9: 4 } }, // Admin, Negocios, T. Humano
    { category: 'Blueprint de Personalidad', text: 'Aunque todo sea un caos, me mantengo tranquilo y enfocado.', type: 'scale', scores: { 1: 2, 5: 1, 8: 2 } }, // Finanzas, I. Ind., Prod. Ind.
    // Habilidades
    {
        category: 'Inventario de Habilidades',
        text: '¿Qué tan pro te sientes para presentar una idea y convencer a otros?',
        answers: [
            { text: 'Uff, me cuesta un montón.', value: 1, scores: { 0: 1, 2: 1, 4: 1, 7:1 } },
            { text: 'Me defiendo si conozco el tema, pero me da nervios.', value: 2, scores: { 0: 2, 2: 2, 4: 2, 7:2 } },
            { text: '¡Bien! Me siento seguro presentando mis ideas.', value: 3, scores: { 0: 3, 2: 2, 4: 3, 7:3 } },
            { text: 'La rompo. Puedo convencer a cualquiera.', value: 4, scores: { 0: 4, 2: 3, 4: 4, 7:4 } }
        ]
    },
    {
        category: 'Inventario de Habilidades',
        text: 'Viendo un gráfico con datos, ¿qué tan fácil es para ti entender la historia?',
        answers: [
            { text: 'Los gráficos y yo no somos amigos.', value: 1, scores: { 1: 1, 5: 1 } },
            { text: 'Entiendo lo básico, pero me pierdo si es muy complejo.', value: 2, scores: { 1: 2, 5: 2 } },
            { text: 'Generalmente le agarro el hilo sin problema.', value: 3, scores: { 1: 3, 5: 3 } },
            { text: 'Veo la historia completa que cuentan los datos.', value: 4, scores: { 1: 4, 5: 4 } }
        ]
    },
    {
        category: 'Inventario de Habilidades',
        text: '¿Qué tan fácil es para ti que se te ocurran ideas visuales cool?',
        answers: [
            { text: 'Cero fácil, no es lo mío.', value: 1, scores: { 3: 1, 4: 1 } },
            { text: 'A veces, pero necesito ver referencias para inspirarme.', value: 2, scores: { 3: 2, 4: 2 } },
            { text: 'Se me da bien, fluyen con facilidad.', value: 3, scores: { 3: 3, 4: 3 } },
            { text: '¡Todo el tiempo! Siempre estoy imaginando cosas nuevas.', value: 4, scores: { 3: 4, 4: 4 } }
        ]
    },
    {
        category: 'Inventario de Habilidades',
        text: '¿Qué tan fácil es para ti entender cómo funciona un programa o una app por dentro?',
        answers: [
            { text: 'Súper difícil, es como si me hablaran en otro idioma.', value: 1, scores: { 5: 1, 6: 1, 8:1 } },
            { text: 'Entiendo la lógica de cosas simples, pero me enredo con lo complejo.', value: 2, scores: { 5: 2, 6: 2, 8:2 } },
            { text: 'Le encuentro la lógica a la mayoría de los programas.', value: 3, scores: { 5: 3, 6: 3, 8:3 } },
            { text: 'Me es fácil "ver" cómo está construido un software complejo.', value: 4, scores: { 5: 4, 6: 4, 8:4 } }
        ]
    },
    // Motivaciones
    { category: 'Motor de Motivación', text: 'A futuro, ¿qué pesa más para ti?', answers: [
        { text: 'Tener un camino claro para subir de nivel y ganar más plata.', scores: { 0: 2, 1: 2, 7: 3 } },
        { text: 'Tener la libertad de hacer las cosas a mi manera.', scores: { 3: 3, 4: 2 } }
    ]},
     { category: 'Motor de Motivación', text: 'A futuro, ¿qué pesa más para ti?', answers: [
        { text: 'Que la gente reconozca cuando hago un buen trabajo.', scores: { 0: 2, 4: 2, 9: 2 } },
        { text: 'Sentir que mi trabajo de verdad ayuda a otros.', scores: { 2: 3, 9: 3 } }
    ]},
     { category: 'Motor de Motivación', text: 'A futuro, ¿qué pesa más para ti?', answers: [
        { text: 'Tener un trabajo fijo y estable.', scores: { 1: 3, 8: 3 } },
        { text: 'Enfrentar retos que me obliguen a ser cada vez mejor.', scores: { 3: 2, 5: 3, 6: 3 } }
    ]}
];

const archetypes = [
    { id: 0, name: "El Líder Estratégico", program: "Administración de Empresas", narrative: `<p>Posees una visión global y la capacidad de organizar recursos para alcanzar metas ambiciosas. Te destacas en el liderazgo y la planificación.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque un líder se forma en la acción. Aplicarás estrategias de gestión en empresas reales, desarrollando criterio y experiencia directiva antes de graduarte.</p>`, profile: ['Emprendedor (E)', 'Liderazgo', 'Responsabilidad (C)', 'Extraversión (E)', 'Logro', 'Social (S)'] },
    { id: 1, name: "El Analista de Riesgos Globales", program: "Finanzas y Comercio Exterior", narrative: `<p>Tu perfil combina un agudo pensamiento analítico con una meticulosa atención al detalle. Te sientes cómodo con los números y los sistemas complejos.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque los mercados financieros no se aprenden solo en libros. Gestionarás datos reales, analizarás riesgos en entornos empresariales y entenderás el comercio internacional desde adentro.</p>`, profile: ['Convencional (C)', 'Analítica', 'Responsabilidad (C)', 'Estabilidad (N-)', 'Seguridad', 'Investigador (I)'] },
    { id: 2, name: "El Conector Multicultural", program: "Negocios Internacionales", narrative: `<p>Tienes una mentalidad abierta, gran habilidad para la comunicación y un interés genuino por otras culturas. Eres un constructor de puentes por naturaleza.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque los negocios globales requieren experiencia práctica intercultural. Participarás en proyectos de expansión y logística internacional, desarrollando una red de contactos valiosa.</p>`, profile: ['Emprendedor (E)', 'Comunicación', 'Apertura (O)', 'Amabilidad (A)', 'Propósito', 'Social (S)'] },
    { id: 3, name: "El Innovador Centrado en el Usuario", program: "Diseño de Producto", narrative: `<p>Tu mente fusiona creatividad con funcionalidad. Disfrutas imaginando nuevas soluciones y tienes una gran empatía para entender las necesidades de los demás.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque las grandes ideas deben materializarse. Trabajarás en equipos de innovación, desde la conceptualización hasta el prototipado de productos reales para empresas co-formadoras.</p>`, profile: ['Artístico (A)', 'Creatividad', 'Apertura (O)', 'Realista (R)', 'Autonomía', 'Desafío'] },
    { id: 4, name: "El Estratega de Crecimiento Digital", program: "Marketing", narrative: `<p>Eres una mezcla de creativo y analista. Te apasiona comunicar ideas de forma persuasiva y entiendes el poder de los datos para conectar con audiencias.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque el marketing de hoy es pura práctica. Gestionarás campañas reales, analizarás métricas de redes sociales y desarrollarás estrategias de contenido para empresas líderes.</p>`, profile: ['Emprendedor (E)', 'Persuasión', 'Extraversión (E)', 'Apertura (O)', 'Impacto', 'Artístico (A)'] },
    { id: 5, name: "El Optimizador de Sistemas", program: "Ingeniería Industrial", narrative: `<p>Tienes un talento natural para ver cómo funcionan los sistemas y encontrar maneras de hacerlos más eficientes. La lógica de procesos es tu fuerte.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque la optimización se aprende en la planta, no en el papel. Analizarás cadenas de suministro, mejorarás procesos productivos y aplicarás metodologías de calidad en entornos industriales reales.</p>`, profile: ['Realista (R)', 'Lógica', 'Responsabilidad (C)', 'Investigador (I)', 'Eficiencia', 'Estabilidad (N-)'] },
    { id: 6, name: "El Arquitecto de Soluciones Digitales", program: "Ingeniería de Software", narrative: `<p>Tu mente está estructurada para resolver problemas complejos con lógica y abstracción. Disfrutas construyendo soluciones digitales desde cero.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque el software de calidad se construye en equipo y con metodologías ágiles. Formarás parte de equipos de desarrollo, construyendo y probando aplicaciones reales para nuestras empresas aliadas.</p>`, profile: ['Investigador (I)', 'Abstracción', 'Responsabilidad (C)', 'Apertura (O)', 'Desafío', 'Realista (R)'] },
    { id: 7, name: "El Impulsor de Ventas", program: "Tecnología en Gestión Comercial", narrative: `<p>Eres pura acción y persuasión. Te mueves con agilidad en entornos sociales, disfrutas negociando y tienes un olfato natural para las oportunidades de negocio.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque las ventas se aprenden en la cancha. Estarás en contacto directo con clientes, aplicando técnicas comerciales en empresas reales y viendo resultados tangibles.</p>`, profile: ['Emprendedor (E)', 'Persuasión', 'Extraversión (E)', 'Logro', 'Social (S)', 'Impacto'] },
    { id: 8, name: "El Maestro de la Eficiencia", program: "Tecnología en Producción Industrial", narrative: `<p>Tienes un enfoque práctico y metódico. Te gusta entender cómo funcionan las cosas para mejorarlas y disfrutas viendo cómo un plan se convierte en un resultado concreto y eficiente.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque la producción es 100% práctica. Supervisarás procesos en planta, aplicarás controles de calidad y resolverás problemas reales de la línea de producción.</p>`, profile: ['Realista (R)', 'Lógica', 'Responsabilidad (C)', 'Estabilidad (N-)', 'Seguridad', 'Convencional (C)'] },
    { id: 9, name: "El Desarrollador de Potencial", program: "Tecnología en Gestión del Talento Humano", narrative: `<p>Tienes una habilidad especial para conectar con las personas, entender sus motivaciones y ayudarles a crecer. Te apasiona construir equipos sólidos y un buen ambiente de trabajo.</p><p><strong>¿Por qué el Modelo Dual?</strong> Porque el talento humano se gestiona con personas, no con teorías. Participarás en procesos de selección, bienestar y capacitación en empresas, impactando directamente en la cultura organizacional.</p>`, profile: ['Social (S)', 'Amabilidad (A)', 'Comunicación', 'Propósito', 'Emprendedor (E)', 'Extraversión (E)'] }
];

// --- STATE ---
let currentQuestionIndex = 0;
let userName = "";
let userEmail = "";
let userPhone = "";
let scores = Array(archetypes.length).fill(0);
let resultsChart;
let userAnswers = []; // Para almacenar todas las respuestas del usuario
let resultArchetype = null; // Para almacenar el resultado final
let compatibility = 0; // Para almacenar la compatibilidad

// --- DOM ELEMENTS ---
const screens = {
    onboarding: document.getElementById('screen-onboarding'),
    evaluation: document.getElementById('screen-evaluation'),
    loading: document.getElementById('screen-loading'),
    results: document.getElementById('screen-results'),
    form: document.getElementById('screen-form'),
    thankyou: document.getElementById('screen-thankyou')
};
const startBtn = document.getElementById('start-btn');
const nameInput = document.getElementById('user-name');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const questionCategory = document.getElementById('question-category');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const ctaBtn = document.getElementById('cta-btn');
const submitBtn = document.getElementById('submit-btn');

// --- FUNCTIONS ---
function switchScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active', 'fade-in');
}

function startEvaluation() {
    userName = nameInput.value || "crack";
    if (userName.trim() === "") {
        nameInput.classList.add('border-red-500');
        return;
    }
    nameInput.classList.remove('border-red-500');
    
    // Resetear el estado para una nueva evaluación
    resetEvaluationState();
    
    switchScreen('evaluation');
    renderQuestion();
}

// Función para resetear el estado de la evaluación
function resetEvaluationState() {
    currentQuestionIndex = 0;
    userEmail = "";
    userPhone = "";
    scores = Array(archetypes.length).fill(0);
    userAnswers = [];
    resultArchetype = null;
    compatibility = 0;
    dataAlreadySent = false;
    
    // Resetear el botón de envío
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Contactarme';
    }
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    
    progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    questionCategory.textContent = question.category;
    questionText.textContent = question.text;
    answersContainer.innerHTML = '';

    if (question.type === 'scale') {
        const scale = [
            { text: 'No me describe', value: 1 },
            { text: 'A veces', value: 2 },
            { text: 'Me describe', value: 3 }
        ];
                scale.forEach(item => {
                    const button = document.createElement('button');
                    button.className = 'answer-btn w-full text-left p-4 bg-slate-100 rounded-lg hover:bg-blue-100 border-2 border-transparent hover:border-blue-500';
                    button.textContent = item.text;
                    button.onclick = () => handleAnswer(question.scores, item.value, item.text);
                    answersContainer.appendChild(button);
                });
    } else {
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.className = 'answer-btn w-full text-left p-4 bg-slate-100 rounded-lg hover:bg-blue-100 border-2 border-transparent hover:border-blue-500';
            button.textContent = answer.text;
            button.onclick = () => handleAnswer(answer.scores, answer.value, answer.text);
            answersContainer.appendChild(button);
        });
    }
}

function handleAnswer(answerScores, scaleValue = 1, answerText = '') {
    // If scaleValue is not provided (for non-scale questions), default to 1
    const multiplier = scaleValue || 1;
    
    // Guardar la respuesta del usuario
    const question = questions[currentQuestionIndex];
    userAnswers.push({
        preguntaId: currentQuestionIndex,
        categoria: question.category,
        pregunta: question.text,
        respuesta: answerText,
        puntuacion: multiplier
    });
    
    for (const archetypeId in answerScores) {
        scores[archetypeId] += answerScores[archetypeId] * multiplier;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    switchScreen('loading');
    setTimeout(() => {
        const maxScore = Math.max(...scores);
        const resultIndex = scores.indexOf(maxScore);
        resultArchetype = archetypes[resultIndex]; // Asignar a variable global
        
        document.getElementById('result-name').textContent = userName;
        document.getElementById('archetype-title').textContent = resultArchetype.name;
        document.getElementById('program-title').textContent = resultArchetype.program;
        
        const totalPossibleScore = 80; // Heuristic max score
        compatibility = Math.min(98, Math.round((maxScore / totalPossibleScore) * 100) + 20); // Asignar a variable global
        document.getElementById('program-compatibility').textContent = `${compatibility}% de Compatibilidad`;
        
        document.getElementById('narrative-container').innerHTML = resultArchetype.narrative.replace('[Nombre]', userName);

        renderResultsChart(resultArchetype);
        switchScreen('results');
        
        // Debug: verificar que los datos estén listos
        console.log('🎯 Resultado calculado:', {
            resultArchetype,
            compatibility,
            userName,
            userEmail,
            userPhone,
            userAnswers: userAnswers.length,
            scores: scores
        });
        
        // NO guardar aquí, se guardará cuando el usuario complete el formulario
    }, 2500);
}

// Variable para controlar que solo se envíe una vez
let dataAlreadySent = false;

// Función para guardar los datos en el backend
async function saveStudentData() {
    try {
        console.log('🚀 Iniciando saveStudentData...');
        console.log('📊 Estado actual:', {
            dataAlreadySent,
            userName,
            resultArchetype: resultArchetype ? resultArchetype.name : 'undefined',
            userEmail,
            userPhone,
            userAnswers: userAnswers.length,
            scores: scores
        });

        // Verificar que no se haya enviado ya
        if (dataAlreadySent) {
            console.log('⚠️ Los datos ya fueron enviados anteriormente');
            return;
        }

        // Solo guardar si tenemos los datos mínimos necesarios
        if (!userName || !resultArchetype) {
            console.log('⏳ Esperando datos completos...', {
                userName: !!userName,
                resultArchetype: !!resultArchetype
            });
            return;
        }

        // Validar que tengamos email y teléfono
        if (!userEmail || !userPhone) {
            console.log('⏳ Esperando email y teléfono...', {
                userEmail: !!userEmail,
                userPhone: !!userPhone
            });
            return;
        }

        const studentData = {
            nombre: userName,
            email: userEmail,
            telefono: userPhone,
            respuestas: userAnswers,
            puntuaciones: scores.map((score, index) => ({
                archetypeId: index,
                puntuacion: score
            })),
            resultado: {
                archetypeId: resultArchetype.id,
                nombreArchetype: resultArchetype.name,
                programa: resultArchetype.program,
                compatibilidad: compatibility
            }
        };

        console.log('📤 Enviando datos:', studentData);

        const response = await fetch('/api/estudiantes/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        });

        console.log('📡 Respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        const result = await response.json();
        console.log('📄 Resultado completo:', result);
        
        if (result.success) {
            console.log('✅ Datos guardados exitosamente:', result.data);
            dataAlreadySent = true; // Marcar como enviado
        } else {
            console.error('❌ Error guardando datos:', result.message);
            throw new Error(result.message || 'Error desconocido del servidor');
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
}

function renderResultsChart(archetype) {
    const ctx = document.getElementById('results-chart').getContext('2d');
    
    // Normalize scores relative to the max possible score for each trait for a more accurate visual
    const normalizedScores = archetype.profile.map((trait, index) => {
        // This is a simplified normalization. A real implementation would have max scores per trait.
        return (scores[archetype.id] / (Math.max(...scores) || 1)) * (Math.random() * 2 + 8); 
    });

    if (resultsChart) {
        resultsChart.destroy();
    }

    resultsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: archetype.profile,
            datasets: [{
                label: 'Tu Perfil',
                data: normalizedScores, 
                backgroundColor: 'rgba(37, 99, 235, 0.2)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    pointLabels: { font: { size: 12 }, color: '#475569' },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: { display: false }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}


// --- EVENT LISTENERS ---
startBtn.addEventListener('click', startEvaluation);
nameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') startEvaluation();
});
ctaBtn.addEventListener('click', () => switchScreen('form'));
        submitBtn.addEventListener('click', async () => {
            console.log('🖱️ Botón de envío presionado');
            
            // Capturar email y teléfono del formulario
            const emailInput = document.getElementById('user-email');
            const phoneInput = document.getElementById('user-phone');
            
            console.log('📧 Campos encontrados:', {
                emailInput: !!emailInput,
                phoneInput: !!phoneInput
            });
            
            userEmail = emailInput.value.trim();
            userPhone = phoneInput.value.trim();
            
            console.log('📝 Datos capturados:', {
                userEmail,
                userPhone,
                userName,
                resultArchetype: resultArchetype ? resultArchetype.name : 'undefined'
            });
            
            if (!userEmail || !userPhone) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            // Validar formato de email básico
            if (!userEmail.includes('@') || !userEmail.includes('.')) {
                alert('Por favor ingresa un email válido');
                return;
            }
            
            // Deshabilitar el botón para evitar doble envío
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            try {
                console.log('🔄 Iniciando proceso de guardado...');
                
                // Guardar datos completos en el backend
                await saveStudentData();
                
                console.log('✅ Guardado exitoso, cambiando a pantalla de agradecimiento');
                switchScreen('loading');
                setTimeout(() => switchScreen('thankyou'), 1500);
            } catch (error) {
                console.error('❌ Error en el proceso:', error);
                alert('Hubo un error al enviar los datos. Por favor intenta de nuevo.');
                
                // Rehabilitar el botón
                submitBtn.disabled = false;
                submitBtn.textContent = 'Contactarme';
            }
        });
