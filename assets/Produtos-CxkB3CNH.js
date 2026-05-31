import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-CjCc2DlV.js';
import { s as supabase, J as Jt, j as Input, g as Button, C as Card, B as Badge, v as Separator, k as AlertDialog, l as AlertDialogContent, m as AlertDialogHeader, n as AlertDialogTitle, o as AlertDialogDescription, p as AlertDialogFooter, q as AlertDialogCancel, r as AlertDialogAction } from './index-U74ij7JC.js';
import { L as Label } from './label-C0AJeojg.js';
import { T as Textarea } from './textarea-D9C69N9T.js';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-Ce9M_rda.js';
import { S as Switch } from './switch-CkSMWSBt.js';
import { X, m as LoaderCircle, bs as ImagePlus, an as Search, am as Filter, ag as Plus, _ as Package, ac as TriangleAlert, bt as PackagePlus, bu as PackageMinus, bp as Pencil, C as ChevronDown, aq as Trash2, ax as Phone, ay as Mail, az as Tag, ao as SquarePen, au as ShoppingBag, ae as TrendingUp, aS as ShoppingCart, V as DollarSign, U as Users } from './ui-libs-B5Rrhu1L.js';
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from './dialog-DK5BU-Za.js';
import { u as useSupabaseCompras, a as useSupabaseVendas } from './useSupabaseVendas-Dmom5SC3.js';
import { f as format } from './format-DsTNzci_.js';
import { p as ptBR } from './pt-BR-HlQT9LXk.js';
import { u as useSupabaseClientes } from './useSupabaseClientes-Bu4CtR3z.js';
import './chart-libs-Cdz70zdY.js';
import './index-BfAAoDv6.js';
import './index-Ls-C4DWD.js';

function useSupabaseProdutos() {
  const [produtos, setProdutos] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [erro, setErro] = reactExports.useState(null);
  const loadProdutos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("produtos").select("*").eq("user_id", user.id).order("nome");
      if (error) throw error;
      setProdutos(data || []);
      setErro(null);
    } catch (error) {
      setErro(error.message || "Erro ao carregar produtos");
      Jt.error("Erro ao carregar produtos: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const createProduto = async (produto) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const produtoSanitizado = {
        ...produto,
        user_id: user.id,
        estoque_atual: 0,
        categoria_id: produto.categoria_id === "" || produto.categoria_id === "none" ? null : produto.categoria_id,
        fornecedor_id: produto.fornecedor_id === "" ? null : produto.fornecedor_id
      };
      const { error } = await supabase.from("produtos").insert([produtoSanitizado]);
      if (error) throw error;
      Jt.success("Produto cadastrado com sucesso!");
      await loadProdutos();
    } catch (error) {
      Jt.error("Erro ao cadastrar produto: " + error.message);
      throw error;
    }
  };
  const updateProduto = async (id, produto) => {
    try {
      const updates = { ...produto };
      if (updates.categoria_id === "" || updates.categoria_id === "none") updates.categoria_id = null;
      if (updates.fornecedor_id === "") updates.fornecedor_id = null;
      const { error } = await supabase.from("produtos").update(updates).eq("id", id);
      if (error) throw error;
      Jt.success("Produto atualizado com sucesso!");
      await loadProdutos();
    } catch (error) {
      Jt.error("Erro ao atualizar produto: " + error.message);
      throw error;
    }
  };
  const uploadImagem = async (file) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage.from("produtos").upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("produtos").getPublicUrl(fileName);
      return publicUrl;
    } catch (error) {
      Jt.error("Erro ao fazer upload da imagem: " + error.message);
      return null;
    }
  };
  const deleteProduto = async (id) => {
    try {
      const { error } = await supabase.from("produtos").update({ ativo: false }).eq("id", id);
      if (error) throw error;
      Jt.success("Produto desativado com sucesso!");
      await loadProdutos();
    } catch (error) {
      Jt.error("Erro ao desativar produto: " + error.message);
      throw error;
    }
  };
  const movimentarEstoque = async (params) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      if (params.quantidade <= 0) throw new Error("Quantidade deve ser positiva");
      const { error } = await supabase.from("movimentacoes_estoque").insert([{
        user_id: user.id,
        produto_id: params.produto_id,
        tipo: params.tipo,
        quantidade: params.quantidade,
        valor_unitario: params.valor_unitario ?? 0,
        valor_total: (params.valor_unitario ?? 0) * params.quantidade,
        motivo: params.motivo || (params.tipo === "ajuste" ? "Ajuste manual" : params.tipo === "perda" ? "Perda" : "Movimentação manual"),
        origem_tipo: "ajuste_manual"
      }]);
      if (error) throw error;
      Jt.success("Movimentação registrada");
      await loadProdutos();
      return true;
    } catch (error) {
      Jt.error("Erro ao movimentar estoque: " + error.message);
      return false;
    }
  };
  reactExports.useEffect(() => {
    loadProdutos();
  }, []);
  return {
    produtos,
    loading,
    erro,
    createProduto,
    updateProduto,
    deleteProduto,
    uploadImagem,
    movimentarEstoque,
    recarregar: loadProdutos
  };
}

