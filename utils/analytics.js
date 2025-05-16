// Sistema de rastreamento de eventos para alimentar análises
// Registra eventos de uso que serão utilizados para gerar dados de análise

/**
 * Tipos de eventos que o sistema rastreia
 */
export const EventTypes = {
  // Eventos de checklist
  CHECKLIST_CREATED: 'checklist_created',
  CHECKLIST_UPDATED: 'checklist_updated',
  CHECKLIST_DELETED: 'checklist_deleted',
  CHECKLIST_SHARED: 'checklist_shared',
  CHECKLIST_VIEWED: 'checklist_viewed',
  
  // Eventos de resposta
  RESPONSE_STARTED: 'response_started',
  RESPONSE_UPDATED: 'response_updated',
  RESPONSE_COMPLETED: 'response_completed',
  RESPONSE_ABANDONED: 'response_abandoned',
  
  // Eventos de usuário
  USER_LOGIN: 'user_login',
  USER_SIGNUP: 'user_signup',
  USER_INVITED: 'user_invited',
  USER_ACTIVATED: 'user_activated',
  
  // Eventos de template
  TEMPLATE_APPLIED: 'template_applied',
  TEMPLATE_CREATED: 'template_created',
  
  // Eventos de exportação
  EXPORT_PDF: 'export_pdf',
  EXPORT_CSV: 'export_csv',
  EXPORT_EXCEL: 'export_excel',
};

/**
 * Registra um evento no sistema de análises
 * @param {string} eventType - Tipo do evento (use EventTypes)
 * @param {object} data - Dados adicionais do evento
 * @param {string} userId - ID do usuário que gerou o evento
 */
export async function trackEvent(eventType, data = {}, userId = null) {
  try {
    // Se não tivermos ID do usuário, tentamos pegar do localStorage
    if (!userId && typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      userId = user.id;
    }

    // Dados comuns para todos os eventos
    const eventData = {
      eventType,
      timestamp: new Date().toISOString(),
      userId,
      data
    };

    // Enviar para a API
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Falha ao registrar evento analítico');
    }

    return true;
  } catch (error) {
    console.error('Erro ao rastrear evento:', error);
    // Failsafe - não queremos que erros de análise afetem a UX
    return false;
  }
}

/**
 * Métodos de conveniência para rastrear eventos específicos
 */

// Checklists
export const trackChecklistCreated = (checklistId, templateId = null, userId = null) => 
  trackEvent(EventTypes.CHECKLIST_CREATED, { checklistId, templateId }, userId);

export const trackChecklistUpdated = (checklistId, userId = null) => 
  trackEvent(EventTypes.CHECKLIST_UPDATED, { checklistId }, userId);

export const trackChecklistDeleted = (checklistId, userId = null) => 
  trackEvent(EventTypes.CHECKLIST_DELETED, { checklistId }, userId);

export const trackChecklistShared = (checklistId, recipientId = null, userId = null) => 
  trackEvent(EventTypes.CHECKLIST_SHARED, { checklistId, recipientId }, userId);

export const trackChecklistViewed = (checklistId, userId = null) => 
  trackEvent(EventTypes.CHECKLIST_VIEWED, { checklistId }, userId);

// Respostas
export const trackResponseStarted = (checklistId, respondentId = null, userId = null) => 
  trackEvent(EventTypes.RESPONSE_STARTED, { checklistId, respondentId }, userId);

export const trackResponseUpdated = (checklistId, responseId, progress, userId = null) => 
  trackEvent(EventTypes.RESPONSE_UPDATED, { checklistId, responseId, progress }, userId);

export const trackResponseCompleted = (checklistId, responseId, timeSpent = null, userId = null) => 
  trackEvent(EventTypes.RESPONSE_COMPLETED, { checklistId, responseId, timeSpent }, userId);

export const trackResponseAbandoned = (checklistId, responseId, lastActiveTime = null, userId = null) => 
  trackEvent(EventTypes.RESPONSE_ABANDONED, { checklistId, responseId, lastActiveTime }, userId);

// Usuários
export const trackUserLogin = (userId) => 
  trackEvent(EventTypes.USER_LOGIN, {}, userId);

export const trackUserSignup = (userId, referralSource = null) => 
  trackEvent(EventTypes.USER_SIGNUP, { referralSource }, userId);

export const trackUserInvited = (invitedEmail, invitedRole, userId = null) => 
  trackEvent(EventTypes.USER_INVITED, { invitedEmail, invitedRole }, userId);

// Templates
export const trackTemplateApplied = (templateId, checklistId, userId = null) => 
  trackEvent(EventTypes.TEMPLATE_APPLIED, { templateId, checklistId }, userId);

export const trackTemplateCreated = (templateId, category, userId = null) => 
  trackEvent(EventTypes.TEMPLATE_CREATED, { templateId, category }, userId);

// Exports
export const trackExport = (type, entityId, format, userId = null) => 
  trackEvent(`EXPORT_${format.toUpperCase()}`, { entityId, entityType: type }, userId);
