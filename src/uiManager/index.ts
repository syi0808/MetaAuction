import { Container, LoadingPage } from "./loadingPage";
import { css } from '@emotion/css';

export enum PageEnum {
    None = 0,
    Loading = 1,
    LoginForm = 2,
    RegisterForm = 3,
    MerchandiseForm = 4,
}

type Pages = { [key in PageEnum]: HTMLElement};

Element.prototype.addClassName = function(name) {
    this.setAttribute("class", `${this.getAttribute("class")} ${name}`);
}

export const PageTransitionDuration = 800;

const PageContainer = css`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(100%);
    transition: transform ${PageTransitionDuration}ms ease-in-out;
`;

export class UIManager {
    private pages: Pages;
    currentPage: PageEnum;

    constructor(canvas: HTMLCanvasElement) {
        this.pages = {
            [PageEnum.None]: canvas,
            [PageEnum.Loading]: this.createContainer(),
            [PageEnum.LoginForm]: this.createContainer(),
            [PageEnum.RegisterForm]: this.createContainer(),
            [PageEnum.MerchandiseForm]: this.createContainer(),
        }

        this.currentPage = PageEnum.None;
        this.init();
    }

    createContainer() {
        const dom = document.createElement("div");
        dom.addClassName(PageContainer);
        return dom;
    }

    init() {
        this.initLoadingPage();

        this.currentPage = PageEnum.Loading;
        document.body.appendChild(this.pages[PageEnum.Loading]);
        this.pages[PageEnum.Loading].style.transform = "translateY(0)";
    }

    initLoadingPage() {
        const page = this.pages[PageEnum.Loading];
        page.addClassName(Container);
        page.innerHTML = LoadingPage;
    }

    updateProgress(percent: number) {
        document.getElementById("percent")!.innerHTML = `${percent}%`;
        document.getElementById("circle")!.style.transform = `translateY(${100 - percent}%)`;
    }

    initPage(page: PageEnum) {
        if(this.currentPage !== PageEnum.None) {
            this.pages[this.currentPage].style.transform = "translateY(100%)";
            setTimeout(() => {
                if(this.currentPage !== PageEnum.None) {
                    document.body.removeChild(this.pages[this.currentPage]);
                    this.pages[this.currentPage].style.transform = "";
                }
            }, PageTransitionDuration);
        }

        if(page !== PageEnum.None) {
            this.pages[page].style.transform = "translateY(0)";
            setTimeout(() => {
                document.body.appendChild(this.pages[page]);
                this.pages[page].style.transform = "";
            }, PageTransitionDuration);
        }

        this.currentPage = page;
    }
}