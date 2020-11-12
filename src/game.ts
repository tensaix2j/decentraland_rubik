





import { getUserData }	from "@decentraland/Identity";
import resources     from "src/resources";
import { UpdateSystem } from "src/updatesystem";
import { Txstage }      from "src/txstage";



export type EmitArg = {
	userID: string,
};


//----------------------------
export class MainClass {

	public messageBus;
	public userID;
	public stages = [];

	constructor() {

		var _this = this;
		let userData = executeTask(async () => {
			
            let data = await getUserData()
			log(data.displayName)
			let userID = data.displayName
			_this.start( userID );
		});
	}


	//---------------------
	public start( userID ) {

		let _this = this;
		this.userID = userID;
		
		log( Date(), "start", userID );
		 
		const camera = Camera.instance;
        let stage = new Txstage( 
            "stage", 
            userID , 
            {
				position: new Vector3( 8, 4.5, 8),
				scale   : new Vector3( 1, 1, 1 )
		    }, 
            camera 
        );

        this.stages.push( stage );
			
		// Add system to engine
		engine.addSystem(new UpdateSystem( this.stages , camera ))


		let floor = new Entity();
		floor.addComponent( resources.models.stage );
		floor.addComponent( new Transform({
			position:new Vector3(8,0,8),
			scale : new Vector3(0.95,1,0.95)
		}));
		engine.addEntity( floor );
				


	} 

}


new MainClass();



