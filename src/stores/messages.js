import { CONFIG } from '../config/index.js';
import { defineStore } from "pinia";
import { ref, computed, onUnmounted, watch } from "vue";
import { useFlash } from '../composables/useFlash.js';
import { useRouter } from "vue-router";
import apiClient from "../api/index.js";
import { useAuthStore } from "./auth.js";
import { useBadgeStore } from "./badgeStore.js";

export const useMessageStore = defineStore("message", () => {
  const router = useRouter();
  const flash = useFlash();

  // State
  const conversations  = ref([]);
  const messages        = ref([]);
  const selectedConversation = ref(null);
  const isLoading       = ref(false);
  const hasMore         = ref(false);
  const hasMoreConversations = ref(false);
  const isLoadingMoreConversations = ref(false);
  const offset          = ref(0);
  const isSidebarOpen   = ref(true);
  const isMobile        = ref(window.innerWidth < 768);
  const product         = ref(null);
  // Cart items to send as a 'cart' message on next chat session
  const cartItems       = ref(null);  // null = no pending cart
  const cartMeta        = ref(null);  // { message, deliveryAddress }
  
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

  // Actions
  const fetchConversations = async (silent = false, force = false, loadMore = false) => {
    if (!force && silent && !loadMore && lastFetchedConversations.value && (Date.now() - lastFetchedConversations.value < CONV_CACHE_TIMEOUT)) {
      return;
    }

    if (loadMore) isLoadingMoreConversations.value = true;
    else if (!silent) isLoading.value = true;
    
    try {
      const currentOffset = loadMore ? conversations.value.length : 0;
      const params = { offset: currentOffset, limit: 10 };
      
      const response = await apiClient.get('/conversations', { params });
      
      if (loadMore) {
        const existingKeys = new Set(conversations.value.map(c => c.user_id + '_' + (c.product_id || '')));
        const newConvs = response.data.conversations.filter(c => !existingKeys.has(c.user_id + '_' + (c.product_id || '')));
        conversations.value = [...conversations.value, ...newConvs];
      } else {
         if (conversations.value.length === 0 || force || !silent) {
            conversations.value = response.data.conversations;
         } else {
            const fetched = response.data.conversations;
            fetched.forEach(conv => {
              const isCurrentlyOpen = selectedConversation.value && String(selectedConversation.value.user_id) === String(conv.user_id) && String(selectedConversation.value.product_id || '') === String(conv.product_id || '');
              if (isCurrentlyOpen) {
                 conv.unread_count = 0; // Force to 0 if we are literally looking at it right now
              }

              const idx = conversations.value.findIndex(c => c.user_id === conv.user_id && String(c.product_id || '') === String(conv.product_id || ''));
              if (idx !== -1) {
                 conversations.value[idx] = { ...conversations.value[idx], ...conv };
              } else {
                 conversations.value.unshift(conv);
              }
            });
            conversations.value.sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
         }
      }

      hasMoreConversations.value = response.data.hasMore || false;
      lastFetchedConversations.value = Date.now();
    } catch (error) {
      console.error("Erreur fetch conversations", error);
      if (!silent && !loadMore) flash.error("Erreur lors du chargement des conversations");
    } finally {
      if (loadMore) isLoadingMoreConversations.value = false;
      else if (!silent) isLoading.value = false;
    }
  };

  const messagesCache = ref({}); 
  const lastFetchedMessages = ref({}); 
  const MSG_CACHE_TIMEOUT = 2 * 60 * 1000; 

  const fetchMessages = async (receiverId, resetOffset = true, productId = null) => {
    const cacheKey = productId ? `${receiverId}_${productId}` : `${receiverId}_null`;

    if (resetOffset) {
      // Nettoyage immédiat pour éviter de voir l'ancien chat
      messages.value = messagesCache.value[cacheKey] || [];
      
      // On essaie de trouver la conversation dans la liste locale pour mettre à jour le header tout de suite
      const convMatch = conversations.value.find(c => String(c.user_id) === String(receiverId) && String(c.product_id || '') === String(productId || ''));
      
      if (convMatch) {
        selectedConversation.value = convMatch;
      } else {
        selectedConversation.value = {
          user_id: receiverId,
          product_id: productId,
          name: "Chargement...",
        };
        // Si on vient juste de cliquer sur "Acheter un produit", on utilise le localStorage
        if (product.value && String(product.value.id) === String(productId)) {
           selectedConversation.value.product_name = product.value.nom;
        }
      }
    }

    const now = Date.now();
    // On ne bypass le cache QUE si ce n'est pas un reset (pagination infinie)
    if (!resetOffset && lastFetchedMessages.value[cacheKey] && (now - lastFetchedMessages.value[cacheKey] < MSG_CACHE_TIMEOUT)) {
      return;
    }

    if (!resetOffset) isLoading.value = true;
    else if (!messagesCache.value[cacheKey]) {
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
        const productData = response.data.product;
        const convMatch = conversations.value.find(c => String(c.user_id) === String(user.id) && String(c.product_id || '') === String(productId || ''));
        
        let displayName = user.nom;
        if (convMatch && convMatch.name) {
          displayName = convMatch.name;
        } else if (productData) {
          const clientName = (authStore.user?.role === 'admin' || authStore.user?.email === 'aaa@aaa.com') ? user.nom : authStore.user?.nom;
          displayName = `${productData.nom} - ${clientName}`;
        }

        selectedConversation.value = {
          user_id: user.id,
          name: displayName,
          profile_photo: user.photo,
          product_id: productId,
          product_name: productData ? productData.nom : (convMatch ? convMatch.product_name : null),
          product_slug: productData ? productData.slug : (convMatch ? convMatch.product_slug : null),
          product_image: productData && productData.photos ? productData.photos[0] : (convMatch ? convMatch.product_image : null),
          order_status: convMatch ? convMatch.order_status : null,
          ...(convMatch || {})
        };
      }

      const convIndex = conversations.value.findIndex(c => String(c.user_id) === String(receiverId) && String(c.product_id || '') === String(productId || ''));
      if (convIndex !== -1) {
        if (conversations.value[convIndex].unread_count > 0) {
           conversations.value[convIndex].unread_count = 0;
           // If we just entered and there were unread messages, let the server know so they're marked as read
           markAllMessagesAsRead(receiverId, productId);
        }
      }

    } catch (error) {
      console.error("Erreur fetch messages", error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateConversationLastMessage = (message) => {
    const cid = String(message.sender_id) === String(authStore.user?.id) ? message.receiver_id : message.sender_id;
    const pid = message.product_id;
    const convIndex = conversations.value.findIndex(c => String(c.user_id) === String(cid) && String(c.product_id || '') === String(pid || ''));

    const lastMsg = message.type === "text" ? message.content : `[${message.type}]`;

    if (convIndex !== -1) {
      // Mettre à jour et remonter en haut
      const conv = conversations.value.splice(convIndex, 1)[0];
      conv.last_message = lastMsg;
      conv.last_message_type = message.type;
      conv.updated_at = message.updated_at || new Date().toISOString();
      conversations.value.unshift(conv);
    } else if (selectedConversation.value && String(selectedConversation.value.user_id) === String(cid) && String(selectedConversation.value.product_id || '') === String(pid || '')) {
      // Créer une nouvelle entrée dans la sidebar pour cette nouvelle conversation
      const newConv = {
        user_id: cid,
        product_id: pid,
        name: selectedConversation.value.name,
        product_name: selectedConversation.value.product_name,
        product_slug: selectedConversation.value.product_slug,
        product_image: selectedConversation.value.product_image,
        user_name: selectedConversation.value.user_name || (authStore.user?.role === 'admin' ? selectedConversation.value.name : authStore.user?.nom),
        user_photo: selectedConversation.value.profile_photo,
        last_message: lastMsg,
        last_message_type: message.type,
        updated_at: message.updated_at || new Date().toISOString(),
        unread_count: 0
      };
      conversations.value.unshift(newConv);
    }
  };

  const sendMessage = async (content, type = 'text', file = null, cartData = null) => {
    if (!selectedConversation.value) return;

    const receiverId = selectedConversation.value.user_id;
    const tempId     = -Date.now();
    
    newMessage.value = '';
    const tempMessage = {
      id:         tempId,
      sender_id:  authStore.user?.id,
      receiver_id: receiverId,
      product_id: selectedConversation.value.product_id || null,
      content,
      type,
      cart_data:  cartData || null,
      is_read:    false,
      created_at: new Date().toISOString(),
      isTemporary: true,
      product:    product.value
    };

    messages.value.push(tempMessage);

    try {
      const formData = new FormData();
      formData.append('type', type);
      if (content) formData.append('content', content);
      if (selectedConversation.value.product_id) {
        formData.append('product_id', selectedConversation.value.product_id);
      }
      if (product.value) formData.append('product_id', product.value.id);
      // Append cart_items as JSON string for type='cart'
      if (cartData && type === 'cart') {
        formData.append('cart_items', JSON.stringify(
          cartData.map(i => ({ 
            productId: i.productId, 
            quantity: i.quantity,
            name: i.name,
            priceRaw: Number(i.priceRaw),
            image: i.image,
            slug: i.slug
          }))
        ));
      }
      
      if (file) {
        formData.append(type, file);
      }

      const response = await apiClient.post(`/chat/${receiverId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const realMessage = response.data.data;

      const index = messages.value.findIndex(m => m.id === tempId);
      if (index !== -1) {
        messages.value[index] = { ...realMessage, isTemporary: false };
      }

      updateConversationLastMessage(realMessage);
      if (product.value) clearProductTag();
      
      return realMessage;
    } catch (error) {
      messages.value = messages.value.filter(m => m.id !== tempId);
      flash.error("Échec de l'envoi");
      throw error;
    }
  };

  const startPolling = () => {
    if (pollingInterval) return;
    
    pollingInterval = setInterval(async () => {
      if (!authStore.isAuthenticated || document.hidden) return;
      
      await fetchConversations(true);
      
      if (selectedConversation.value && !isLoading.value) {
        // Capture the current context BEFORE the async call
        const capturedReceiverId = selectedConversation.value.user_id;
        const capturedProductId = selectedConversation.value.product_id;
        
        try {
          const response = await apiClient.get(`/chat/${capturedReceiverId}`, {
            params: { limit: 10, product_id: capturedProductId }
          });
          
          // Guard: if user switched conversations while we were awaiting, discard stale results
          if (
            selectedConversation.value?.user_id !== capturedReceiverId ||
            String(selectedConversation.value?.product_id || '') !== String(capturedProductId || '')
          ) {
            return;
          }
          
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

  const markAllMessagesAsRead = async (receiverId, productId = null) => {
    try {
      await apiClient.put("/messages/mark-all-as-read", {
        sender_id: receiverId,
        product_id: productId
      });
      
      const convIndex = conversations.value.findIndex(c => String(c.user_id) === String(receiverId) && String(c.product_id || '') === String(productId || ''));
      if (convIndex !== -1) {
        conversations.value[convIndex].unread_count = 0;
      }
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
      flash.error("Erreur lors de la modification");
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
      flash.error("Erreur lors de la suppression");
      throw error;
    }
  };

  const setProductTag = (productData) => {
    product.value = productData;
    localStorage.setItem('chatProduct', JSON.stringify(productData));
  };

  const clearProductTag = () => {
    product.value = null;
    localStorage.removeItem('chatProduct');
  };

  /** Store cart items + optional metadata to be sent as a 'cart' message when chat opens */
  const setCartItems = (items, meta = {}) => {
    cartItems.value = items && items.length > 0 ? items : null;
    cartMeta.value  = meta || null;
    if (cartItems.value) {
      sessionStorage.setItem('pendingCart', JSON.stringify(cartItems.value));
      if (cartMeta.value) {
        sessionStorage.setItem('pendingCartMeta', JSON.stringify(cartMeta.value));
      }
    }
  };

  const clearCartItems = () => {
    cartItems.value = null;
    cartMeta.value  = null;
    sessionStorage.removeItem('pendingCart');
    sessionStorage.removeItem('pendingCartMeta');
  };

  /**
   * Called by Messages.vue after conversation loads — sends the pending cart
   * as a 'cart' type message if one is set.
   */
  const sendPendingCartIfAny = async () => {
    // Try restoring from sessionStorage (survives page reload)
    if (!cartItems.value) {
      const stored = sessionStorage.getItem('pendingCart');
      if (stored) {
        try { cartItems.value = JSON.parse(stored); } catch { /* ignore */ }
      }
    }
    if (!cartMeta.value) {
      const storedMeta = sessionStorage.getItem('pendingCartMeta');
      if (storedMeta) {
        try { cartMeta.value = JSON.parse(storedMeta); } catch { /* ignore */ }
      }
    }
    if (!cartItems.value || cartItems.value.length === 0) return;

    const items = cartItems.value;
    const meta  = cartMeta.value || {};
    clearCartItems();

    // Set a clean message content just for the address and default question
    let content = "Ces articles sont-ils toujours disponibles ?";

    if (meta.deliveryAddress) {
      // Add a line break and the delivery address
      content += `\n\n📍 Adresse de livraison : ${meta.deliveryAddress}`;
    }

    // Attach deliveryAddress to each cart item so the backend/admin can see it
    const itemsWithMeta = items.map(i => ({ ...i, deliveryAddress: meta.deliveryAddress || null }));

    try {
      await sendMessage(content, 'cart', null, itemsWithMeta);
    } catch (err) {
      console.error("Erreur lors de l'envoi automatique du panier:", err);
    }
  };

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  const selectConversation = (receiverId, productId = null) => {
    router.push({ 
      name: "messages", 
      params: { receiverId }, 
      query: productId ? { productId } : {} 
    });
    if (isMobile.value) {
      isSidebarOpen.value = false;
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      flash.error("Audio non supporté");
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
    } catch (e) { flash.error("Erreur micro"); }
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
    // console.log("Real-time subscription requested");
  };

  const unsubscribeFromChannel = () => {
    // console.log("Unsubscribe from channel");
  };

  const cleanup = () => {
    stopPolling();
    unsubscribeFromChannel();
    window.removeEventListener("resize", handleResize);
  };

  // Keep badgeStore automatically synchronized with unreadCount in real-time
  watch(unreadCount, (newVal) => {
    if (badgeStore.badgeCounts) {
      badgeStore.badgeCounts.messages = newVal;
    }
  });

  return {
    conversations, messages, selectedConversation, isLoading, hasMore, hasMoreConversations,
    isLoadingMoreConversations, isSidebarOpen, isMobile, product, cartItems,
    typingState, recordingState, newMessage,
    groupedMessages, unreadCount,
    fetchConversations, fetchMessages, sendMessage, sendPendingCartIfAny,
    startRecording, stopRecording, toggleRecordingPause, cancelRecording,
    markAllMessagesAsRead, editMessage, deleteMessage,
    setProductTag, clearProductTag, setCartItems, clearCartItems,
    toggleSidebar, selectConversation,
    initialize, cleanup, subscribeToChannel, unsubscribeFromChannel
  };
});
