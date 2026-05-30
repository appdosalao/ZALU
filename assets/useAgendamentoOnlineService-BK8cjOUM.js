import { r as reactExports } from './react-vendor-BpXfDOw7.js';
import { a4 as createClient, J as Jt } from './index-BxmTkSue.js';

const shouldDebug$1 = () => {
  try {
    const isDev = Boolean(import.meta?.env?.DEV);
    if (isDev) return true;
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).has("debugSupabase");
  } catch {
    return false;
  }
};
function createLoggedFetch({ label, timeoutMs }) {
  return async (input, init) => {
    const startedAt = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const requestInit = {
        ...init,
        signal: init?.signal ?? controller.signal
      };
      const res = await fetch(input, requestInit);
      const elapsedMs = Math.round(performance.now() - startedAt);
      if (shouldDebug$1()) {
        const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        const path = (() => {
          try {
            const u = new URL(url);
            return `${u.origin}${u.pathname}`;
          } catch {
            return url;
          }
        })();
        console.debug(`[${label}]`, requestInit.method || "GET", path, res.status, `${elapsedMs}ms`);
      }
      return res;
    } catch (err) {
      const elapsedMs = Math.round(performance.now() - startedAt);
      if (shouldDebug$1()) console.debug(`[${label}]`, "ERR", `${elapsedMs}ms`);
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  };
}

const VITE_SUPABASE_URL = "https://dfwepnzwktjyhvfmpuxo.supabase.co";
const VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmd2Vwbnp3a3RqeWh2Zm1wdXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzE4NzQsImV4cCI6MjA3MTE0Nzg3NH0.9BR-N9tSzHetSL50Dsalwb-q_dNHfdQBp32Y9qIXlag";
const SUPABASE_URL = VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = VITE_SUPABASE_ANON_KEY;
const memoryStorage = /* @__PURE__ */ (() => {
  const store = /* @__PURE__ */ new Map();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    }
  };
})();
const supabasePublic = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storageKey: "sb-public-no-session",
    storage: memoryStorage
  },
  global: {
    fetch: createLoggedFetch({ label: "supabasePublic", timeoutMs: 15e3 })
  }
});

