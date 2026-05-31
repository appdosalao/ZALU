import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { J as Jt, h as cn, A as AppLogo, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, v as Separator, g as Button, j as Input, G as Alert, H as AlertDescription } from './index-U74ij7JC.js';
import { L as Label } from './label-C0AJeojg.js';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-Ce9M_rda.js';
import { T as Textarea } from './textarea-D9C69N9T.js';
import { C as Checkbox } from './checkbox-CBroLTbH.js';
import { s as supabasePublic, u as useAgendamentoOnlineService } from './useAgendamentoOnlineService-ksgHdO0Y.js';
import { l as Check, a9 as User, K as Calendar, aP as CircleCheck, bG as MapPin, ax as Phone, ay as Mail, Q as Clock, a2 as Instagram, a3 as Facebook, N as Scissors, au as ShoppingBag, bH as Share2, bI as Copy, aL as CircleAlert, bJ as Timer, bK as LayoutGrid, az as Tag, as as ArrowLeft, b8 as ArrowRight } from './ui-libs-B5Rrhu1L.js';
import { o as object, s as string, Z as ZodError } from './form-libs-BJ_wtrcd.js';
import './chart-libs-Cdz70zdY.js';
import './index-BfAAoDv6.js';
import './index-Ls-C4DWD.js';

const useHorariosTrabalhoPublic = (userId) => {
  const [configuracoes, setConfiguracoes] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const carregarConfiguracoes = reactExports.useCallback(async () => {
    try {
      if (!userId) {
        setConfiguracoes([]);
        return;
      }
      const { data, error } = await supabasePublic.from("configuracoes_horarios").select("*").eq("ativo", true).eq("user_id", userId).order("dia_semana");
      if (error) throw error;
      setConfiguracoes(data || []);
    } catch {
      setConfiguracoes([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  reactExports.useEffect(() => {
    carregarConfiguracoes();
  }, [carregarConfiguracoes]);
  const isDiaAtivo = reactExports.useCallback((diaSemana) => {
    const config = configuracoes.find((c) => c.dia_semana === diaSemana && c.ativo);
    return !!config;
  }, [configuracoes]);
  return {
    configuracoes,
    loading,
    isDiaAtivo,
    refetch: carregarConfiguracoes
  };
};

const useShare = () => {
  const [isSharing, setIsSharing] = reactExports.useState(false);
  const canShare = typeof navigator !== "undefined" && "share" in navigator;
  const shareContent = async (data) => {
    setIsSharing(true);
    try {
      if (canShare) {
        await navigator.share(data);
        return true;
      } else {
        const message = `${data.title ? data.title + "\n\n" : ""}${data.text ? data.text + "\n" : ""}${data.url || ""}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
        return true;
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return false;
      }
      const message = `${data.title ? data.title + "\n\n" : ""}${data.text ? data.text + "\n" : ""}${data.url || ""}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
      return true;
    } finally {
      setIsSharing(false);
    }
  };
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      Jt.success("✅ Copiado! Conteúdo copiado para a área de transferência.");
      return true;
    } catch (error) {
      Jt.error("❌ Erro ao copiar. Não foi possível copiar o conteúdo.");
      return false;
    }
  };
  return {
    canShare,
    isSharing,
    shareContent,
    copyToClipboard
  };
};

const defaultConfig = {
  ativo: true,
  nome_salao: "Meu Salão",
  descricao: "Bem-vindo ao nosso salão! Agende seu horário de forma rápida e fácil.",
  telefone: "",
  email: "",
  endereco: "",
  instagram: "",
  facebook: "",
  whatsapp: "",
  logo_url: "",
  banner_url: "",
  taxa_sinal_percentual: 30,
  tempo_minimo_antecedencia: 60,
  tempo_maximo_antecedencia: 4320,
  mensagem_boas_vindas: "Olá! Estamos felizes em atendê-lo(a). Preencha os dados abaixo para agendar seu horário.",
  termos_condicoes: "Ao agendar, você concorda em chegar no horário marcado. Em caso de atraso superior a 15 minutos, o agendamento poderá ser cancelado.",
  mensagem_confirmacao: "Agendamento recebido! Em breve você receberá uma confirmação.",
  cor_primaria: "#8B5CF6",
  cor_texto_botao: "#FFFFFF",
  mostrar_precos: true,
  mostrar_duracao: true
};
function useConfigAgendamentoOnlinePublic(ownerUserId) {
  const [config, setConfig] = reactExports.useState(defaultConfig);
  const [loading, setLoading] = reactExports.useState(true);
  const cacheKey = reactExports.useMemo(() => ownerUserId || "default", [ownerUserId]);
  reactExports.useEffect(() => {
    let active = true;
    async function fetchConfig() {
      try {
        setLoading(true);
        const query = supabasePublic.from("configuracoes_agendamento_online").select("*");
        if (!ownerUserId) {
          if (active) {
            setConfig(defaultConfig);
            setLoading(false);
          }
          return;
        }
        const { data, error } = await query.eq("user_id", ownerUserId).maybeSingle();
        if (!active) return;
        if (error) {
          console.error("Erro ao carregar config pública:", error);
          setConfig(defaultConfig);
        } else {
          setConfig(data || defaultConfig);
        }
      } catch (error) {
        console.error("Erro ao carregar configuração pública:", error);
        setConfig(defaultConfig);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchConfig();
    return () => {
      active = false;
    };
  }, [cacheKey, ownerUserId]);
  return { config, loading };
}

function ProgressSteps({ currentStep, steps }) {
  const icons = [User, Calendar, CircleCheck];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full py-6 sm:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative max-w-lg mx-auto px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[22px] sm:top-[26px] left-0 right-0 h-2 bg-primary/10 -translate-y-1/2 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary),0.4)]",
        style: { width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }
      }
    ) }),
    steps.map((step, index) => {
      const stepNumber = index + 1;
      const isCompleted = stepNumber < currentStep;
      const isCurrent = stepNumber === currentStep;
      const StepIcon = icons[index] || Check;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-11 h-11 sm:w-14 sm:h-14 rounded-3xl flex items-center justify-center transition-all duration-700 ease-in-out",
              "border-b-4 border-r-2 shadow-xl",
              isCompleted && "bg-primary border-primary/50 text-white rotate-[360deg] scale-95",
              isCurrent && "bg-white border-primary text-primary scale-110 ring-8 ring-primary/10 -translate-y-2",
              !isCompleted && !isCurrent && "bg-muted border-muted/50 text-muted-foreground scale-90"
            ),
            children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-6 h-6 sm:w-7 sm:h-7 stroke-[3]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(StepIcon, { className: cn("w-6 h-6 sm:w-7 sm:h-7", isCurrent ? "animate-bounce" : "opacity-40") })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-10 left-1/2 -translate-x-1/2 w-max", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: cn(
              "text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all duration-500",
              isCurrent ? "text-primary opacity-100 translate-y-0 scale-110" : "text-muted-foreground opacity-50 translate-y-2"
            ),
            children: step
          }
        ) })
      ] }, stepNumber);
    })
  ] }) });
}

function SalonHeader({ config }) {
  const bannerUrl = config.banner_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop";
  const logoUrl = config.logo_url;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full relative mb-14", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-48 sm:h-72 w-full relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.2)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: bannerUrl,
          alt: "Capa do Salão",
          className: "w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent mix-blend-overlay" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-6 left-6 right-6 sm:left-12 sm:bottom-10 text-white drop-shadow-2xl animate-in fade-in slide-in-from-left-4 duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl sm:text-5xl font-black mb-1 tracking-tighter uppercase italic", children: config.nome_salao }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-12 bg-primary rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] max-w-md line-clamp-1", children: config.descricao || "Beleza & Estilo Profissional" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-10 left-1/2 -translate-x-1/2 sm:left-12 sm:translate-x-0 z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 bg-white rounded-[2.5rem] shadow-[0_15px_35px_rgba(0,0,0,0.25)] transform transition-all hover:scale-110 hover:-rotate-3 duration-500 border border-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 rounded-[2.2rem] p-1 overflow-hidden w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center relative", children: [
      logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: logoUrl,
          alt: config.nome_salao,
          className: "w-full h-full object-cover rounded-[2rem]"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-primary/20 to-primary/5 w-full h-full flex items-center justify-center rounded-[2rem]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 70, rounded: "full" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" })
    ] }) }) })
  ] });
}

