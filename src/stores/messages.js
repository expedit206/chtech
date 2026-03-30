
import { defineStore } from "pinia";
import { ref, computed, onUnmounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import apiClient from "../api/index.js";
import { useAuthStore } from "./auth.js";
import { useBadgeStore } from "./badgeStore.js";

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
  
  // Polling management
  let pollingInterval = null;
  const lastFetchedConversations = ref(null);
  const CONV_CACHE_TIMEOUT = 30 * 1000; // 30 seconds

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

  // Stores
  const authStore = useAuthStore();
  const badgeStore = useBadgeStore();

  // Getters
  const groupedMessages = computed(() => {
    if (messages.value.length === 0) return [];
    
    const groups = [];
    let lastDate = "";

    // Iteration efficace
    for (let i = 0; i < messages.value.length; i++) {
      const msg = messages.value[i];
      if (!msg.created_at) continue;
      
      const msgDate = new Date(msg.created_at).toLocaleDateString();
      if (msgDate !== lastDate) {
        groups.push({ date: msgDate, messages: [msg] });
        lastDate = msgDate;
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    }

    return groups;
  });

  const unreadCount = computed(() => {
    return conversations.value.reduce(
      (total, conv) => total + (conv.unread_count || 0),
      0
    );
  });

  const storageUrl = computed(() => {
    return "http://localhost:8000/storage/";
  });

  // Actions
  const fetchConversations = async (silent = false, force = false) => {
    // Cache check for conversations
    if (!force && silent && lastFetchedConversations.value && (Date.now() - lastFetchedConversations.value < CONV_CACHE_TIMEOUT)) {
      return;
    }

    if (!silent) isLoading.value = true;
    try {
      const response = await apiClient.get('/conversations');
      conversations.value = response.data.conversations;
      lastFetchedConversations.value = Date.now();

      // Update badge count
      if (badgeStore.badgeCounts) {
        badgeStore.badgeCounts.messages = unreadCount.value;
      }
    } catch (error) {
      console.error("Erreur fetch conversations", error);
      if (!silent) toast.error("Erreur lors du chargement des conversations");
    } finally {
      if (!silent) isLoading.value = false;
    }
  };

  const messagesCache = ref({}); // { [cacheKey]: messages[] }
  const lastFetchedMessages = ref({}); // { [cacheKey]: timestamp }
  const MSG_CACHE_TIMEOUT = 2 * 60 * 1000; // 2 minutes

  const fetchMessages = async (receiverId, resetOffset = true, productId = null) => {
    const cacheKey = productId ? `${receiverId}_${productId}` : `${receiverId}_null`;

    // Si on a déjà des messages en cache et qu'on reset, on les affiche tout de suite
    if (resetOffset && messagesCache.value[cacheKey]) {
      messages.value = messagesCache.value[cacheKey];
    }

    // Éviter de recharger si c'est très récent (moins de 2 min)
    const now = Date.now();
    if (resetOffset && lastFetchedMessages.value[cacheKey] && (now - lastFetchedMessages.value[cacheKey] < MSG_CACHE_TIMEOUT)) {
      return;
    }

    if (!resetOffset) isLoading.value = true;
    else if (!messagesCache.value[cacheKey]) {
        // N'afficher le loader que si on n'a absolument rien en cache
        isLoading.value = true;
    }

    try {
      const currentOffset = resetOffset ? 0 : messages.value.length;
      const params = { offset: currentOffset };
      if (productId) params.product_id = productId;

      const response = await apiClient.get(`/chat/${receiverId}`, { params });

      const newMessages = response.data.messages;
      
      if (resetOffset) {
        messages.value = newMessages;
        messagesCache.value[cacheKey] = newMessages;
        lastFetchedMessages.value[cacheKey] = Date.now();
      } else {
        messages.value = [...newMessages, ...messages.value];
        messagesCache.value[cacheKey] = messages.value;
      }

      hasMore.value = response.data.hasMore;
      
      if (response.data.user) {
        const user = response.data.user;
        const convMatch = conversations.value.find(c => String(c.user_id) === String(user.id) && String(c.product_id || '') === String(productId || ''));
        
        selectedConversation.value = {
          user_id: user.id,
          name: convMatch && convMatch.name ? convMatch.name : user.nom,
          profile_photo: user.photo,
          product_id: productId,
          order_status: convMatch ? convMatch.order_status : null,
          ...(convMatch || {})
        };
      }

      const convIndex = conversations.value.findIndex(c => String(c.user_id) === String(receiverId) && String(c.product_id || '') === String(productId || ''));
      if (convIndex !== -1) {
        conversations.value[convIndex].unread_count = 0;
      }

    } catch (error) {
      console.error("Erreur fetch messages", error);
    } finally {
      isLoading.value = false;
    }
  };

  const sendMessage = async (content, type = "text", file = null) => {
    if (!selectedConversation.value) return;

    const receiverId = selectedConversation.value.user_id;
    const tempId = -Date.now();
    
    newMessage.value = "";
    // UI optimistic update
    const tempMessage = {
      id: tempId,
      sender_id: authStore.user?.id,
      receiver_id: receiverId,
      product_id: selectedConversation.value.product_id || null,
      content,
      type,
      is_read: false,
      created_at: new Date().toISOString(),
      isTemporary: true,
      product: product.value
    };

    messages.value.push(tempMessage);

    try {
      const formData = new FormData();
      formData.append("type", type);
      if (content) formData.append("content", content);
      if (selectedConversation.value.product_id) {
          formData.append("product_id", selectedConversation.value.product_id);
      }
      if (product.value) formData.append("product_id", product.value.id);
      
      if (file) {
        formData.append(type, file);
      }

      const response = await apiClient.post(`/chat/${receiverId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const realMessage = response.data.data;

      // Replace temporary message
      const index = messages.value.findIndex(m => m.id === tempId);
      if (index !== -1) {
        messages.value[index] = { ...realMessage, isTemporary: false };
      }

      updateConversationLastMessage(realMessage);
      if (product.value) clearProductTag();
      // newMessage.value = "";
      
      return realMessage;
    } catch (error) {
      messages.value = messages.value.filter(m => m.id !== tempId);
      toast.error("Échec de l'envoi");
      throw error;
    }
  };

  const startPolling = () => {
    if (pollingInterval) return;
    
    // Polling adaptatif : plus fréquent si la page est active
    pollingInterval = setInterval(async () => {
      if (!authStore.isAuthenticated || document.hidden) return;
      
      // Conversations moins fréquentes (via le cache check dans fetchConversations)
      await fetchConversations(true);
      
      // Messages uniquement si une conv est ouverte
      if (selectedConversation.value && !isLoading.value) {
        const receiverId = selectedConversation.value.user_id;
        try {
          const response = await apiClient.get(`/chat/${receiverId}`, {
            params: { limit: 10 }
          });
          
          const latestMessages = response.data.messages;
          const existingIds = new Set(messages.value.map(m => m.id));
          
          let added = false;
          latestMessages.forEach(msg => {
            if (!existingIds.has(msg.id)) {
              messages.value.push(msg);
              added = true;
            }
          });
          
          if (added) {
            messages.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            updateConversationLastMessage(messages.value[messages.value.length - 1]);
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }
    }, 4000);
  };

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  };

  const markAllMessagesAsRead = async (receiverId) => {
    try {
      await apiClient.put("/messages/mark-all-as-read");
      
      const convIndex = conversations.value.findIndex(c => String(c.user_id) === String(receiverId));
      if (convIndex !== -1) {
        conversations.value[convIndex].unread_count = 0;
      }
      
      if(badgeStore.decrementLocalCount) badgeStore.decrementLocalCount("messages");
    } catch (error) {
      console.error("Erreur markAllRead", error);
    }
  };

  const editMessage = async (messageId, content) => {
    try {
      const response = await apiClient.put(`/chat/message/${messageId}`, { content });
      const updatedMessage = response.data.data;

      const index = messages.value.findIndex(m => m.id === messageId);
      if (index !== -1) {
        messages.value[index] = updatedMessage;
      }
      
      updateConversationLastMessage(updatedMessage);
    } catch (error) {
      toast.error("Erreur lors de la modification");
      throw error;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await apiClient.delete(`/chat/message/${messageId}`);
      messages.value = messages.value.filter(m => m.id !== messageId);
      
      if (messages.value.length > 0) {
        updateConversationLastMessage(messages.value[messages.value.length - 1]);
      } else {
        fetchConversations(true);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      throw error;
    }
  };

  const setProductTag = (productData) => {
    product.value = productData;
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

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Audio non supporté");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      recordingState.value = { isRecording: true, isPaused: false, recordingTime: 0, audioChunks: [], mediaRecorder };
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordingState.value.audioChunks.push(e.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(recordingState.value.audioChunks, { type: "audio/webm" });
        await sendMessage(null, "audio", audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      startRecordingTimer();
    } catch (e) { toast.error("Erreur micro"); }
  };

  const stopRecording = () => {
    if (recordingState.value.mediaRecorder && recordingState.value.isRecording) {
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
    if (recordingState.value.mediaRecorder) {
      recordingState.value.mediaRecorder.stop();
      recordingState.value.isRecording = false;
      recordingState.value.isPaused = false;
      stopRecordingTimer();
    }
  };

  const startRecordingTimer = () => {
    recordingState.value.recordingTime = 0;
    recordingState.value.timer = setInterval(() => {
      if (!recordingState.value.isPaused) recordingState.value.recordingTime++;
    }, 1000);
  };

  const stopRecordingTimer = () => { if (recordingState.value.timer) clearInterval(recordingState.value.timer); };

  const updateConversationLastMessage = (message) => {
    const cid = String(message.sender_id) === String(authStore.user?.id) ? message.receiver_id : message.sender_id;
    const convIndex = conversations.value.findIndex(c => String(c.user_id) === String(cid));

    if (convIndex !== -1) {
      conversations.value[convIndex].last_message = message.type === "text" ? message.content : `[${message.type}]`;
      conversations.value[convIndex].last_message_type = message.type;
      conversations.value[convIndex].updated_at = message.updated_at;
    }
  };

  const initialize = () => {
    const storedProduct = localStorage.getItem("chatProduct");
    if (storedProduct) product.value = JSON.parse(storedProduct);
    window.addEventListener("resize", handleResize);
    startPolling();
  };

  const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
    isSidebarOpen.value = window.innerWidth >= 768;
  };

  const subscribeToChannel = () => {
    // TODO: Implement real-time with Echo if needed
    // console.log("Real-time subscription requested");
  };

  const unsubscribeFromChannel = () => {
    // TODO: Cleanup real-time
  };

  const cleanup = () => {
    stopPolling();
    unsubscribeFromChannel();
    window.removeEventListener("resize", handleResize);
  };

  return {
    conversations, messages, selectedConversation, isLoading, hasMore, isSidebarOpen, isMobile, product, typingState, recordingState, newMessage,
    groupedMessages, unreadCount, storageUrl,
    fetchConversations, fetchMessages, sendMessage, startRecording, stopRecording, toggleRecordingPause, cancelRecording,
    markAllMessagesAsRead, editMessage, deleteMessage, setProductTag, clearProductTag, toggleSidebar, selectConversation,
    initialize, cleanup, subscribeToChannel, unsubscribeFromChannel
  };
});
