const comunsLocators = {

    carregamentoTela: "//div[contains(@class,'oxd-layout-context')]",
    tituloModal: "//div[@role='document']//p[contains(@class,'oxd-text--card-title')]",


    getTituloTela(nomeTela) {
        return `//h6[contains(@class,'orangehrm-main-title')][normalize-space()="${nomeTela}"]`;
    },

    getTituloListagem(nomeTela) {
        return `//h5[contains(@class,'oxd-table-filter-title')][normalize-space()="${nomeTela}"]`;
    },

    getOpcaoMenu(opcao) {
        return `//aside//a[contains(@class,'oxd-main-menu-item')][.//span[normalize-space()="${opcao}"]]`;
    },

    // Filtra pelo texto porque o sistema pode exibir mais de uma mensagem ao mesmo tempo
    // (ex: "Successfully Deleted" junto com "No Records Found")
    getMensagemTemporaria(mensagem) {
        return `//div[contains(@class,'oxd-toast-container')]//p[contains(@class,'oxd-text--toast-message')][normalize-space()="${mensagem}"]`;
    },

    getBotao(nomeBotao) {
        return `//button[normalize-space()="${nomeBotao}"]`;
    },

    
    getCampoPorLabel(nomeCampo) {
        return `//label[normalize-space()="${nomeCampo}"]/parent::div/following-sibling::div//input`;
    },

    getCampoPorPlaceholder(placeholder) {
        return `//input[@placeholder="${placeholder}"]`;
    },

    getMensagemErroPorPlaceholder(placeholder) {
        return `//input[@placeholder="${placeholder}"]/parent::div/following-sibling::span[contains(@class,'oxd-input-field-error-message')]`;
    },

    getMensagemErroPorLabel(nomeCampo) {
        return `//label[normalize-space()="${nomeCampo}"]/parent::div/following-sibling::span[contains(@class,'oxd-input-field-error-message')]`;
    },

    getCheckboxPorLabel(nomeCampo) {
        return `//label[normalize-space()="${nomeCampo}"]/parent::div/following-sibling::div//span[contains(@class,'oxd-checkbox-input')]`;
    },

    getDropdownPorLabel(nomeCampo) {
        return `//label[normalize-space()="${nomeCampo}"]/parent::div/following-sibling::div//div[contains(@class,'oxd-select-text-input')]`;
    },


    getOpcaoLista(opcao) {
        return `//div[@role='listbox']//div[@role='option'][normalize-space()="${opcao}"]`;
    },

    // Celula da listagem que contem exatamente a informacao pesquisada,
    // permitindo comparar o dado esperado com o que o site exibe na coluna
    getInformacaoNaLista(informacao) {
        return `//div[contains(@class,'oxd-table-body')]//div[contains(@class,'oxd-table-row')]//div[@role='cell'][normalize-space()="${informacao}"]`;
    },

    // Linha inteira da listagem, usada para acionar os botoes do registro localizado
    getLinhaNaLista(informacao) {
        return `//div[contains(@class,'oxd-table-body')]//div[contains(@class,'oxd-table-row')][.//div[@role='cell'][normalize-space()="${informacao}"]]`;
    },

    getExcluirNaLinha(informacao) {
        return `${this.getLinhaNaLista(informacao)}//button[.//i[contains(@class,'bi-trash')]]`;
    },

    getEditarNaLinha(informacao) {
        return `${this.getLinhaNaLista(informacao)}//button[.//i[contains(@class,'bi-pencil-fill')]]`;
    },

    getBotaoModal(nomeBotao) {
        return `//div[@role='document']//button[normalize-space()="${nomeBotao}"]`;
    },

};

export default comunsLocators;
