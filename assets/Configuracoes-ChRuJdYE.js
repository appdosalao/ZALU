import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { s as supabase, J as Jt, C as Card, e as CardContent, c as CardHeader, d as CardTitle, f as CardDescription, B as Badge, j as Input, g as Button, h as cn, P as useSupabaseConfiguracoes, Q as usePushNotifications, v as Separator, b as useAuth, G as Alert, H as AlertDescription, t as useConfigAgendamentoOnline, u as useSearchParams, a as useNavigate, R as usePaidAccess } from './index-U74ij7JC.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-CjCc2DlV.js';
import { S as ScrollArea, a as ScrollBar } from './scroll-area-BG3HujHg.js';
import { L as Label } from './label-C0AJeojg.js';
import { S as Switch } from './switch-CkSMWSBt.js';
import { Q as Clock, K as Calendar, aL as CircleAlert, ar as Save, u as useControllableState, c as createContextScope, g as createCollection, b as composeEventHandlers, P as Primitive, e as useComposedRefs, h as useDirection, aZ as useSize, a8 as Bell, a0 as Settings, o as Smartphone, ay as Mail, a_ as Volume2, ac as TriangleAlert, D as Download, a$ as FileJson, at as FileText, ad as Database, b0 as Send, b1 as Upload, b2 as File, aP as CircleCheck, m as LoaderCircle, b3 as Store, b4 as Palette, b5 as Image, X, b6 as PanelsTopLeft, ax as Phone, a2 as Instagram, aB as Eye, L as Lock, b7 as Crown, l as Check, k as CreditCard, R as RefreshCw } from './ui-libs-B5Rrhu1L.js';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-Ce9M_rda.js';
import { c as clamp } from './index-BfAAoDv6.js';
import { u as usePrevious } from './index-Ls-C4DWD.js';
import { T as Textarea } from './textarea-D9C69N9T.js';
import { u as useForm, o as object, s as string } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import './chart-libs-Cdz70zdY.js';