function useSupabaseFornecedores() {
  const [fornecedores, setFornecedores] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const loadFornecedores = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("fornecedores").select("*").eq("user_id", user.id).order("nome");
      if (error) throw error;
      setFornecedores(data || []);
    } catch (error) {
      Jt.error("Erro ao carregar fornecedores: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const createFornecedor = async (fornecedor) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { error } = await supabase.from("fornecedores").insert([{ ...fornecedor, user_id: user.id }]);
      if (error) throw error;
      Jt.success("Fornecedor cadastrado com sucesso!");
      await loadFornecedores();
    } catch (error) {
      Jt.error("Erro ao cadastrar fornecedor: " + error.message);
      throw error;
    }
  };
  const updateFornecedor = async (id, fornecedor) => {
    try {
      const { error } = await supabase.from("fornecedores").update(fornecedor).eq("id", id);
      if (error) throw error;
      Jt.success("Fornecedor atualizado com sucesso!");
      await loadFornecedores();
    } catch (error) {
      Jt.error("Erro ao atualizar fornecedor: " + error.message);
      throw error;
    }
  };
  const deleteFornecedor = async (id) => {
    try {
      const { error } = await supabase.from("fornecedores").delete().eq("id", id);
      if (error) throw error;
      Jt.success("Fornecedor excluído com sucesso!");
      await loadFornecedores();
    } catch (error) {
      Jt.error("Erro ao excluir fornecedor: " + error.message);
      throw error;
    }
  };
  reactExports.useEffect(() => {
    loadFornecedores();
  }, []);
  return {
    fornecedores,
    loading,
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,
    recarregar: loadFornecedores
  };
}

function useSupabaseCategorias() {
  const [categorias, setCategorias] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const loadCategorias = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("categorias_produtos").select("*").eq("user_id", user.id).order("tipo", { ascending: true }).order("nome", { ascending: true });
      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      Jt.error("Erro ao carregar categorias: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const createCategoria = async (categoria) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { error } = await supabase.from("categorias_produtos").insert([{
        ...categoria,
        user_id: user.id
      }]);
      if (error) throw error;
      Jt.success("Categoria criada com sucesso!");
      await loadCategorias();
    } catch (error) {
      Jt.error("Erro ao criar categoria: " + error.message);
      throw error;
    }
  };
  const updateCategoria = async (id, categoria) => {
    try {
      const { error } = await supabase.from("categorias_produtos").update(categoria).eq("id", id);
      if (error) throw error;
      Jt.success("Categoria atualizada com sucesso!");
      await loadCategorias();
    } catch (error) {
      Jt.error("Erro ao atualizar categoria: " + error.message);
      throw error;
    }
  };
  const deleteCategoria = async (id) => {
    try {
      const { error } = await supabase.from("categorias_produtos").delete().eq("id", id);
      if (error) throw error;
      Jt.success("Categoria excluída com sucesso!");
      await loadCategorias();
    } catch (error) {
      Jt.error("Erro ao excluir categoria: " + error.message);
      throw error;
    }
  };
  reactExports.useEffect(() => {
    loadCategorias();
  }, []);
  return {
    categorias,
    loading,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    recarregar: loadCategorias
  };
}

