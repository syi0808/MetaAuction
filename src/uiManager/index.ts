import { 
    Circle, 
    Container, 
    InnerCircle, 
    Percent, 
    Water 
} from "./loadingPageStyles";

export enum PageEnum {
    None = 0,
    Loading = 1,
}

interface Pages {
    [PageEnum.Loading]: HTMLDivElement;
    
}

Element.prototype.setClassName = function(name) {
    this.setAttribute("class", name);
}

export const PageTransitionDuration = 800;

export class UIManager {
    private pages: Pages;
    currentPage: PageEnum;

    constructor() {
        this.pages = {
            [PageEnum.Loading]: this.createContainer(),
        }

        this.currentPage = PageEnum.None;
        this.init();
    }

    createContainer() {
        const dom = document.createElement("div");
        dom.style.transform = "translateY(100%)";
        dom.style.transition = `transform ${PageTransitionDuration}ms ease-in-out`;
        return dom;
    }

    private init() {
        this.initLoadingPage();

        this.pages[PageEnum.Loading].style.transform = "translateY(0)";
        document.body.appendChild(this.pages[PageEnum.Loading]);
        this.currentPage = PageEnum.Loading;
    }

    private initLoadingPage() {
        const page = this.pages[PageEnum.Loading];
        page.setClassName(Container);
        
        page.innerHTML = `
            <div class="${Circle}">
                <div id="circle" class="${InnerCircle}">
                    <div class="${Water}"></div>
                </div>
                <span id="percent" class=${Percent}>0%</span>
            </div>
        `;
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