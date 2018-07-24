import 'phaser';
declare function getState(game: Phaser.Game): {
    preload: () => void;
    create: () => void;
    update: () => void;
    render: () => void;
};
export default getState;
