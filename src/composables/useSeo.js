import { useHead } from '@unhead/vue';
import { computed, unref } from 'vue';

export function useSeo(options = {}) {
  const siteName = 'Sasaye';

  const title = computed(() => {
    const t = unref(options.title);
    return t ? `${t} | ${siteName}` : siteName;
  });

  const description = computed(() => unref(options.description));
  const image = computed(() => unref(options.image) || 'https://sasaye.com/og-image.jpg');
  const url = computed(() => unref(options.url) || (typeof window !== 'undefined' ? window.location.href : ''));
  const type = computed(() => unref(options.type) || 'website');

  useHead({
    title: title,
    meta: [
      { name: 'description', content: description },
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [
      { rel: 'canonical', href: url }
    ]
  });
}
