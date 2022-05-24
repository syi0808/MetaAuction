import { css, keyframes } from '@emotion/css';

export const Container = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #A2DE9C;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Circle = css`
    width: 300px;
    height: 300px;
    border: 7px solid #444;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const InnerCircle = css`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 50%;
    transition: transform .5s ease-in-out;
    transform: translateY(100%);
`;

const Rotate = keyframes`
    from {
        transform: translateX(-50%) rotate(0);
    }

    to {
        transform: translateX(-50%) rotate(360deg);
    }
`;

export const Water = css`
    width: 200%;
    height: 200%;
    border-radius: 30%;
    background: #90C8DA;
    transform: translateX(-50%);
    animation: ${Rotate} 3s infinite linear;
`;

export const Percent = css`
    font-family: 'Koulen', cursive;
    font-size: 42px;
    z-index: 2;
`;