function ProdutoForm({ produto, onSuccess, onCancel }) {
  const { createProduto, updateProduto, uploadImagem } = useSupabaseProdutos();
  const { fornecedores } = useSupabaseFornecedores();
  const { categorias } = useSupabaseCategorias();
  const fileInputRef = reactExports.useRef(null);
  const [uploading, setUploading] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    nome: "",
    descricao: "",
    codigo_barras: "",
    categoria: "uso_profissional",
    categoria_id: "",
    fornecedor_id: "",
    estoque_minimo: 0,
    unidade_medida: "un",
    preco_custo: 0,
    preco_venda: 0,
    imagem_url: "",
    ativo: true
  });
  reactExports.useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome,
        descricao: produto.descricao || "",
        codigo_barras: produto.codigo_barras || "",
        categoria: produto.categoria,
        categoria_id: produto.categoria_id || "",
        fornecedor_id: produto.fornecedor_id || "",
        estoque_minimo: produto.estoque_minimo,
        unidade_medida: produto.unidade_medida,
        preco_custo: produto.preco_custo,
        preco_venda: produto.preco_venda,
        imagem_url: produto.imagem_url || "",
        ativo: produto.ativo
      });
    }
  }, [produto]);
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImagem(file);
      if (url) {
        setFormData((prev) => ({ ...prev, imagem_url: url }));
      }
    } finally {
      setUploading(false);
    }
  };
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imagem_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (produto) {
        await updateProduto(produto.id, formData);
      } else {
        await createProduto(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", className: "text-sm sm:text-base", children: "Nome *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "nome",
            required: true,
            className: "h-12 sm:h-11 text-base sm:text-sm",
            value: formData.nome,
            onChange: (e) => setFormData({ ...formData, nome: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "categoria", children: "Tipo *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: formData.categoria,
            onValueChange: (value) => setFormData({ ...formData, categoria: value }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "uso_profissional", children: "Uso Profissional" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "revenda", children: "Revenda" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "consumo", children: "Consumo" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          formData.categoria === "revenda" && "Produtos para revender aos clientes",
          formData.categoria === "uso_profissional" && "Produtos usados em procedimentos",
          formData.categoria === "consumo" && "Produtos de uso próprio do salão"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "categoria_id", children: "Categoria Personalizada" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: formData.categoria_id || "none",
            onValueChange: (value) => {
              const selectedCat = categorias.find((c) => c.id === value);
              if (selectedCat) {
                setFormData({
                  ...formData,
                  categoria_id: value,
                  categoria: selectedCat.tipo
                });
              } else {
                setFormData({ ...formData, categoria_id: value === "none" ? void 0 : value });
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Nenhuma" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "Nenhuma" }),
                categorias.filter((c) => c.ativo).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: c.id, children: [
                  c.nome,
                  " (",
                  c.tipo === "revenda" ? "Revenda" : c.tipo === "uso_profissional" ? "Uso Profissional" : "Consumo",
                  ")"
                ] }, c.id))
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fornecedor_id", children: "Fornecedor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: formData.fornecedor_id,
            onValueChange: (value) => setFormData({ ...formData, fornecedor_id: value }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um fornecedor" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: fornecedores.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.id, children: f.nome }, f.id)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "codigo_barras", children: "Código de Barras" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "codigo_barras",
            value: formData.codigo_barras,
            onChange: (e) => setFormData({ ...formData, codigo_barras: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "estoque_minimo", children: "Estoque Mínimo *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "estoque_minimo",
            type: "number",
            min: "0",
            step: "0.01",
            required: true,
            value: formData.estoque_minimo,
            onChange: (e) => setFormData({ ...formData, estoque_minimo: parseFloat(e.target.value) || 0 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "unidade_medida", children: "Unidade de Medida *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "unidade_medida",
            required: true,
            value: formData.unidade_medida,
            onChange: (e) => setFormData({ ...formData, unidade_medida: e.target.value }),
            placeholder: "Ex: un, kg, L"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "preco_custo", children: "Preço de Custo (R$) *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "preco_custo",
            type: "number",
            min: "0",
            step: "0.01",
            required: true,
            value: formData.preco_custo,
            onChange: (e) => setFormData({ ...formData, preco_custo: parseFloat(e.target.value) || 0 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "preco_venda", children: "Preço de Venda (R$) *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "preco_venda",
            type: "number",
            min: "0",
            step: "0.01",
            required: true,
            value: formData.preco_venda,
            onChange: (e) => setFormData({ ...formData, preco_venda: parseFloat(e.target.value) || 0 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Imagem do Produto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
        formData.imagem_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-[200px] aspect-square rounded-2xl overflow-hidden border-2 border-primary/10 shadow-lg group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: formData.imagem_url,
              alt: "Prévia do produto",
              className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: removeImage,
              className: "absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-xl shadow-lg hover:scale-110 transition-transform",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            onClick: () => fileInputRef.current?.click(),
            className: "w-full max-w-[200px] aspect-square rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all group",
            children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 text-primary animate-spin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary/70 uppercase tracking-widest", children: "Enviando..." })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlus, { className: "w-8 h-8 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary/70 uppercase tracking-widest", children: "Adicionar Foto" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "file",
            ref: fileInputRef,
            onChange: handleImageUpload,
            accept: "image/*",
            className: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Recomendado: Imagem quadrada (1:1), formato PNG ou JPG, até 2MB." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "descricao", children: "Descrição" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "descricao",
          value: formData.descricao,
          onChange: (e) => setFormData({ ...formData, descricao: e.target.value }),
          rows: 3
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Switch,
        {
          id: "ativo",
          checked: formData.ativo,
          onCheckedChange: (checked) => setFormData({ ...formData, ativo: checked })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ativo", children: "Produto Ativo" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, className: "h-11 btn-touch sm:flex-1", children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "h-11 btn-touch sm:flex-1", children: produto ? "Atualizar" : "Cadastrar" })
    ] })
  ] });
}

function MovimentacaoEstoqueDialog({
  produto,
  tipo,
  open,
  onOpenChange,
  onSuccess
}) {
  const { movimentarEstoque } = useSupabaseProdutos();
  const [quantidade, setQuantidade] = reactExports.useState("1");
  const [motivo, setMotivo] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const qtd = parseFloat(quantidade);
      if (isNaN(qtd) || qtd <= 0) {
        throw new Error("Quantidade inválida");
      }
      const success = await movimentarEstoque({
        produto_id: produto.id,
        tipo,
        quantidade: qtd,
        motivo: motivo || void 0,
        valor_unitario: tipo === "entrada" ? produto.preco_custo : produto.preco_venda
      });
      if (success) {
        onSuccess();
        onOpenChange(false);
        setQuantidade("1");
        setMotivo("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-[425px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: tipo === "entrada" ? "Entrada de Estoque" : "Saída de Estoque" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Produto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: produto?.nome, disabled: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "quantidade", children: [
          "Quantidade (",
          produto?.unidade_medida,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "quantidade",
            type: "number",
            step: "0.01",
            min: "0.01",
            value: quantidade,
            onChange: (e) => setQuantidade(e.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "motivo", children: "Motivo (Opcional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "motivo",
            placeholder: "Ex: Ajuste de inventário, perda, brinde...",
            value: motivo,
            onChange: (e) => setMotivo(e.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => onOpenChange(false), children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, children: loading ? "Processando..." : "Confirmar" })
    ] })
  ] }) }) });
}