const shouldDebug = () => {
  try {
    if (false) ;
    return typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debugSupabase");
  } catch {
    return false;
  }
};
const withTiming = async (op, fn) => {
  const startedAt = performance.now();
  try {
    const out = await fn();
    if (shouldDebug()) console.debug("[booking]", op, "ok", `${Math.round(performance.now() - startedAt)}ms`);
    return out;
  } catch (err) {
    if (shouldDebug()) console.debug("[booking]", op, "err", `${Math.round(performance.now() - startedAt)}ms`);
    throw err;
  }
};
const getPublicIdFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("s") || params.get("public_id") || params.get("salao") || params.get("slug") || "";
  } catch {
    return "";
  }
};
const getOwnerUserIdFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("uid") || params.get("user_id") || params.get("owner") || params.get("id") || "";
  } catch {
    return "";
  }
};
const useAgendamentoOnlineService = () => {
  const db = supabasePublic;
  const [loading, setLoading] = reactExports.useState(false);
  const [servicos, setServicos] = reactExports.useState([]);
  const [servicosError, setServicosError] = reactExports.useState(null);
  const [produtos, setProdutos] = reactExports.useState([]);
  const [horariosError, setHorariosError] = reactExports.useState(null);
  const [ownerUserId, setOwnerUserId] = reactExports.useState(null);
  const [publicId, setPublicId] = reactExports.useState(null);
  const resolveIdentifiers = reactExports.useCallback(async () => {
    if (ownerUserId && publicId) return { ownerUserId, publicId };
    try {
      const urlPublicId = getPublicIdFromUrl();
      const urlOwnerId = getOwnerUserIdFromUrl();
      if (urlOwnerId) {
        setOwnerUserId(urlOwnerId);
        return { ownerUserId: urlOwnerId, publicId: urlPublicId };
      }
      if (urlPublicId) {
        setPublicId(urlPublicId);
        const { data, error } = await withTiming(
          "rpc:get_booking_owner_id",
          () => db.rpc("get_booking_owner_id", { p_public_id: urlPublicId })
        );
        if (error) {
          console.error("[booking] Erro ao resolver owner pelo slug:", error);
        } else if (data) {
          const resolvedId = String(data);
          setOwnerUserId(resolvedId);
          return { ownerUserId: resolvedId, publicId: urlPublicId };
        }
      }
      if (false) ;
      return { ownerUserId: null, publicId: urlPublicId };
    } catch (error) {
      console.error("[booking] Erro ao resolver identificadores:", error);
      return { ownerUserId: null, publicId: null };
    }
  }, [ownerUserId, publicId, db]);
  const carregarServicos = reactExports.useCallback(async () => {
    setLoading(true);
    setServicosError(null);
    try {
      const { ownerUserId: resolvedOwnerId, publicId: resolvedPublicId } = await resolveIdentifiers();
      if (!resolvedOwnerId) {
        setServicos([]);
        setServicosError("Link do agendamento incompleto ou salão não encontrado. Use o link oficial fornecido pelo estabelecimento.");
        return;
      }
      if (resolvedPublicId) {
        const { data: data2, error: error2 } = await withTiming(
          "rpc:get_public_services",
          () => db.rpc("get_public_services", { p_public_id: resolvedPublicId })
        );
        if (!error2 && Array.isArray(data2) && data2.length > 0) {
          setServicos(data2);
          setLoading(false);
          return;
        }
      }
      const { data, error } = await withTiming(
        "select:servicos",
        () => db.from("servicos").select("id, nome, descricao, valor, duracao, user_id").eq("user_id", resolvedOwnerId).order("nome")
      );
      if (error) {
        throw error;
      }
      setServicos(data || []);
      if (!data || data.length === 0) {
        setServicosError("Nenhum serviço disponível para agendamento online neste salão.");
      }
    } catch (error) {
      console.error("[booking] Erro ao carregar serviços:", error);
      setServicosError("Erro ao carregar serviços. Por favor, tente novamente mais tarde.");
      setServicos([]);
    } finally {
      setLoading(false);
    }
  }, [resolveIdentifiers, db]);
  const carregarProdutosPublicos = reactExports.useCallback(async () => {
    try {
      const { ownerUserId: resolvedOwnerId, publicId: resolvedPublicId } = await resolveIdentifiers();
      if (resolvedPublicId) {
        const { data: data2, error: error2 } = await withTiming(
          "rpc:get_public_products",
          () => db.rpc("get_public_products", { p_public_id: resolvedPublicId })
        );
        if (!error2 && Array.isArray(data2) && data2.length > 0) {
          setProdutos(data2.map((p) => ({
            id: p.id,
            nome: p.nome,
            valor: p.valor,
            categoria: p.categoria,
            imagem_url: p.imagem_url
          })));
          return;
        }
      }
      if (!resolvedOwnerId) {
        setProdutos([]);
        return;
      }
      const { data, error } = await withTiming(
        "select:produtos",
        () => db.from("produtos").select("id, nome, preco_venda, ativo, categoria, imagem_url").eq("ativo", true).eq("categoria", "revenda").eq("user_id", resolvedOwnerId).limit(200)
      );
      if (error) throw error;
      setProdutos((Array.isArray(data) ? data : []).map((p) => ({
        id: p.id,
        nome: p.nome,
        valor: p.preco_venda,
        categoria: p.categoria,
        imagem_url: p.imagem_url
      })));
    } catch (error) {
      console.error("[booking] Erro ao carregar produtos:", error);
      setProdutos([]);
    }
  }, [resolveIdentifiers, db]);
  const calcularHorariosDisponiveis = reactExports.useCallback(async (servicoId, data) => {
    setHorariosError(null);
    const servico = servicos.find((s) => s.id === servicoId);
    if (!servico) {
      console.log("[booking] Serviço não encontrado:", servicoId);
      return [];
    }
    try {
      const { ownerUserId: resolvedOwnerId, publicId: resolvedPublicId } = await resolveIdentifiers();
      const horariosResultCall = resolvedPublicId ? await withTiming(
        "rpc:get_public_time_slots",
        () => db.rpc("get_public_time_slots", {
          p_public_id: resolvedPublicId,
          p_data: data,
          p_servico_id: servicoId
        })
      ) : await withTiming(
        "rpc:buscar_horarios_com_multiplos_intervalos",
        async () => db.rpc("buscar_horarios_com_multiplos_intervalos", {
          data_selecionada: data,
          user_id_param: servico.user_id || resolvedOwnerId,
          duracao_servico: typeof servico.duracao === "number" && servico.duracao > 0 ? servico.duracao : 60
        })
      );
      const horariosResult = horariosResultCall?.data;
      const error = horariosResultCall?.error;
      if (error) {
        console.error("Erro ao buscar horários:", error);
        setHorariosError(`${error.code || ""} ${error.message || ""}`.trim() || "Erro ao buscar horários");
        return [];
      }
      const duracaoLabel = typeof servico.duracao === "number" && servico.duracao > 0 ? servico.duracao : 60;
      console.log(`Horários para serviço ${servico.nome} (${duracaoLabel}min):`, horariosResult);
      const horariosFormatados = (horariosResult || []).filter((item) => item.horario && item.disponivel === true).map((item) => ({
        horario: String(item.horario).slice(0, 5),
        disponivel: true
      }));
      return horariosFormatados;
    } catch (error) {
      console.error("Erro ao calcular horários disponíveis:", error);
      setHorariosError(error instanceof Error ? error.message : "Erro ao calcular horários disponíveis");
      return [];
    }
  }, [resolveIdentifiers, servicos]);
  const criarClienteSeNaoExistir = reactExports.useCallback(async (dados) => {
    try {
      const { data, error } = await withTiming(
        "rpc:criar_cliente_agendamento_online",
        () => db.rpc("criar_cliente_agendamento_online", {
          p_nome: dados.nome_completo,
          p_telefone: dados.telefone,
          p_email: dados.email,
          p_observacoes: "Cliente criado via agendamento online"
        })
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  }, []);
  const criarAgendamento = reactExports.useCallback(async (dados) => {
    setLoading(true);
    try {
      const { ownerUserId: resolvedOwnerId } = await resolveIdentifiers();
      const servico = servicos.find((s) => s.id === dados.servico_id);
      if (!servico) {
        throw new Error("Serviço não encontrado");
      }
      const duracaoEfetiva = typeof servico.duracao === "number" && servico.duracao > 0 ? servico.duracao : 60;
      const valorEfetivo = typeof dados.valor === "number" ? dados.valor : typeof servico.valor === "number" && servico.valor >= 0 ? servico.valor : 0;
      try {
        const horariosDisponiveis = await calcularHorariosDisponiveis(dados.servico_id, dados.data);
        if (horariosDisponiveis.length > 0) {
          const alvo = String(dados.horario).slice(0, 5);
          const horarioDisponivel = horariosDisponiveis.find((h) => String(h.horario).slice(0, 5) === alvo);
          if (!horarioDisponivel || !horarioDisponivel.disponivel) {
            Jt.error("Este horário acabou de ser reservado por outro cliente. Por favor, selecione outro horário.");
            return false;
          }
        }
      } catch (error) {
        console.warn("Erro ao validar disponibilidade final (prosseguindo mesmo assim):", error);
      }
      try {
        await criarClienteSeNaoExistir(dados);
      } catch (error) {
        console.warn("Não foi possível criar/associar cliente (prosseguindo):", error);
      }
      const baseInsert = {
        user_id: resolvedOwnerId,
        // Explicitamente associando ao dono do salão
        nome_completo: dados.nome_completo,
        email: dados.email,
        telefone: dados.telefone,
        servico_id: dados.servico_id,
        data: dados.data,
        horario: dados.horario,
        observacoes: dados.observacoes,
        valor: valorEfetivo,
        duracao: duracaoEfetiva,
        status: "confirmado",
        origem: "formulario_online",
        user_agent: navigator.userAgent
      };
      let insertError = null;
      const firstTry = await withTiming("insert:agendamentos_online", () => db.from("agendamentos_online").insert(baseInsert));
      insertError = firstTry.error;
      if (insertError) throw insertError;
      Jt.success(`Agendamento confirmado! ✨
Seu agendamento para ${servico.nome} foi confirmado para ${new Date(dados.data).toLocaleDateString("pt-BR")} às ${dados.horario}. Você foi cadastrado como cliente.`);
      return true;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      const msg = error?.message ? String(error.message) : "";
      const code = error?.code ? String(error.code) : "";
      if (code || msg) {
        Jt.error(`Não foi possível confirmar seu agendamento.
${code ? `(${code}) ` : ""}${msg}`.trim());
      } else {
        Jt.error("Não foi possível confirmar seu agendamento. Tente novamente.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [servicos, criarClienteSeNaoExistir, calcularHorariosDisponiveis, resolveIdentifiers]);
  return {
    loading,
    servicos,
    servicosError,
    produtos,
    horariosError,
    ownerUserId,
    publicId,
    carregarServicos,
    carregarProdutosPublicos,
    calcularHorariosDisponiveis,
    criarAgendamento
  };
};

export { supabasePublic as s, useAgendamentoOnlineService as u };
