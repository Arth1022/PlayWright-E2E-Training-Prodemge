const logoutLocators = {

    sairMenu: "//span[contains(@class,'oxd-userdropdown-tab')]",

    getDefinirLogout(opcao) {
        return `//ul[contains(@class,'oxd-dropdown-menu')]//a[normalize-space()="${opcao}"]`;
    }

};
export default logoutLocators;