const DIAS_SEMANA = [
  { id: 0, nome: "Domingo", abrev: "DOM" },
  { id: 1, nome: "Segunda-feira", abrev: "SEG" },
  { id: 2, nome: "Terça-feira", abrev: "TER" },
  { id: 3, nome: "Quarta-feira", abrev: "QUA" },
  { id: 4, nome: "Quinta-feira", abrev: "QUI" },
  { id: 5, nome: "Sexta-feira", abrev: "SEX" },
  { id: 6, nome: "Sábado", abrev: "SAB" }
];
function ConfiguracaoHorarios() {
  const [configs, setConfigs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const configsPadrao = DIAS_SEMANA.map((dia) => ({
      dia_semana: dia.id,
      ativo: dia.id >= 1 && dia.id <= 5,
      // Segunda a sexta ativo por padrão
      horario_abertura: "08:00",
      horario_fechamento: "18:00",
      intervalo_inicio: "12:00",
      intervalo_fim: "13:00"
    }));
    setConfigs(configsPadrao);
    carregarConfiguracoes();
  }, []);
  const carregarConfiguracoes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("configuracoes_horarios").select("*").eq("user_id", user.id);
      if (error) throw error;
      if (data && data.length > 0) {
        const configsCarregadas = DIAS_SEMANA.map((dia) => {
          const configDb = data.find((c) => c.dia_semana === dia.id);
          return configDb ? {
            id: configDb.id,
            dia_semana: dia.id,
            ativo: configDb.ativo,
            horario_abertura: configDb.horario_abertura,
            horario_fechamento: configDb.horario_fechamento,
            intervalo_inicio: configDb.intervalo_inicio || "12:00",
            intervalo_fim: configDb.intervalo_fim || "13:00"
          } : {
            dia_semana: dia.id,
            ativo: dia.id >= 1 && dia.id <= 5,
            horario_abertura: "08:00",
            horario_fechamento: "18:00",
            intervalo_inicio: "12:00",
            intervalo_fim: "13:00"
          };
        });
        setConfigs(configsCarregadas);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      Jt.error("Erro ao carregar configurações de horário");
    } finally {
      setLoading(false);
    }
  };
  const salvarConfiguracao = async (diaId) => {
    const config = configs.find((c) => c.dia_semana === diaId);
    if (!config) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const configData = {
        user_id: user.id,
        dia_semana: config.dia_semana,
        ativo: config.ativo,
        horario_abertura: config.horario_abertura,
        horario_fechamento: config.horario_fechamento,
        intervalo_inicio: config.intervalo_inicio,
        intervalo_fim: config.intervalo_fim
      };
      if (config.id) {
        const { error } = await supabase.from("configuracoes_horarios").update(configData).eq("id", config.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("configuracoes_horarios").insert(configData).select().single();
        if (error) throw error;
        setConfigs((prev) => prev.map(
          (c) => c.dia_semana === diaId ? { ...c, id: data.id } : c
        ));
      }
      Jt.success(`Horário de ${DIAS_SEMANA[diaId].nome} salvo com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      Jt.error("Erro ao salvar configuração");
    } finally {
      setSaving(false);
    }
  };
  const updateConfig = (diaId, field, value) => {
    setConfigs((prev) => prev.map(
      (config) => config.dia_semana === diaId ? { ...config, [field]: value } : config
    ));
  };
  const diasAtivos = configs.filter((c) => c.ativo);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Carregando configurações..." }) }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }),
        "Configuração de Horários de Trabalho"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure os dias e horários em que você atende clientes" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5" }),
          "Resumo dos Dias de Atendimento"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Visão geral dos dias em que você atenderá clientes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: DIAS_SEMANA.map((dia) => {
          const config = configs.find((c) => c.dia_semana === dia.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: config?.ativo ? "default" : "secondary", children: [
            dia.abrev,
            " ",
            config?.ativo ? `(${config.horario_abertura}-${config.horario_fechamento})` : "(Fechado)"
          ] }, dia.id);
        }) }),
        diasAtivos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-amber-700 dark:text-amber-300", children: "Nenhum dia de atendimento configurado. Configure pelo menos um dia para receber agendamentos." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: diasAtivos.length > 0 ? `${diasAtivos.length} ${diasAtivos.length === 1 ? "dia configurado" : "dias configurados"} para atendimento` : "Configure os dias e horários de atendimento abaixo" })
      ] })
    ] }),
    DIAS_SEMANA.map((dia) => {
      const config = configs.find((c) => c.dia_semana === dia.id);
      if (!config) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }),
              dia.nome
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: config.ativo,
                  onCheckedChange: (checked) => updateConfig(dia.id, "ativo", checked)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: config.ativo ? "default" : "secondary", children: config.ativo ? "Ativo" : "Inativo" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "Configure os horários de funcionamento para ",
            dia.nome.toLowerCase()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          config.ativo && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium mb-2 block", children: "Horário de Funcionamento" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `abertura-${dia.id}`, className: "text-xs", children: "Abertura" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `abertura-${dia.id}`,
                      type: "time",
                      value: config.horario_abertura,
                      onChange: (e) => updateConfig(dia.id, "horario_abertura", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `fechamento-${dia.id}`, className: "text-xs", children: "Fechamento" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `fechamento-${dia.id}`,
                      type: "time",
                      value: config.horario_fechamento,
                      onChange: (e) => updateConfig(dia.id, "horario_fechamento", e.target.value)
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium mb-2 block", children: "Intervalo de Almoço (Opcional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `intervalo-inicio-${dia.id}`, className: "text-xs", children: "Início do Almoço" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `intervalo-inicio-${dia.id}`,
                      type: "time",
                      value: config.intervalo_inicio || "",
                      onChange: (e) => updateConfig(dia.id, "intervalo_inicio", e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: `intervalo-fim-${dia.id}`, className: "text-xs", children: "Fim do Almoço" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: `intervalo-fim-${dia.id}`,
                      type: "time",
                      value: config.intervalo_fim || "",
                      onChange: (e) => updateConfig(dia.id, "intervalo_fim", e.target.value)
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/50 p-3 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Funcionamento:" }),
              " ",
              config.horario_abertura,
              " às ",
              config.horario_fechamento,
              config.intervalo_inicio && config.intervalo_fim && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                " (Almoço: ",
                config.intervalo_inicio,
                " às ",
                config.intervalo_fim,
                ")"
              ] })
            ] }) })
          ] }),
          !config.ativo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-8 w-8 mx-auto mb-2 opacity-50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Este dia está desativado para atendimento" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "w-full",
              variant: "outline",
              onClick: () => salvarConfiguracao(dia.id),
              disabled: saving,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
                saving ? "Salvando..." : `Salvar ${dia.nome}`
              ]
            }
          )
        ] })
      ] }, dia.id);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-green-900 dark:text-green-100 mb-2", children: "✅ Configuração Funcional" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-green-700 dark:text-green-300 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Configure os dias e horários de atendimento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Os horários são salvos automaticamente no banco de dados" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Os agendamentos respeitarão essas configurações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Use o switch para ativar/desativar dias específicos" })
      ] })
    ] }) })
  ] });
}

var PAGE_KEYS = ["PageUp", "PageDown"];
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var BACK_KEYS = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
};
var SLIDER_NAME = "Slider";
var [Collection, useCollection, createCollectionScope] = createCollection(SLIDER_NAME);
var [createSliderContext] = createContextScope(SLIDER_NAME, [
  createCollectionScope
]);
var [SliderProvider, useSliderContext] = createSliderContext(SLIDER_NAME);
var Slider$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      name,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {
      },
      onValueCommit = () => {
      },
      inverted = false,
      form,
      ...sliderProps
    } = props;
    const thumbRefs = reactExports.useRef(/* @__PURE__ */ new Set());
    const valueIndexToChangeRef = reactExports.useRef(0);
    const isHorizontal = orientation === "horizontal";
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;
    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value2) => {
        const thumbs = [...thumbRefs.current];
        thumbs[valueIndexToChangeRef.current]?.focus();
        onValueChange(value2);
      }
    });
    const valuesBeforeSlideStartRef = reactExports.useRef(values);
    function handleSlideStart(value2) {
      const closestIndex = getClosestValueIndex(values, value2);
      updateValues(value2, closestIndex);
    }
    function handleSlideMove(value2) {
      updateValues(value2, valueIndexToChangeRef.current);
    }
    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }
    function updateValues(value2, atIndex, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value2 - min) / step) * step + min, decimalCount);
      const nextValue = clamp(snapToStep, [min, max]);
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          const hasChanged = String(nextValues) !== String(prevValues);
          if (hasChanged && commit) onValueCommit(nextValues);
          return hasChanged ? nextValues : prevValues;
        } else {
          return prevValues;
        }
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderProvider,
      {
        scope: props.__scopeSlider,
        name,
        disabled,
        min,
        max,
        valueIndexToChangeRef,
        thumbs: thumbRefs.current,
        values,
        orientation,
        form,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderOrientation,
          {
            "aria-disabled": disabled,
            "data-disabled": disabled ? "" : void 0,
            ...sliderProps,
            ref: forwardedRef,
            onPointerDown: composeEventHandlers(sliderProps.onPointerDown, () => {
              if (!disabled) valuesBeforeSlideStartRef.current = values;
            }),
            min,
            max,
            inverted,
            onSlideStart: disabled ? void 0 : handleSlideStart,
            onSlideMove: disabled ? void 0 : handleSlideMove,
            onSlideEnd: disabled ? void 0 : handleSlideEnd,
            onHomeKeyDown: () => !disabled && updateValues(min, 0, { commit: true }),
            onEndKeyDown: () => !disabled && updateValues(max, values.length - 1, { commit: true }),
            onStepKeyDown: ({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key);
                const isSkipKey = isPageKey || event.shiftKey && ARROW_KEYS.includes(event.key);
                const multiplier = isSkipKey ? 10 : 1;
                const atIndex = valueIndexToChangeRef.current;
                const value2 = values[atIndex];
                const stepInDirection = step * multiplier * stepDirection;
                updateValues(value2 + stepInDirection, atIndex, { commit: true });
              }
            }
          }
        ) }) })
      }
    );
  }
);
Slider$1.displayName = SLIDER_NAME;
var [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext(SLIDER_NAME, {
  startEdge: "left",
  endEdge: "right",
  size: "width",
  direction: 1
});
var SliderHorizontal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      dir,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = reactExports.useRef();
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const isSlidingFromLeft = isDirectionLTR && !inverted || !isDirectionLTR && inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || slider.getBoundingClientRect();
      const input = [0, rect.width];
      const output = isSlidingFromLeft ? [min, max] : [max, min];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromLeft ? "left" : "right",
        endEdge: isSlidingFromLeft ? "right" : "left",
        direction: isSlidingFromLeft ? 1 : -1,
        size: "width",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            dir: direction,
            "data-orientation": "horizontal",
            ...sliderProps,
            ref: composedRefs,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateX(-50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideStart?.(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideMove?.(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd?.();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromLeft ? "from-left" : "from-right";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderVertical = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const sliderRef = reactExports.useRef(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rectRef = reactExports.useRef();
    const isSlidingFromBottom = !inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || sliderRef.current.getBoundingClientRect();
      const input = [0, rect.height];
      const output = isSlidingFromBottom ? [max, min] : [min, max];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.top);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromBottom ? "bottom" : "top",
        endEdge: isSlidingFromBottom ? "top" : "bottom",
        size: "height",
        direction: isSlidingFromBottom ? 1 : -1,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            "data-orientation": "vertical",
            ...sliderProps,
            ref,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateY(50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideStart?.(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideMove?.(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd?.();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromBottom ? "from-bottom" : "from-top";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown?.({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const context = useSliderContext(SLIDER_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        ...sliderProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Home") {
            onHomeKeyDown(event);
            event.preventDefault();
          } else if (event.key === "End") {
            onEndKeyDown(event);
            event.preventDefault();
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            onStepKeyDown(event);
            event.preventDefault();
          }
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target;
          target.setPointerCapture(event.pointerId);
          event.preventDefault();
          if (context.thumbs.has(target)) {
            target.focus();
          } else {
            onSlideStart(event);
          }
        }),
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
            onSlideEnd(event);
          }
        })
      }
    );
  }
);
var TRACK_NAME = "SliderTrack";
var SliderTrack = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props;
    const context = useSliderContext(TRACK_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-disabled": context.disabled ? "" : void 0,
        "data-orientation": context.orientation,
        ...trackProps,
        ref: forwardedRef
      }
    );
  }
);
SliderTrack.displayName = TRACK_NAME;
var RANGE_NAME = "SliderRange";
var SliderRange = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map(
      (value) => convertValueToPercentage(value, context.min, context.max)
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-orientation": context.orientation,
        "data-disabled": context.disabled ? "" : void 0,
        ...rangeProps,
        ref: composedRefs,
        style: {
          ...props.style,
          [orientation.startEdge]: offsetStart + "%",
          [orientation.endEdge]: offsetEnd + "%"
        }
      }
    );
  }
);
SliderRange.displayName = RANGE_NAME;
var THUMB_NAME = "SliderThumb";
var SliderThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index = reactExports.useMemo(
      () => thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1,
      [getItems, thumb]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumbImpl, { ...props, ref: composedRefs, index });
  }
);
var SliderThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, index, name, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const isFormControl = thumb ? context.form || !!thumb.closest("form") : true;
    const size = useSize(thumb);
    const value = context.values[index];
    const percent = value === void 0 ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const orientationSize = size?.[orientation.size];
    const thumbInBoundsOffset = orientationSize ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction) : 0;
    reactExports.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive.span,
            {
              role: "slider",
              "aria-label": props["aria-label"] || label,
              "aria-valuemin": context.min,
              "aria-valuenow": value,
              "aria-valuemax": context.max,
              "aria-orientation": context.orientation,
              "data-orientation": context.orientation,
              "data-disabled": context.disabled ? "" : void 0,
              tabIndex: context.disabled ? void 0 : 0,
              ...thumbProps,
              ref: composedRefs,
              style: value === void 0 ? { display: "none" } : props.style,
              onFocus: composeEventHandlers(props.onFocus, () => {
                context.valueIndexToChangeRef.current = index;
              })
            }
          ) }),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            BubbleInput,
            {
              name: name ?? (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : void 0),
              form: context.form,
              value
            },
            index
          )
        ]
      }
    );
  }
);
SliderThumb.displayName = THUMB_NAME;
var BubbleInput = (props) => {
  const { value, ...inputProps } = props;
  const ref = reactExports.useRef(null);
  const prevValue = usePrevious(value);
  reactExports.useEffect(() => {
    const input = ref.current;
    const inputProto = window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
    const setValue = descriptor.set;
    if (prevValue !== value && setValue) {
      const event = new Event("input", { bubbles: true });
      setValue.call(input, value);
      input.dispatchEvent(event);
    }
  }, [prevValue, value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("input", { style: { display: "none" }, ...inputProps, ref, defaultValue: value });
};
function getNextSortedValues(prevValues = [], nextValue, atIndex) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}
function convertValueToPercentage(value, min, max) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return clamp(percentage, [0, 100]);
}
function getLabel(index, totalValues) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`;
  } else if (totalValues === 2) {
    return ["Minimum", "Maximum"][index];
  } else {
    return void 0;
  }
}
function getClosestValueIndex(values, nextValue) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}
function getThumbInBoundsOffset(width, left, direction) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}
function getStepsBetweenValues(values) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function getDecimalCount(value) {
  return (String(value).split(".")[1] || "").length;
}
function roundValue(value, decimalCount) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}
var Root = Slider$1;
var Track = SliderTrack;
var Range = SliderRange;
var Thumb = SliderThumb;