function ProdutosList() {
  const { produtos, loading, deleteProduto} = useSupabaseProdutos();
  const [editingProduto, setEditingProduto] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [busca, setBusca] = reactExports.useState("");
  const [filtroTipo, setFiltroTipo] = reactExports.useState("todos");
  const [somenteBaixoEstoque, setSomenteBaixoEstoque] = reactExports.useState(false);
  const [movOpenId, setMovOpenId] = reactExports.useState(null);
  const [movs, setMovs] = reactExports.useState({});
  const [movDialog, setMovDialog] = reactExports.useState({
    open: false,
    produto: null,
    tipo: "entrada"
  });
  const [deleteDialog, setDeleteDialog] = reactExports.useState({
    open: false,
    id: "",
    nome: ""
  });
  const handleDelete = async () => {
    if (deleteDialog.id) {
      await deleteProduto(deleteDialog.id);
      setDeleteDialog({ open: false, id: "", nome: "" });
    }
  };
  const getCategoriaLabel = (categoria) => {
    const labels = {
      uso_profissional: "Uso Profissional",
      revenda: "Revenda",
      consumo: "Consumo"
    };
    return labels[categoria] || categoria;
  };
  const produtosFiltrados = reactExports.useMemo(() => {
    const texto = busca.toLowerCase().trim();
    return produtos.filter((p) => {
      const matchBusca = !texto || p.nome.toLowerCase().includes(texto) || (p.codigo_barras || "").toLowerCase().includes(texto);
      const matchTipo = filtroTipo === "todos" || p.categoria === filtroTipo;
      const matchEstoque = !somenteBaixoEstoque || p.estoque_atual <= p.estoque_minimo;
      return matchBusca && matchTipo && matchEstoque;
    });
  }, [produtos, busca, filtroTipo, somenteBaixoEstoque]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-8", children: "Carregando..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Produtos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Buscar por nome ou código...",
              value: busca,
              onChange: (e) => setBusca(e.target.value),
              className: "pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filtroTipo, onValueChange: (v) => setFiltroTipo(v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Tipo" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todos", children: "Todos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "uso_profissional", children: "Uso Profissional" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "revenda", children: "Revenda" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "consumo", children: "Consumo" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: somenteBaixoEstoque ? "default" : "outline",
            onClick: () => setSomenteBaixoEstoque((v) => !v),
            className: "gap-2",
            title: "Apenas com estoque abaixo do mínimo",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "h-4 w-4" }),
              "Baixo estoque"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
          setEditingProduto(null);
          setShowForm(true);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
          "Novo Produto"
        ] })
      ] })
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProdutoForm,
      {
        produto: editingProduto,
        onSuccess: () => {
          setShowForm(false);
          setEditingProduto(null);
        },
        onCancel: () => {
          setShowForm(false);
          setEditingProduto(null);
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:gap-4", children: [
      produtosFiltrados.map((produto) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4 sm:p-5 border-border/50 bg-card/50 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden border border-border/50 flex-shrink-0 bg-primary/5 flex items-center justify-center", children: produto.imagem_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: produto.imagem_url,
              alt: produto.nome,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-8 h-8 text-primary/20" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 w-full min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base sm:text-lg font-semibold", children: produto.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: produto.ativo ? "default" : "secondary", className: "text-xs h-5", children: produto.ativo ? "Ativo" : "Inativo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs h-5", children: getCategoriaLabel(produto.categoria) }),
              produto.estoque_atual <= produto.estoque_minimo && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "flex items-center gap-1 text-xs h-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline", children: "Estoque Baixo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "xs:hidden", children: "Baixo" })
              ] })
            ] }),
            produto.descricao && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mb-3", children: produto.descricao }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs sm:text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Estoque:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  produto.estoque_atual,
                  " ",
                  produto.unidade_medida
                ] }),
                produto.estoque_atual <= produto.estoque_minimo && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-destructive", children: [
                  "Mínimo: ",
                  produto.estoque_minimo
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Mínimo:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  produto.estoque_minimo,
                  " ",
                  produto.unidade_medida
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Custo:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  "R$ ",
                  Number(produto.preco_custo).toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Venda:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                  "R$ ",
                  Number(produto.preco_venda).toFixed(2)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex sm:flex-col gap-2 w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setMovDialog({ open: true, produto, tipo: "entrada" }),
                className: "flex-1 sm:flex-none h-10 btn-touch",
                title: "Entrada de estoque",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PackagePlus, { className: "h-3 w-3 sm:mr-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Entrada" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setMovDialog({ open: true, produto, tipo: "saida" }),
                className: "flex-1 sm:flex-none h-10 btn-touch",
                title: "Saída de estoque",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PackageMinus, { className: "h-3 w-3 sm:mr-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Saída" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  setEditingProduto(produto);
                  setShowForm(true);
                },
                className: "flex-1 sm:flex-none h-10 btn-touch",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3 w-3 sm:mr-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Editar" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: async () => {
                  const open = movOpenId === produto.id ? null : produto.id;
                  setMovOpenId(open);
                  if (open && !movs[produto.id]) {
                    const { data } = await supabase.from("movimentacoes_estoque").select("*").eq("produto_id", produto.id).order("created_at", { ascending: false }).limit(5);
                    setMovs((prev) => ({ ...prev, [produto.id]: data || [] }));
                  }
                },
                className: "flex-1 sm:flex-none h-10 btn-touch",
                title: "Ver movimentações recentes",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 sm:mr-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Movimentações" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setDeleteDialog({ open: true, id: produto.id, nome: produto.nome }),
                className: "flex-1 sm:flex-none h-10 btn-touch hover:bg-destructive/10 hover:text-destructive",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 sm:mr-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Desativar" })
                ]
              }
            )
          ] })
        ] }),
        movOpenId === produto.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            (movs[produto.id] || []).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                m.tipo,
                " • ",
                new Date(m.created_at).toLocaleString("pt-BR")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Qtd: ",
                m.quantidade,
                " • R$ ",
                Number(m.valor_total || 0).toFixed(2)
              ] })
            ] }, m.id)),
            (movs[produto.id] || []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Sem movimentações recentes" })
          ] })
        ] })
      ] }, produto.id)),
      produtosFiltrados.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-muted-foreground", children: "Nenhum produto encontrado." })
    ] }),
    movDialog.produto && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MovimentacaoEstoqueDialog,
      {
        open: movDialog.open,
        onOpenChange: (open) => setMovDialog((prev) => ({ ...prev, open })),
        produto: movDialog.produto,
        tipo: movDialog.tipo,
        onSuccess: () => {
          if (movOpenId === movDialog.produto.id) {
            setMovs((prev) => {
              const newMovs = { ...prev };
              delete newMovs[movDialog.produto.id];
              return newMovs;
            });
          }
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: deleteDialog.open,
        onOpenChange: (open) => setDeleteDialog((prev) => ({ ...prev, open })),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Desativar Produto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
              'Tem certeza que deseja desativar o produto "',
              deleteDialog.nome,
              '"? Ele ficará oculto da lista, mas todo o histórico de estoque e vendas será preservado.'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                onClick: handleDelete,
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                children: "Desativar"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}

function FornecedorForm({ fornecedor, onSuccess, onCancel }) {
  const { createFornecedor, updateFornecedor } = useSupabaseFornecedores();
  const [formData, setFormData] = reactExports.useState({
    nome: "",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
    ativo: true
  });
  reactExports.useEffect(() => {
    if (fornecedor) {
      setFormData({
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj || "",
        telefone: fornecedor.telefone || "",
        email: fornecedor.email || "",
        endereco: fornecedor.endereco || "",
        cidade: fornecedor.cidade || "",
        estado: fornecedor.estado || "",
        cep: fornecedor.cep || "",
        observacoes: fornecedor.observacoes || "",
        ativo: fornecedor.ativo
      });
    }
  }, [fornecedor]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (fornecedor) {
        await updateFornecedor(fornecedor.id, formData);
      } else {
        await createFornecedor(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", children: "Nome *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "nome",
            required: true,
            value: formData.nome,
            onChange: (e) => setFormData({ ...formData, nome: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cnpj", children: "CNPJ" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "cnpj",
            value: formData.cnpj,
            onChange: (e) => setFormData({ ...formData, cnpj: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "telefone", children: "Telefone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "telefone",
            value: formData.telefone,
            onChange: (e) => setFormData({ ...formData, telefone: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "E-mail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "email",
            type: "email",
            value: formData.email,
            onChange: (e) => setFormData({ ...formData, email: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cidade", children: "Cidade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "cidade",
            value: formData.cidade,
            onChange: (e) => setFormData({ ...formData, cidade: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "estado", children: "Estado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "estado",
            maxLength: 2,
            value: formData.estado,
            onChange: (e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cep", children: "CEP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "cep",
            value: formData.cep,
            onChange: (e) => setFormData({ ...formData, cep: e.target.value })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "endereco", children: "Endereço" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "endereco",
          value: formData.endereco,
          onChange: (e) => setFormData({ ...formData, endereco: e.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "observacoes", children: "Observações" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          id: "observacoes",
          value: formData.observacoes,
          onChange: (e) => setFormData({ ...formData, observacoes: e.target.value }),
          rows: 3
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Switch,
        {
          id: "ativo",
          checked: formData.ativo,
          onCheckedChange: (checked) => setFormData({ ...formData, ativo: checked })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ativo", children: "Fornecedor Ativo" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: fornecedor ? "Atualizar" : "Cadastrar" })
    ] })
  ] });
}

function FornecedoresList() {
  const { fornecedores, loading, deleteFornecedor } = useSupabaseFornecedores();
  const [editingFornecedor, setEditingFornecedor] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      await deleteFornecedor(id);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-8", children: "Carregando..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Fornecedores" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => {
        setEditingFornecedor(null);
        setShowForm(true);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Novo Fornecedor"
      ] })
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      FornecedorForm,
      {
        fornecedor: editingFornecedor,
        onSuccess: () => {
          setShowForm(false);
          setEditingFornecedor(null);
        },
        onCancel: () => {
          setShowForm(false);
          setEditingFornecedor(null);
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      fornecedores.map((fornecedor) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: fornecedor.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: fornecedor.ativo ? "default" : "secondary", children: fornecedor.ativo ? "Ativo" : "Inativo" })
          ] }),
          fornecedor.cnpj && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-2", children: [
            "CNPJ: ",
            fornecedor.cnpj
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
            fornecedor.telefone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fornecedor.telefone })
            ] }),
            fornecedor.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fornecedor.email })
            ] }),
            fornecedor.cidade && fornecedor.estado && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
              fornecedor.cidade,
              " - ",
              fornecedor.estado
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 ml-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => {
                setEditingFornecedor(fornecedor);
                setShowForm(true);
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => handleDelete(fornecedor.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }) }, fornecedor.id)),
      fornecedores.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-muted-foreground col-span-2", children: "Nenhum fornecedor cadastrado ainda." })
    ] })
  ] });
}

