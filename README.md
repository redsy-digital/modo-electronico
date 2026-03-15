# Modo Electrónico 🔌

O **Modo Electrónico** é uma plataforma de e-commerce moderna e intuitiva, desenvolvida para a venda de produtos eletrónicos. O sistema conta com uma interface de utilizador fluida e um painel de administração robusto para gestão de inventário em tempo real.

## 🚀 Funcionalidades Principais

### Para Utilizadores
*   **Catálogo Dinâmico:** Listagem de produtos com carregamento em tempo real a partir do banco de dados.
*   **Filtros Inteligentes:** Pesquisa por nome e filtragem rápida por categorias.
*   **Detalhes do Produto:** Galeria de imagens interativa e informações técnicas detalhadas.
*   **Compra via WhatsApp:** Integração direta para facilitar o fecho de vendas.

### Painel de Administração (Admin)
*   **Dashboard de Estatísticas:** Visualização rápida do total de produtos, categorias e destaques.
*   **Gestão de Produtos:** Interface completa para Adicionar, Editar e Eliminar produtos.
*   **Sistema de Imagens:** Upload automático de múltiplas imagens para o Supabase Storage com geração de URLs públicas.
*   **Categorias Dinâmicas:** Gestão centralizada de categorias sincronizada com a loja.
*   **Segurança:** Autenticação protegida e políticas de acesso (RLS) configuradas.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** HTML5, CSS3 (Design Responsivo), JavaScript (ES6+).
*   **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL).
*   **Storage:** Supabase Storage para armazenamento de imagens de alta performance.
*   **Deployment:** [Vercel](https://vercel.com/).

## ⚙️ Configuração do Projeto

1.  **Base de Dados:** O projeto utiliza as tabelas `products`, `product_images` e `categories` no Supabase.
2.  **Storage:** É necessário um bucket público chamado `product-images` para o armazenamento das fotos.
3.  **Conexão:** As credenciais de API estão configuradas no ficheiro `assets/js/supabase.js`.

## 📝 Licença

Este projeto foi desenvolvido para a **Modo Electrónico**. Todos os direitos reservados.