const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Root,
  {
    ref,
    className: cn(
      "relative flex w-full touch-none select-none items-center",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Thumb, { className: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Root.displayName;

const DEFAULTS = ["Mensagem de Texto 1.mp3", "Mensagem de Texto 2.mp3", "Mensagem de Texto 3.mp3"];
const CUSTOM_STORAGE_KEY = "custom-sound-library";
function useSoundLibrary() {
  const [sounds, setSounds] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const fileToUrl = reactExports.useCallback((filename) => {
    return `/sounds/${encodeURIComponent(filename)}`;
  }, []);
  const addUnique = (items) => {
    setSounds((prev) => {
      const map = /* @__PURE__ */ new Map();
      [...prev, ...items].forEach((i) => map.set(i.name, i));
      return Array.from(map.values());
    });
  };
  const loadManifest = reactExports.useCallback(async () => {
    const manifest = "/sounds/sounds.json";
    try {
      const res = await fetch(manifest, { cache: "no-cache" });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          const items = list.filter((n) => typeof n === "string" && (n.toLowerCase().endsWith(".mp3") || n.toLowerCase().endsWith(".wav"))).map((n) => ({ name: n, src: fileToUrl(n) }));
          addUnique(items);
        }
      }
    } catch {
    }
  }, [fileToUrl]);
  const loadDefaults = reactExports.useCallback(() => {
    addUnique(DEFAULTS.map((n) => ({ name: n, src: fileToUrl(n) })));
  }, [fileToUrl]);
  const loadCustomStorage = reactExports.useCallback(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw);
        addUnique(list.map((n) => ({ name: n, src: fileToUrl(n) })));
      }
    } catch {
    }
  }, [fileToUrl]);
  reactExports.useEffect(() => {
    (async () => {
      setLoading(true);
      loadDefaults();
      loadCustomStorage();
      await loadManifest();
      setLoading(false);
    })();
  }, [loadDefaults, loadCustomStorage, loadManifest]);
  const addIfExists = reactExports.useCallback(async (filename) => {
    const clean = filename.trim();
    if (!clean) return false;
    const url = fileToUrl(clean);
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        addUnique([{ name: clean, src: url }]);
        try {
          const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
          const list = raw ? JSON.parse(raw) : [];
          if (!list.includes(clean)) {
            list.push(clean);
            localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(list));
          }
        } catch {
        }
        return true;
      }
    } catch {
    }
    return false;
  }, [fileToUrl]);
  const reload = reactExports.useCallback(async () => {
    setLoading(true);
    setSounds([]);
    loadDefaults();
    loadCustomStorage();
    await loadManifest();
    setLoading(false);
  }, [loadDefaults, loadCustomStorage, loadManifest]);
  return { sounds, loading, addIfExists, reload };
}

