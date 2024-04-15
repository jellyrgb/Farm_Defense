import Label from "./Label";
import Color from "../../Utils/Color";
import Vec2 from "../../DataTypes/Vec2";

/** A clickable button UIElement */
export default class Button extends Label {

	constructor(position: Vec2, text: string, fontSize: number = 40) { 
		super(position, text);
	
		this.fontSize = fontSize;
		this.backgroundColor = new Color(0, 0, 0, 0);
		this.borderColor = new Color(0, 0, 0, 0);
		this.textColor = new Color(255, 255, 255);
		this.borderWidth = 0;
	}

	// @override
	calculateBackgroundColor(): Color {
		// Change the background color if clicked or hovered
		if(this.isEntered && !this.isClicked){
			return this.backgroundColor.lighten();
		} else if(this.isClicked){
			return this.backgroundColor.darken();
		} else {
			return this.backgroundColor;
		}
	}
	
}