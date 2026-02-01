import { GoogleGenAI } from "@google/genai";
import { IncidentData, AnalysisResult } from '../types';
import { LEGAL_FRAMEWORK, SEV_PROTOCOLS } from '../constants';

// 1. Inicializamos la IA con la librería NUEVA (@google/genai)
// Usamos process.env.API_KEY porque lo definimos en vite.config.ts
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeIncident = async (data: IncidentData): Promise<AnalysisResult> => {
  const systemInstruction = `
    Eres un Abogado Experto en Derecho Educativo y Protocolos de Seguridad Escolar del Estado de Veracruz.

    # REGLA DE ORO (STRICT GROUNDING)
    Tienes PROHIBIDO usar conocimiento general externo para definir los protocolos.
    Toda recomendación, paso a paso o clasificación DEBE provenir EXCLUSIVAMENTE de los documentos provistos en la BASE DE CONOCIMIENTO a continuación.

    BASE DE CONOCIMIENTO (DOCUMENTOS VIGENTES):
    ${JSON.stringify(LEGAL_FRAMEWORK)}
    ${JSON.stringify(SEV_PROTOCOLS)}

    PROCESO MENTAL OBLIGATORIO:
    1. Buscar palabras clave en los documentos de la BASE DE CONOCIMIENTO.
    2. Encontrar la sección exacta (ej. "Protocolo de Acoso Escolar", "Ley 303 Art. 12").
    3. Extraer los pasos literalmente de las descripciones provistas.
    
    Si la información no está en los documentos, omite el paso en lugar de inventar una solución genérica.

    # GENERACIÓN DE MEDIDAS Y ACUERDOS
    - "disciplinaryMeasures": Debes sugerir medidas formativas (sanciones) basadas en la proporcionalidad (Ley 303 y Marcos de Convivencia). Ej: "Suspensión de actividades extraescolares", "Servicio comunitario escolar", "Exhorto verbal". Si es delito, la medida es "Suspensión precautoria mientras investiga la autoridad".
    - "finalAgreements": Redacta compromisos específicos para el Acta en primera persona del plural o singular según corresponda al padre/tutor/alumno. Ej: "Me comprometo a vigilar la asistencia...", "Me comprometo a asistir a terapia psicológica...".

    # REQUISITO DE CITAS
    En cada paso del "actionPlan" (Guía de Actuación), DEBES poner entre paréntesis la fuente exacta.
    Ejemplo: "Notificar al Supervisor Escolar (Ref: Protocolo SEV, Apartado Acoso)".
    Si no puedes citar la fuente basándote estrictamente en el texto provisto, NO incluyas el paso.

    FORMATO JSON ESPERADO:
    {
      "classification": string,
      "riskLevel": "Bajo" | "Medio" | "Alto",
      "actionPlan": [{ "role": string, "actions": string[] }],
      "legalBasis": [{ "document": string, "article": string, "description": string }],
      "requiredDocuments": string[],
      "consideredDocuments": string[],
      "canalizationBody": string | null,
      "disciplinaryMeasures": string[],
      "finalAgreements": string[]
    }
  `;

  const userPrompt = `
    INCIDENTE A ANALIZAR BAJO PROTOCOLO ESTRICTO:
    - Reporta: ${data.reporter}
    - Lugar: ${data.location}
    - Fecha: ${data.date} ${data.time}
    - Involucrados: ${data.involvedPersons}
    - Descripción de Hechos: ${data.description}
  `;

  try {
    // 2. Llamada con la sintaxis NUEVA (ai.models.generateContent)
    // Usamos gemini-2.5-flash-preview o gemini-1.5-flash-latest según disponibilidad,
    // pero para compatibilidad con las instrucciones usamos gemini-2.5-flash-preview
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2 // Reduced temperature for stricter adherence to context
      }
    });

    let text = response.text;
    if (!text) throw new Error("La IA no devolvió contenido.");

    // Sanitize markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text) as AnalysisResult;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw new Error(error.message || "Falló la conexión con el servicio de Inteligencia Artificial.");
  }
};