function ConfiguracaoNotificacoesAvancadas() {
  const { configuracaoNotificacoes, loading, salvarNotificacoes } = useSupabaseConfiguracoes();
  const {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe,
    sendTestNotification,
    isLoading: pushLoading
  } = usePushNotifications();
  const { sounds, loading: soundsLoading, addIfExists, reload } = useSoundLibrary();
  const [localConfig, setLocalConfig] = reactExports.useState({
    notificacoes_push: true,
    notificacoes_email: true,
    notificacoes_som: true,
    som_personalizado: "Mensagem de Texto 1.mp3",
    lembrete_agendamento_minutos: 60,
    lembrete_vencimento_dias: 3,
    lembrete_contas_fixas_dias: 7,
    notificar_cancelamentos: true,
    notificar_reagendamentos: true,
    notificar_pagamentos: true,
    notificar_novos_agendamentos: true,
    horario_inicio_notificacoes: "08:00",
    horario_fim_notificacoes: "20:00"
  });
  reactExports.useEffect(() => {
    if (configuracaoNotificacoes) {
      setLocalConfig({
        notificacoes_push: configuracaoNotificacoes.notificacoes_push,
        notificacoes_email: configuracaoNotificacoes.notificacoes_email,
        notificacoes_som: configuracaoNotificacoes.notificacoes_som,
        som_personalizado: configuracaoNotificacoes.som_personalizado || "Mensagem de Texto 1.mp3",
        lembrete_agendamento_minutos: configuracaoNotificacoes.lembrete_agendamento_minutos,
        lembrete_vencimento_dias: configuracaoNotificacoes.lembrete_vencimento_dias,
        lembrete_contas_fixas_dias: configuracaoNotificacoes.lembrete_contas_fixas_dias,
        notificar_cancelamentos: configuracaoNotificacoes.notificar_cancelamentos,
        notificar_reagendamentos: configuracaoNotificacoes.notificar_reagendamentos,
        notificar_pagamentos: configuracaoNotificacoes.notificar_pagamentos,
        notificar_novos_agendamentos: configuracaoNotificacoes.notificar_novos_agendamentos,
        horario_inicio_notificacoes: configuracaoNotificacoes.horario_inicio_notificacoes,
        horario_fim_notificacoes: configuracaoNotificacoes.horario_fim_notificacoes
      });
    }
  }, [configuracaoNotificacoes]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: "Carregando configurações de notificações..." }) }) });
  }
  const handleSave = async () => {
    try {
      await salvarNotificacoes(localConfig);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };
  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
      setLocalConfig((prev) => ({ ...prev, notificacoes_push: false }));
    } else {
      const success = await subscribe();
      if (success) {
        setLocalConfig((prev) => ({ ...prev, notificacoes_push: true }));
      }
    }
  };
  const playTestSound = () => {
    try {
      const audio = new Audio(`/sounds/${encodeURIComponent(localConfig.som_personalizado)}`);
      audio.play().catch((error) => {
        console.log("Erro ao reproduzir som:", error);
        Jt.error("Não foi possível reproduzir o som selecionado");
      });
    } catch (error) {
      console.log("Erro ao criar áudio:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
        "Status das Notificações"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: localConfig.notificacoes_push ? "default" : "secondary", children: [
            "Push ",
            localConfig.notificacoes_push ? "Ativo" : "Inativo"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: localConfig.notificacoes_email ? "default" : "secondary", children: [
            "Email ",
            localConfig.notificacoes_email ? "Ativo" : "Inativo"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: localConfig.notificacoes_som ? "default" : "secondary", children: [
            "Som ",
            localConfig.notificacoes_som ? "Ativo" : "Inativo"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleSave, className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
          "Salvar Todas as Configurações"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5" }),
        "Configurações Principais"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-medium", children: "Notificações Push" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Receba notificações no celular mesmo com o app fechado" }),
              !isSupported && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-orange-600", children: "Não suportado neste navegador" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: isSubscribed && localConfig.notificacoes_push,
              onCheckedChange: handlePushToggle,
              disabled: !isSupported || pushLoading
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-medium", children: "Notificações por Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Receba resumos e alertas importantes por email" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: localConfig.notificacoes_email,
              onCheckedChange: (checked) => setLocalConfig((prev) => ({ ...prev, notificacoes_email: checked }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-medium", children: "Notificações Sonoras" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Reproduzir som ao receber notificações" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: localConfig.notificacoes_som,
                onCheckedChange: (checked) => setLocalConfig((prev) => ({ ...prev, notificacoes_som: checked }))
              }
            )
          ] }),
          localConfig.notificacoes_som && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "som-select", children: "Som das Notificações" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: localConfig.som_personalizado,
                  onValueChange: (value) => setLocalConfig((prev) => ({ ...prev, som_personalizado: value })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: soundsLoading ? "Carregando sons..." : "Selecione um som" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: sounds.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.name, children: s.name }, s.name)) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: playTestSound, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "som-custom", children: "Arquivo personalizado em /sounds" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "som-custom",
                  placeholder: "ex.: meu_som.mp3",
                  value: localConfig.som_personalizado,
                  onChange: (e) => setLocalConfig((prev) => ({ ...prev, som_personalizado: e.target.value }))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: async () => {
                      const ok = await addIfExists(localConfig.som_personalizado);
                      if (ok) {
                        Jt.success("Som adicionado à biblioteca");
                        await reload();
                      } else {
                        Jt.error("Arquivo não encontrado em /sounds ou /sunds");
                      }
                    },
                    children: "Adicionar à lista"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: reload, children: "Recarregar sons" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }),
        "Horários de Notificação"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "inicio-notif", children: "Horário de Início" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "inicio-notif",
                type: "time",
                value: localConfig.horario_inicio_notificacoes,
                onChange: (e) => setLocalConfig((prev) => ({ ...prev, horario_inicio_notificacoes: e.target.value }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fim-notif", children: "Horário de Fim" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "fim-notif",
                type: "time",
                value: localConfig.horario_fim_notificacoes,
                onChange: (e) => setLocalConfig((prev) => ({ ...prev, horario_fim_notificacoes: e.target.value }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/50 p-3 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Período ativo:" }),
          " ",
          localConfig.horario_inicio_notificacoes,
          " às ",
          localConfig.horario_fim_notificacoes,
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Notificações fora deste horário serão silenciadas" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
        "Tipos de Notificação"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "novos-agend", children: "Novos Agendamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "novos-agend",
              checked: localConfig.notificar_novos_agendamentos,
              onCheckedChange: (checked) => setLocalConfig((prev) => ({ ...prev, notificar_novos_agendamentos: checked }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cancelamentos", children: "Cancelamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "cancelamentos",
              checked: localConfig.notificar_cancelamentos,
              onCheckedChange: (checked) => setLocalConfig((prev) => ({ ...prev, notificar_cancelamentos: checked }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reagendamentos", children: "Reagendamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "reagendamentos",
              checked: localConfig.notificar_reagendamentos,
              onCheckedChange: (checked) => setLocalConfig((prev) => ({ ...prev, notificar_reagendamentos: checked }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 border rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pagamentos", children: "Pagamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "pagamentos",
              checked: localConfig.notificar_pagamentos,
              onCheckedChange: (checked) => setLocalConfig((prev) => ({ ...prev, notificar_pagamentos: checked }))
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5" }),
        "Lembretes e Alertas"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-medium", children: "Lembrete de Agendamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm", children: [
              "Antecedência: ",
              localConfig.lembrete_agendamento_minutos,
              " minutos"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                value: [localConfig.lembrete_agendamento_minutos],
                onValueChange: ([value]) => setLocalConfig((prev) => ({ ...prev, lembrete_agendamento_minutos: value })),
                max: 480,
                min: 5,
                step: 5,
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "5 min" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "8 horas" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-medium", children: "Lembrete de Vencimentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm", children: [
              "Antecedência: ",
              localConfig.lembrete_vencimento_dias,
              " dias"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                value: [localConfig.lembrete_vencimento_dias],
                onValueChange: ([value]) => setLocalConfig((prev) => ({ ...prev, lembrete_vencimento_dias: value })),
                max: 30,
                min: 1,
                step: 1,
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1 dia" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "30 dias" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-medium", children: "Lembrete de Contas Fixas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm", children: [
              "Antecedência: ",
              localConfig.lembrete_contas_fixas_dias,
              " dias"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                value: [localConfig.lembrete_contas_fixas_dias],
                onValueChange: ([value]) => setLocalConfig((prev) => ({ ...prev, lembrete_contas_fixas_dias: value })),
                max: 30,
                min: 1,
                step: 1,
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1 dia" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "30 dias" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    isSubscribed && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Teste de Notificações" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: sendTestNotification,
            className: "w-full",
            disabled: pushLoading,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 mr-2" }),
              "Enviar Notificação de Teste"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: playTestSound,
            className: "w-full",
            disabled: !localConfig.notificacoes_som,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4 mr-2" }),
              "Testar Som da Notificação"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "💡 Sobre as Notificações" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-sm text-blue-700 dark:text-blue-300 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Notificações push funcionam apenas em HTTPS ou localhost" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Configure horários para evitar notificações em períodos de descanso" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Lembretes ajudam a não esquecer de agendamentos e vencimentos importantes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Todas as configurações são salvas automaticamente" })
      ] })
    ] }) })
  ] });
}

