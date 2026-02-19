
import { defineStore } from "pinia";
import { ref, computed, nextTick } from "vue"; // removed watch as not used in store init
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import apiClient from "../api/index.js"; // adjust path
import { useAuthStore } from "./auth.js"; // adjust path
import { useBadgeStore } from "./badgeStore.js"; // adjust path

export const useMessageStore = defineStore("message", () => {
  const router = useRouter();
  const toast = useToast();

  // State
  const conversations = ref([]);
  const messages = ref([]);
  const selectedConversation = ref(null);
  const isLoading = ref(false);
  const hasMore = ref(false);
  const offset = ref(0);
  const isSidebarOpen = ref(true);
  const isMobile = ref(window.innerWidth < 768);
  const product = ref(null);

  // Typing state
  const typingState = ref({
    isTyping: false,
    userId: null,
  });

  // Recording state
  const recordingState = ref({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioChunks: [],
    mediaRecorder: null,
  });

  // New message input
  const newMessage = ref("");

  // Echo channel (mocked for now unless user provides echo)
  let currentChannel = null;
  let typingTimeout = null;

  // Stores
  const authStore = useAuthStore();
  const badgeStore = useBadgeStore();

  // Getters
  const groupedMessages = computed(() => {
    const groups = [];
    let lastDate = "";

    messages.value.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toLocaleDateString();
      if (msgDate !== lastDate) {
        groups.push({ date: msgDate, messages: [msg] });
        lastDate = msgDate;
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  });

  const unreadCount = computed(() => {
    return conversations.value.reduce(
      (total, conv) => total + conv.unread_count,
      0
    );
  });

  const storageUrl = computed(() => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8000/storage/";
    }
    return "https://api.espacecameroun.com/storage/";
  });

  // Actions
  const fetchConversations = async () => {
    // Simulation de données (Mock)
    isLoading.value = true;
    try {
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));

      // Générer 15 fausses conversations
      const mockConversations = Array.from({ length: 15 }, (_, i) => {
        const userId = i + 2; // ID 2 à 16 (1 est l'utilisateur connecté)
        return {
          user_id: userId.toString(),
          name: `Utilisateur ${userId}`,
          profile_photo: `https://i.pravatar.cc/150?u=${userId}`,
          last_message: i % 2 === 0 ? "Bonjour, cet article est-il toujours disponible ?" : "D'accord, je vous remercie.",
          last_message_type: "text",
          unread_count: i < 3 ? i + 1 : 0, // Quelques non-lus
          updated_at: new Date(Date.now() - i * 1000 * 60 * 60 * 2).toISOString(), // Décalage de 2h par conversation
          is_online: i % 3 === 0,
        };
      });

      conversations.value = mockConversations;

      // Calculer le nombre total de messages non lus
      const totalUnread = conversations.value.reduce(
        (total, conv) => total + conv.unread_count,
        0
      );
      
      // Simuler l'accès au badge store
      if (badgeStore.badgeCounts) {
        badgeStore.badgeCounts.messages = totalUnread;
      }

    } catch (error) {
      console.error("Erreur mock conversations", error);
      toast.error("Erreur lors du chargement des conversations simulées");
    } finally {
        isLoading.value = false;
    }
  };

  const fetchMessages = async (receiverId, resetOffset = true) => {
    if (isLoading.value && !resetOffset) return;

    isLoading.value = true;
    try {
      if (resetOffset) {
        offset.value = 0;
        messages.value = [];
      }

      // Simuler délai réseau
      await new Promise(resolve => setTimeout(resolve, 600));

      const mockMessages = Array.from({ length: 20 }, (_, i) => {
        const isMe = i % 2 === 0;
        return {
          id: i + offset.value + 100,
          sender_id: isMe ? authStore.user?.id : Number(receiverId),
          receiver_id: isMe ? Number(receiverId) : authStore.user?.id,
          content: isMe 
            ? `Ceci est mon message ${i + 1} à l'utilisateur ${receiverId}.` 
            : `Voici une réponse simulée ${i + 1} de l'utilisateur ${receiverId}.`,
          type: i === 5 ? 'image' : 'text',
          is_read: true,
          created_at: new Date(Date.now() - (20 - i) * 1000 * 60 * 10).toISOString(),
          updated_at: new Date(Date.now() - (20 - i) * 1000 * 60 * 10).toISOString(),
          attachment_url: i === 5 ? `https://picsum.photos/300/200?random=${i}` : null,
          product: i === 0 ? { id: 101, nom: 'Produit Intéressant', photo_url: 'https://via.placeholder.com/50'} : null
        };
      });

      // Ajouter les nouveaux messages (simulation pagination inversée en fait)
      if (resetOffset) {
        messages.value = mockMessages;
      } else {
        messages.value = [...mockMessages, ...messages.value];
      }

      hasMore.value = false; // Pas de pagination infinie pour la simu simple

      // Update selected conversation
      const conversation = conversations.value.find(
        (c) => c.user_id == receiverId
      );
      if (conversation) {
        selectedConversation.value = conversation;
      } else {
         // Create a fake conversation header if not found (direct link case)
        selectedConversation.value = {
            user_id: receiverId,
            name: `Utilisateur ${receiverId}`,
            profile_photo: `https://i.pravatar.cc/150?u=${receiverId}`,
            updated_at: new Date().toISOString(),
            unread_count: 0
        };
      }

      // Marquer comme lu (simulé)
      if (conversation) conversation.unread_count = 0;
      
    } catch (error) {
      console.error("Erreur mock messages", error);
      toast.error("Erreur lors du chargement des messages simulés");
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async (
    content,
    type = "text",
    file
  ) => {
    if (!selectedConversation.value) {
      toast.error("Aucune conversation sélectionnée");
      return;
    }

    const tempId = -Date.now();
    const tempMessage = {
      id: tempId,
      sender_id: authStore.user?.id,
      receiver_id: selectedConversation.value.user_id,
      content,
      type,
      is_read: false,
      product_id: product.value?.id || null,
      audio_url: type === "audio" ? content : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isTemporary: true,
      sender: {
        ...authStore.user,
        id: authStore.user.id,
        parrain_id: authStore.user.parrain_id ? String(authStore.user.parrain_id) : undefined,
      },
      receiver: {
        id: selectedConversation.value.user_id,
        nom: selectedConversation.value.name,
        email: "",
        telephone: null,
        ville: null,
        premium: false,
        parrain_id: undefined,
      },
      product: product.value,
    };

    // Add temporary message
    messages.value.push(tempMessage);
    newMessage.value = "";

    try {
      // Simulation sans backend
      // On simule une réponse réussie après un délai
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const realMessage = {
          ...tempMessage,
           id: Math.abs(tempId) + 1000,
           created_at: new Date().toISOString(),
           updated_at: new Date().toISOString(),
           content: content, 
           attachment_url: (type === 'image' || type === 'video' || type === 'audio') && file ? URL.createObjectURL(file) : null,
           isTemporary: false,
      };


      /* 
      let response;
      if ((type === "audio" || type === "image" || type === "video") && file) {
        const formData = new FormData();
        formData.append("type", type);
        formData.append(type, file); // 'audio', 'image' or 'video' matches the type
        
        // Append optional text content if present
        if (content) {
          formData.append("content", content);
        }

        formData.append(
          "receiver_id",
          selectedConversation.value.user_id.toString()
        );

        response = await apiClient.post(
          `/chat/${selectedConversation.value.user_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await apiClient.post(
          `/chat/${selectedConversation.value.user_id}`,
          {
            type: "text",
            content,
            product_id: product.value?.id,
          }
        );
      }

      const realMessage = response.data.data;
      */

      // Replace temporary message with real one
      const tempIndex = messages.value.findIndex((m) => m.id === tempId);
      if (tempIndex !== -1) {
        messages.value[tempIndex] = {
           ...realMessage
        };
      }

      // Update conversation list
      updateConversationLastMessage(realMessage);

      // Clear product if used
      if (product.value) {
        clearProductTag();
      }

      // badgeStore.syncWithBackend()

      // --- SIMULATION AUTO-REPLY ---
      if (!realMessage.isTemporary) {
          const replyDelay = 1500;
          const typingDelay = 1000;
          
          setTimeout(() => {
              // Simulate Typing
              if(selectedConversation.value && selectedConversation.value.user_id === realMessage.receiver_id) {
                   // Only show if we are still in the same conversation
                   typingState.value = {
                       isTyping: true,
                       userId: realMessage.receiver_id
                   };
              }

              setTimeout(() => {
                  typingState.value = { isTyping: false, userId: null };
                  
                  // Generate Auto Reply
                  const replyId = Date.now();
                  const autoReply = {
                      id: replyId,
                      sender_id: realMessage.receiver_id,
                      receiver_id: realMessage.sender_id,
                      content: `Ceci est une réponse automatique de ${selectedConversation.value ? selectedConversation.value.name : 'l\'utilisateur'}.`,
                      type: 'text',
                      is_read: true, // Assuming we are looking at it
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      sender: realMessage.receiver,
                      receiver: realMessage.sender,
                      product: null
                  };

                  // Add to messages
                  messages.value.push(autoReply);
                  
                  // Update conversation
                  updateConversationLastMessage(autoReply);

              }, 2000); // Typing for 2 seconds

          }, 1000); // Start typing after 1 second
      }
      // -----------------------------

    } catch (error) {
      // Remove temporary message on error
      messages.value = messages.value.filter((m) => m.id !== tempId);
      toast.error("Erreur lors de l'envoi du message");
      throw error;
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Enregistrement audio non supporté");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      recordingState.value = {
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        audioChunks: [],
        mediaRecorder,
      };

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingState.value.audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(recordingState.value.audioChunks, {
          type: "audio/webm",
        });
        await sendMessage(URL.createObjectURL(audioBlob), "audio", audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      startRecordingTimer();
    } catch (error) {
      toast.error("Erreur d'accès au microphone");
      throw error;
    }
  };

  const stopRecording = () => {
    if (
      recordingState.value.mediaRecorder &&
      recordingState.value.isRecording
    ) {
      recordingState.value.mediaRecorder.stop();
      recordingState.value.isRecording = false;
      stopRecordingTimer();
    }
  };

  const toggleRecordingPause = () => {
    if (!recordingState.value.mediaRecorder) return;

    if (recordingState.value.isPaused) {
      recordingState.value.mediaRecorder.resume();
      recordingState.value.isPaused = false;
      startRecordingTimer();
    } else {
      recordingState.value.mediaRecorder.pause();
      recordingState.value.isPaused = true;
      stopRecordingTimer();
    }
  };

  const cancelRecording = () => {
    if (
      recordingState.value.mediaRecorder &&
      recordingState.value.isRecording
    ) {
      recordingState.value.mediaRecorder.stop();
      recordingState.value.isRecording = false;
      recordingState.value.isPaused = false;
      stopRecordingTimer();
    }
  };

  const markAllMessagesAsRead = async (receiverId) => {
    try {
      // Simulation sans backend
      // await apiClient.put("/messages/mark-all-as-read");
      
      // Mettre à jour le badge des messages via le badge store
      // await badgeStore.markAsRead("messages");

      // Mettre à jour localement les conversations
      const convIndex = conversations.value.findIndex(
        (c) => c.user_id === String(receiverId)
      );
      if (convIndex !== -1) {
        conversations.value[convIndex].unread_count = 0;
      }

      // Réinitialiser localement le compteur de messages dans le badge store
      if(badgeStore.decrementLocalCount) badgeStore.decrementLocalCount("messages");
      
    } catch (error) {
      /*
      if (error.response?.data?.message === "Unauthenticated.") {
        router.push("/login");
      }
      toast.error("Erreur lors de la mise à jour des messages lus");
      throw error;
      */
     console.error("Erreur simulation markAllRead", error);
    }
  };

  const editMessage = async (
    messageId,
    content
  ) => {
    try {
      // await apiClient.put(`/chat/message/${messageId}`, { content });

      // Update local message
      const messageIndex = messages.value.findIndex((m) => m.id === messageId);
      if (messageIndex !== -1) {
        messages.value[messageIndex].content = content;
        messages.value[messageIndex].updated_at = new Date().toISOString();
      }

      // Update conversation last message if needed
      if (
        selectedConversation.value &&
        messageIndex === messages.value.length - 1
      ) {
        updateConversationLastMessage(messages.value[messageIndex]);
      }
    } catch (error) {
      toast.error("Erreur lors de la modification du message");
      throw error;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      // await apiClient.delete(`/chat/message/${messageId}`);

      // Remove message locally
      messages.value = messages.value.filter((m) => m.id !== messageId);

      // Update conversation last message if needed
      if (selectedConversation.value && messages.value.length > 0) {
        updateConversationLastMessage(
          messages.value[messages.value.length - 1]
        );
      } else if (messages.value.length === 0 && selectedConversation.value) {
           const convIndex = conversations.value.findIndex(c => c.user_id === selectedConversation.value.user_id);
           if (convIndex !== -1) {
               conversations.value[convIndex].last_message = "";
               conversations.value[convIndex].last_message_type = "text";
           }
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du message");
      throw error;
    }
  };

  const setProductTag = (productData) => {
    product.value = productData;
    // Optionnel: Vous pouvez toujours utiliser localStorage pour persister
    // l'état entre les rechargements de page si nécessaire
    localStorage.setItem("chatProduct", JSON.stringify(productData));
  };

  const clearProductTag = () => {
    product.value = null;
    localStorage.removeItem("chatProduct");
  };

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const selectConversation = (receiverId) => {
    router.push({ name: "messages", params: { receiverId } });
    if (isMobile.value) {
      isSidebarOpen.value = false;
    }
  };

  // Private helpers
  const startRecordingTimer = () => {
    recordingState.value.recordingTime = 0;
    const timer = setInterval(() => {
      if (!recordingState.value.isPaused) {
        recordingState.value.recordingTime++;
      }
    }, 1000);

    // Store timer reference if needed
    recordingState.value.timer = timer;
  };

  const stopRecordingTimer = () => {
    if (recordingState.value.timer) {
      clearInterval(recordingState.value.timer);
    }
  };

  const updateConversationLastMessage = (message) => {
    const convIndex = conversations.value.findIndex(
      (c) =>
        c.user_id === message.sender_id || c.user_id === message.receiver_id
    );

    if (convIndex !== -1) {
      conversations.value[convIndex].last_message =
        message.type === "audio" 
          ? "Message vocal" 
          : message.type === "image" 
            ? "Photo" 
            : message.type === "video" 
              ? "Vidéo" 
              : message.content;
      conversations.value[convIndex].last_message_type = message.type;
      conversations.value[convIndex].updated_at = message.updated_at;

      // Si c'est un message reçu, mettre à jour le compteur non lu
      if (message.receiver_id === authStore.user?.id && !message.is_read) {
        conversations.value[convIndex].unread_count += 1;
      }
    }
  };

  // Echo real-time communication - ADAPTÉ pour mettre à jour les badges
  const subscribeToChannel = () => {
    if (!authStore.user?.id) return;
    // Mocking echo for now
  };

  const unsubscribeFromChannel = () => {
    // Mocking echo
  };

  const emitTyping = () => {
    // Mock typing
  };

  // Initializer modifié
  const initialize = () => {
    // Load product from localStorage (optionnel, pour persistance)
    const storedProduct = localStorage.getItem("chatProduct");
    if (storedProduct) {
      product.value = JSON.parse(storedProduct);
    }

    // Set up window resize listener
    window.addEventListener("resize", handleResize);
    
    // Synchroniser les badges au démarrage
    badgeStore.fetchBadgeCounts().catch(console.error);
  };

  const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
    // Ajuster le sidebar en fonction de la taille de l'écran
    isSidebarOpen.value = window.innerWidth >= 768;
  };

  // Cleanup
  const cleanup = () => {
    unsubscribeFromChannel();
    window.removeEventListener("resize", handleResize);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  };

  return {
    // State
    conversations,
    messages,
    selectedConversation,
    isLoading,
    hasMore,
    isSidebarOpen,
    isMobile,
    product,
    typingState,
    recordingState,
    newMessage,

    // Getters
    groupedMessages,
    unreadCount,
    storageUrl,

    // Actions
    fetchConversations,
    fetchMessages,
    sendMessage,
    startRecording,
    stopRecording,
    toggleRecordingPause,
    cancelRecording,
    markAllMessagesAsRead,
    editMessage,
    deleteMessage,
    setProductTag,
    clearProductTag,
    toggleSidebar,
    selectConversation,
    subscribeToChannel,
    unsubscribeFromChannel,
    emitTyping,
    initialize,
    cleanup,
  };
});
