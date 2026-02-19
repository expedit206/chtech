
export default function useI18n() {
  const t = (key) => {
    const translations = {
      messages_seo_title: "Messages",
      messages_seo_description: "Vos conversations",
      messages_seo_keywords: "chat, messages, conversation",
      messages_structured_name: "Messagerie",
      messages_structured_description: "Interface de messagerie",
      select_conversation_to_start: "Sélectionnez une conversation pour commencer",
      edit: "Modifier",
      delete: "Supprimer",
    };
    return translations[key] || key;
  };
  return { t };
}