const FORMATOS_EXPORT = [
  { value: "json", label: "JSON", icon: FileJson, description: "Formato legível e universal" },
  { value: "csv", label: "CSV", icon: FileText, description: "Para Excel e planilhas" },
  { value: "sql", label: "SQL", icon: Database, description: "Script de restauração" }
];
function ConfiguracaoBackup() {
  const { configuracaoBackup, loading, salvarBackup } = useSupabaseConfiguracoes();
  const { user } = useAuth();
  const [realizandoBackup, setRealizandoBackup] = reactExports.useState(false);
  const [enviandoEmail, setEnviandoEmail] = reactExports.useState(false);
  const [importando, setImportando] = reactExports.useState(false);
  const [formatoExport, setFormatoExport] = reactExports.useState("json");
  const [localConfig, setLocalConfig] = reactExports.useState({
    incluir_clientes: true,
    incluir_agendamentos: true,
    incluir_servicos: true,
    incluir_financeiro: true,
    incluir_cronogramas: true,
    backup_automatico: false,
    frequencia_backup: "semanal",
    dia_backup: 1,
    hora_backup: "02:00",
    email_backup: ""
  });
  reactExports.useEffect(() => {
    if (configuracaoBackup) {
      setLocalConfig({
        incluir_clientes: configuracaoBackup.incluir_clientes,
        incluir_agendamentos: configuracaoBackup.incluir_agendamentos,
        incluir_servicos: configuracaoBackup.incluir_servicos,
        incluir_financeiro: configuracaoBackup.incluir_financeiro,
        incluir_cronogramas: configuracaoBackup.incluir_cronogramas,
        backup_automatico: configuracaoBackup.backup_automatico,
        frequencia_backup: configuracaoBackup.frequencia_backup,
        dia_backup: configuracaoBackup.dia_backup || 1,
        hora_backup: configuracaoBackup.hora_backup,
        email_backup: configuracaoBackup.email_backup || ""
      });
    }
  }, [configuracaoBackup]);
  const coletarDados = async () => {
    if (!user?.id) {
      throw new Error("Usuário não autenticado");
    }
    const dadosBackup = {
      exportadoEm: (/* @__PURE__ */ new Date()).toISOString(),
      usuario: user.email,
      userId: user.id,
      versao: "1.0",
      dados: {},
      estatisticas: {}
    };
    if (localConfig.incluir_clientes) {
      const { data: clientes } = await supabase.from("clientes").select("*").eq("user_id", user.id);
      dadosBackup.dados.clientes = clientes || [];
      dadosBackup.estatisticas.totalClientes = clientes?.length || 0;
    }
    if (localConfig.incluir_servicos) {
      const { data: servicos } = await supabase.from("servicos").select("*").eq("user_id", user.id);
      dadosBackup.dados.servicos = servicos || [];
      dadosBackup.estatisticas.totalServicos = servicos?.length || 0;
    }
    if (localConfig.incluir_agendamentos) {
      const { data: agendamentos } = await supabase.from("agendamentos").select("*").eq("user_id", user.id);
      dadosBackup.dados.agendamentos = agendamentos || [];
      dadosBackup.estatisticas.totalAgendamentos = agendamentos?.length || 0;
    }
    if (localConfig.incluir_cronogramas) {
      const { data: cronogramas } = await supabase.from("cronogramas_novos").select("*").eq("user_id", user.id);
      dadosBackup.dados.cronogramas = cronogramas || [];
      const { data: retornos } = await supabase.from("retornos_novos").select("*").eq("user_id", user.id);
      dadosBackup.dados.retornos = retornos || [];
    }
    if (localConfig.incluir_financeiro) {
      const { data: lancamentos } = await supabase.from("lancamentos").select("*").eq("user_id", user.id);
      dadosBackup.dados.lancamentos = lancamentos || [];
      const { data: contasFixas } = await supabase.from("contas_fixas").select("*").eq("user_id", user.id);
      dadosBackup.dados.contas_fixas = contasFixas || [];
    }
    const { data: configHorarios } = await supabase.from("configuracoes_horarios").select("*").eq("user_id", user.id);
    dadosBackup.dados.configuracoes_horarios = configHorarios || [];
    return dadosBackup;
  };
  const converterParaCSV = (dados) => {
    let csv = "";
    Object.entries(dados.dados).forEach(([tabela, registros]) => {
      if (!Array.isArray(registros) || registros.length === 0) return;
      csv += `

=== ${tabela.toUpperCase()} ===
`;
      const headers = Object.keys(registros[0]);
      csv += headers.join(",") + "\n";
      registros.forEach((registro) => {
        const valores = headers.map((header) => {
          const valor = registro[header];
          if (valor === null || valor === void 0) return "";
          if (typeof valor === "string" && valor.includes(",")) {
            return `"${valor.replace(/"/g, '""')}"`;
          }
          if (typeof valor === "object") return JSON.stringify(valor);
          return valor;
        });
        csv += valores.join(",") + "\n";
      });
    });
    return csv;
  };
  const converterParaSQL = (dados) => {
    let sql = `-- Backup exportado em: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
    sql += `-- Usuário: ${dados.usuario}

`;
    sql += `-- IMPORTANTE: Este backup foi criado para restauração de dados
`;
    sql += `-- Execute este script em um banco de dados limpo ou revise antes de executar

`;
    const tabelas = [
      { nome: "clientes", campos: ["id", "user_id", "nome", "telefone", "email", "endereco", "data_nascimento", "observacoes", "historico_servicos"] },
      { nome: "servicos", campos: ["id", "user_id", "nome", "descricao", "valor", "duracao", "observacoes"] },
      { nome: "agendamentos", campos: ["id", "user_id", "cliente_id", "servico_id", "data", "hora", "duracao", "valor", "status", "observacoes"] },
      { nome: "lancamentos", campos: ["id", "user_id", "tipo", "descricao", "valor", "data", "categoria"] },
      { nome: "contas_fixas", campos: ["id", "user_id", "nome", "valor", "categoria", "frequencia", "data_vencimento"] },
      { nome: "cronogramas_novos", campos: ["id_cronograma", "user_id", "cliente_id", "servico_id", "tipo_servico", "recorrencia", "data_inicio"] }
    ];
    tabelas.forEach(({ nome, campos }) => {
      const registros = dados.dados[nome];
      if (!registros || !Array.isArray(registros) || registros.length === 0) return;
      sql += `
-- Tabela: ${nome}
`;
      sql += `-- Total de registros: ${registros.length}

`;
      registros.forEach((registro) => {
        const valores = campos.map((campo) => {
          const valor = registro[campo];
          if (valor === null || valor === void 0) return "NULL";
          if (typeof valor === "string") return `'${valor.replace(/'/g, "''")}'`;
          if (typeof valor === "boolean") return valor ? "TRUE" : "FALSE";
          if (typeof valor === "object") return `'${JSON.stringify(valor).replace(/'/g, "''")}'`;
          return valor;
        });
        sql += `INSERT INTO ${nome} (${campos.join(", ")}) VALUES (${valores.join(", ")});
`;
      });
    });
    return sql;
  };
  const exportarDados = async () => {
    if (!user?.id) {
      Jt.error("Usuário não autenticado");
      return;
    }
    setRealizandoBackup(true);
    try {
      console.log("🔄 Iniciando backup dos dados...");
      const dadosBackup = await coletarDados();
      console.log("💾 Dados coletados:", dadosBackup.estatisticas);
      let conteudo;
      let nomeArquivo;
      let tipoMime;
      switch (formatoExport) {
        case "csv":
          conteudo = converterParaCSV(dadosBackup);
          nomeArquivo = `backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
          tipoMime = "text/csv";
          break;
        case "sql":
          conteudo = converterParaSQL(dadosBackup);
          nomeArquivo = `backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.sql`;
          tipoMime = "text/plain";
          break;
        case "json":
        default:
          conteudo = JSON.stringify(dadosBackup, null, 2);
          nomeArquivo = `backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
          tipoMime = "application/json";
      }
      const dataBlob = new Blob([conteudo], { type: tipoMime });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      await salvarBackup({
        ...localConfig,
        ultimo_backup: (/* @__PURE__ */ new Date()).toISOString()
      });
      const totalItens = Object.values(dadosBackup.estatisticas).reduce((acc, val) => acc + (typeof val === "number" ? val : 0), 0);
      Jt.success(
        `Backup ${formatoExport.toUpperCase()} criado com sucesso! ${totalItens} registros exportados.`
      );
    } catch (error) {
      console.error("❌ Erro ao exportar dados:", error);
      Jt.error("Erro ao criar backup. Verifique o console.");
    } finally {
      setRealizandoBackup(false);
    }
  };
  const enviarPorEmail = async () => {
    const emailDestino = localConfig.email_backup;
    if (!emailDestino) {
      Jt.error("Por favor, cadastre um e-mail para receber o backup.");
      return;
    }
    if (!user?.id) {
      Jt.error("Usuário não autenticado");
      return;
    }
    setEnviandoEmail(true);
    try {
      const dadosBackup = await coletarDados();
      const totalItens = Object.values(dadosBackup.estatisticas).reduce((acc, val) => acc + (typeof val === "number" ? val : 0), 0);
      const { data, error } = await supabase.functions.invoke("enviar-backup-email", {
        body: {
          email: emailDestino,
          usuario: user.email,
          dados: dadosBackup,
          formato: formatoExport,
          totalItens
        }
      });
      if (error) throw error;
      await salvarBackup({
        ...localConfig,
        ultimo_backup: (/* @__PURE__ */ new Date()).toISOString()
      });
      Jt.success(`Backup enviado com sucesso para ${emailDestino}!`);
    } catch (error) {
      console.error("❌ Erro ao enviar backup por e-mail:", error);
      Jt.error("Erro ao enviar e-mail. Certifique-se de que a função de e-mail está configurada no Supabase.");
    } finally {
      setEnviandoEmail(false);
    }
  };
  const importarDados = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;
    setImportando(true);
    try {
      console.log("📥 Iniciando importação de:", file.name);
      const texto = await file.text();
      let dadosImportados;
      if (file.name.endsWith(".json")) {
        dadosImportados = JSON.parse(texto);
      } else if (file.name.endsWith(".csv")) {
        Jt.error("Importação de CSV em desenvolvimento");
        setImportando(false);
        return;
      } else if (file.name.endsWith(".sql")) {
        Jt.error("Importação de SQL em desenvolvimento");
        setImportando(false);
        return;
      } else {
        Jt.error("Formato de arquivo não suportado");
        setImportando(false);
        return;
      }
      if (!dadosImportados.dados || !dadosImportados.userId) {
        Jt.error("Arquivo de backup inválido");
        setImportando(false);
        return;
      }
      const totalRegistros = Object.values(dadosImportados.dados).reduce((acc, val) => acc + (Array.isArray(val) ? val.length : 0), 0);
      if (!confirm(`Deseja importar ${totalRegistros} registros? Isso irá adicionar dados ao sistema.`)) {
        setImportando(false);
        return;
      }
      let importados = 0;
      let erros = 0;
      if (dadosImportados.dados.clientes?.length > 0) {
        for (const cliente of dadosImportados.dados.clientes) {
          try {
            const { error } = await supabase.from("clientes").upsert({ ...cliente, user_id: user.id }, { onConflict: "id" });
            if (error) throw error;
            importados++;
          } catch (err) {
            console.error("Erro ao importar cliente:", err);
            erros++;
          }
        }
      }
      if (dadosImportados.dados.servicos?.length > 0) {
        for (const servico of dadosImportados.dados.servicos) {
          try {
            const { error } = await supabase.from("servicos").upsert({ ...servico, user_id: user.id }, { onConflict: "id" });
            if (error) throw error;
            importados++;
          } catch (err) {
            console.error("Erro ao importar serviço:", err);
            erros++;
          }
        }
      }
      if (dadosImportados.dados.agendamentos?.length > 0) {
        for (const agendamento of dadosImportados.dados.agendamentos) {
          try {
            const { error } = await supabase.from("agendamentos").upsert({ ...agendamento, user_id: user.id }, { onConflict: "id" });
            if (error) throw error;
            importados++;
          } catch (err) {
            console.error("Erro ao importar agendamento:", err);
            erros++;
          }
        }
      }
      Jt.success(`Importação concluída! ${importados} registros importados${erros > 0 ? `, ${erros} erros` : ""}.`);
    } catch (error) {
      console.error("❌ Erro na importação:", error);
      Jt.error("Erro ao importar dados. Verifique o arquivo.");
    } finally {
      setImportando(false);
      event.target.value = "";
    }
  };
  const handleUpdateConfig = async (field, value) => {
    const newConfig = { ...localConfig, [field]: value };
    setLocalConfig(newConfig);
    await salvarBackup(newConfig);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "card-3d border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-responsive-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-primary" }),
          "Exportar Dados"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-responsive-sm", children: "Faça backup de todos os seus dados em diferentes formatos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-base font-medium", children: "Formato de Exportação:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3", children: FORMATOS_EXPORT.map((formato) => {
            const Icon = formato.icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setFormatoExport(formato.value),
                className: `p-3 sm:p-4 border-2 rounded-xl text-left transition-all touch-manipulation shadow-sm ${formatoExport === formato.value ? "border-primary bg-primary/5 shadow-md scale-[1.02]" : "border-border hover:border-primary/50"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${formatoExport === formato.value ? "text-primary" : "text-muted-foreground"}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-semibold text-responsive-sm ${formatoExport === formato.value ? "text-primary" : ""}`, children: formato.label })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-xs text-muted-foreground", children: formato.description })
                ]
              },
              formato.value
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-base font-medium", children: "Dados para incluir:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3", children: [
            { key: "incluir_clientes", label: "Clientes", icon: "👥" },
            { key: "incluir_servicos", label: "Serviços", icon: "✂️" },
            { key: "incluir_agendamentos", label: "Agendamentos", icon: "📅" },
            { key: "incluir_cronogramas", label: "Cronogramas", icon: "🔄" },
            { key: "incluir_financeiro", label: "Financeiro", icon: "💰" }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-2 sm:p-3 border rounded-lg touch-manipulation hover:bg-muted/50 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: item.key,
                checked: localConfig[item.key],
                onCheckedChange: (checked) => handleUpdateConfig(item.key, checked)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: item.key, className: "text-responsive-xs cursor-pointer flex-1 select-none font-medium", children: [
              item.icon,
              " ",
              item.label
            ] })
          ] }, item.key)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: exportarDados,
              disabled: realizandoBackup || enviandoEmail,
              className: "w-full btn-touch btn-3d bg-primary hover:bg-primary/90 text-white font-bold h-12",
              size: "lg",
              children: realizandoBackup ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2 animate-bounce" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-responsive-sm", children: "Gerando Arquivo..." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-responsive-sm", children: [
                  "Baixar Arquivo (",
                  formatoExport.toUpperCase(),
                  ")"
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: enviarPorEmail,
              disabled: realizandoBackup || enviandoEmail,
              variant: "outline",
              className: "w-full btn-touch btn-3d border-primary/20 text-primary font-bold h-12 hover:bg-primary/5",
              size: "lg",
              children: enviandoEmail ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2 animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-responsive-sm", children: "Enviando E-mail..." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4 mr-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-responsive-sm", children: "Enviar para E-mail" })
              ] })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "card-3d border-border/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-responsive-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-primary" }),
          "Restaurar Backup"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-responsive-sm", children: "Recupere seus dados a partir de um arquivo de backup (.json)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 flex-shrink-0 text-amber-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-responsive-xs text-amber-800 dark:text-amber-400 font-medium", children: "A restauração irá mesclar os dados do arquivo com os dados atuais. Certifique-se de que o arquivo é um backup válido gerado por este sistema." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-primary/20 rounded-xl p-6 sm:p-10 text-center touch-manipulation bg-primary/5 hover:bg-primary/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              id: "file-upload",
              accept: ".json",
              onChange: importarDados,
              disabled: importando,
              className: "hidden"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "file-upload",
              className: "cursor-pointer flex flex-col items-center gap-4",
              children: importando ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-responsive-base text-primary", children: "Restaurando Dados..." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-sm text-muted-foreground", children: "Por favor, não feche a página" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "h-8 w-8 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-responsive-base", children: "Clique ou arraste o arquivo aqui" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-xs text-muted-foreground", children: "Somente arquivos .JSON (máx. 10MB)" })
                ] })
              ] })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "card-3d border-primary/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-responsive-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-primary" }),
          "Lembrete de Backup Automático"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-responsive-sm", children: "Configure alertas periódicos para nunca esquecer de salvar seus dados" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border rounded-xl bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-base font-bold", children: "Ativar Alertas de Backup" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-xs text-muted-foreground mt-1", children: "O sistema lembrará você de exportar seus dados conforme a frequência escolhida" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: localConfig.backup_automatico,
              onCheckedChange: (checked) => handleUpdateConfig("backup_automatico", checked),
              className: "data-[state=checked]:bg-primary"
            }
          )
        ] }),
        localConfig.backup_automatico && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-sm font-bold", children: "Frequência do Lembrete:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: localConfig.frequencia_backup,
                onValueChange: (value) => handleUpdateConfig("frequencia_backup", value),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-11 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "diario", children: "Diariamente" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "semanal", children: "Semanalmente" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mensal", children: "Mensalmente" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-sm font-bold", children: "Horário Preferencial:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: localConfig.hora_backup,
                onChange: (e) => setLocalConfig((prev) => ({ ...prev, hora_backup: e.target.value })),
                onBlur: (e) => handleUpdateConfig("hora_backup", e.target.value),
                className: "h-11 rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 sm:col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-sm font-bold", children: "Email para Lembrete (opcional):" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "email",
                placeholder: "seu@email.com",
                value: localConfig.email_backup,
                onChange: (e) => setLocalConfig((prev) => ({ ...prev, email_backup: e.target.value })),
                onBlur: (e) => handleUpdateConfig("email_backup", e.target.value),
                className: "h-11 rounded-xl"
              }
            )
          ] }),
          configuracaoBackup?.ultimo_backup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "bg-primary/5 border-primary/10 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-responsive-xs font-medium text-primary", children: [
              "Último backup exportado em: ",
              new Date(configuracaoBackup.ultimo_backup).toLocaleString("pt-BR")
            ] })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "p-responsive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-primary text-responsive-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" }),
        "Segurança dos Seus Dados"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3 p-responsive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-responsive-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "✓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Privacidade Total:" }),
            " Os dados são gerados e processados localmente no seu navegador."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-responsive-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "✓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Backup Universal:" }),
            " O formato JSON permite que seus dados sejam lidos por qualquer sistema."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-responsive-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "✓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Recomendação:" }),
            " Faça backup semanalmente e guarde o arquivo em um local seguro (nuvem ou pendrive)."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-responsive-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold", children: "✓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Restauração:" }),
            " Use a função de importar apenas em caso de perda de dados ou migração de conta."
          ] })
        ] })
      ] }) })
    ] })
  ] });
}

