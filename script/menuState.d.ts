import { default as GameState } from "./gameState";
export default class MenuState extends GameState {
    index: number;
    private menuText;
    private menuItems;
    private _index;
    preload(): void;
    create(): void;
    update(): void;
}
