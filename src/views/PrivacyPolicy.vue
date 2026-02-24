<template>
  <div
    class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] pb-20"
  >
    <header
      class="bg-[var(--color-primary)] text-white py-16 px-6 text-center relative overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
      >
        <CloudLightning :size="300" class="absolute -top-10 -right-10" />
      </div>

      <div class="max-w-4xl mx-auto relative z-10">
        <div
          class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
        >
          <ShieldCheck :size="40" class="text-white" />
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-4">
          Politique de Confidentialité
        </h1>
        <p class="text-xl text-white/90 max-w-2xl mx-auto">
          Chez CH-TECH, la protection de vos données et de votre vie privée est
          inscrite dans notre code.
        </p>

        <div
          class="flex flex-wrap justify-center gap-6 mt-8 text-sm font-medium text-white/80"
        >
          <div class="flex items-center gap-2">
            <Calendar :size="16" /> Dernière mise à jour : 24 février 2026
          </div>
          <div class="flex items-center gap-2">
            <Clock :size="16" /> Temps de lecture : ~6 minutes
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
      <section
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 shadow-xl mb-8"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-blue-500/10 rounded-lg">
            <Info :size="24" class="text-blue-500" />
          </div>
          <h2 class="text-2xl font-bold">Introduction</h2>
        </div>
        <div class="space-y-4 text-[var(--color-text-sub)] leading-relaxed">
          <p>
            Bienvenue sur la politique de confidentialité de
            <strong>CH-TECH</strong>. Cette page vous explique de manière
            transparente comment nous collectons, utilisons et protégeons vos
            informations personnelles lorsque vous utilisez nos solutions
            technologiques.
          </p>
          <div
            class="bg-[var(--color-primary)]/5 border-l-4 border-[var(--color-primary)] p-4 rounded-r-xl mt-4"
          >
            <p
              class="text-[var(--color-primary)] font-medium flex items-center gap-2"
            >
              <AlertCircle :size="18" /> Note importante :
            </p>
            <p class="text-sm mt-1">
              Cette politique s'applique à l'ensemble de l'écosystème CH-TECH,
              incluant nos applications web, mobiles et services API.
            </p>
          </div>
        </div>
      </section>

      <section
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 shadow-xl mb-8"
      >
        <div class="flex items-center gap-3 mb-8">
          <div class="p-2 bg-amber-500/10 rounded-lg">
            <Database :size="24" class="text-amber-500" />
          </div>
          <h2 class="text-2xl font-bold">Données que nous collectons</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3
              class="font-bold mb-4 flex items-center gap-2 text-[var(--color-text-main)]"
            >
              <UserPlus :size="18" class="text-[var(--color-primary)]" />
              Informations fournies
            </h3>
            <ul class="space-y-4">
              <li
                v-for="item in providedData"
                :key="item.title"
                class="flex gap-4"
              >
                <component
                  :is="item.icon"
                  :size="20"
                  class="shrink-0 text-[var(--color-text-sub)]"
                />
                <div>
                  <p class="font-semibold text-sm">{{ item.title }}</p>
                  <p class="text-xs text-[var(--color-text-sub)]">
                    {{ item.desc }}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3
              class="font-bold mb-4 flex items-center gap-2 text-[var(--color-text-main)]"
            >
              <Cpu :size="18" class="text-[var(--color-primary)]" /> Collecte
              automatique
            </h3>
            <ul class="space-y-4">
              <li v-for="item in autoData" :key="item.title" class="flex gap-4">
                <component
                  :is="item.icon"
                  :size="20"
                  class="shrink-0 text-[var(--color-text-sub)]"
                />
                <div>
                  <p class="font-semibold text-sm">{{ item.title }}</p>
                  <p class="text-xs text-[var(--color-text-sub)]">
                    {{ item.desc }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 shadow-xl mb-8"
      >
        <div class="flex items-center gap-3 mb-8">
          <div class="p-2 bg-emerald-500/10 rounded-lg">
            <Lock :size="24" class="text-emerald-500" />
          </div>
          <h2 class="text-2xl font-bold">Sécurité des données</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            v-for="sec in securityMeasures"
            :key="sec.title"
            class="text-center p-6 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]"
          >
            <div
              class="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <component :is="sec.icon" :size="24" />
            </div>
            <h4 class="font-bold mb-2">{{ sec.title }}</h4>
            <p class="text-xs text-[var(--color-text-sub)]">{{ sec.desc }}</p>
          </div>
        </div>

        <div
          class="bg-[var(--color-bg)] rounded-2xl p-6 grid md:grid-cols-2 gap-4 border border-[var(--color-border)]"
        >
          <div
            v-for="tech in techSpecs"
            :key="tech"
            class="flex items-center gap-3 text-sm"
          >
            <CheckCircle :size="18" class="text-emerald-500" />
            <span>{{ tech }}</span>
          </div>
        </div>
      </section>

      <section
        class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 shadow-xl"
      >
        <div class="flex items-center gap-3 mb-8">
          <div class="p-2 bg-[var(--color-accent)]/10 rounded-lg">
            <Fingerprint :size="24" class="text-[var(--color-accent)]" />
          </div>
          <h2 class="text-2xl font-bold">Vos Droits</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-8">
          <div
            v-for="right in userRights"
            :key="right.name"
            class="p-4 rounded-xl border border-[var(--color-border)] flex items-start gap-4 hover:border-[var(--color-primary)] transition-colors"
          >
            <div :class="`p-2 rounded-lg ${right.bg}`">
              <component :is="right.icon" :size="20" :class="right.color" />
            </div>
            <div>
              <p class="font-bold text-sm">{{ right.name }}</p>
              <p class="text-xs text-[var(--color-text-sub)] mt-1">
                {{ right.desc }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="text-center p-6 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20"
        >
          <p class="text-sm font-medium mb-4">
            Pour exercer vos droits, contactez notre DPO :
          </p>
          <a
            href="mailto:chtech@hmil.com"
            class="text-[var(--color-primary)] font-bold text-lg hover:underline"
          >
            chtech@hmil.com
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import {
  ShieldCheck,
  CloudLightning,
  Calendar,
  Clock,
  Info,
  AlertCircle,
  Database,
  UserPlus,
  Cpu,
  User,
  Briefcase,
  MessageSquare,
  Globe,
  Activity,
  CreditCard,
  Lock,
  Shield,
  Eye,
  CheckCircle,
  Fingerprint,
  ArrowLeftRight,
  Trash2,
  Edit3,
  EyeOff,
  Ban,
} from "lucide-vue-next";

const providedData = [
  {
    title: "Informations de compte",
    desc: "Nom, email, mot de passe haché",
    icon: User,
  },
  {
    title: "Profil professionnel",
    desc: "Compétences, portfolio, expériences",
    icon: Briefcase,
  },
  {
    title: "Communications",
    desc: "Échanges avec le support CH-TECH",
    icon: MessageSquare,
  },
];

const autoData = [
  {
    title: "Données techniques",
    desc: "Adresse IP, type de navigateur",
    icon: Globe,
  },
  {
    title: "Usage analytique",
    desc: "Temps passé, pages consultées",
    icon: Activity,
  },
  {
    title: "Transactions",
    desc: "Historique de vos abonnements",
    icon: CreditCard,
  },
];

const securityMeasures = [
  {
    title: "Chiffrement",
    desc: "Données chiffrées en transit (TLS 1.3) et au repos",
    icon: Lock,
  },
  {
    title: "Contrôle d'accès",
    desc: "Authentification forte et accès limité au strict nécessaire",
    icon: Shield,
  },
  {
    title: "Surveillance",
    desc: "Monitoring 24/7 contre les tentatives d'intrusion",
    icon: Eye,
  },
];

const techSpecs = [
  "HTTPS avec chiffrement TLS 1.3",
  "Mots de passe hachés avec Argon2",
  "Sauvegardes quotidiennes isolées",
  "Protection Anti-DDoS et WAF",
];

const userRights = [
  {
    name: "Droit d'accès",
    desc: "Obtenir une copie de vos données",
    icon: Eye,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Droit de rectification",
    desc: "Modifier vos informations",
    icon: Edit3,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    name: "Droit à l'oubli",
    desc: "Supprimer définitivement votre compte",
    icon: Trash2,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Portabilité",
    desc: "Récupérer vos données au format JSON",
    icon: ArrowLeftRight,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Droit d'opposition",
    desc: "Refuser certains traitements",
    icon: Ban,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    name: "Limitation",
    desc: "Suspendre temporairement le traitement",
    icon: EyeOff,
    color: "text-slate-500",
    bg: "bg-slate-500/10",
  },
];
</script>