function ConfiguracaoAgendamentoOnline() {
  const { config, loading, saving, setConfig, salvarConfig } = useConfigAgendamentoOnline();
  const [uploadingLogo, setUploadingLogo] = reactExports.useState(false);
  const [uploadingBanner, setUploadingBanner] = reactExports.useState(false);
  const [previewLogoUrl, setPreviewLogoUrl] = reactExports.useState(null);
  const [previewBannerUrl, setPreviewBannerUrl] = reactExports.useState(null);
  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };
  const handleSave = async () => {
    await salvarConfig(config);
  };
  const handleFileUpload = async (event, type) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        Jt.error("Por favor, selecione apenas arquivos de imagem");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        Jt.error("A imagem deve ter no máximo 2MB");
        return;
      }
      if (type === "logo") setUploadingLogo(true);
      else setUploadingBanner(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const currentUrl = type === "logo" ? config.logo_url : config.banner_url;
      if (currentUrl && currentUrl.includes("salon-logos")) {
        const oldPath = currentUrl.split("/salon-logos/")[1];
        if (oldPath) {
          await supabase.storage.from("salon-logos").remove([oldPath]);
        }
      }
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("salon-logos").upload(fileName, file, {
        cacheControl: "3600",
        upsert: true
      });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("salon-logos").getPublicUrl(fileName);
      if (type === "logo") {
        handleChange("logo_url", publicUrl);
        setPreviewLogoUrl(publicUrl);
        Jt.success("Logo atualizada!");
      } else {
        handleChange("banner_url", publicUrl);
        setPreviewBannerUrl(publicUrl);
        Jt.success("Banner atualizado!");
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      Jt.error("Erro ao fazer upload da imagem");
    } finally {
      if (type === "logo") setUploadingLogo(false);
      else setUploadingBanner(false);
    }
  };
  const handleRemoveImage = async (type) => {
    try {
      const currentUrl = type === "logo" ? config.logo_url : config.banner_url;
      if (currentUrl && currentUrl.includes("salon-logos")) {
        const oldPath = currentUrl.split("/salon-logos/")[1];
        if (oldPath) {
          await supabase.storage.from("salon-logos").remove([oldPath]);
        }
      }
      if (type === "logo") {
        handleChange("logo_url", "");
        setPreviewLogoUrl(null);
      } else {
        handleChange("banner_url", "");
        setPreviewBannerUrl(null);
      }
      Jt.success("Imagem removida");
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      Jt.error("Erro ao remover imagem");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-primary" }),
          "Status do Agendamento Online"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Ative ou desative o formulário de agendamento online público" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ativo", className: "text-base font-bold", children: "Agendamento Online Ativo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Quando ativo, clientes podem agendar através do link público" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "ativo",
            checked: config.ativo,
            onCheckedChange: (checked) => handleChange("ativo", checked),
            className: "data-[state=checked]:bg-primary"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "h-5 w-5 text-primary" }),
          "Visual e Personalização"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Personalize as imagens e cores do seu formulário" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }),
              "Logo/Foto Circular"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/10 rounded-2xl bg-muted/30", children: [
              config.logo_url || previewLogoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: previewLogoUrl || config.logo_url,
                    alt: "Logo",
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleRemoveImage("logo"),
                    className: "absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center border-4 border-white shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-10 w-10 text-primary/20" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: uploadingLogo,
                  onClick: () => document.getElementById("logo-upload")?.click(),
                  className: "rounded-full px-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
                    uploadingLogo ? "Enviando..." : "Trocar Logo"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "logo-upload", type: "file", accept: "image/*", onChange: (e) => handleFileUpload(e, "logo"), className: "hidden" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "flex items-center gap-2 font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PanelsTopLeft, { className: "h-4 w-4" }),
              "Imagem de Capa (Banner)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/10 rounded-2xl bg-muted/30", children: [
              config.banner_url || previewBannerUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-24 rounded-xl overflow-hidden border-4 border-white shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: previewBannerUrl || config.banner_url,
                    alt: "Banner",
                    className: "w-full h-full object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => handleRemoveImage("banner"),
                    className: "absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-24 rounded-xl bg-primary/5 flex items-center justify-center border-4 border-white shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-10 w-10 text-primary/20" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  disabled: uploadingBanner,
                  onClick: () => document.getElementById("banner-upload")?.click(),
                  className: "rounded-full px-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
                    uploadingBanner ? "Enviando..." : "Trocar Capa"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "banner-upload", type: "file", accept: "image/*", onChange: (e) => handleFileUpload(e, "banner"), className: "hidden" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cor_primaria", className: "font-bold", children: "Cor de Destaque" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cor_primaria",
                  type: "color",
                  value: config.cor_primaria || "#8B5CF6",
                  onChange: (e) => handleChange("cor_primaria", e.target.value),
                  className: "w-16 h-12 p-1 rounded-lg cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: config.cor_primaria || "#8B5CF6",
                  onChange: (e) => handleChange("cor_primaria", e.target.value),
                  placeholder: "#000000",
                  className: "font-mono"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-bold", children: "Opções de Exibição" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Mostrar Preços" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: config.mostrar_precos, onCheckedChange: (v) => handleChange("mostrar_precos", v) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/50 rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Mostrar Duração" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: config.mostrar_duracao, onCheckedChange: (v) => handleChange("mostrar_duracao", v) })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-primary" }),
          "Informações do Salão"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Dados que aparecerão no formulário de agendamento online" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome_salao", className: "font-bold", children: "Nome do Salão *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "nome_salao",
              value: config.nome_salao,
              onChange: (e) => handleChange("nome_salao", e.target.value),
              placeholder: "Ex: Salão Beleza Pura",
              className: "h-12 rounded-xl"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "public_id", className: "font-bold", children: "Link Personalizado (Slug)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center px-3 bg-muted rounded-l-xl border border-r-0 border-primary/10 text-xs font-mono text-muted-foreground whitespace-nowrap", children: ".../agendamento-online?s=" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "public_id",
                value: config.public_id || "",
                onChange: (e) => handleChange("public_id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")),
                placeholder: "nome-do-seu-salao",
                className: "h-12 rounded-l-none rounded-r-xl font-mono"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground px-1", children: "Use apenas letras minúsculas, números e hífens. Este será o identificador do seu link." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "descricao", className: "font-bold", children: "Descrição Curta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "descricao",
              value: config.descricao,
              onChange: (e) => handleChange("descricao", e.target.value),
              placeholder: "Breve descrição sobre seu salão",
              rows: 2,
              className: "rounded-xl resize-none"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-primary" }),
          "Contato"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "whatsapp", className: "text-xs font-bold uppercase text-muted-foreground", children: "WhatsApp" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "whatsapp", value: config.whatsapp, onChange: (e) => handleChange("whatsapp", e.target.value), placeholder: "5511999999999", className: "h-11 rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "endereco", className: "text-xs font-bold uppercase text-muted-foreground", children: "Endereço" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "endereco", value: config.endereco, onChange: (e) => handleChange("endereco", e.target.value), placeholder: "Rua...", className: "h-11 rounded-xl" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { className: "h-4 w-4 text-primary" }),
          "Redes Sociais"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "instagram", className: "text-xs font-bold uppercase text-muted-foreground", children: "Instagram" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "instagram", value: config.instagram, onChange: (e) => handleChange("instagram", e.target.value), placeholder: "@seuuser", className: "h-11 rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "facebook", className: "text-xs font-bold uppercase text-muted-foreground", children: "Facebook" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "facebook", value: config.facebook, onChange: (e) => handleChange("facebook", e.target.value), placeholder: "fb.com/user", className: "h-11 rounded-xl" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary" }),
        "Regras e Mensagens"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold uppercase", children: "Sinal (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: config.taxa_sinal_percentual, onChange: (e) => handleChange("taxa_sinal_percentual", Number(e.target.value)), className: "h-11 rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold uppercase", children: "Ant. Mín (min)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: config.tempo_minimo_antecedencia, onChange: (e) => handleChange("tempo_minimo_antecedencia", Number(e.target.value)), className: "h-11 rounded-xl" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold uppercase", children: "Ant. Máx (dias)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: Math.floor(config.tempo_maximo_antecedencia / 1440), onChange: (e) => handleChange("tempo_maximo_antecedencia", Number(e.target.value) * 1440), className: "h-11 rounded-xl" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-bold", children: "Boas-vindas" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: config.mensagem_boas_vindas, onChange: (e) => handleChange("mensagem_boas_vindas", e.target.value), className: "rounded-xl resize-none", rows: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-bold", children: "Termos de Uso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: config.termos_condicoes, onChange: (e) => handleChange("termos_condicoes", e.target.value), className: "rounded-xl resize-none", rows: 2 })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: handleSave,
        disabled: saving,
        size: "lg",
        className: "w-full sm:w-auto h-14 sm:h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl transition-all active:scale-95",
        children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" }),
          "Salvando..."
        ] }) : "Salvar Todas as Configurações"
      }
    ) }),
    config.ativo && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row items-center gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 text-center sm:text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold text-primary flex items-center gap-2 justify-center sm:justify-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5" }),
        "Seu Link Público Está Pronto!"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Copie o link abaixo e coloque na sua Bio do Instagram ou envie para seus clientes no WhatsApp." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            readOnly: true,
            value: `${window.location.origin}/agendamento-online?${config.public_id ? `s=${config.public_id}` : `uid=${config.user_id}`}`,
            className: "bg-background/50 h-11 rounded-xl font-medium"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "default",
            onClick: () => {
              const link = `${window.location.origin}/agendamento-online?${config.public_id ? `s=${config.public_id}` : `uid=${config.user_id}`}`;
              navigator.clipboard.writeText(link);
              Jt.success("Link copiado com sucesso! 🚀");
            },
            className: "h-11 rounded-xl px-6",
            children: "Copiar"
          }
        )
      ] })
    ] }) }) }) })
  ] });
}