function SalonFooter({ config }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "w-full bg-card border-t border-border mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg text-foreground mb-4", children: "Contato" }),
        config.endereco && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 text-primary mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: config.endereco })
        ] }),
        config.telefone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-primary flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: config.telefone })
        ] }),
        config.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 text-primary flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: config.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-primary mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Segunda a Sexta: 9h às 18h",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Sábado: 9h às 14h"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-lg text-foreground mb-4", children: "Redes Sociais" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          config.instagram && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: config.instagram.startsWith("http") ? config.instagram : `https://instagram.com/${config.instagram.replace("@", "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: config.instagram })
              ]
            }
          ),
          config.facebook && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: config.facebook.startsWith("http") ? config.facebook : `https://facebook.com/${config.facebook}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: config.facebook })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 pt-6 border-t border-border text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " ",
      config.nome_salao,
      ". Todos os direitos reservados."
    ] }) })
  ] }) });
}

/*! @license DOMPurify 3.3.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.0/LICENSE */

const {
  entries,
  setPrototypeOf,
  isFrozen,
  getPrototypeOf,
  getOwnPropertyDescriptor
} = Object;
let {
  freeze,
  seal,
  create
} = Object; // eslint-disable-line import/no-mutable-exports
let {
  apply,
  construct
} = typeof Reflect !== 'undefined' && Reflect;
if (!freeze) {
  freeze = function freeze(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
 * Creates a new function that calls the given function with a specified thisArg and arguments.
 *
 * @param func - The function to be wrapped and called.
 * @returns A new function that calls the given function with a specified thisArg and arguments.
 */
function unapply(func) {
  return function (thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
/**
 * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
 *
 * @param func - The constructor function to be wrapped and called.
 * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
 */
function unconstruct(Func) {
  return function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
/**
 * Add properties to a lookup table
 *
 * @param set - The set to which elements will be added.
 * @param array - The array containing elements to be added to the set.
 * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
 * @returns The modified set with added elements.
 */
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === 'string') {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
/**
 * Clean up an array to harden against CSPP
 *
 * @param array - The array to be cleaned.
 * @returns The cleaned version of the array
 */
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
/**
 * Shallow clone an object
 *
 * @param object - The object to be cloned.
 * @returns A new object that copies the original.
 */
function clone(object) {
  const newObject = create(null);
  for (const [property, value] of entries(object)) {
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (Array.isArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
/**
 * This method automatically checks if the prop is function or getter and behaves accordingly.
 *
 * @param object - The object to look up the getter function in its prototype chain.
 * @param prop - The property name for which to find the getter function.
 * @returns The getter function found in the prototype chain or a fallback function.
 */
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === 'function') {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}

const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'search', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);
const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'enterkeyhint', 'exportparts', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'inputmode', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'part', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);
// List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.
const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']);
// Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.
const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
const text = freeze(['#text']);

const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'exportparts', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inert', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'part', 'pattern', 'placeholder', 'playsinline', 'popover', 'popovertarget', 'popovertargetaction', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'wrap', 'xmlns', 'slot']);
const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'amplitude', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'exponent', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'intercept', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'mask-type', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'slope', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'tablevalues', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

// eslint-disable-next-line unicorn/better-regex
const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm); // eslint-disable-line unicorn/better-regex
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);

var EXPRESSIONS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ARIA_ATTR: ARIA_ATTR,
  ATTR_WHITESPACE: ATTR_WHITESPACE,
  CUSTOM_ELEMENT: CUSTOM_ELEMENT,
  DATA_ATTR: DATA_ATTR,
  DOCTYPE_NAME: DOCTYPE_NAME,
  ERB_EXPR: ERB_EXPR,
  IS_ALLOWED_URI: IS_ALLOWED_URI,
  IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
  MUSTACHE_EXPR: MUSTACHE_EXPR,
  TMPLIT_EXPR: TMPLIT_EXPR
});

/* eslint-disable @typescript-eslint/indent */
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
const NODE_TYPE = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9};
const getGlobal = function getGlobal() {
  return typeof window === 'undefined' ? null : window;
};
/**
 * Creates a no-op policy for internal use only.
 * Don't export this function outside this module!
 * @param trustedTypes The policy factory.
 * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
 * @return The policy created (or null, if Trusted Types
 * are not supported or creating the policy failed).
 */
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  }
  // Allow the callers to control the unique policy name
  // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
  // Policy creation with duplicate names throws in Trusted Types.
  let suffix = null;
  const ATTR_NAME = 'data-tt-policy-suffix';
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = 'dompurify' + (suffix ? '#' + suffix : '');
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html) {
        return html;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    // Policy creation failed (most likely another DOMPurify script has
    // already run). Skip creating the policy, as this will only cause errors
    // if TT are enforced.
    console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
    return null;
  }
};
const _createHooksMap = function _createHooksMap() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function createDOMPurify() {
  let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
  const DOMPurify = root => createDOMPurify(root);
  DOMPurify.version = '3.3.0';
  DOMPurify.removed = [];
  if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
    // Not running in a browser, provide a factory function
    // so that you can pass your own Window
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let {
    document
  } = window;
  const originalDocument = document;
  const currentScript = originalDocument.currentScript;
  const {
    DocumentFragment,
    HTMLTemplateElement,
    Node,
    Element,
    NodeFilter,
    NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
    HTMLFormElement,
    DOMParser,
    trustedTypes
  } = window;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
  const remove = lookupGetter(ElementPrototype, 'remove');
  const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
  const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
  const getParentNode = lookupGetter(ElementPrototype, 'parentNode');
  // As per issue #47, the web-components registry is inherited by a
  // new document created via createHTMLDocument. As per the spec
  // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
  // a new empty registry is used when creating a template contents owner
  // document, so we use that as our parent document to ensure nothing
  // is inherited.
  if (typeof HTMLTemplateElement === 'function') {
    const template = document.createElement('template');
    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = '';
  const {
    implementation,
    createNodeIterator,
    createDocumentFragment,
    getElementsByTagName
  } = document;
  const {
    importNode
  } = originalDocument;
  let hooks = _createHooksMap();
  /**
   * Expose whether this browser supports running the full DOMPurify.
   */
  DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
  const {
    MUSTACHE_EXPR,
    ERB_EXPR,
    TMPLIT_EXPR,
    DATA_ATTR,
    ARIA_ATTR,
    IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE,
    CUSTOM_ELEMENT
  } = EXPRESSIONS;
  let {
    IS_ALLOWED_URI: IS_ALLOWED_URI$1
  } = EXPRESSIONS;
  /**
   * We consider the elements and attributes below to be safe. Ideally
   * don't add any new ones but feel free to remove unwanted ones.
   */
  /* allowed element names */
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  /* Allowed attribute names */
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  /*
   * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
   */
  let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
    tagNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeNameCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: false
    }
  }));
  /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
  let FORBID_TAGS = null;
  /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
  let FORBID_ATTR = null;
  /* Config object to store ADD_TAGS/ADD_ATTR functions (when used as functions) */
  const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
    tagCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    },
    attributeCheck: {
      writable: true,
      configurable: false,
      enumerable: true,
      value: null
    }
  }));
  /* Decide if ARIA attributes are okay */
  let ALLOW_ARIA_ATTR = true;
  /* Decide if custom data attributes are okay */
  let ALLOW_DATA_ATTR = true;
  /* Decide if unknown protocols are okay */
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  /* Decide if self-closing tags in attributes are allowed.
   * Usually removed due to a mXSS issue in jQuery 3.0 */
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  /* Output should be safe for common template engines.
   * This means, DOMPurify removes data attributes, mustaches and ERB
   */
  let SAFE_FOR_TEMPLATES = false;
  /* Output should be safe even for XML used within HTML and alike.
   * This means, DOMPurify removes comments when containing risky content.
   */
  let SAFE_FOR_XML = true;
  /* Decide if document with <html>... should be returned */
  let WHOLE_DOCUMENT = false;
  /* Track whether config is already set on this instance of DOMPurify. */
  let SET_CONFIG = false;
  /* Decide if all elements (e.g. style, script) must be children of
   * document.body. By default, browsers might move them to document.head */
  let FORCE_BODY = false;
  /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
   * string (or a TrustedHTML object if Trusted Types are supported).
   * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
   */
  let RETURN_DOM = false;
  /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
   * string  (or a TrustedHTML object if Trusted Types are supported) */
  let RETURN_DOM_FRAGMENT = false;
  /* Try to return a Trusted Type object instead of a string, return a string in
   * case Trusted Types are not supported  */
  let RETURN_TRUSTED_TYPE = false;
  /* Output should be free from DOM clobbering attacks?
   * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
   */
  let SANITIZE_DOM = true;
  /* Achieve full DOM Clobbering protection by isolating the namespace of named
   * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
   *
   * HTML/DOM spec rules that enable DOM Clobbering:
   *   - Named Access on Window (§7.3.3)
   *   - DOM Tree Accessors (§3.1.5)
   *   - Form Element Parent-Child Relations (§4.10.3)
   *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
   *   - HTMLCollection (§4.2.10.2)
   *
   * Namespace isolation is implemented by prefixing `id` and `name` attributes
   * with a constant string, i.e., `user-content-`
   */
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
  /* Keep element content when removing element? */
  let KEEP_CONTENT = true;
  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
   * of importing it into a new Document and returning a sanitized copy */
  let IN_PLACE = false;
  /* Allow usage of profiles like html, svg and mathMl */
  let USE_PROFILES = {};
  /* Tags to ignore content of when KEEP_CONTENT is true */
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
  /* Tags that are safe for data: URIs */
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
  /* Attributes safe for values like "javascript:" */
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
  const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  /* Document namespace */
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  /* Allowed XHTML+XML namespaces */
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
  let HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);
  // Certain elements are allowed in both SVG and HTML
  // namespace. We need to specify them explicitly
  // so that they don't get erroneously deleted from
  // HTML namespace.
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
  /* Parsing of strict XHTML documents */
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
  const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
  let transformCaseFunc = null;
  /* Keep a reference to config to pass to hooks */
  let CONFIG = null;
  /* Ideally, do not touch anything below this line */
  /* ______________________________________________ */
  const formElement = document.createElement('form');
  const isRegexOrFunction = function isRegexOrFunction(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  /**
   * _parseConfig
   *
   * @param cfg optional config literal
   */
  // eslint-disable-next-line complexity
  const _parseConfig = function _parseConfig() {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    /* Shield configuration object from tampering */
    if (!cfg || typeof cfg !== 'object') {
      cfg = {};
    }
    /* Shield configuration object from prototype pollution */
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE =
    // eslint-disable-next-line unicorn/prefer-includes
    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
    // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
    /* Set configuration parameters */
    ALLOWED_TAGS = objectHasOwnProperty(cfg, 'ALLOWED_TAGS') ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR = objectHasOwnProperty(cfg, 'ALLOWED_ATTR') ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, 'ALLOWED_NAMESPACES') ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS = objectHasOwnProperty(cfg, 'ADD_DATA_URI_TAGS') ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS = objectHasOwnProperty(cfg, 'FORBID_CONTENTS') ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS = objectHasOwnProperty(cfg, 'FORBID_TAGS') ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
    FORBID_ATTR = objectHasOwnProperty(cfg, 'FORBID_ATTR') ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, 'USE_PROFILES') ? cfg.USE_PROFILES : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
    RETURN_DOM = cfg.RETURN_DOM || false; // Default false
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
    FORCE_BODY = cfg.FORCE_BODY || false; // Default false
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
    IN_PLACE = cfg.IN_PLACE || false; // Default false
    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
    MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
    HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
    }
    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    /* Parse profile info */
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = [];
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    /* Merge configuration parameters */
    if (cfg.ADD_TAGS) {
      if (typeof cfg.ADD_TAGS === 'function') {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (cfg.ADD_ATTR) {
      if (typeof cfg.ADD_ATTR === 'function') {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (cfg.ADD_URI_SAFE_ATTR) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (cfg.FORBID_CONTENTS) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    /* Add #text in case KEEP_CONTENT is set to true */
    if (KEEP_CONTENT) {
      ALLOWED_TAGS['#text'] = true;
    }
    /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
    }
    /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ['tbody']);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      // Overwrite existing TrustedTypes policy.
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      // Sign local variables required by `sanitize`.
      emptyHTML = trustedTypesPolicy.createHTML('');
    } else {
      // Uninitialized policy, attempt to initialize the internal dompurify policy.
      if (trustedTypesPolicy === undefined) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      // If creating the internal policy succeeded sign internal variables.
      if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
        emptyHTML = trustedTypesPolicy.createHTML('');
      }
    }
    // Prevent further manipulation of configuration.
    // Not available in IE8, Safari 5, etc.
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  /* Keep track of all possible SVG and MathML tags
   * so that we can perform the namespace checks
   * correctly. */
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  /**
   * @param element a DOM element whose namespace is being checked
   * @returns Return false if the element has a
   *  namespace that a spec-compliant parser would never
   *  return. Return true otherwise.
   */
  const _checkValidNamespace = function _checkValidNamespace(element) {
    let parent = getParentNode(element);
    // In JSDOM, if we're inside shadow DOM, then parentNode
    // can be null. We just simulate parent in this case.
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: 'template'
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      // The only way to switch from HTML namespace to SVG
      // is via <svg>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'svg';
      }
      // The only way to switch from MathML to SVG is via`
      // svg if parent is either <annotation-xml> or MathML
      // text integration points.
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
      }
      // We only allow elements that are defined in SVG
      // spec. All others are disallowed in SVG namespace.
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      // The only way to switch from HTML namespace to MathML
      // is via <math>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'math';
      }
      // The only way to switch from SVG to MathML is via
      // <math> and HTML integration points
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
      }
      // We only allow elements that are defined in MathML
      // spec. All others are disallowed in MathML namespace.
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      // The only way to switch from SVG to HTML is via
      // HTML integration points, and from MathML to HTML
      // is via MathML text integration points
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      // We disallow tags that are specific for MathML
      // or SVG and should never appear in HTML namespace
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    // For XHTML and XML documents that support custom namespaces
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    // The code should never reach this place (this means
    // that the element somehow got namespace that is not
    // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
    // Return false just in case.
    return false;
  };
  /**
   * _forceRemove
   *
   * @param node a DOM node
   */
  const _forceRemove = function _forceRemove(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
    }
  };
  /**
   * _removeAttribute
   *
   * @param name an Attribute name
   * @param element a DOM node
   */
  const _removeAttribute = function _removeAttribute(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    // We void attribute values for unremovable "is" attributes
    if (name === 'is') {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {}
      } else {
        try {
          element.setAttribute(name, '');
        } catch (_) {}
      }
    }
  };
  /**
   * _initDocument
   *
   * @param dirty - a string of dirty markup
   * @return a DOM, filled with the dirty markup
   */
  const _initDocument = function _initDocument(dirty) {
    /* Create a HTML document */
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = '<remove></remove>' + dirty;
    } else {
      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    /*
     * Use the DOMParser API by default, fallback later if needs be
     * DOMParser not work for svg when has multiple root element.
     */
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {}
    }
    /* Use createHTMLDocument in case DOMParser is not available */
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, 'template', null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
        // Syntax error if dirtyPayload is invalid xml
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    /* Work on whole document or just its body */
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   *
   * @param root The root element or node to start traversing on.
   * @return The created NodeIterator
   */
  const _createNodeIterator = function _createNodeIterator(root) {
    return createNodeIterator.call(root.ownerDocument || root, root,
    // eslint-disable-next-line no-bitwise
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
  };
  /**
   * _isClobbered
   *
   * @param element element to check for clobbering attacks
   * @return true if clobbered, false if safe
   */
  const _isClobbered = function _isClobbered(element) {
    return element instanceof HTMLFormElement && (typeof element.nodeName !== 'string' || typeof element.textContent !== 'string' || typeof element.removeChild !== 'function' || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== 'function' || typeof element.setAttribute !== 'function' || typeof element.namespaceURI !== 'string' || typeof element.insertBefore !== 'function' || typeof element.hasChildNodes !== 'function');
  };
  /**
   * Checks whether the given object is a DOM node.
   *
   * @param value object to check whether it's a DOM node
   * @return true is object is a DOM node
   */
  const _isNode = function _isNode(value) {
    return typeof Node === 'function' && value instanceof Node;
  };
  function _executeHooks(hooks, currentNode, data) {
    arrayForEach(hooks, hook => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  /**
   * _sanitizeElements
   *
   * @protect nodeName
   * @protect textContent
   * @protect removeChild
   * @param currentNode to check for permission to exist
   * @return true if node was killed, false if left alive
   */
  const _sanitizeElements = function _sanitizeElements(currentNode) {
    let content = null;
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    /* Check if element is clobbered or can clobber */
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Now let's check the element's type and name */
    const tagName = transformCaseFunc(currentNode.nodeName);
    /* Execute a hook if present */
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    /* Detect mXSS attempts abusing namespace confusion */
    if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any occurrence of processing instructions */
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any kind of possibly harmful comments */
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove element if anything forbids its presence */
    if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
      /* Check if we have a custom element to handle */
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      /* Keep content except for bad-listed elements */
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode) || currentNode.parentNode;
        const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    /* Check whether element has a valid namespace */
    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Make sure that older browsers don't get fallback-tag mXSS */
    if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Sanitize element content to be template-safe */
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      /* Get the element's text content */
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        content = stringReplace(content, expr, ' ');
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  /**
   * _isValidAttribute
   *
   * @param lcTag Lowercase tag name of containing element.
   * @param lcName Lowercase attribute name.
   * @param value Attribute value.
   * @return Returns true if `value` is valid, otherwise false.
   */
  // eslint-disable-next-line complexity
  const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
    /* Make sure attribute cannot clobber */
    if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
      return false;
    }
    /* Allow valid data-* attributes: At least one character after "-"
        (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
        XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
        We don't need to check the value; it's always URI safe. */
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ; else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
      if (
      // First condition does a very basic check if a) it's basically a valid custom element tagname AND
      // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
      _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) ||
      // Alternative, second condition checks if it's an `is`-attribute, AND
      // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
      lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
        return false;
      }
      /* Check value is safe. First, is attr inert? If so, is safe */
    } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if (value) {
      return false;
    } else ;
    return true;
  };
  /**
   * _isBasicCustomElement
   * checks if at least one dash is included in tagName, and it's not the first char
   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
   *
   * @param tagName name of the tag of the node to sanitize
   * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
   */
  const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
    return tagName !== 'annotation-xml' && stringMatch(tagName, CUSTOM_ELEMENT);
  };
  /**
   * _sanitizeAttributes
   *
   * @protect attributes
   * @protect nodeName
   * @protect removeAttribute
   * @protect setAttribute
   *
   * @param currentNode to sanitize
   */
  const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const {
      attributes
    } = currentNode;
    /* Check if we have attributes; if not we might have a text node */
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: '',
      attrValue: '',
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: undefined
    };
    let l = attributes.length;
    /* Go backwards over all attributes; safely remove bad ones */
    while (l--) {
      const attr = attributes[l];
      const {
        name,
        namespaceURI,
        value: attrValue
      } = attr;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === 'value' ? initValue : stringTrim(initValue);
      /* Execute a hook if present */
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      /* Full DOM Clobbering protection via namespace isolation,
       * Prefix id and name attributes with `user-content-`
       */
      if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
        // Remove the attribute with this value
        _removeAttribute(name, currentNode);
        // Prefix the value and later re-create the attribute with the sanitized value
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      /* Work around a security issue with comments inside attributes */
      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title|textarea)/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Make sure we cannot easily use animated hrefs, even if animations are allowed */
      if (lcName === 'attributename' && stringMatch(value, 'href')) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Work around a security issue in jQuery 3.0 */
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Sanitize attribute content to be template-safe */
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
          value = stringReplace(value, expr, ' ');
        });
      }
      /* Is `value` valid for this attribute? */
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Handle attributes that require Trusted Types */
      if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
        if (namespaceURI) ; else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case 'TrustedHTML':
              {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
            case 'TrustedScriptURL':
              {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
          }
        }
      }
      /* Handle invalid data-* attribute set by try-catching it */
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  /**
   * _sanitizeShadowDOM
   *
   * @param fragment to iterate over recursively
   */
  const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while (shadowNode = shadowIterator.nextNode()) {
      /* Execute a hook if present */
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      /* Sanitize tags and elements */
      _sanitizeElements(shadowNode);
      /* Check attributes next */
      _sanitizeAttributes(shadowNode);
      /* Deep shadow DOM detected */
      if (shadowNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(shadowNode.content);
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  // eslint-disable-next-line complexity
  DOMPurify.sanitize = function (dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    /* Make sure we have a string to sanitize.
      DO NOT return early, as this will return the wrong type if
      the user has requested a DOM object rather than a string */
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = '<!-->';
    }
    /* Stringify, in case dirty is an object */
    if (typeof dirty !== 'string' && !_isNode(dirty)) {
      if (typeof dirty.toString === 'function') {
        dirty = dirty.toString();
        if (typeof dirty !== 'string') {
          throw typeErrorCreate('dirty is not a string, aborting');
        }
      } else {
        throw typeErrorCreate('toString is not a function');
      }
    }
    /* Return dirty HTML if DOMPurify cannot run */
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    /* Assign config vars */
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    /* Clean up removed elements */
    DOMPurify.removed = [];
    /* Check if dirty is correctly typed for IN_PLACE */
    if (typeof dirty === 'string') {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      /* Do some early pre-sanitization to avoid unsafe root nodes */
      if (dirty.nodeName) {
        const tagName = transformCaseFunc(dirty.nodeName);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
        }
      }
    } else if (dirty instanceof Node) {
      /* If dirty is a DOM element, append to an empty document to avoid
         elements being stripped by the parser */
      body = _initDocument('<!---->');
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === 'BODY') {
        /* Node is already a body, use as is */
        body = importedNode;
      } else if (importedNode.nodeName === 'HTML') {
        body = importedNode;
      } else {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        body.appendChild(importedNode);
      }
    } else {
      /* Exit directly if we have nothing to do */
      if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
      // eslint-disable-next-line unicorn/prefer-includes
      dirty.indexOf('<') === -1) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      /* Initialize the document to work on */
      body = _initDocument(dirty);
      /* Check we have a DOM node from the data */
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
      }
    }
    /* Remove first element node (ours) if FORCE_BODY is set */
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    /* Get node iterator */
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    /* Now start iterating over the created document */
    while (currentNode = nodeIterator.nextNode()) {
      /* Sanitize tags and elements */
      _sanitizeElements(currentNode);
      /* Check attributes next */
      _sanitizeAttributes(currentNode);
      /* Shadow DOM detected, sanitize it */
      if (currentNode.content instanceof DocumentFragment) {
        _sanitizeShadowDOM(currentNode.content);
      }
    }
    /* If we sanitized `dirty` in-place, return it. */
    if (IN_PLACE) {
      return dirty;
    }
    /* Return sanitized string or DOM */
    if (RETURN_DOM) {
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        /*
          AdoptNode() is not used because internal state is not reset
          (e.g. the past names map of a HTMLFormElement), this is safe
          in theory but we would rather not risk another attack vector.
          The state that is cloned by importNode() is explicitly defined
          by the specs.
        */
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    /* Serialize doctype if allowed */
    if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
    }
    /* Sanitize final string template-safe */
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
        serializedHTML = stringReplace(serializedHTML, expr, ' ');
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function () {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function () {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function (tag, attr, value) {
    /* Initialize shared config vars if necessary. */
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function (entryPoint, hookFunction) {
    if (typeof hookFunction !== 'function') {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function (entryPoint, hookFunction) {
    if (hookFunction !== undefined) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? undefined : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function (entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function () {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

const agendamentoOnlineSchema = object({
  nome_completo: string().trim().min(2, "Nome deve ter no mínimo 2 caracteres").max(200, "Nome deve ter no máximo 200 caracteres"),
  email: string().trim().email("Email inválido").max(255, "Email deve ter no máximo 255 caracteres").toLowerCase(),
  telefone: string().transform((val) => val.replace(/\D/g, "")).refine((val) => val.length >= 8 && val.length <= 15, "Telefone inválido"),
  // Nem todas as fontes garantem UUID; aceitar qualquer string não vazia
  servico_id: string().trim().min(1, "Selecione um serviço"),
  data: string().refine((date) => {
    const today = /* @__PURE__ */ new Date();
    const todayStr = today.toISOString().split("T")[0];
    return date >= todayStr;
  }, "Data deve ser hoje ou no futuro"),
  // Aceitar HH:MM ou HH:MM:SS e normalizar para HH:MM
  horario: string().regex(/^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, "Horário inválido").transform((h) => h.length >= 5 ? h.slice(0, 5) : h),
  observacoes: string().trim().max(500, "Observações devem ter no máximo 500 caracteres").optional().transform((val) => val ? purify.sanitize(val, { ALLOWED_TAGS: [] }) : "")
});

function AgendamentoOnlineForm() {
  const {
    loading,
    servicos,
    servicosError,
    produtos,
    horariosError,
    ownerUserId,
    carregarServicos,
    carregarProdutosPublicos,
    calcularHorariosDisponiveis,
    criarAgendamento
  } = useAgendamentoOnlineService();
  const {
    isDiaAtivo,
    loading: loadingHorarios,
    configuracoes
  } = useHorariosTrabalhoPublic(ownerUserId || void 0);
  const { shareContent, copyToClipboard, isSharing } = useShare();
  const { config: configOnline } = useConfigAgendamentoOnlinePublic(ownerUserId);
  const primaryColor = configOnline.cor_primaria || "#8B5CF6";
  const primaryHsl = hexToHsl(primaryColor);
  function hexToHsl(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map((char) => char + char).join("");
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }
  const [formData, setFormData] = reactExports.useState({
    nome_completo: "",
    email: "",
    telefone: "",
    servico_id: "",
    data: "",
    horario: "",
    observacoes: ""
  });
  const [horariosDisponiveis, setHorariosDisponiveis] = reactExports.useState([]);
  const [errors, setErrors] = reactExports.useState({});
  const [termsAccepted, setTermsAccepted] = reactExports.useState(false);
  const [taxaAccepted, setTaxaAccepted] = reactExports.useState(false);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [currentStep, setCurrentStep] = reactExports.useState(1);
  const formRef = reactExports.useRef(null);
  const [produtoId, setProdutoId] = reactExports.useState("");
  const [produtoQtd, setProdutoQtd] = reactExports.useState(1);
  const [produtoForma, setProdutoForma] = reactExports.useState("pix");
  const [produtoEnabled, setProdutoEnabled] = reactExports.useState(false);
  const [produtoCategoria, setProdutoCategoria] = reactExports.useState("todas");
  const [produtoOrdenacao, setProdutoOrdenacao] = reactExports.useState("nome");
  const agora = reactExports.useMemo(() => /* @__PURE__ */ new Date(), []);
  const minAntecedenciaMin = reactExports.useMemo(
    () => typeof configOnline.tempo_minimo_antecedencia === "number" && configOnline.tempo_minimo_antecedencia > 0 ? configOnline.tempo_minimo_antecedencia : 0,
    [configOnline.tempo_minimo_antecedencia]
  );
  const minDateTime = reactExports.useMemo(
    () => new Date(agora.getTime() + minAntecedenciaMin * 60 * 1e3),
    [agora, minAntecedenciaMin]
  );
  const dataMinima = reactExports.useMemo(
    () => minDateTime.toISOString().split("T")[0],
    [minDateTime]
  );
  const maxMinutos = reactExports.useMemo(
    () => typeof configOnline.tempo_maximo_antecedencia === "number" && configOnline.tempo_maximo_antecedencia > 0 ? configOnline.tempo_maximo_antecedencia : 90 * 24 * 60,
    [configOnline.tempo_maximo_antecedencia]
  );
  const dataMaxima = reactExports.useMemo(
    () => new Date(agora.getTime() + maxMinutos * 60 * 1e3).toISOString().split("T")[0],
    [agora, maxMinutos]
  );
  const steps = ["Dados", "Agendamento", "Finalização"];
  reactExports.useEffect(() => {
    carregarServicos();
    carregarProdutosPublicos();
  }, [carregarServicos, carregarProdutosPublicos]);
  reactExports.useEffect(() => {
    console.log("Configurações carregadas:", {
      total: configuracoes.length,
      loading: loadingHorarios,
      items: configuracoes
    });
  }, [configuracoes, loadingHorarios]);
  const carregarHorariosDisponiveis = reactExports.useCallback(async () => {
    if (!formData.servico_id || !formData.data) return;
    const servicoSelecionado2 = servicos.find((s) => s.id === formData.servico_id);
    if (!servicoSelecionado2) {
      console.warn("[booking] Serviço não encontrado:", formData.servico_id);
      return;
    }
    const dataSelecionada = /* @__PURE__ */ new Date(formData.data + "T00:00:00");
    const diaSemana = dataSelecionada.getDay();
    if (!loadingHorarios && configuracoes.length > 0 && !isDiaAtivo(diaSemana)) {
      console.log("[booking] Dia não ativo:", diaSemana);
      setHorariosDisponiveis([]);
      return;
    }
    try {
      console.log("[booking] Buscando horários:", formData.data, formData.servico_id);
      const result = await calcularHorariosDisponiveis(formData.servico_id, formData.data);
      if (!Array.isArray(result)) {
        console.warn("[booking] Resultado inválido:", result);
        setHorariosDisponiveis([]);
        return;
      }
      console.log("[booking] Horários encontrados:", result.length);
      const horariosFormatados = result.map((h) => {
        if (typeof h === "string") {
          return { horario: h, disponivel: true };
        }
        if (h && typeof h === "object" && "horario" in h) {
          return h;
        }
        return { horario: String(h), disponivel: false };
      });
      const isHoje = formData.data === agora.toISOString().split("T")[0];
      const horariosFiltrados = isHoje ? horariosFormatados.filter((h) => {
        const [hh, mm] = String(h.horario).slice(0, 5).split(":").map(Number);
        if (!Number.isFinite(hh) || !Number.isFinite(mm)) return false;
        const slot = new Date(agora);
        slot.setHours(hh, mm, 0, 0);
        return slot >= minDateTime;
      }) : horariosFormatados;
      setHorariosDisponiveis(horariosFiltrados);
    } catch (error) {
      console.error("[booking] Erro ao carregar horários:", error);
      setHorariosDisponiveis([]);
    }
  }, [formData.servico_id, formData.data, servicos, loadingHorarios, configuracoes.length, isDiaAtivo, calcularHorariosDisponiveis, minDateTime, agora]);
  reactExports.useEffect(() => {
    if (formData.servico_id && formData.data) {
      carregarHorariosDisponiveis();
      const channel = supabasePublic.channel("configuracoes_horarios_online").on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "configuracoes_horarios"
      }, () => {
        carregarHorariosDisponiveis();
      }).subscribe();
      return () => {
        supabasePublic.removeChannel(channel);
      };
    }
  }, [formData.servico_id, formData.data, carregarHorariosDisponiveis]);
  const formatarTelefone = (valor) => {
    const digits = valor.replace(/\D/g, "");
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };
  const handleInputChange = (field, value) => {
    if (field === "telefone") {
      value = formatarTelefone(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
  };
  const handleNextStep = () => {
    if (currentStep === 1) {
      const newErrors = {};
      if (!formData.nome_completo.trim()) newErrors.nome_completo = "Nome completo é obrigatório";
      if (!formData.email.trim()) {
        newErrors.email = "Email é obrigatório";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email inválido";
      }
      if (!formData.telefone.trim()) {
        newErrors.telefone = "Telefone é obrigatório";
      } else if (formData.telefone.replace(/\D/g, "").length < 8) {
        newErrors.telefone = "Telefone inválido (mínimo 8 dígitos)";
      }
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    if (currentStep === 2) {
      const newErrors = {};
      if (!formData.servico_id) newErrors.servico_id = "Selecione um serviço";
      if (!formData.data) newErrors.data = "Selecione uma data";
      if (!formData.horario) newErrors.horario = "Selecione um horário";
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      Jt.error("Você deve aceitar os termos e condições para continuar.");
      return;
    }
    if (configOnline.taxa_sinal_percentual > 0 && !taxaAccepted) {
      Jt.error("Você deve aceitar as condições da taxa antecipada para continuar.");
      return;
    }
    try {
      const validatedData = agendamentoOnlineSchema.parse(formData);
      const canSubmit = termsAccepted && (configOnline.taxa_sinal_percentual <= 0 || taxaAccepted);
      if (!canSubmit) {
        Jt.error("Você deve aceitar os termos e a taxa de sinal (se houver) para continuar.");
        return;
      }
      if (produtoEnabled && produtoId) {
        const pSel = produtos.find((p) => p.id === produtoId);
        const compra = {
          produto_id: produtoId,
          produto_nome: pSel?.nome || "",
          quantidade: produtoQtd,
          forma_pagamento_produto: produtoForma,
          valor_unitario: pSel?.valor || 0,
          valor_total: (pSel?.valor || 0) * produtoQtd
        };
        const prefix = validatedData.observacoes ? validatedData.observacoes + "\n" : "";
        const nextObs = `${prefix}Compra de produto: ${JSON.stringify(compra)}`;
        if (nextObs.length > 500) {
          Jt.error("As observações ficaram muito longas. Remova texto ou a compra do produto.");
          setIsSubmitting(false);
          return;
        }
        validatedData.observacoes = nextObs;
        const valorServico2 = servicos.find((s) => s.id === formData.servico_id)?.valor || 0;
        const valorTotal2 = valorServico2 + compra.valor_total;
        validatedData.valor = valorTotal2;
      }
      setIsSubmitting(true);
      const sucesso = await criarAgendamento(validatedData);
      if (sucesso) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
      setIsSubmitting(false);
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        const firstErrorMessage = error.issues[0]?.message || "Erro de validação";
        error.issues.forEach((err) => {
          const field = err.path[0];
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
        Jt.error(`Erro no formulário: ${firstErrorMessage}`);
      } else {
        Jt.error("Erro ao validar dados do formulário: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      }
      setIsSubmitting(false);
    }
  };
  const servicoSelecionado = servicos.find((s) => s.id === formData.servico_id);
  const produtoSelecionado = produtos.find((p) => p.id === produtoId);
  const valorServico = typeof servicoSelecionado?.valor === "number" && Number.isFinite(servicoSelecionado.valor) ? servicoSelecionado.valor : 0;
  const valorProdutoUnit = typeof produtoSelecionado?.valor === "number" && Number.isFinite(produtoSelecionado.valor) ? produtoSelecionado.valor : 0;
  const valorProdutoTotal = produtoEnabled && produtoId ? valorProdutoUnit * Math.max(1, produtoQtd || 1) : 0;
  const valorTotal = valorServico + valorProdutoTotal;
  const compartilharComprovante = async () => {
    const dataFormatada = new Date(formData.data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    const comprovanteTexto = `🎉 *AGENDAMENTO CONFIRMADO*

📋 *Detalhes do Agendamento:*
👤 Cliente: ${formData.nome_completo}
💇 Serviço: ${servicoSelecionado?.nome}
${produtoEnabled && produtoId ? `📦 Produto: ${produtoSelecionado?.nome} (${produtoQtd}x)
` : ""}
📅 Data: ${dataFormatada}
⏰ Horário: ${formData.horario}
💰 Valor Total: R$ ${valorTotal.toFixed(2).replace(".", ",")}

✅ Seu agendamento foi confirmado com sucesso!
Você receberá uma confirmação em breve.

📱 Guarde este comprovante para apresentar no dia do atendimento.`;
    await shareContent({
      title: "Comprovante de Agendamento",
      text: comprovanteTexto
    });
  };
  const copiarComprovante = async () => {
    const dataFormatada = new Date(formData.data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    const comprovanteTexto = `🎉 AGENDAMENTO CONFIRMADO

📋 Detalhes do Agendamento:
👤 Cliente: ${formData.nome_completo}
💇 Serviço: ${servicoSelecionado?.nome}
${produtoEnabled && produtoId ? `📦 Produto: ${produtoSelecionado?.nome} (${produtoQtd}x)
` : ""}
📅 Data: ${dataFormatada}
⏰ Horário: ${formData.horario}
💰 Valor Total: R$ ${valorTotal.toFixed(2).replace(".", ",")}

✅ Seu agendamento foi confirmado com sucesso!
Você receberá uma confirmação em breve.

📱 Guarde este comprovante para apresentar no dia do atendimento.`;
    await copyToClipboard(comprovanteTexto);
  };
  const isDataDisponivel = (data) => {
    if (!data) return false;
    const dataSelecionada = /* @__PURE__ */ new Date(data + "T00:00:00");
    const diaSemana = dataSelecionada.getDay();
    if (configuracoes.length === 0) return true;
    return isDiaAtivo(diaSemana);
  };
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen", style: { "--primary": primaryHsl }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SalonHeader, { config: configOnline }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md border-none shadow-[0_30px_60px_rgba(0,0,0,0.12)] bg-white/90 backdrop-blur-xl rounded-[3rem] overflow-hidden animate-in zoom-in duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary h-2 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center rotate-12 animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-12 h-12 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-3xl font-black text-primary tracking-tighter", children: "Agendamento Confirmado!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-base font-medium px-4", children: "Tudo pronto! Seu horário foi reservado com sucesso em nosso sistema." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 p-6 rounded-[2rem] border-2 border-primary/10 space-y-4 relative overflow-hidden group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-20 h-20 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "w-6 h-6 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-black text-muted-foreground tracking-widest", children: "Serviço" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg leading-tight", children: servicoSelecionado?.nome })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-3 rounded-2xl shadow-sm border border-primary/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-black text-muted-foreground tracking-widest", children: "Data" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: new Date(formData.data).toLocaleDateString("pt-BR") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white p-3 rounded-2xl shadow-sm border border-primary/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase font-black text-muted-foreground tracking-widest", children: "Horário" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: formData.horario })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-primary/10 flex flex-col gap-2 relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm font-medium text-muted-foreground/70 uppercase tracking-widest", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Serviço" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "R$ ",
                  valorServico.toFixed(2)
                ] })
              ] }),
              produtoEnabled && produtoId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-sm font-medium text-primary/70 uppercase tracking-widest animate-in fade-in slide-in-from-top-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Produto (",
                  produtoQtd,
                  "x)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "+ R$ ",
                  valorProdutoTotal.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-primary/5 my-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-foreground uppercase tracking-tighter", children: "Valor Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-black text-primary tracking-tighter", children: [
                  "R$ ",
                  valorTotal.toFixed(2)
                ] })
              ] })
            ] }),
            produtoEnabled && produtoId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 pt-4 border-t border-primary/10 animate-in fade-in slide-in-from-top-2 relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-black text-primary tracking-widest", children: "Produto Extra" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-muted-foreground bg-white/50 p-2 rounded-xl", children: (() => {
                return `${produtoSelecionado?.nome || "Produto"} • Qtd: ${produtoQtd}`;
              })() })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: compartilharComprovante,
                disabled: isSharing,
                className: "w-full h-14 rounded-2xl flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:translate-y-0 border-b-4 border-primary/50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-5 h-5" }),
                  isSharing ? "Compartilhando..." : "Enviar Comprovante"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: copiarComprovante,
                  variant: "outline",
                  className: "h-12 rounded-2xl flex items-center gap-2 border-primary/10 font-bold hover:bg-primary/5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4" }),
                    "Copiar"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => window.location.reload(),
                  variant: "ghost",
                  className: "h-12 rounded-2xl font-bold text-muted-foreground hover:text-primary",
                  children: "Novo Agendamento"
                }
              )
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SalonFooter, { config: configOnline })
    ] });
  }
  if (!configOnline.ativo && !loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen", style: { "--primary": primaryHsl }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SalonHeader, { config: configOnline }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md border-none shadow-[0_30px_60px_rgba(0,0,0,0.12)] bg-white/90 backdrop-blur-xl rounded-[3rem] overflow-hidden p-8 text-center space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-10 h-10 text-amber-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-black text-foreground tracking-tighter", children: "Agendamento Indisponível" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No momento, o agendamento online para este salão está temporariamente desativado." })
        ] }),
        configOnline.telefone && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            className: "w-full h-12 rounded-2xl bg-primary text-white font-bold",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: `tel:${configOnline.telefone.replace(/\D/g, "")}`, children: "Ligar para o Salão" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SalonFooter, { config: configOnline })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-h-screen", style: { "--primary": primaryHsl, "--ring": primaryHsl }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SalonHeader, { config: configOnline }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-gradient-to-b from-transparent to-primary/5 p-4 sm:p-6 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/5 p-6 sm:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressSteps, { currentStep, steps }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 sm:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { ref: formRef, onSubmit: handleSubmit, className: "space-y-8", children: [
        currentStep === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in slide-in-from-right-4 duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 border-b border-primary/10 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-foreground", children: "Seus Dados" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: configOnline.mensagem_boas_vindas || "Preencha os dados abaixo para agendar seu horário." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome_completo", className: "text-sm font-semibold group-focus-within:text-primary transition-colors", children: "Nome Completo *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "nome_completo",
                  value: formData.nome_completo,
                  onChange: (e) => handleInputChange("nome_completo", e.target.value),
                  placeholder: "Seu nome completo",
                  className: `h-12 rounded-xl border-primary/10 bg-white/50 focus:bg-white shadow-sm transition-all duration-300 ${errors.nome_completo ? "border-destructive ring-destructive/20" : "focus:shadow-md focus:ring-primary/20"}`
                }
              ),
              errors.nome_completo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1", children: errors.nome_completo })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-sm font-semibold group-focus-within:text-primary transition-colors", children: "Email *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  value: formData.email,
                  onChange: (e) => handleInputChange("email", e.target.value),
                  placeholder: "seu@email.com",
                  className: `h-12 rounded-xl border-primary/10 bg-white/50 focus:bg-white shadow-sm transition-all duration-300 ${errors.email ? "border-destructive ring-destructive/20" : "focus:shadow-md focus:ring-primary/20"}`
                }
              ),
              errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1", children: errors.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "telefone", className: "text-sm font-semibold group-focus-within:text-primary transition-colors", children: "Telefone *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "telefone",
                  value: formData.telefone,
                  onChange: (e) => handleInputChange("telefone", e.target.value),
                  placeholder: "(11) 99999-9999",
                  className: `h-12 rounded-xl border-primary/10 bg-white/50 focus:bg-white shadow-sm transition-all duration-300 ${errors.telefone ? "border-destructive ring-destructive/20" : "focus:shadow-md focus:ring-primary/20"}`
                }
              ),
              errors.telefone && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1", children: errors.telefone })
            ] })
          ] })
        ] }),
        currentStep === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in slide-in-from-right-4 duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 border-b border-primary/10 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-foreground", children: "Escolha o Serviço" })
          ] }) }),
          loading && servicos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-[140px] rounded-[2rem] border border-primary/10 bg-white/50 animate-pulse"
            },
            i
          )) }),
          !loading && servicos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "rounded-3xl border-primary/20 bg-primary/5 p-6 shadow-sm animate-in fade-in duration-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-foreground text-sm font-medium ml-2", children: servicosError?.includes("link") || servicosError?.includes("oficial") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black tracking-tight text-primary", children: "Salão não identificado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Para acessar a página de agendamento, você precisa utilizar o link oficial fornecido pelo estabelecimento." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/50 rounded-2xl border border-primary/10 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold mb-1 uppercase tracking-widest text-[10px]", children: "Dica para o proprietário:" }),
                "Certifique-se de compartilhar o link completo com seu ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-primary/10 px-1 rounded text-primary", children: "slug" }),
                " ou ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-primary/10 px-1 rounded text-primary", children: "ID" }),
                " único."
              ] }),
              false
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-black tracking-tight text-amber-600", children: "Serviços Indisponíveis" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No momento não há serviços disponíveis para agendamento online neste salão." }),
              servicosError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs opacity-60", children: [
                "Detalhes: ",
                servicosError
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: servicos.map((servico) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleInputChange("servico_id", servico.id),
              className: cn(
                "group relative flex flex-col p-5 rounded-[2rem] border-2 transition-all duration-300 text-left",
                formData.servico_id === servico.id ? "border-primary bg-primary/5 shadow-[0_10px_30px_rgba(var(--primary),0.2)] scale-[1.02] -translate-y-1 border-b-8 active:translate-y-0 active:border-b-2" : "border-primary/10 bg-white/50 hover:border-primary/30 hover:bg-white hover:-translate-y-1 hover:shadow-xl border-b-4 active:translate-y-0 active:border-b-2"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                    "p-3 rounded-2xl transition-all duration-500",
                    formData.servico_id === servico.id ? "bg-primary text-white shadow-lg rotate-12" : "bg-primary/10 text-primary group-hover:rotate-12"
                  ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "w-5 h-5" }) }),
                  formData.servico_id === servico.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary text-white p-1.5 rounded-full shadow-lg animate-in zoom-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 stroke-[3]" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-black text-lg text-foreground group-hover:text-primary transition-colors leading-tight", children: servico.nome }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-4", children: [
                  configOnline.mostrar_precos && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-black text-muted-foreground/50 tracking-tighter", children: "Preço" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-black text-xl tracking-tighter", children: [
                      "R$ ",
                      servico.valor.toFixed(2)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-8 bg-primary/10 mx-1" }),
                  configOnline.mostrar_duracao && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-black text-muted-foreground/50 tracking-tighter", children: "Duração" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-bold text-sm flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-3.5 h-3.5 text-primary/50" }),
                      servico.duracao,
                      " min"
                    ] })
                  ] })
                ] }),
                formData.servico_id === servico.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem] pointer-events-none" })
              ]
            },
            servico.id
          )) }),
          errors.servico_id && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive font-medium -mt-4 block", children: errors.servico_id }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pt-4 border-t border-primary/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-foreground", children: "Data e Horário" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-black flex items-center gap-2 uppercase tracking-widest text-primary/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" }),
                  "Selecione o Dia"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide -mx-4 sm:mx-0 sm:px-0", children: [
                  Array.from({ length: 14 }).map((_, i) => {
                    const d = /* @__PURE__ */ new Date();
                    d.setDate(d.getDate() + i);
                    const iso = d.toISOString().split("T")[0];
                    const diaSemana = d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
                    const diaMes = d.getDate();
                    const isAtivo = configuracoes.length === 0 ? true : isDiaAtivo(d.getDay());
                    const isSelected = formData.data === iso;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        disabled: !isAtivo,
                        onClick: () => handleInputChange("data", iso),
                        className: cn(
                          "flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-3xl transition-all duration-300 border-2",
                          !isAtivo ? "opacity-30 grayscale cursor-not-allowed border-transparent" : isSelected ? "bg-primary border-primary text-white shadow-lg shadow-primary/30 -translate-y-2 scale-110 border-b-8 active:translate-y-0 active:border-b-2" : "bg-white border-primary/10 text-foreground hover:border-primary/30 hover:-translate-y-1 border-b-4 active:translate-y-0 active:border-b-2"
                        ),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                            "text-[10px] font-black uppercase tracking-tighter mb-1",
                            isSelected ? "text-white/80" : "text-muted-foreground"
                          ), children: diaSemana }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-black", children: diaMes })
                        ]
                      },
                      iso
                    );
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-[70px] h-[90px]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "date",
                        min: dataMinima,
                        max: dataMaxima,
                        value: formData.data,
                        onChange: (e) => handleInputChange("data", e.target.value),
                        className: "absolute inset-0 opacity-0 cursor-pointer z-10"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full rounded-3xl border-2 border-dashed border-primary/30 text-primary/50 bg-primary/5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-5 h-5 mb-1" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase", children: "Mais" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-black flex items-center gap-2 uppercase tracking-widest text-primary/70", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
                  "Horários Disponíveis"
                ] }),
                !formData.servico_id || !formData.data ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-24 rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-muted-foreground p-4 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "w-6 h-6 mb-2 opacity-20" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-tight", children: "Escolha o serviço e a data primeiro" })
                ] }) : !isDataDisponivel(formData.data) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-24 rounded-[2rem] bg-destructive/5 border-2 border-destructive/10 flex flex-col items-center justify-center text-destructive p-4 text-center font-black uppercase tracking-tighter", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-6 h-6 mb-2" }),
                  "Salão fechado nesta data"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[280px] overflow-y-auto p-2 pr-3 custom-scrollbar", children: [
                  horariosDisponiveis.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      disabled: !h.disponivel,
                      onClick: () => handleInputChange("horario", h.horario),
                      className: cn(
                        "h-12 rounded-2xl text-sm font-black transition-all duration-300 border-2 flex items-center justify-center",
                        !h.disponivel ? "bg-muted/30 border-transparent text-muted-foreground/30 cursor-not-allowed grayscale" : formData.horario === h.horario ? "bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-105 -translate-y-1 border-b-4 active:translate-y-0 active:border-b-0" : "bg-white border-primary/10 text-foreground hover:border-primary/50 hover:bg-primary/5 hover:-translate-y-0.5 border-b-2 active:translate-y-0 active:border-b-0"
                      ),
                      children: h.horario
                    },
                    h.horario
                  )),
                  horariosDisponiveis.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full py-8 text-center text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-muted", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-8 h-8 mx-auto mb-2 opacity-20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black uppercase", children: "Sem horários para este dia" }),
                    horariosError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-[10px] font-bold opacity-70", children: horariosError })
                  ] })
                ] }),
                errors.horario && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive font-black uppercase tracking-tighter block mt-2 ml-1", children: errors.horario })
              ] })
            ] }),
            formData.data && !isDataDisponivel(formData.data) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "rounded-2xl border-amber-200 bg-amber-50 animate-in zoom-in-95 duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-amber-800 text-xs font-bold uppercase tracking-tight", children: "Este dia não atendemos. Por favor, escolha outra data." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "observacoes", className: "text-sm font-bold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4 text-primary" }),
                "Observações (opcional)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "observacoes",
                  value: formData.observacoes,
                  onChange: (e) => handleInputChange("observacoes", e.target.value),
                  placeholder: "Ex: Tenho alergia a algum produto, ou gostaria de um profissional específico.",
                  rows: 3,
                  className: "rounded-2xl border-primary/10 bg-white/50 shadow-sm focus:shadow-lg transition-all duration-300 resize-none"
                }
              )
            ] })
          ] })
        ] }),
        currentStep === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in slide-in-from-right-4 duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 rounded-2xl p-6 border border-primary/10 shadow-inner", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold flex items-center gap-2 mb-4 text-primary", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5" }),
              "Resumo do Agendamento"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Cliente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground truncate", children: formData.nome_completo })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Serviço" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground", children: servicoSelecionado?.nome })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Data e Horário" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-foreground", children: [
                  formData.data ? new Date(formData.data).toLocaleDateString("pt-BR") : "-",
                  " às ",
                  formData.horario
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Investimento" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-primary text-lg", children: [
                  "R$ ",
                  servicoSelecionado?.valor.toFixed(2)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/50 border border-primary/10 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-12 h-12 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xl font-black flex items-center gap-2 text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-6 h-6 text-primary" }),
                  "Produtos Extras"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-bold uppercase tracking-tighter", children: "Adicione itens ao seu agendamento" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  id: "produtoEnabled",
                  checked: produtoEnabled,
                  onCheckedChange: (checked) => setProdutoEnabled(!!checked),
                  className: "w-8 h-8 rounded-xl border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300 shadow-lg"
                }
              )
            ] }),
            produtoEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1 pr-3 custom-scrollbar", children: produtos.map((p) => {
                const isSelected = produtoId === p.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setProdutoId(isSelected ? "" : p.id),
                    className: cn(
                      "flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden",
                      isSelected ? "border-primary bg-primary/5 shadow-lg -translate-y-1 border-b-4 active:translate-y-0 active:border-b-0" : "border-primary/10 bg-white hover:border-primary/30 hover:-translate-y-1 border-b-2 active:translate-y-0 active:border-b-0"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
                          "p-2 rounded-xl",
                          isSelected ? "bg-primary text-white" : "bg-primary/5 text-primary"
                        ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4" }) }),
                        isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary text-white p-1 rounded-full animate-in zoom-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 stroke-[3]" }) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full aspect-video rounded-xl overflow-hidden mb-3 border border-primary/5 bg-primary/5 flex items-center justify-center", children: p.imagem_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: p.imagem_url,
                          alt: p.nome,
                          className: "w-full h-full object-cover"
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-8 h-8 text-primary/20" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm text-foreground line-clamp-1", children: p.nome }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-black text-lg mt-1", children: [
                        "R$ ",
                        Number(p.valor).toFixed(2)
                      ] }),
                      isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-[2rem] -mr-4 -mt-4 rotate-45" })
                    ]
                  },
                  p.id
                );
              }) }),
              produtoId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-300 bg-primary/5 p-4 rounded-2xl border border-primary/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-black text-primary uppercase ml-1", children: "Quantidade" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: 1,
                      value: produtoQtd,
                      onChange: (e) => setProdutoQtd(Math.max(1, Number(e.target.value))),
                      className: "h-12 rounded-xl border-primary/10 bg-white font-black text-center shadow-inner"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-black text-primary uppercase ml-1", children: "Pagamento" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: produtoForma, onValueChange: setProdutoForma, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-12 rounded-xl border-primary/10 bg-white font-black shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl shadow-2xl font-bold", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pix", children: "PIX" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cartao", children: "CARTÃO" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dinheiro", children: "DINHEIRO" })
                    ] })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            configOnline.taxa_sinal_percentual > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  id: "taxa",
                  checked: taxaAccepted,
                  onCheckedChange: (checked) => setTaxaAccepted(checked),
                  className: "mt-1 w-6 h-6 rounded-lg border-amber-300 data-[state=checked]:bg-amber-600"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "taxa", className: "text-sm leading-relaxed cursor-pointer text-amber-900 font-medium", children: [
                "Oi, tudo bem? 💙 Para garantir seu horário pedimos uma taxa antecipada de ",
                configOnline.taxa_sinal_percentual,
                "%. Esse valor é abatido no dia do atendimento. Não devolvemos em caso de cancelamento sem justificativa. *"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 px-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  id: "terms",
                  checked: termsAccepted,
                  onCheckedChange: (checked) => setTermsAccepted(checked),
                  className: "w-6 h-6 rounded-lg border-primary/20 mt-1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "terms", className: "text-sm text-muted-foreground font-medium cursor-pointer leading-relaxed", children: configOnline.termos_condicoes || "Aceito os termos e concordo em receber confirmações por WhatsApp *" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 pt-4", children: [
          currentStep > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handlePrevStep,
              className: "flex-1 h-14 rounded-2xl border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all shadow-sm active:scale-95",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5 mr-2" }),
                "Voltar"
              ]
            }
          ),
          currentStep < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: handleNextStep,
              className: "flex-1 h-14 rounded-2xl text-white font-bold shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-[1px] active:shadow-none",
              style: { background: primaryColor },
              children: [
                "Continuar",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: `flex-1 h-14 rounded-2xl font-bold shadow-lg transition-all active:translate-y-[1px] active:shadow-none ${isSubmitting || !termsAccepted || configOnline.taxa_sinal_percentual > 0 && !taxaAccepted ? "bg-muted cursor-not-allowed" : "text-white hover:shadow-xl hover:translate-y-[-2px]"}`,
              style: {
                background: !isSubmitting && termsAccepted && (configOnline.taxa_sinal_percentual <= 0 || taxaAccepted) ? `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` : void 0
              },
              disabled: isSubmitting || !termsAccepted || configOnline.taxa_sinal_percentual > 0 && !taxaAccepted,
              children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
                "Processando..."
              ] }) : "Confirmar Agendamento"
            }
          )
        ] })
      ] }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SalonFooter, { config: configOnline })
  ] });
}

export { AgendamentoOnlineForm };