function CompraForm({ onSuccess }) {
  const { createCompra } = useSupabaseCompras();
  const { fornecedores } = useSupabaseFornecedores();
  const { produtos } = useSupabaseProdutos();
  const [fornecedorId, setFornecedorId] = reactExports.useState("");
  const [numeroNota, setNumeroNota] = reactExports.useState("");
  const [dataCompra, setDataCompra] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [dataVencimento, setDataVencimento] = reactExports.useState("");
  const [formaPagamento, setFormaPagamento] = reactExports.useState("");
  const [observacoes, setObservacoes] = reactExports.useState("");
  const [itens, setItens] = reactExports.useState([
    { produto_id: "", quantidade: 1, valor_unitario: 0, valor_total: 0 }
  ]);
  const adicionarItem = () => {
    setItens([...itens, { produto_id: "", quantidade: 1, valor_unitario: 0, valor_total: 0 }]);
  };
  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };
  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    if (campo === "quantidade" || campo === "valor_unitario") {
      novosItens[index].valor_total = novosItens[index].quantidade * novosItens[index].valor_unitario;
    }
    setItens(novosItens);
  };
  const calcularTotal = () => {
    return itens.reduce((sum, item) => sum + item.valor_total, 0);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itens.some((item) => !item.produto_id)) {
      alert("Selecione um produto para cada item");
      return;
    }
    try {
      await createCompra({
        fornecedor_id: fornecedorId || void 0,
        numero_nota: numeroNota || void 0,
        data_compra: dataCompra,
        data_vencimento: dataVencimento || void 0,
        valor_total: calcularTotal(),
        forma_pagamento: formaPagamento || void 0,
        observacoes: observacoes || void 0,
        itens
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao registrar compra:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-4", children: "Informações da Compra" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Fornecedor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: fornecedorId, onValueChange: setFornecedorId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um fornecedor (opcional)" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: fornecedores.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: f.id, children: f.nome }, f.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Número da Nota" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: numeroNota,
              onChange: (e) => setNumeroNota(e.target.value),
              placeholder: "Ex: NF-12345"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Data da Compra" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: dataCompra,
              onChange: (e) => setDataCompra(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Data de Vencimento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: dataVencimento,
              onChange: (e) => setDataVencimento(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Forma de Pagamento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formaPagamento, onValueChange: setFormaPagamento, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dinheiro", children: "Dinheiro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pix", children: "PIX" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cartao_credito", children: "Cartão de Crédito" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cartao_debito", children: "Cartão de Débito" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "boleto", children: "Boleto" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "a_prazo", children: "A Prazo" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: observacoes,
              onChange: (e) => setObservacoes(e.target.value),
              placeholder: "Observações sobre a compra"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Itens da Compra" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: adicionarItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          "Adicionar Item"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: itens.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-12 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Produto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: item.produto_id,
              onValueChange: (value) => atualizarItem(index, "produto_id", value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o produto" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: produtos.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.nome }, p.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "0",
              step: "0.01",
              value: item.quantidade,
              onChange: (e) => atualizarItem(index, "quantidade", parseFloat(e.target.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Valor Unitário" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "0",
              step: "0.01",
              value: item.valor_unitario,
              onChange: (e) => atualizarItem(index, "valor_unitario", parseFloat(e.target.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: item.valor_total.toFixed(2),
              disabled: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "icon",
            onClick: () => removerItem(index),
            disabled: itens.length === 1,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
          }
        ) })
      ] }) }, index)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-lg font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Valor Total:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "R$ ",
          calcularTotal().toFixed(2)
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onSuccess, children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Registrar Compra" })
    ] })
  ] });
}

