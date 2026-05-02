// /src/utils/share.js
import { useToast } from "vue-toastification";

// Le mot "export" est obligatoire devant "function"
export async function shareProfile(user) {
  const toast = useToast();

  if (!user) return;

  const shareData = {
    title: `Profil de ${user.nom || "Vendeur"}`,
    text: `Découvrez le profil de ${user.nom} sur Sasayee`,
    url: `${window.location.origin}/profile/${user.id}`,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (e) {
      return;
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.url);
    toast.success("Lien copié ! ✅");
  } catch (e) {
    toast.error("Erreur lors de la copie");
  }
}
