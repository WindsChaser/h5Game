import 'phaser';

/**
 * 自定义游戏状态基类，已实现：
 * 显示画面帧率
 */
class GameState extends Phaser.State
{
	/**
	 * 显示在画面左上角的帧率
	 */
	private fps: Phaser.Text;

	public showFPS: boolean;

	constructor()
	{
		super();
		this.showFPS = true;
	}

	create()
	{
		this.game.time.advancedTiming = true;//允许记录时间信息
		this.fps = this.game.add.text(0, 0, "", {fill: "#ff0000", fontSize: 30});//显示帧率
		this.fps.fixedToCamera = true;//固定显示在相机视野
	}

	/**
	 * 渲染结束后，更新帧率文字
	 */
	render()
	{
		this.fps.text = "Fps:" + this.game.time.fps;
		this.fps.bringToTop();//置于最上层
	};
}

export default GameState;