function ComprasList() {
  const { compras, loading } = useSupabaseCompras();
  const [showForm, setShowForm] = reactExports.useState(false);
  const getStatusBadge = (status) => {
    const variants = {
      pendente: "secondary",
      pago_parcial: "default",
      pago: "default",
      vencido: "destructive"
    };
    const labels = {
      pendente: "Pendente",
      pago_parcial: "Pago Parcial",
      pago: "Pago",
      vencido: "Vencido"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: variants[status], children: labels[status] });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center p-8", children: "Carregando..." });
  }
  if (showForm) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Registrar Nova Compra" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CompraForm, { onSuccess: () => setShowForm(false) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Histórico de Compras" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowForm(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Nova Compra"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
      compras.map((compra) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: compra.numero_nota ? `Nota: ${compra.numero_nota}` : `Compra #${compra.id.slice(0, 8)}` }),
              getStatusBadge(compra.status_pagamento)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: format(new Date(compra.data_compra), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold", children: [
              "R$ ",
              Number(compra.valor_total).toFixed(2)
            ] }),
            compra.valor_devido > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-destructive", children: [
              "Devido: R$ ",
              Number(compra.valor_devido).toFixed(2)
            ] })
          ] })
        ] }),
        compra.itens_compra && compra.itens_compra.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-2", children: "Itens:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: compra.itens_compra.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              item.quantidade,
              "x - Produto ID: ",
              item.produto_id.slice(0, 8)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "R$ ",
              Number(item.valor_total).toFixed(2)
            ] })
          ] }, item.id)) })
        ] })
      ] }, compra.id)),
      compras.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-8 text-center text-muted-foreground", children: "Nenhuma compra registrada ainda." })
    ] })
  ] });
}

function CategoriaForm({ categoria, onSuccess, onCancel }) {
  const { createCategoria, updateCategoria } = useSupabaseCategorias();
  const [formData, setFormData] = reactExports.useState({
    nome: "",
    tipo: "revenda",
    cor: "#94a3b8",
    ativo: true
  });
  reactExports.useEffect(() => {
    if (categoria) {
      setFormData({
        nome: categoria.nome,
        tipo: categoria.tipo,
        cor: categoria.cor || "#94a3b8",
        icone: categoria.icone,
        ativo: categoria.ativo
      });
    }
  }, [categoria]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoria) {
        await updateCategoria(categoria.id, formData);
      } else {
        await createCategoria(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };
  const getTipoLabel = (tipo) => {
    const labels = {
      revenda: "Revenda",
      uso_profissional: "Uso Profissional",
      consumo: "Consumo"
    };
    return labels[tipo];
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", children: "Nome da Categoria" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          id: "nome",
          value: formData.nome,
          onChange: (e) => setFormData({ ...formData, nome: e.target.value }),
          placeholder: "Ex: Esmaltes, Shampoos, Material de Limpeza",
          required: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tipo", children: "Tipo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: formData.tipo,
          onValueChange: (value) => setFormData({ ...formData, tipo: value }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "revenda", children: getTipoLabel("revenda") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "uso_profissional", children: getTipoLabel("uso_profissional") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "consumo", children: getTipoLabel("consumo") })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
        formData.tipo === "revenda" && "Produtos que você compra para revender no salão",
        formData.tipo === "uso_profissional" && "Produtos usados em procedimentos com clientes",
        formData.tipo === "consumo" && "Produtos para uso próprio do salão"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cor", children: "Cor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "cor",
            type: "color",
            value: formData.cor,
            onChange: (e) => setFormData({ ...formData, cor: e.target.value }),
            className: "w-20 h-10"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: formData.cor,
            onChange: (e) => setFormData({ ...formData, cor: e.target.value }),
            placeholder: "#94a3b8"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ativo", children: "Categoria Ativa" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Switch,
        {
          id: "ativo",
          checked: formData.ativo,
          onCheckedChange: (checked) => setFormData({ ...formData, ativo: checked })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: categoria ? "Atualizar" : "Cadastrar" })
    ] })
  ] });
}

