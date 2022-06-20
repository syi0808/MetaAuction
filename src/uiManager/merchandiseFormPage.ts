import { css } from '@emotion/css';
import { EntityManager } from '../entityManager';
import { ExhibitModel } from '../modelManager/exhibit';

export const Container = css`
    width: 100%;
    height: 100%;
    background: #A2DE9C;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Wrapper = css`
    width: 1000px;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Input = css`
    width: 100%;
    padding: 8px 14px;
    background: white;
    border: 1px solid rgb(100, 100, 100);
    border-radius: 4px;
`;

export const FileInput = css`
    width: 100%;
    height: 450px;
    border: 2px dotted rgb(50, 50, 50);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

export const Text = css`
    font-size: 26px;
    font-weight: 600;
    color: rgb(70, 70, 70);
`;

export const Button = css`
    width: 100%;
    padding: 16px 0;
    display: flex;
    justify-content: center;
    background: white;
    border-radius: 8px;
    cursor: pointer;
`;

export const MerchandiseFormPage = `
    <div class="${Container}">
        <form class="${Wrapper}">
            <input name="name" class="${Input}" type="text" placeholder="상품명을 입력하세요.">
            <input name="price" class="${Input}" type="number" placeholder="상품가격을 입력하세요.">
            <label class="${FileInput}">
                <h1 class="${Text}">파일을 드래그해주세요.</h1>
                <input name="file" class="${Input}" style="display: none;" type="file" multiple placeholder="상품명을 입력하세요.">
            </label>
            <button class="${Button}">상품 올리기</button>
        </form>
    </div>
`;

export const onDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
}

export const onDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    document.getElementsByClassName(Text)[0].innerHTML = `${[...e.dataTransfer!.files].map(file => `${file.name}, ${(file.size / (1024*1024)).toFixed(2)}MB`).join("<br>")}`;
}

export const onChange = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    document.getElementsByClassName(Text)[0].innerHTML = `${[...(e.target! as EventTarget & { files: File[]; }).files].map(file => `${file.name}, ${(file.size / (1024*1024)).toFixed(2)}MB`).join("<br>")}`;
}

export const onSubmit = (e: SubmitEvent, entityManager: EntityManager) => {
    e.preventDefault();
    const { name, price, file } = (e.target as EventTarget & { [key: string]: HTMLInputElement; });
    entityManager.addModel(new ExhibitModel({ price: Number(price.value), title: name.value, type: "image", url: URL.createObjectURL(file.files![0]) }), { mass: 0, position: [20, 1, 5], degree: [0, 90, 0] });
}