import { Application, Graphics, Text } from 'pixi.js';
import { shapesData } from './data.json';
import "./style.css";

const app = new Application();

async function setup() {
  await app.init({ 
    background: '#EEEEEE', 

    resizeTo: window,
    
  });

  app.renderer.resize(window.innerWidth, window.innerHeight);
  document.body.appendChild(app.canvas);
  console.log('test');
}

(async () => {
  await setup();
  const shape = new Shapes(app);

  window.addEventListener('keydown', (event) => {
    if (event.key === 's' || event.key === 'S') {
      //Press s to cycle through the shapes
      shape.updateShape() 
    }
    if (event.key === 'e' || event.key === 'E') {
      //Press e to cycle through border colours (red, green, yellow, blue)
      shape.updateBorderColour() 
    }
    if (event.key === 'b' || event.key === 'B') {
      //Press b to cycle through background colours (red, green, yellow, blue)
        shape.updateBackgroundColour() 
    } 
    if (event.key === 't' || event.key === 'T') {
      //Press t to cycle through border thickness in pixels - 2,4,6,8
      shape.updateBorderThickness() 
    }
    if (event.key === 'ArrowLeft') {
      //Rotate the current shape anti clockwise using the left arrow
      shape.rotateShapeLeft()
    }
    if (event.key === 'ArrowRight') {
      //Rotate the current shape clockwise using the right arrows
      shape.rotateShapeRight()
    }
    if (event.key === 'ArrowUp') {
      //Zoom in using the up arrow
      shape.scaleUpShape()
    }
    if (event.key === 'ArrowDown') {
      //Zoom out using down arrow
      shape.scaleDownShape()
    }
  });
})();

interface Shape {
  name: string;
  data: number[];
}

interface ShapesJSON {
  [key: string]: Shape;
}

class Shapes {    
  private app: Application;
  private colourPool: string[] = [];
  private shapesData : ShapesJSON;
  private graphics: Graphics;
  private shapeNum : number;
  private bgColNum : number;
  private borderColNum : number;
  private borderWidth : number;
  private scale : number;
  private shape : number[] =[];
  private rot : number;
  private text: Text;

  constructor(app: Application) {
    this.app = app;
    this.graphics = new Graphics();
    this.app.stage.addChild(this.graphics);
    this.colourPool = ['0xFF8888', '0xBBFFAA', '0x99DDFF', '0xFFFFAA'];
    this.shapeNum = 0;
    this.bgColNum = 0;
    this.borderColNum = 0;
    this.borderWidth = 2;
    this.borderWidth = 2;
    this.scale = 1;
    this.rot = 0;
    this.shapesData = shapesData as ShapesJSON;

    this.text = new Text( {text: this.shapesData[0].name, style:{ fontSize: 24, fill: "black",  align: 'center'}});
    this.text.anchor.set(0.5, 0.5);
    this.text.x = this.app.screen.width/2;
    this.text.y = this.app.screen.height/8 ;
    this.app.stage.addChild(this.text);

    this.drawShape()
  }

  private drawShape(){
    this.graphics.clear();
    this.shape =[];
  
    for(let i = 0; i < this.shapesData[this.shapeNum].data.length;  i +=2){
      //Change Points & redraw instrad of using pixi.js to rotate
      let x = this.shapesData[this.shapeNum].data[i];
      let y = this.shapesData[this.shapeNum].data[i+1];
      let newX = (x * Math.cos(this.rot) - y * Math.sin(this.rot))*this.scale;
      let newY = (x * Math.sin(this.rot) + y * Math.cos(this.rot))*this.scale;
      this.shape.push(newX, newY);
    }

    this.graphics.poly(this.shape);
    this.graphics.fill(this.colourPool[this.bgColNum]);
    this.graphics.stroke({ width: this.borderWidth, color: this.colourPool[this.borderColNum] });
    this.graphics.x = window.innerWidth/2;
    this.graphics.y = window.innerHeight/2;     

    //Update text
    this.text.text = this.shapesData[this.shapeNum].name
  }

  public updateShape(){
    this.shapeNum = (this.shapeNum +1) % Object.keys(this.shapesData).length;  
    this.drawShape()
  }

  public updateBackgroundColour(){
    this.bgColNum = (this.bgColNum +1) % this.colourPool.length;  
    this.drawShape()
  }
  
  public updateBorderColour(){
    this.borderColNum = (this.borderColNum +1) % this.colourPool.length;  
    this.drawShape()
  }

  public updateBorderThickness(){
    this.borderWidth = this.borderWidth >= 8 ? 2 : this.borderWidth +2 ;  
    this.drawShape();
  }

  public scaleUpShape(){
    this.scale = this.scale < 10 ? this.scale + 0.2 : this.scale;  
    this.drawShape();
  }
  
  public scaleDownShape(){
    this.scale = this.scale > 0.2 ? this.scale - 0.2 : this.scale;  
    this.drawShape();
  }

  public rotateShapeLeft(){
    this.rot -= 0.1;
    this.drawShape();
  }

  public rotateShapeRight(){
    this.rot += 0.1;
    this.drawShape();
  }
};