function CategoriasList() {
  const { categorias, loading, deleteCategoria } = useSupabaseCategorias();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingCategoria, setEditingCategoria] = reactExports.useState();
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const handleEdit = (categoria) => {
    setEditingCategoria(categoria);
    setShowForm(true);
  };
  const handleDelete = async () => {
    if (deletingId) {
      await deleteCategoria(deletingId);
      setDeletingId(null);
    }
  };
  const getTipoLabel = (tipo) => {
    const labels = {
      revenda: "Revenda",
      uso_profissional: "Uso Profissional",
      consumo: "Consumo"
    };
    return labels[tipo];
  };
  const getTipoBadgeVariant = (tipo) => {
    const variants = {
      revenda: "default",
      uso_profissional: "secondary",
      consumo: "outline"
    };
    return variants[tipo];
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Carregando categorias..." });
  }
  if (showForm) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: editingCategoria ? "Editar Categoria" : "Nova Categoria" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CategoriaForm,
        {
          categoria: editingCategoria,
          onSuccess: () => {
            setShowForm(false);
            setEditingCategoria(void 0);
          },
          onCancel: () => {
            setShowForm(false);
            setEditingCategoria(void 0);
          }
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Categorias de Produtos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowForm(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Nova Categoria"
      ] })
    ] }),
    categorias.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhuma categoria cadastrada. Crie categorias para organizar seus produtos!" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: categorias.map((categoria) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-4 h-4 rounded-full",
              style: { backgroundColor: categoria.cor }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: categoria.nome })
        ] }),
        !categoria.ativo && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: "Inativa" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: getTipoBadgeVariant(categoria.tipo), className: "mb-3", children: getTipoLabel(categoria.tipo) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handleEdit(categoria),
            className: "flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-1" }),
              "Editar"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setDeletingId(categoria.id),
            className: "flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-1" }),
              "Excluir"
            ]
          }
        )
      ] })
    ] }, categoria.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!deletingId, onOpenChange: () => setDeletingId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirmar exclusão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Tem certeza que deseja excluir esta categoria? Os produtos associados não serão excluídos, mas perderão a referência à categoria." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleDelete, children: "Excluir" })
      ] })
    ] }) })
  ] });
}

function VendaForm({ onSuccess }) {
  const { createVenda } = useSupabaseVendas();
  const { produtos } = useSupabaseProdutos();
  const { clientes } = useSupabaseClientes();
  const { categorias } = useSupabaseCategorias();
  const [clienteId, setClienteId] = reactExports.useState("");
  const [dataVenda, setDataVenda] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const [formaPagamento, setFormaPagamento] = reactExports.useState("");
  const [observacoes, setObservacoes] = reactExports.useState("");
  const [itens, setItens] = reactExports.useState([
    { produto_id: "", quantidade: 1, valor_unitario: 0, valor_total: 0 }
  ]);
  const produtosRevenda = produtos.filter((p) => p.categoria === "revenda" && p.ativo);
  const [categoriaFiltro, setCategoriaFiltro] = reactExports.useState("todas");
  const categoriasDisponiveis = Array.from(new Set(produtosRevenda.map((p) => p.categoria_id).filter(Boolean))).map((id) => {
    const cat = categorias.find((c) => c.id === id);
    return { id: String(id), nome: cat ? cat.nome : String(id) };
  });
  const produtosFiltrados = produtosRevenda.filter((p) => categoriaFiltro === "todas" || String(p.categoria_id || "") === categoriaFiltro);
  const adicionarItem = () => {
    setItens([...itens, { produto_id: "", quantidade: 1, valor_unitario: 0, valor_total: 0 }]);
  };
  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };
  const atualizarItem = (index, campo, valor) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    if (campo === "produto_id") {
      const produto = produtos.find((p) => p.id === valor);
      if (produto) {
        novosItens[index].valor_unitario = produto.preco_venda;
      }
    }
    if (campo === "quantidade" || campo === "valor_unitario") {
      novosItens[index].valor_total = novosItens[index].quantidade * novosItens[index].valor_unitario;
    }
    setItens(novosItens);
  };
  const calcularTotal = () => {
    return itens.reduce((sum, item) => sum + item.valor_total, 0);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itens.some((item) => !item.produto_id)) {
      alert("Selecione um produto para cada item");
      return;
    }
    try {
      await createVenda({
        cliente_id: clienteId || void 0,
        data_venda: dataVenda,
        forma_pagamento: formaPagamento || void 0,
        observacoes: observacoes || void 0,
        itens
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-4", children: "Informações da Venda" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cliente (opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: clienteId, onValueChange: setClienteId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um cliente" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clientes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.nome }, c.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Data da Venda" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: dataVenda,
              onChange: (e) => setDataVenda(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Forma de Pagamento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formaPagamento, onValueChange: setFormaPagamento, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dinheiro", children: "Dinheiro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pix", children: "PIX" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cartao_credito", children: "Cartão de Crédito" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cartao_debito", children: "Cartão de Débito" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: observacoes,
              onChange: (e) => setObservacoes(e.target.value),
              placeholder: "Observações sobre a venda"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: "Itens da Venda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: adicionarItem, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
          "Adicionar Item"
        ] })
      ] }),
      produtosRevenda.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-4", children: 'Nenhum produto de revenda cadastrado. Cadastre produtos com a categoria "Revenda" para poder vendê-los.' }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-3 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Filtrar por Categoria" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoriaFiltro, onValueChange: setCategoriaFiltro, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Todas" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todas", children: "Todas" }),
            categoriasDisponiveis.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, children: c.nome }, c.id))
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: itens.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-12 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Produto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: item.produto_id,
              onValueChange: (value) => atualizarItem(index, "produto_id", value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o produto" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: produtosFiltrados.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: p.id, children: [
                  p.nome,
                  " - R$ ",
                  p.preco_venda.toFixed(2)
                ] }, p.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "0",
              step: "0.01",
              value: item.quantidade,
              onChange: (e) => atualizarItem(index, "quantidade", parseFloat(e.target.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Valor Unitário" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "0",
              step: "0.01",
              value: item.valor_unitario,
              onChange: (e) => atualizarItem(index, "valor_unitario", parseFloat(e.target.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: item.valor_total.toFixed(2),
              disabled: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "icon",
            onClick: () => removerItem(index),
            disabled: itens.length === 1,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
          }
        ) })
      ] }) }, index)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-lg font-semibold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Valor Total:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "R$ ",
          calcularTotal().toFixed(2)
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onSuccess, children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", children: "Registrar Venda" })
    ] })
  ] });
}