const schema = object({
  senha: string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmar_senha: string().min(6, "A confirmação deve ter pelo menos 6 caracteres")
}).refine((data) => data.senha === data.confirmar_senha, {
  message: "As senhas não coincidem",
  path: ["confirmar_senha"]
});
function ConfiguracaoConta() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: a(schema)
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.senha });
      if (error) throw error;
      Jt.success("Senha atualizada com sucesso.");
      reset();
    } catch (err) {
      Jt.error(err instanceof Error ? err.message : "Não foi possível atualizar a senha.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Conta" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: user?.email ? `E-mail: ${user.email}` : "Gerencie dados de conta e segurança." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "senha", children: "Nova senha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "senha", type: "password", ...register("senha"), disabled: isLoading }),
        errors.senha && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.senha.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirmar_senha", children: "Confirmar nova senha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "confirmar_senha", type: "password", ...register("confirmar_senha"), disabled: isLoading }),
        errors.confirmar_senha && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.confirmar_senha.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "Salvando..." : "Alterar senha" })
    ] }) })
  ] });
}

function Configuracoes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "horarios";
  const [activeTab, setActiveTab] = reactExports.useState(initialTab);
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading, refreshProfile, isAuthenticated } = useAuth();
  const { isPaid, isLoading: paidLoading, refetch } = usePaidAccess();
  const [statusLoading, setStatusLoading] = reactExports.useState(false);
  const isLoading = authLoading || paidLoading;
  const trialStart = typeof usuario?.trial_start_date === "string" ? new Date(usuario.trial_start_date) : null;
  const trialStartMs = trialStart ? trialStart.getTime() : null;
  const trialEndMs = typeof trialStartMs === "number" && Number.isFinite(trialStartMs) ? trialStartMs + 7 * 24 * 60 * 60 * 1e3 : null;
  const nowMs = Date.now();
  const trialValid = usuario?.subscription_status === "trial" && typeof trialStartMs === "number" && Number.isFinite(trialStartMs) && nowMs < trialStartMs + 7 * 24 * 60 * 60 * 1e3;
  const trialRemainingDays = typeof trialEndMs === "number" && Number.isFinite(trialEndMs) ? Math.max(0, Math.ceil((trialEndMs - nowMs) / (1e3 * 60 * 60 * 24))) : null;
  const trialProgress = typeof trialStartMs === "number" && Number.isFinite(trialStartMs) && typeof trialEndMs === "number" && Number.isFinite(trialEndMs) ? Math.min(100, Math.max(0, Math.round((nowMs - trialStartMs) / (trialEndMs - trialStartMs) * 100))) : null;
  const formatDate = (value) => {
    if (!value) return "—";
    const d = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(d.getTime())) return "—";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
  };
  const statusLabel = (() => {
    if (isPaid) return "Assinatura ativa";
    if (trialValid) return `Teste grátis ativo — ${trialRemainingDays ?? 0} dia(s) restante(s)`;
    if (usuario?.subscription_status === "trial") return "Teste grátis expirado — acesso pendente";
    return "Acesso pendente";
  })();
  const planLabel = (() => {
    if (isPaid) return "Mensal (R$ 7,90/mês)";
    return "Teste grátis (7 dias)";
  })();
  reactExports.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  reactExports.useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-responsive p-3 sm:p-6 space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 sm:space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl sm:text-3xl font-bold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-6 w-6 sm:h-8 sm:w-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Configurações" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Configure os horários de atendimento, agendamento online, notificações e backup do sistema" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "w-full whitespace-nowrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex md:grid md:grid-cols-6 gap-1 p-1 w-full bg-muted rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "horarios", className: "flex items-center gap-2 min-h-[44px] flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
            "Horários"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "agendamento-online", className: "flex items-center gap-2 min-h-[44px] flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            "Agend. Online"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "notificacoes", className: "flex items-center gap-2 min-h-[44px] flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
            "Notificações"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "backup", className: "flex items-center gap-2 min-h-[44px] flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            "Backup"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "conta", className: "flex items-center gap-2 min-h-[44px] flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }),
            "Conta"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "assinatura", className: "flex items-center gap-2 min-h-[44px] flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4" }),
            "Assinatura"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, { orientation: "horizontal", className: "md:hidden" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "horarios", className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Horários e Dias de Trabalho" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure os dias da semana e horários em que você atenderá clientes. Estas configurações serão respeitadas nos formulários de agendamento." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ConfiguracaoHorarios, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-blue-900 dark:text-blue-100 mb-2", children: "📋 Integração com Agendamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-700 dark:text-blue-300", children: "Os horários configurados aqui serão automaticamente aplicados aos formulários de agendamento interno e externo, bloqueando horários indisponíveis." })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "agendamento-online", className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Configurações do Agendamento Online" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure o formulário público de agendamento, informações do salão, redes sociais e regras de agendamento." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ConfiguracaoAgendamentoOnline, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "notificacoes", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfiguracaoNotificacoesAvancadas, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "backup", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfiguracaoBackup, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "conta", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfiguracaoConta, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "assinatura", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Plano e Assinatura" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Acompanhe seu acesso, o período de teste e como assinar" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Carregando status..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/50 rounded-lg border border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: statusLabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: isPaid ? "default" : "outline", className: isPaid ? "bg-green-600 hover:bg-green-700" : "", children: isPaid ? "Ativa" : trialValid ? "Teste grátis" : "Pendente" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/30 rounded-lg border border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Plano" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: planLabel })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/30 rounded-lg border border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Liberação" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: isPaid ? formatDate(usuario?.paid_at) : "Após pagamento aprovado" })
            ] })
          ] }),
          trialValid ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-primary", children: "Teste grátis em andamento" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  "Início: ",
                  formatDate(usuario?.trial_start_date),
                  " · Expira: ",
                  trialEndMs ? formatDate(new Date(trialEndMs)) : "—"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: trialProgress !== null ? `${trialProgress}%` : "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-2 w-full rounded-full bg-primary/10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary", style: { width: `${trialProgress ?? 0}%` } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: "Você pode usar o app normalmente durante o teste. Depois, será necessário assinar para continuar." })
          ] }) : null,
          !isPaid ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-card/50 p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "O que você recebe na assinatura" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid gap-2 sm:grid-cols-2", children: [
              "Agenda com visão diária/semana",
              "Agendamentos e clientes ilimitados",
              "Serviços e preços organizados",
              "Controle financeiro e relatórios",
              "Atualizações futuras inclusas",
              "Suporte prioritário"
            ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 bg-green-100 dark:bg-green-900/30 rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-green-600 dark:text-green-400", strokeWidth: 3 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: t })
            ] }, t)) })
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1 grid grid-cols-1 gap-2 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  navigate("/checkout");
                },
                className: "w-full gap-2",
                disabled: isPaid,
                variant: isPaid ? "outline" : "default",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" }),
                  isPaid ? "Assinatura ativa" : "Assinar por R$ 7,90/mês"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "w-full gap-2",
                disabled: statusLoading,
                onClick: async () => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  setStatusLoading(true);
                  try {
                    await refreshProfile();
                    await refetch?.();
                    Jt.success("Status atualizado!");
                  } catch (e) {
                    Jt.error("Erro ao verificar status");
                  } finally {
                    setStatusLoading(false);
                  }
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
                  statusLoading ? "Verificando..." : "Verificar Status"
                ]
              }
            )
          ] })
        ] }) })
      ] }) })
    ] })
  ] });
}

export { Configuracoes as default };
