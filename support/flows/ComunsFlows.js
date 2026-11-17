import ComunsPage from "../pages/ComunsPage";

export default class ComunsFlows {
  constructor(page) {
    this.page = page;
    this.comunsPage = new ComunsPage(page);
  }


}