function VendasList() {
  const { vendas, loading } = useSupabaseVendas();
  const [showForm, setShowForm] = reactExports.useState(false);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Carregando vendas..." });
  }
  if (showForm) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-4", children: "Registrar Nova Venda" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VendaForm, { onSuccess: () => setShowForm(false) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold", children: "Vendas de Produtos" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowForm(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Nova Venda"
      ] })
    ] }),
    vendas.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhuma venda registrada ainda." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: vendas.map((venda) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold", children: [
            "Venda #",
            venda.id.slice(0, 8)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: venda.status_pagamento === "pago" ? "default" : "secondary", children: venda.status_pagamento === "pago" ? "Pago" : "Pendente" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Data: ",
            format(new Date(venda.data_venda), "dd/MM/yyyy", { locale: ptBR })
          ] }),
          venda.forma_pagamento && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Pagamento: ",
            venda.forma_pagamento
          ] }),
          venda.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2", children: venda.observacoes })
        ] }),
        venda.itens_venda && venda.itens_venda.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-2", children: "Itens:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-sm text-muted-foreground space-y-1", children: venda.itens_venda.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            item.quantidade,
            "x - R$ ",
            item.valor_unitario.toFixed(2),
            " = R$ ",
            item.valor_total.toFixed(2)
          ] }, item.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold", children: [
        "R$ ",
        venda.valor_total.toFixed(2)
      ] }) })
    ] }) }, venda.id)) })
  ] });
}

function Produtos() {
  const [activeTab, setActiveTab] = reactExports.useState("produtos");
  const { produtos } = useSupabaseProdutos();
  const { compras } = useSupabaseCompras();
  const { vendas } = useSupabaseVendas();
  const estatisticas = {
    totalProdutos: produtos.length,
    produtosAtivos: produtos.filter((p) => p.ativo).length,
    estoqueTotal: produtos.reduce((sum, p) => sum + p.estoque_atual, 0),
    comprasRealizadas: compras.length,
    vendasRealizadas: vendas.length
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold", children: "Produtos e Estoque" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground mt-1", children: "Gerencie seus produtos, fornecedores e movimentações de estoque" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors",
          onClick: () => setActiveTab("produtos"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-lg flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 sm:h-6 sm:w-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground truncate", children: "Total de Produtos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl sm:text-2xl font-bold", children: estatisticas.totalProdutos })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors",
          onClick: () => setActiveTab("produtos"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-green-500/10 rounded-lg flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 sm:h-6 sm:w-6 text-green-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground truncate", children: "Produtos Ativos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl sm:text-2xl font-bold", children: estatisticas.produtosAtivos })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors",
          onClick: () => setActiveTab("produtos"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-blue-500/10 rounded-lg flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 sm:h-6 sm:w-6 text-blue-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground truncate", children: "Estoque Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl sm:text-2xl font-bold", children: estatisticas.estoqueTotal })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors",
          onClick: () => setActiveTab("compras"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-purple-500/10 rounded-lg flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5 sm:h-6 sm:w-6 text-purple-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground truncate", children: "Compras Realizadas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl sm:text-2xl font-bold", children: estatisticas.comprasRealizadas })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors",
          onClick: () => setActiveTab("vendas"),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-orange-500/10 rounded-lg flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 sm:h-6 sm:w-6 text-orange-600" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground truncate", children: "Vendas Realizadas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl sm:text-2xl font-bold", children: estatisticas.vendasRealizadas })
            ] })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "produtos", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline", children: "Produtos" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "fornecedores", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline", children: "Fornecedores" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "compras", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline", children: "Compras" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "categorias", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline", children: "Categorias" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "vendas", className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline", children: "Vendas" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "produtos", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProdutosList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "fornecedores", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FornecedoresList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "compras", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComprasList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "categorias", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoriasList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "vendas", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VendasList, {}) })
    ] })
  ] });
}

export { Produtos as default };
