import { Container as LContainer, LoadingPage } from "./loadingPage";
import { Container as MContainer, FileInput, Input, MerchandiseFormPage, onChange, onDrag, onDrop, onSubmit, Wrapper } from "./merchandiseFormPage";
import { css } from '@emotion/css';
import { EntityManager } from "../entityManager";

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
    return this;
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
    entityManager: EntityManager;

    constructor(canvas: HTMLCanvasElement, entityManager: EntityManager) {
        this.pages = {
            [PageEnum.None]: canvas,
            [PageEnum.Loading]: this.createContainer(),
            [PageEnum.LoginForm]: this.createContainer(),
            [PageEnum.RegisterForm]: this.createContainer(),
            [PageEnum.MerchandiseForm]: this.createContainer(),
        }

        this.entityManager = entityManager;
        this.currentPage = PageEnum.None;
        this.init();
    }

    createContainer() {
        return document.createElement("div").addClassName(PageContainer);
    }

    init() {
        this.initLoadingPage();
        this.initMerchandiseForm();

        this.currentPage = PageEnum.Loading;
        document.body.appendChild(this.pages[PageEnum.Loading]);
        this.pages[PageEnum.Loading].style.transform = "translateY(0)";
    }

    initLoadingPage() {
        const page = this.pages[PageEnum.Loading];
        page.addClassName(LContainer);
        page.innerHTML = LoadingPage;

        document.body.appendChild(page);
    }

    initMerchandiseForm() {
        const page = this.pages[PageEnum.MerchandiseForm];
        page.addClassName(MContainer);
        page.innerHTML = MerchandiseFormPage;

        document.body.appendChild(page);

        (document.getElementsByClassName(FileInput)[0] as HTMLDivElement).addEventListener("dragleave", onDrag);
        (document.getElementsByClassName(FileInput)[0] as HTMLDivElement).addEventListener("dragenter", onDrag);
        (document.getElementsByClassName(FileInput)[0] as HTMLDivElement).addEventListener("dragover", onDrag);
        (document.getElementsByClassName(FileInput)[0] as HTMLDivElement).addEventListener("drop", onDrop);
        (document.getElementsByClassName(Input)[2] as HTMLInputElement).addEventListener("input", onChange);
        (document.getElementsByClassName(Wrapper)[0] as HTMLFormElement).addEventListener("submit", e => {
            onSubmit(e, this.entityManager);
            this.initPage(PageEnum.None);
        });
    }

    updateProgress(percent: number) {
        document.getElementById("percent")!.innerHTML = `${percent}%`;
        document.getElementById("circle")!.style.transform = `translateY(${100 - percent}%)`;
    }

    initPage(page: PageEnum) {
        const { currentPage } = this;
        
        if(currentPage !== PageEnum.None) this.pages[currentPage].style.transform = "translateY(100%)";
        else document.getElementById("point")!.style.display = "none";

        if(page !== PageEnum.None) {
            document.exitPointerLock();
            this.pages[page].style.transform = "translateY(100%)";
            setTimeout(() => {
                this.pages[page].style.transform = "translateY(0)";
            }, PageTransitionDuration);
        } else {
            document.body.requestPointerLock();
            document.getElementById("point")!.style.display = "block";
        }

        this.currentPage = page;
    }
}