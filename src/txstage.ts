
import { Txface }      from "src/txface";
import resources from "src/resources";
import { Txclickable_box} from "src/txclickable_box";
import {Utils} from "src/utils"
import { getUserAccount, RPCSendableMessage  } from '@decentraland/EthereumController'




export class Txstage extends Entity {

	public id;
	public userID;
	public transform;
	public camera;



	public cubepivots = [];
	public orifaces   = [];
	public curfaces   = [];
	public face_arr   = [];

	public facematerials;

	public rotating = null;
	public cubeframe;

	public anim_rot = 0;
	public cubesize = 0.5;
	public facesize = 0.9;

	public rot_mode = 0;
	public sel_center_piece = 12;
	public sel_face         = 26;
	public sel_row 			= 0;
	public sel_col 			= 0;


	public buttons = {};
	public mode = 0;
	public lblhighscore;
	public lbltime;

	public record_seconds = 99999;
	public tick = 0;

	public rotate_speed = 5;


	constructor( id, userID , transform_args , camera ) {

		super();
		engine.addEntity(this);

		this.id = id;
		this.userID = userID;
		this.transform = new Transform( transform_args );
		this.camera = camera;

		this.addComponent(  this.transform );
		let _this = this;


		let h,i,j;
		let size = this.cubesize;
		let gap  = 0.00;
		let cube_id = 0;
		let facesize = this.facesize;


		let cubematerial = new Material();
		cubematerial.albedoColor = Color3.FromInts(0,0,0);

		let facematerials = [] 
		facematerials[0] = new Material();
		facematerials[0].albedoColor = Color3.FromInts(255,0,0);
		
		facematerials[1] = new Material();
		facematerials[1].albedoColor = Color3.FromInts(0, 150 ,0);
		
		facematerials[2] = new Material();
		facematerials[2].albedoColor = Color3.FromInts(0,0,255);
		
		facematerials[3] = new Material();
		facematerials[3].albedoColor = Color3.FromInts(255,255,0);
		
		facematerials[4] = new Material();
		facematerials[4].albedoColor = Color3.FromInts(255,255,255);
		
		facematerials[5] = new Material();
		facematerials[5].albedoColor = Color3.FromInts(255, 140, 0);
						
		this.facematerials = facematerials;

		for ( h = 0 ; h < 6 ; h++ ) {
			this.orifaces.push([]);
			this.curfaces.push([]);
		}


		let faceid = 0;
						
		
		for ( h = 0 ; h < 3 ; h++ ) {

			for ( i = 0 ; i < 3; i++ ) {
				for ( j = 0 ; j < 3 ; j++) {

					if ( cube_id != 13 ) {
						

						let cubepivot = new Entity();
						cubepivot.setParent( this );
						cubepivot.addComponent( new Transform );
						this.cubepivots[cube_id] = cubepivot ;
						
						let cube = new Entity();
						let x =  ( i - 1 ) * (size + gap);
						let y =  ( h - 1 ) * (size + gap);
						let z =  ( j - 1 ) * (size + gap);



						cube.setParent( cubepivot );
						cube.addComponent( new BoxShape() );
						cube.addComponent( new Transform({
							position: new Vector3(x,y,z ),
							scale   : new Vector3(size,size,size)
						}) );

						cube.addComponent( cubematerial );


						let face;
						let matid;



						// Corner 
						if ( [0,2,6,8,  18,20,24,26 ].indexOf( cube_id ) > -1 ) {



							//--------------
							//Face0
							y = -0.51;
							matid = 0;
							
							if ( [ 18 , 20, 24,26   ].indexOf( cube_id ) > -1  ) { 
								y = 0.51;
								matid = 5;
							}

							faceid = this.face_arr.length;
							face = new Txface( 
								faceid, 
								cube, {
									position:new Vector3( 0, y , 0),
									scale: new Vector3( facesize, facesize, facesize )
								} , 
								this , 
								new Vector3(90,0,0), 
								facematerials[matid],
								matid, 
								cube_id
							);
							this.orifaces[matid].push( faceid  )
							this.face_arr.push( face );
								

							

							//--------------
							//Face1
							z = -0.51;
							matid = 1;
							
							if ( [ 0 , 6 , 18 ,24   ].indexOf( cube_id ) > -1  ) { 
								z = - 0.51
								matid = 1;
							} else if ( [ 2, 8, 20,26  ].indexOf( cube_id ) > -1  )  {
								z = 0.51
								matid = 2;
							}
							faceid = this.face_arr.length;
							face = new Txface( 
								faceid, 
								cube, {
									position:new Vector3( 0, 0 , z),
									scale: new Vector3( facesize, facesize, facesize )
								} , 
								this , 
								new Vector3(0,0,0), 
								facematerials[matid],
								matid,
								cube_id
							);
							this.orifaces[matid].push( faceid )
							this.face_arr.push( face );
							

							

							
							//--------------	
							//Face2
							x = -0.51;
							matid = 3;
							
							if ( [ 0 , 2 , 18,20  ].indexOf( cube_id ) > -1  ) { 
								x = -0.51
								matid = 3;
							} else if ( [ 6, 8, 24, 26 ].indexOf( cube_id ) > -1  )  {
								x = 0.51
								matid = 4;
							}

							faceid = this.face_arr.length;
							face = new Txface( 
								faceid, 
								cube, {
									position:new Vector3( x, 0 , 0),
									scale: new Vector3( facesize, facesize, facesize )
								} , 
								this , 
								new Vector3(0,90,0), 
								facematerials[matid],
								matid,
								cube_id
							);

							this.orifaces[matid].push( faceid )
							this.face_arr.push( face );
							

							
						}




						// Edge 
						if ( [ 1,3, 5,7,  9,11,15,17,  19,21,23,25].indexOf( cube_id) > -1 ) {

							

							let matid = 1;
							
							if ( [1,7,  19,25].indexOf( cube_id ) > -1 ) {
								
								// Face 1.0
								let x = -0.51;
								matid = 3;
								if ( [7, 25].indexOf(cube_id) > -1 ) {
									x = 0.51;
									matid = 4;
								}

								faceid = this.face_arr.length;
								face = new Txface( 
									faceid , 
									cube, {
										position:new Vector3( x, 0 , 0),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(0,90,0), 
									facematerials[matid],
									matid,
									cube_id  
								);

								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
							

							



								//-----------
								// Face 1.1
								let y = -0.51;
								matid = 0;
								
								if ( [19, 25].indexOf(cube_id) > -1 ) {
									y = 0.51;
									matid = 5;
								}
								faceid = this.face_arr.length;
								face = new Txface( 
									faceid, 
									cube, {
										position:new Vector3( 0, y , 0),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(90,0,0), 
									facematerials[matid],
									matid ,
									cube_id
								);

								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
								

							



							} else if ( [9, 11,15,17   ].indexOf( cube_id ) > -1  ) { 


								//------------------
								// Face 2.0
								
								let x = -0.51;
								matid = 3;

								if ( [15, 17].indexOf(cube_id) > -1 ) {
									x = 0.51;
									matid = 4;
								}
								faceid = this.face_arr.length;
								face = new Txface( 
									faceid , 
									cube, {
										position:new Vector3( x, 0 , 0),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(0,90,0), 
									facematerials[matid],
									matid ,
									cube_id
								);

								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
								

							

								//------------------
								// Face 2.1
								let z = -0.51;
								matid = 1;
								if ( [11, 17].indexOf(cube_id) > -1 ) {
									z = 0.51;
									matid = 2;
								}
								faceid = this.face_arr.length;
								face = new Txface( 
									faceid, 
									cube, {
										position:new Vector3( 0, 0 , z),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(0,0,0), 
									facematerials[matid],
									matid,
									cube_id  
								);
								
								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
								

							


							} else if ( [3,  5,     21,23   ].indexOf( cube_id ) > -1 ) {
									
								// Face 3.0
								let z = -0.51;
								matid = 1;

								if ( [5,23].indexOf( cube_id ) > -1 ) {
									z = 0.51;
									matid = 2;
								}
								faceid = this.face_arr.length;
								face = new Txface( 
									faceid , 
									cube, {
										position:new Vector3( 0, 0 , z),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(0,0,0), 
									facematerials[matid],
									matid,
									cube_id 
								);
								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
							

							

								//-----------
								// Face 3.1
								let y = -0.51;
								matid = 0;
								if ( [21, 23].indexOf(cube_id) > -1 ) {
									y = 0.51;
									matid = 5;
								}
								faceid = this.face_arr.length;
								face = new Txface( 
									faceid, 
									cube, {
										position:new Vector3( 0, y , 0),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(90,0,0), 
									facematerials[matid],
									matid,
									cube_id
								);

								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
								

							

							}
							
						}







						// Center
						if ( [4,10,12,14,16,22].indexOf( cube_id ) > -1 ) {
							
							if ( [4, 22].indexOf(cube_id) > -1 ) {
								
								y = -0.51
								matid = 0;
								if ( cube_id == 22 ) {
									y = 0.51;
									matid = 5;
								}
								faceid = this.face_arr.length;
								face = new Txface( 
									faceid, 
									cube, {
										position:new Vector3( 0, y , 0),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(90,0,0), 
									facematerials[matid],
									matid,
									cube_id  
								);
								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
							

							
								
							} else if ( [12, 14].indexOf( cube_id ) > -1 ) {

								z = -0.51
								matid = 1;
								if ( cube_id == 14 ) {
									z = 0.51;
									matid = 2;
								}
								faceid = this.face_arr.length;
								face = new Txface( 
									faceid , 
									cube, {
										position:new Vector3( 0, 0 , z),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(0,0,0), 
									facematerials[matid],
									matid,
									cube_id
								);

								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
								

							
							
							} else if ( [10, 16].indexOf(cube_id) > -1 ) {

								let x = -0.51
								matid = 3;
								if ( cube_id == 16 ) {
									x = 0.51;
									matid = 4;
								}
								faceid = this.face_arr.length;
								face = new Txface( 
									faceid , 
									cube, {
										position:new Vector3( x, 0 , 0),
										scale: new Vector3( facesize, facesize, facesize )
									} , 
									this , 
									new Vector3(0,90,0), 
									facematerials[matid] ,
									matid,
									cube_id 
								);
								this.orifaces[matid].push( faceid )
								this.face_arr.push( face );
								

							
							}
							

						}	

					}


					cube_id += 1;
				}	
			} 
		}

		this.reset_curfaces();

		


		this.cubeframe = new Entity();
		this.cubeframe.setParent( this );
		this.cubeframe.addComponent( new Transform );
		this.cubeframe.addComponent( resources.models.cubeframe);
		this.reposition_cubeframe();


		this.buttons["start"] = new Txclickable_box(
            "Start" , 
            "start",
            {
                position: new Vector3( 6.0,  1.0, 1.5),
                scale   : new Vector3(0.5,0.5,0.5)
            },
            this,
            this
        );
        this.buttons["reset"] = new Txclickable_box(
            "Reset" , 
            "reset",
            {
                position: new Vector3( 6.0,  1.0, 1.5),
                scale   : new Vector3(0.5,0.5,0.5)
            },
            this,
            this
        );
        this.buttons["reset"].hide();

		let lbltime = new Entity();
		lbltime.setParent(this );
		lbltime.addComponent( new TextShape("00:00:00") );
		lbltime.addComponent( new Transform({
			position:new Vector3(6,  3,  1.5),
			scale: new Vector3(0.7,0.7,0.7)
		}) );

		lbltime.getComponent( Transform ).rotation.eulerAngles = new Vector3(0,90,0);
		this.lbltime = lbltime;




		let lblhighscore = new Entity();
		lblhighscore.setParent(this );
		lblhighscore.addComponent( new TextShape("Highscores") );
		lblhighscore.addComponent( new Transform({
			position:new Vector3(6,  4.5, -0.8),
			scale: new Vector3(0.25,0.25,0.25)
		}) );

		lblhighscore.getComponent( Transform ).rotation.eulerAngles = new Vector3(0,90,0);
		lblhighscore.getComponent( TextShape ).hTextAlign = "left";
        lblhighscore.getComponent( TextShape ).vTextAlign = "top";

		this.lblhighscore = lblhighscore;

		this.displayHighscores();
	}




	//----------
	format_sec_to_time( seconds ) {

		let hour = ( seconds / 3600 ) >> 0;
		seconds = seconds % 3600;

		let strhour = hour.toString();
		if ( hour < 10 ) {
			strhour = "0" + hour;
		}
		
		let minute = ( seconds / 60 ) >> 0;
		let strminute = minute.toString();
		if ( minute < 10 ) {
			strminute = "0" + minute;
		}
		seconds = seconds % 60;
		let strsecond = seconds.toString(); 
		if ( seconds < 10 ) {
			strsecond = "0" + seconds;
		}

		return strhour + ":" + strminute + ":" + strsecond;

	}	

    //----------------------
    displayHighscores() {

        let url = "https://tensaistudio.xyz/rubik/get_highscore.tcl";
        let fetchopt = {
            headers: {
              'content-type': 'application/json'
            },
            method: 'GET'
        };

        executeTask(async () => {
            try {
                let resp = await fetch(url, fetchopt ).then(response => response.json())
            
                log("sent request to URL", url , "SUCCESS", resp );
                let str = "";
                let i;
                for ( i = 0 ; i < resp.length ; i++ ) {
                    str += ( i + 1 ) + "." + " " + resp[i]["username"] + "     " + this.format_sec_to_time( parseInt( resp[i]["score"] ) ) + "\n";
                }
                this.lblhighscore.getComponent(TextShape).value = "Highscores\n\n"
                this.lblhighscore.getComponent(TextShape).value += str;
            } catch(err) {
                log("error to do", url, fetchopt, err );
            }
        });
    }


    //----------------------
    async submitHighscores() {

        let url = "https://tensaistudio.xyz/rubik/update_highscore.tcl";
       
        const myaddress = await getUserAccount()
        log("myaddress is " , myaddress);

        let username = this.userID;
        let useraddr = myaddress;
        let score    = this.record_seconds;

        let sig      = Utils.sha256(useraddr + "wibble" + score );

        let fetchopt = {
            headers: {
              'content-type': 'application/json'
            },
            body: "username="+ username + "&score="+ score + "&useraddr=" + useraddr+ "&sig=" + sig,
            method: 'POST'
        };
        let _this = this;
        try {
            let resp = await fetch(url, fetchopt ).then(response => response.text())
            log("sent request to URL", url , "SUCCESS", resp );
            _this.displayHighscores();

        } catch(err) {
            log("error to do", url, fetchopt, err );
        }
   
    }











	//---
	update( dt ) {

		let i;

		if ( this.mode == 1 ) {

			this.tick += 1;
			if ( this.tick >= 30 ) {
				this.record_seconds += 1;
				this.lbltime.getComponent( TextShape ).value = this.format_sec_to_time( this.record_seconds );
				this.tick = 0;
			}
		}

		if ( this.rotating != null ) {

			let center_piece = this.rotating[0]; 
			let target_rot   = this.rotating[1];
			let direction 	 = this.rotating[2];
			let face_group 	 = this.center_pieces.indexOf( center_piece );

			
			let movables;
			if ( face_group == -1 ) {
				if ( center_piece == 27 ) {
					movables = [ 1,10,19,4,   7,16,25,22];

				} else if ( center_piece == 28 ) {
					movables = [ 3,12,21, 22,  23, 14,5,4];

				} else if ( center_piece == 29 ) {
					movables = [17,14,11, 10,9 ,12, 15, 16];
				}
			}	

			if ( this.anim_rot != target_rot ) {

				let delta = this.rotate_speed;
				if ( direction == -1 ) {
					delta = -1 * this.rotate_speed;
				}
				let new_rot = ( this.anim_rot + delta ) % 360;

				this.anim_rot = new_rot;

				let nrot_vec3 = new Vector3(0,0,0);
				if ( center_piece == 4 ) {
					nrot_vec3 = new Vector3( 0, -new_rot , 0 );
				} else if ( center_piece == 22 ) {
					nrot_vec3 = new Vector3( 0, new_rot , 0 );
				} else if ( center_piece == 12 ) {
					nrot_vec3 = new Vector3( 0, 0, -new_rot );
				} else if ( center_piece == 14 ) {
					nrot_vec3 = new Vector3( 0, 0, new_rot );
				} else if ( center_piece == 10 ) {
					nrot_vec3 = new Vector3( -new_rot, 0 , 0 );
				} else if ( center_piece == 16 ) {
					nrot_vec3 = new Vector3( new_rot, 0 , 0);
				


					// Middle section
				} else if ( center_piece == 27 ) {
					nrot_vec3 = new Vector3( 0, 0, -new_rot );
				} else if ( center_piece == 28 ) {
					nrot_vec3 = new Vector3( -new_rot, 0 , 0 );
				} else if ( center_piece == 29 ) {
					nrot_vec3 = new Vector3( 0, -new_rot , 0 );
				}



				// Rotate
				
				if ( face_group > -1 ) {
					for ( i = 0 ; i < this.orifaces[face_group].length ; i++ ) {
						
						let face_i = this.orifaces[face_group][i];
						let cube_id = this.face_arr[face_i].cube_id;		

						this.cubepivots[cube_id].getComponent(Transform).rotation.eulerAngles = nrot_vec3 ;
					}
				} else {
					for ( i = 0 ; i < movables.length ; i++ ) {
						let cube_id = movables[i];
						this.cubepivots[cube_id].getComponent(Transform).rotation.eulerAngles = nrot_vec3 ;
					}
				}


				

			} else {

				this.rotating = null;
				this.anim_rot = 0;
				if ( face_group > -1 ) {
					for ( i = 0 ; i < this.orifaces[face_group].length ; i++ ) {
						let face_i = this.orifaces[face_group][i];
						let cube_id = this.face_arr[face_i].cube_id;		
						this.cubepivots[cube_id].getComponent(Transform).rotation.eulerAngles = new Vector3(0,0,0) ;
					}
				} else {
					for ( i = 0 ; i < movables.length ; i++ ) {
						let cube_id = movables[i];
						this.cubepivots[cube_id].getComponent(Transform).rotation.eulerAngles = new Vector3(0,0,0) ;
					}
				}

				// Update curfaces array 
				this.rotate_curfaces_arr( center_piece , direction );
				this.update_color();

				if ( this.mode == 2 ) {
					this.scramble_cube();
				} else if ( this.mode == 1 ) {
					
					let done = this.check_cube_finish();
					if ( done == 1 ) {
						this.mode = 3;
						this.submitHighscores();
						this.update_ui_page();
					}
				}
			}

		}
	}



    //------------------
    txclickable_button_onclick( id , userData ) {
        

        if ( id == "start" ) {
        	this.mode = 2;
        	this.tick = 0;
        	this.cubeframe.getComponent(Transform).position.y = -999;
        	this.scramble_cube();

        	this.lbltime.getComponent( TextShape ).value = "Scrambling\nPlease\nWait\n..."

        } else if ( id == "reset" ) {

        	this.record_seconds = 0;
        	this.lbltime.getComponent( TextShape ).value = this.format_sec_to_time( this.record_seconds );

        	this.mode = 0;
        }

        this.update_ui_page();
        
    }

    //----------------
    update_ui_page() {

    	let b ;
    	for ( b in this.buttons ) {
    		this.buttons[b].hide();
    	}

    	if ( this.mode == 0 ) {
    		this.buttons["start"].show();


    	} else if ( this.mode == 1 ) {
    		this.buttons["reset"].show();
    		this.lbltime.getComponent( TextShape ).value = this.format_sec_to_time( this.record_seconds );

    	} else if ( this.mode == 3 ) {

    		this.buttons["reset"].show();
    		this.lbltime.getComponent( TextShape ).value = "Finished\n" +  this.format_sec_to_time( this.record_seconds );

    	}

    }

    //-------------------
    scramble_cube() {

    	this.tick += 1;
    	if ( this.tick < 40 ) {

    		this.rotate_speed = 30;
    		let rotation_center_piece = [4,10,12,14,16,22][ (Math.random() * 6) >> 0 ];
    		let need_reverse_rotation = [-1,1][Math.random() * 2 >> 0 ];
    		this.rotating = [ rotation_center_piece , -90 * need_reverse_rotation , -1 * need_reverse_rotation  ];

    	} else {
    		
    		this.tick = 0;
    		this.mode = 1;
    		this.rotate_speed = 5;
    		this.record_seconds = 0;
    		this.update_ui_page();


    	}
    }


	//----------
	reset_curfaces( ) {

		let h,i;
		for ( h = 0 ; h < 6; h++ ) {
			for ( i = 0 ; i < this.orifaces[h].length; i++ ) {
				this.curfaces[h][i] = this.orifaces[h][i] ;
			}
		}
		log( this.curfaces );
	}

	//----
	update_color() {
		let h,i;
		for (  h = 0 ; h < this.curfaces.length ; h++ ) {
			for ( i = 0 ; i < this.curfaces[h].length; i++ ) {
					
				let oriface 	= this.face_arr[ this.orifaces[h][i] ];
				let curface 	= this.face_arr[ this.curfaces[h][i] ];
				let mat_to_use 	= this.facematerials[ curface.matid ];
				oriface.changeMaterial( mat_to_use );
			
			}
		}
	}

	//----------
	check_cube_finish() {

		let h,i;
		let done = 1;

		for (  h = 0 ; h < this.curfaces.length ; h++ ) {
			
			let refmatid = -1;
			for ( i = 0 ; i < this.curfaces[h].length; i++ ) {
				
				let curface 	= this.face_arr[ this.curfaces[h][i] ];
				
				if ( i == 0 ) {
					refmatid = curface.matid;
				} else {
					if ( curface.matid != refmatid ) {
						return 0;
					}
				}	
			}
		}
		return done;
	}

	//-----------
	rotate_curfaces_arr( center_piece , rot_directon) {

		let i;
		let face_group = this.center_pieces.indexOf( center_piece );
		let tmp;

		if ( center_piece == 12  || center_piece == 16 || center_piece == 4 ) {

			if ( rot_directon == -1 ) { 
				
				tmp = this.curfaces[ face_group ][0];
				this.curfaces[ face_group ][0] = this.curfaces[ face_group ][6];
				this.curfaces[ face_group ][6] = this.curfaces[ face_group ][8];
				this.curfaces[ face_group ][8] = this.curfaces[ face_group ][2];
				this.curfaces[ face_group ][2] = tmp;

				tmp = this.curfaces[ face_group ][1];
				this.curfaces[ face_group ][1] = this.curfaces[ face_group ][3];
				this.curfaces[ face_group ][3] = this.curfaces[ face_group ][7];
				this.curfaces[ face_group ][7] = this.curfaces[ face_group ][5];
				this.curfaces[ face_group ][5] = tmp;

			} else {

				tmp = this.curfaces[ face_group ][0];
				this.curfaces[ face_group ][0] = this.curfaces[ face_group ][2];
				this.curfaces[ face_group ][2] = this.curfaces[ face_group ][8];
				this.curfaces[ face_group ][8] = this.curfaces[ face_group ][6];
				this.curfaces[ face_group ][6] = tmp;

				tmp = this.curfaces[ face_group ][1];
				this.curfaces[ face_group ][1] = this.curfaces[ face_group ][5];
				this.curfaces[ face_group ][5] = this.curfaces[ face_group ][7];
				this.curfaces[ face_group ][7] = this.curfaces[ face_group ][3];
				this.curfaces[ face_group ][3] = tmp;
			}

			
			if ( center_piece == 12 ) {
				
				let face_group_L = 3;
				let face_group_T = 5;
				let face_group_R = 4;
				let face_group_B = 0;

				if ( rot_directon == -1 ) { 

					tmp = this.curfaces[ face_group_L ][ 0 ];
					this.curfaces[ face_group_L ][ 0 ] = this.curfaces[ face_group_T ][ 0 ];
					this.curfaces[ face_group_T ][ 0 ] = this.curfaces[ face_group_R ][ 6 ];
					this.curfaces[ face_group_R ][ 6 ] = this.curfaces[ face_group_B ][ 6 ];
					this.curfaces[ face_group_B ][ 6 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 3 ];
					this.curfaces[ face_group_L ][ 3 ] = this.curfaces[ face_group_T ][ 3 ];
					this.curfaces[ face_group_T ][ 3 ] = this.curfaces[ face_group_R ][ 3 ];
					this.curfaces[ face_group_R ][ 3 ] = this.curfaces[ face_group_B ][ 3 ];
					this.curfaces[ face_group_B ][ 3 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 6 ];
					this.curfaces[ face_group_L ][ 6 ] = this.curfaces[ face_group_T ][ 6 ];
					this.curfaces[ face_group_T ][ 6 ] = this.curfaces[ face_group_R ][ 0 ];
					this.curfaces[ face_group_R ][ 0 ] = this.curfaces[ face_group_B ][ 0 ];
					this.curfaces[ face_group_B ][ 0 ] = tmp;

				} else {

					tmp = this.curfaces[ face_group_B ][ 6 ];
					this.curfaces[ face_group_B ][ 6 ] = this.curfaces[ face_group_R ][ 6 ];
					this.curfaces[ face_group_R ][ 6 ] = this.curfaces[ face_group_T ][ 0 ];
					this.curfaces[ face_group_T ][ 0 ] = this.curfaces[ face_group_L ][ 0 ];
					this.curfaces[ face_group_L ][ 0 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 3 ];
					this.curfaces[ face_group_B ][ 3 ] = this.curfaces[ face_group_R ][ 3 ];
					this.curfaces[ face_group_R ][ 3 ] = this.curfaces[ face_group_T ][ 3 ];
					this.curfaces[ face_group_T ][ 3 ] = this.curfaces[ face_group_L ][ 3 ];
					this.curfaces[ face_group_L ][ 3 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 0 ];
					this.curfaces[ face_group_B ][ 0 ] = this.curfaces[ face_group_R ][ 0 ];
					this.curfaces[ face_group_R ][ 0 ] = this.curfaces[ face_group_T ][ 6 ];
					this.curfaces[ face_group_T ][ 6 ] = this.curfaces[ face_group_L ][ 6 ];
					this.curfaces[ face_group_L ][ 6 ] = tmp;
				}

			} else if ( center_piece == 16 ) {

				let face_group_L = 1;
				let face_group_T = 5;
				let face_group_R = 2;
				let face_group_B = 0;
				
				if ( rot_directon == -1 ) { 

					tmp = this.curfaces[ face_group_L ][ 2 ];
					this.curfaces[ face_group_L ][ 2 ] = this.curfaces[ face_group_T ][ 6 ];
					this.curfaces[ face_group_T ][ 6 ] = this.curfaces[ face_group_R ][ 8 ];
					this.curfaces[ face_group_R ][ 8 ] = this.curfaces[ face_group_B ][ 8 ];
					this.curfaces[ face_group_B ][ 8 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 5 ];
					this.curfaces[ face_group_L ][ 5 ] = this.curfaces[ face_group_T ][ 7 ];
					this.curfaces[ face_group_T ][ 7 ] = this.curfaces[ face_group_R ][ 5 ];
					this.curfaces[ face_group_R ][ 5 ] = this.curfaces[ face_group_B ][ 7 ];
					this.curfaces[ face_group_B ][ 7 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 8 ];
					this.curfaces[ face_group_L ][ 8 ] = this.curfaces[ face_group_T ][ 8 ];
					this.curfaces[ face_group_T ][ 8 ] = this.curfaces[ face_group_R ][ 2 ];
					this.curfaces[ face_group_R ][ 2 ] = this.curfaces[ face_group_B ][ 6 ];
					this.curfaces[ face_group_B ][ 6 ] = tmp;
				
				} else {

					tmp = this.curfaces[ face_group_B ][ 8 ];
					this.curfaces[ face_group_B ][ 8 ] = this.curfaces[ face_group_R ][ 8 ];
					this.curfaces[ face_group_R ][ 8 ] = this.curfaces[ face_group_T ][ 6 ];
					this.curfaces[ face_group_T ][ 6 ] = this.curfaces[ face_group_L ][ 2 ];
					this.curfaces[ face_group_L ][ 2 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 7 ];
					this.curfaces[ face_group_B ][ 7 ] = this.curfaces[ face_group_R ][ 5 ];
					this.curfaces[ face_group_R ][ 5 ] = this.curfaces[ face_group_T ][ 7 ];
					this.curfaces[ face_group_T ][ 7 ] = this.curfaces[ face_group_L ][ 5 ];
					this.curfaces[ face_group_L ][ 5 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 6 ];
					this.curfaces[ face_group_B ][ 6 ] = this.curfaces[ face_group_R ][ 2 ];
					this.curfaces[ face_group_R ][ 2 ] = this.curfaces[ face_group_T ][ 8 ];
					this.curfaces[ face_group_T ][ 8 ] = this.curfaces[ face_group_L ][ 8 ];
					this.curfaces[ face_group_L ][ 8 ] = tmp;

				}
			
			} else if ( center_piece == 4 ) {

				let face_group_L = 3;
				let face_group_T = 1;
				let face_group_R = 4;
				let face_group_B = 2;
				
				if ( rot_directon == -1 ) { 

					tmp = this.curfaces[ face_group_L ][ 2 ];
					this.curfaces[ face_group_L ][ 2 ] = this.curfaces[ face_group_T ][ 0 ];
					this.curfaces[ face_group_T ][ 0 ] = this.curfaces[ face_group_R ][ 0 ];
					this.curfaces[ face_group_R ][ 0 ] = this.curfaces[ face_group_B ][ 2 ];
					this.curfaces[ face_group_B ][ 2 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 1 ];
					this.curfaces[ face_group_L ][ 1 ] = this.curfaces[ face_group_T ][ 1 ];
					this.curfaces[ face_group_T ][ 1 ] = this.curfaces[ face_group_R ][ 1 ];
					this.curfaces[ face_group_R ][ 1 ] = this.curfaces[ face_group_B ][ 1 ];
					this.curfaces[ face_group_B ][ 1 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 0 ];
					this.curfaces[ face_group_L ][ 0 ] = this.curfaces[ face_group_T ][ 2 ];
					this.curfaces[ face_group_T ][ 2 ] = this.curfaces[ face_group_R ][ 2 ];
					this.curfaces[ face_group_R ][ 2 ] = this.curfaces[ face_group_B ][ 0 ];
					this.curfaces[ face_group_B ][ 0 ] = tmp;
				
				} else {

					tmp = this.curfaces[ face_group_B ][ 2 ];
					this.curfaces[ face_group_B ][ 2 ] = this.curfaces[ face_group_R ][ 0 ];
					this.curfaces[ face_group_R ][ 0 ] = this.curfaces[ face_group_T ][ 0 ];
					this.curfaces[ face_group_T ][ 0 ] = this.curfaces[ face_group_L ][ 2 ];
					this.curfaces[ face_group_L ][ 2 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 1 ];
					this.curfaces[ face_group_B ][ 1 ] = this.curfaces[ face_group_R ][ 1 ];
					this.curfaces[ face_group_R ][ 1 ] = this.curfaces[ face_group_T ][ 1 ];
					this.curfaces[ face_group_T ][ 1 ] = this.curfaces[ face_group_L ][ 1 ];
					this.curfaces[ face_group_L ][ 1 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 0 ];
					this.curfaces[ face_group_B ][ 0 ] = this.curfaces[ face_group_R ][ 2 ];
					this.curfaces[ face_group_R ][ 2 ] = this.curfaces[ face_group_T ][ 2 ];
					this.curfaces[ face_group_T ][ 2 ] = this.curfaces[ face_group_L ][ 0 ];
					this.curfaces[ face_group_L ][ 0 ] = tmp;


				}
			}

		
		} else if ( center_piece == 10 || center_piece == 14 || center_piece == 22 ) {

			if ( rot_directon == 1 ) { 
				
				tmp = this.curfaces[ face_group ][0];
				this.curfaces[ face_group ][0] = this.curfaces[ face_group ][6];
				this.curfaces[ face_group ][6] = this.curfaces[ face_group ][8];
				this.curfaces[ face_group ][8] = this.curfaces[ face_group ][2];
				this.curfaces[ face_group ][2] = tmp;

				tmp = this.curfaces[ face_group ][1];
				this.curfaces[ face_group ][1] = this.curfaces[ face_group ][3];
				this.curfaces[ face_group ][3] = this.curfaces[ face_group ][7];
				this.curfaces[ face_group ][7] = this.curfaces[ face_group ][5];
				this.curfaces[ face_group ][5] = tmp;

			} else {

				tmp = this.curfaces[ face_group ][0];
				this.curfaces[ face_group ][0] = this.curfaces[ face_group ][2];
				this.curfaces[ face_group ][2] = this.curfaces[ face_group ][8];
				this.curfaces[ face_group ][8] = this.curfaces[ face_group ][6];
				this.curfaces[ face_group ][6] = tmp;

				tmp = this.curfaces[ face_group ][1];
				this.curfaces[ face_group ][1] = this.curfaces[ face_group ][5];
				this.curfaces[ face_group ][5] = this.curfaces[ face_group ][7];
				this.curfaces[ face_group ][7] = this.curfaces[ face_group ][3];
				this.curfaces[ face_group ][3] = tmp;
			}

			if ( center_piece == 10 ) {
				
				let face_group_L = 2;
				let face_group_T = 5;
				let face_group_R = 1;
				let face_group_B = 0;

				if ( rot_directon == -1 ) { 

					tmp = this.curfaces[ face_group_L ][ 0 ];
					this.curfaces[ face_group_L ][ 0 ] = this.curfaces[ face_group_T ][ 2 ];
					this.curfaces[ face_group_T ][ 2 ] = this.curfaces[ face_group_R ][ 6 ];
					this.curfaces[ face_group_R ][ 6 ] = this.curfaces[ face_group_B ][ 0 ];
					this.curfaces[ face_group_B ][ 0 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 3 ];
					this.curfaces[ face_group_L ][ 3 ] = this.curfaces[ face_group_T ][ 1 ];
					this.curfaces[ face_group_T ][ 1 ] = this.curfaces[ face_group_R ][ 3 ];
					this.curfaces[ face_group_R ][ 3 ] = this.curfaces[ face_group_B ][ 1 ];
					this.curfaces[ face_group_B ][ 1 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 6 ];
					this.curfaces[ face_group_L ][ 6 ] = this.curfaces[ face_group_T ][ 0 ];
					this.curfaces[ face_group_T ][ 0 ] = this.curfaces[ face_group_R ][ 0 ];
					this.curfaces[ face_group_R ][ 0 ] = this.curfaces[ face_group_B ][ 2 ];
					this.curfaces[ face_group_B ][ 2 ] = tmp;

				} else {

					tmp = this.curfaces[ face_group_B ][ 0 ];
					this.curfaces[ face_group_B ][ 0 ] = this.curfaces[ face_group_R ][ 6 ];
					this.curfaces[ face_group_R ][ 6 ] = this.curfaces[ face_group_T ][ 2 ];
					this.curfaces[ face_group_T ][ 2 ] = this.curfaces[ face_group_L ][ 0 ];
					this.curfaces[ face_group_L ][ 0 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 1 ];
					this.curfaces[ face_group_B ][ 1 ] = this.curfaces[ face_group_R ][ 3 ];
					this.curfaces[ face_group_R ][ 3 ] = this.curfaces[ face_group_T ][ 1 ];
					this.curfaces[ face_group_T ][ 1 ] = this.curfaces[ face_group_L ][ 3 ];
					this.curfaces[ face_group_L ][ 3 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 2 ];
					this.curfaces[ face_group_B ][ 2 ] = this.curfaces[ face_group_R ][ 0 ];
					this.curfaces[ face_group_R ][ 0 ] = this.curfaces[ face_group_T ][ 0 ];
					this.curfaces[ face_group_T ][ 0 ] = this.curfaces[ face_group_L ][ 6 ];
					this.curfaces[ face_group_L ][ 6 ] = tmp;

				}	

			} else if ( center_piece == 14 ) {

				let face_group_L = 4;
				let face_group_T = 5;
				let face_group_R = 3;
				let face_group_B = 0;
				
				if ( rot_directon == -1 ) { 

					tmp = this.curfaces[ face_group_L ][ 2 ];
					this.curfaces[ face_group_L ][ 2 ] = this.curfaces[ face_group_T ][ 8 ];
					this.curfaces[ face_group_T ][ 8 ] = this.curfaces[ face_group_R ][ 8 ];
					this.curfaces[ face_group_R ][ 8 ] = this.curfaces[ face_group_B ][ 2 ];
					this.curfaces[ face_group_B ][ 2 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 5 ];
					this.curfaces[ face_group_L ][ 5 ] = this.curfaces[ face_group_T ][ 5 ];
					this.curfaces[ face_group_T ][ 5 ] = this.curfaces[ face_group_R ][ 5 ];
					this.curfaces[ face_group_R ][ 5 ] = this.curfaces[ face_group_B ][ 5 ];
					this.curfaces[ face_group_B ][ 5 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 8 ];
					this.curfaces[ face_group_L ][ 8 ] = this.curfaces[ face_group_T ][ 2 ];
					this.curfaces[ face_group_T ][ 2 ] = this.curfaces[ face_group_R ][ 2 ];
					this.curfaces[ face_group_R ][ 2 ] = this.curfaces[ face_group_B ][ 8 ];
					this.curfaces[ face_group_B ][ 8 ] = tmp;
					
				} else {

					tmp = this.curfaces[ face_group_B ][ 2 ];
					this.curfaces[ face_group_B ][ 2 ] = this.curfaces[ face_group_R ][ 8 ];
					this.curfaces[ face_group_R ][ 8 ] = this.curfaces[ face_group_T ][ 8 ];
					this.curfaces[ face_group_T ][ 8 ] = this.curfaces[ face_group_L ][ 2 ];
					this.curfaces[ face_group_L ][ 2 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 5 ];
					this.curfaces[ face_group_B ][ 5 ] = this.curfaces[ face_group_R ][ 5 ];
					this.curfaces[ face_group_R ][ 5 ] = this.curfaces[ face_group_T ][ 5 ];
					this.curfaces[ face_group_T ][ 5 ] = this.curfaces[ face_group_L ][ 5 ];
					this.curfaces[ face_group_L ][ 5 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 8 ];
					this.curfaces[ face_group_B ][ 8 ] = this.curfaces[ face_group_R ][ 2 ];
					this.curfaces[ face_group_R ][ 2 ] = this.curfaces[ face_group_T ][ 2 ];
					this.curfaces[ face_group_T ][ 2 ] = this.curfaces[ face_group_L ][ 8 ];
					this.curfaces[ face_group_L ][ 8 ] = tmp;
					
				}


			} else if ( center_piece == 22 ) {

				let face_group_L = 3;
				let face_group_T = 2;
				let face_group_R = 4;
				let face_group_B = 1;
				
				if ( rot_directon == -1 ) { 
					tmp = this.curfaces[ face_group_L ][ 6 ];
					this.curfaces[ face_group_L ][ 6 ] = this.curfaces[ face_group_T ][ 6 ];
					this.curfaces[ face_group_T ][ 6 ] = this.curfaces[ face_group_R ][ 8 ];
					this.curfaces[ face_group_R ][ 8 ] = this.curfaces[ face_group_B ][ 8 ];
					this.curfaces[ face_group_B ][ 8 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 7 ];
					this.curfaces[ face_group_L ][ 7 ] = this.curfaces[ face_group_T ][ 7 ];
					this.curfaces[ face_group_T ][ 7 ] = this.curfaces[ face_group_R ][ 7 ];
					this.curfaces[ face_group_R ][ 7 ] = this.curfaces[ face_group_B ][ 7 ];
					this.curfaces[ face_group_B ][ 7 ] = tmp;

					tmp = this.curfaces[ face_group_L ][ 8 ];
					this.curfaces[ face_group_L ][ 8 ] = this.curfaces[ face_group_T ][ 8 ];
					this.curfaces[ face_group_T ][ 8 ] = this.curfaces[ face_group_R ][ 6 ];
					this.curfaces[ face_group_R ][ 6 ] = this.curfaces[ face_group_B ][ 6 ];
					this.curfaces[ face_group_B ][ 6 ] = tmp;
				
				} else {

					tmp = this.curfaces[ face_group_B ][ 8 ];
					this.curfaces[ face_group_B ][ 8 ] = this.curfaces[ face_group_R ][ 8 ];
					this.curfaces[ face_group_R ][ 8 ] = this.curfaces[ face_group_T ][ 6 ];
					this.curfaces[ face_group_T ][ 6 ] = this.curfaces[ face_group_L ][ 6 ];
					this.curfaces[ face_group_L ][ 6 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 7 ];
					this.curfaces[ face_group_B ][ 7 ] = this.curfaces[ face_group_R ][ 7 ];
					this.curfaces[ face_group_R ][ 7 ] = this.curfaces[ face_group_T ][ 7 ];
					this.curfaces[ face_group_T ][ 7 ] = this.curfaces[ face_group_L ][ 7 ];
					this.curfaces[ face_group_L ][ 7 ] = tmp;

					tmp = this.curfaces[ face_group_B ][ 6 ];
					this.curfaces[ face_group_B ][ 6 ] = this.curfaces[ face_group_R ][ 6 ];
					this.curfaces[ face_group_R ][ 6 ] = this.curfaces[ face_group_T ][ 8 ];
					this.curfaces[ face_group_T ][ 8 ] = this.curfaces[ face_group_L ][ 8 ];
					this.curfaces[ face_group_L ][ 8 ] = tmp;
				}
			
			}

		}



		if ( center_piece == 27 ) {

			let face_group_L = 3;
			let face_group_T = 5;
			let face_group_R = 4;
			let face_group_B = 0;

			if ( rot_directon == -1 ) { 

				tmp = this.curfaces[ face_group_L ][ 1 ];
				this.curfaces[ face_group_L ][ 1 ] = this.curfaces[ face_group_T ][ 1 ];
				this.curfaces[ face_group_T ][ 1 ] = this.curfaces[ face_group_R ][ 7 ];
				this.curfaces[ face_group_R ][ 7 ] = this.curfaces[ face_group_B ][ 7 ];
				this.curfaces[ face_group_B ][ 7 ] = tmp;

				tmp = this.curfaces[ face_group_L ][ 4 ];
				this.curfaces[ face_group_L ][ 4 ] = this.curfaces[ face_group_T ][ 4 ];
				this.curfaces[ face_group_T ][ 4 ] = this.curfaces[ face_group_R ][ 4 ];
				this.curfaces[ face_group_R ][ 4 ] = this.curfaces[ face_group_B ][ 4 ];
				this.curfaces[ face_group_B ][ 4 ] = tmp;

				tmp = this.curfaces[ face_group_L ][ 7 ];
				this.curfaces[ face_group_L ][ 7 ] = this.curfaces[ face_group_T ][ 7 ];
				this.curfaces[ face_group_T ][ 7 ] = this.curfaces[ face_group_R ][ 1 ];
				this.curfaces[ face_group_R ][ 1 ] = this.curfaces[ face_group_B ][ 1 ];
				this.curfaces[ face_group_B ][ 1 ] = tmp;

			} else {

				tmp = this.curfaces[ face_group_B ][ 7 ];
				this.curfaces[ face_group_B ][ 7 ] = this.curfaces[ face_group_R ][ 7 ];
				this.curfaces[ face_group_R ][ 7 ] = this.curfaces[ face_group_T ][ 1 ];
				this.curfaces[ face_group_T ][ 1 ] = this.curfaces[ face_group_L ][ 1 ];
				this.curfaces[ face_group_L ][ 1 ] = tmp;

				tmp = this.curfaces[ face_group_B ][ 4 ];
				this.curfaces[ face_group_B ][ 4 ] = this.curfaces[ face_group_R ][ 4 ];
				this.curfaces[ face_group_R ][ 4 ] = this.curfaces[ face_group_T ][ 4 ];
				this.curfaces[ face_group_T ][ 4 ] = this.curfaces[ face_group_L ][ 4 ];
				this.curfaces[ face_group_L ][ 4 ] = tmp;

				tmp = this.curfaces[ face_group_B ][ 1 ];
				this.curfaces[ face_group_B ][ 1 ] = this.curfaces[ face_group_R ][ 1 ];
				this.curfaces[ face_group_R ][ 1 ] = this.curfaces[ face_group_T ][ 7 ];
				this.curfaces[ face_group_T ][ 7 ] = this.curfaces[ face_group_L ][ 7 ];
				this.curfaces[ face_group_L ][ 7 ] = tmp;
			}


		} else if ( center_piece == 28 ) {


			let face_group_L = 2;
			let face_group_T = 5;
			let face_group_R = 1;
			let face_group_B = 0;

			if ( rot_directon == -1 ) { 

				tmp = this.curfaces[ face_group_L ][ 1 ];
				this.curfaces[ face_group_L ][ 1 ] = this.curfaces[ face_group_T ][ 5 ];
				this.curfaces[ face_group_T ][ 5 ] = this.curfaces[ face_group_R ][ 7 ];
				this.curfaces[ face_group_R ][ 7 ] = this.curfaces[ face_group_B ][ 3 ];
				this.curfaces[ face_group_B ][ 3 ] = tmp;

				tmp = this.curfaces[ face_group_L ][ 4 ];
				this.curfaces[ face_group_L ][ 4 ] = this.curfaces[ face_group_T ][ 4 ];
				this.curfaces[ face_group_T ][ 4 ] = this.curfaces[ face_group_R ][ 4 ];
				this.curfaces[ face_group_R ][ 4 ] = this.curfaces[ face_group_B ][ 4 ];
				this.curfaces[ face_group_B ][ 4 ] = tmp;

				tmp = this.curfaces[ face_group_L ][ 7 ];
				this.curfaces[ face_group_L ][ 7 ] = this.curfaces[ face_group_T ][ 3 ];
				this.curfaces[ face_group_T ][ 3 ] = this.curfaces[ face_group_R ][ 1 ];
				this.curfaces[ face_group_R ][ 1 ] = this.curfaces[ face_group_B ][ 5 ];
				this.curfaces[ face_group_B ][ 5 ] = tmp;

			} else {

				tmp = this.curfaces[ face_group_B ][ 3 ];
				this.curfaces[ face_group_B ][ 3 ] = this.curfaces[ face_group_R ][ 7 ];
				this.curfaces[ face_group_R ][ 7 ] = this.curfaces[ face_group_T ][ 5 ];
				this.curfaces[ face_group_T ][ 5 ] = this.curfaces[ face_group_L ][ 1 ];
				this.curfaces[ face_group_L ][ 1 ] = tmp;

				tmp = this.curfaces[ face_group_B ][ 4 ];
				this.curfaces[ face_group_B ][ 4 ] = this.curfaces[ face_group_R ][ 4 ];
				this.curfaces[ face_group_R ][ 4 ] = this.curfaces[ face_group_T ][ 4 ];
				this.curfaces[ face_group_T ][ 4 ] = this.curfaces[ face_group_L ][ 4 ];
				this.curfaces[ face_group_L ][ 4 ] = tmp;

				tmp = this.curfaces[ face_group_B ][ 5 ];
				this.curfaces[ face_group_B ][ 5 ] = this.curfaces[ face_group_R ][ 1 ];
				this.curfaces[ face_group_R ][ 1 ] = this.curfaces[ face_group_T ][ 3 ];
				this.curfaces[ face_group_T ][ 3 ] = this.curfaces[ face_group_L ][ 7 ];
				this.curfaces[ face_group_L ][ 7 ] = tmp;
			}

		} else if ( center_piece == 29 ) {

			let face_group_L = 3;
			let face_group_T = 2;
			let face_group_R = 4;
			let face_group_B = 1;			

			if ( rot_directon == 1 ) { 

				tmp = this.curfaces[ face_group_L ][ 3 ];
				this.curfaces[ face_group_L ][ 3 ] = this.curfaces[ face_group_T ][ 3 ];
				this.curfaces[ face_group_T ][ 3 ] = this.curfaces[ face_group_R ][ 5 ];
				this.curfaces[ face_group_R ][ 5 ] = this.curfaces[ face_group_B ][ 5 ];
				this.curfaces[ face_group_B ][ 5 ] = tmp;

				tmp = this.curfaces[ face_group_L ][ 4 ];
				this.curfaces[ face_group_L ][ 4 ] = this.curfaces[ face_group_T ][ 4 ];
				this.curfaces[ face_group_T ][ 4 ] = this.curfaces[ face_group_R ][ 4 ];
				this.curfaces[ face_group_R ][ 4 ] = this.curfaces[ face_group_B ][ 4 ];
				this.curfaces[ face_group_B ][ 4 ] = tmp;

				tmp = this.curfaces[ face_group_L ][ 5 ];
				this.curfaces[ face_group_L ][ 5 ] = this.curfaces[ face_group_T ][ 5 ];
				this.curfaces[ face_group_T ][ 5 ] = this.curfaces[ face_group_R ][ 3 ];
				this.curfaces[ face_group_R ][ 3 ] = this.curfaces[ face_group_B ][ 3 ];
				this.curfaces[ face_group_B ][ 3 ] = tmp;

			} else {

				tmp = this.curfaces[ face_group_B ][ 5 ];
				this.curfaces[ face_group_B ][ 5 ] = this.curfaces[ face_group_R ][ 5 ];
				this.curfaces[ face_group_R ][ 5 ] = this.curfaces[ face_group_T ][ 3 ];
				this.curfaces[ face_group_T ][ 3 ] = this.curfaces[ face_group_L ][ 3 ];
				this.curfaces[ face_group_L ][ 3 ] = tmp;

				tmp = this.curfaces[ face_group_B ][ 4 ];
				this.curfaces[ face_group_B ][ 4 ] = this.curfaces[ face_group_R ][ 4 ];
				this.curfaces[ face_group_R ][ 4 ] = this.curfaces[ face_group_T ][ 4 ];
				this.curfaces[ face_group_T ][ 4 ] = this.curfaces[ face_group_L ][ 4 ];
				this.curfaces[ face_group_L ][ 4 ] = tmp;

				tmp = this.curfaces[ face_group_B ][ 3 ];
				this.curfaces[ face_group_B ][ 3 ] = this.curfaces[ face_group_R ][ 3 ];
				this.curfaces[ face_group_R ][ 3 ] = this.curfaces[ face_group_T ][ 5 ];
				this.curfaces[ face_group_T ][ 5 ] = this.curfaces[ face_group_L ][ 5 ];
				this.curfaces[ face_group_L ][ 5 ] = tmp;
			}
		}



	}









	//---------------------------------
	public center_pieces = [ 4, 12, 14, 10, 16, 22 ];

	//--------------
	debug_log( faceid ) {

		let h, i ;
		let found = 0;
		let arr_index;
		let cube_id = this.face_arr[faceid].cube_id;

		for ( h = 0 ; h < this.orifaces.length; h++) {
			for ( i = 0 ; i < this.orifaces[h].length; i++ ) {
				if ( this.orifaces[h][i] == faceid ) {
					arr_index = i ;
					found = 1;
					break;
				}
			}
			if ( found == 1 ) {
				break;
			}
		}
		log( "Face id" , faceid , "Cube id" , cube_id , "arr index", arr_index ) ;

		/*
		let angle_xzplane = Math.atan2( 
									this.transform.position.x - this.camera.position.x ,
									 this.transform.position.z - this.camera.position.z 
							);

		log( angle_xzplane * 180 / Math.PI );
		*/

	}

    //--------------------
    global_input_down(e , faceid ) {
		
		if ( e.buttonId == 0 ) {	

			this.debug_log( faceid );
			
			let change_mode = 0;
			let sel_center_piece = this.find_center_cube_id_by_face_id( faceid );
			
			if ( this.sel_face == faceid ) {
				// Face is same, change mode definitely...
				change_mode = 1;
			} else if ( sel_center_piece == this.sel_center_piece ) {
				// Face difference, but still the same center.

				// Change if at mode 0, otherwise dont
				if ( this.rot_mode == 0 ) {
					change_mode = 1;
				// Otherwise just change the row and column thingy..
				}

			} else {
				// Face difference, center also difference.
				this.sel_center_piece = sel_center_piece;
			}	

			if ( change_mode == 1 ) {
				this.rot_mode = (this.rot_mode + 1 ) % 3 ;
			}


			if ( this.rot_mode == 1 ) {
				if (         [1,8,14,       2,3,7,    15,16,20,    6,11,19   , 33,42,46 , 0,9,13   ].indexOf( faceid ) > -1 ) {
					this.sel_row = -1;
				} else if ( [22,26,29,    21,23,24,   28,30,31,    25,27,32  , 37,43,50 , 4,10,17  ].indexOf( faceid ) > -1 ) {
					this.sel_row =  0;
				} else if ( [34,41,47,    35,36,40,   48,49, 53,   39,44,52  , 38,45,51,  5,12,18 ].indexOf( faceid ) > -1 ) {
					this.sel_row =  1;
				}
			} else if ( this.rot_mode == 2 ) {

				if (        [1,22,34    , 2,21,35,    15,28,48,   6,25,39    ,33,37,38 , 0,4,5].indexOf( faceid ) > -1 ) {
					this.sel_col = -1;
				} else if ( [8,26,41,   3,23,36 ,    16,30,49,    11,27,44   ,42,43,45 , 9,10,12   ].indexOf( faceid ) > -1 ) {
					this.sel_col =  0;
				} else if ( [14,29,47   ,7,24,40,     20,31,53,   19,32,52   ,46,50,51, 13,17,18    ].indexOf( faceid ) > -1 ) {
					this.sel_col =  1;
				}

			}

			this.reposition_cubeframe();
			this.sel_face = faceid;
		
		} else {




			if ( this.rotating == null ) {


				let rotation_center_piece 	= this.find_center_cube_id_by_cubeframe();
				let pointer_center_piece 	= this.find_center_cube_id_by_face_id( faceid );
			
				let need_reverse_rotation = this.find_need_reverse_rotation( rotation_center_piece , pointer_center_piece )

				log( "need_reverse_rotation" , need_reverse_rotation );

				if ( rotation_center_piece != -1 ) {

					if ( e.buttonId == 1 ) {
		    			
		    			this.rotating = [ rotation_center_piece , -90 * need_reverse_rotation , -1 * need_reverse_rotation  ];

		    		} else if ( e.buttonId == 2 ) {
		    			this.rotating = [ rotation_center_piece ,  90 * need_reverse_rotation ,  1 * need_reverse_rotation ];
		    		}

	    		}


    		}
		}

    }


    //--------------------
    global_input_up(e) {

    	if ( e.buttonId == 0 ) {
    	}
    }

    //---------
    find_need_reverse_rotation( rotation_center_piece , pointer_center_piece ) {

    	let ret = 1;
    	if ( rotation_center_piece == 12 ) {
    		if ( [12,16,22].indexOf( pointer_center_piece ) > -1 ) {
    			ret = 1;
    		} else  {
    			ret = -1;
    		}
    	} else if ( rotation_center_piece == 10 ) {
    		if ( [10,12,22].indexOf( pointer_center_piece ) > -1 ) {
    			ret = 1;
    		} else  {
    			ret = -1;
    		}
    	} else if ( rotation_center_piece == 14 ) {
    		if ( [14,10,22].indexOf( pointer_center_piece ) > -1 ) {
    			ret = 1;
    		} else  {
    			ret = -1;
    		}

    	} else if ( rotation_center_piece == 16 ) {
    		if ( [16,14,22].indexOf( pointer_center_piece ) > -1 ) {
    			ret = 1;
    		} else  {
    			ret = -1;
    		}

    	} else if ( rotation_center_piece == 22 ) {
    		if ( [22,14,12, 10, 16].indexOf( pointer_center_piece ) > -1 ) {
    			ret = 1;
    		} else  {
    			ret = -1;
    		}

    	} else if ( rotation_center_piece == 4 ) {
    		if ( [4].indexOf( pointer_center_piece ) > -1 ) {
    			ret = 1;
    		} else  {
    			ret = -1;
    		}
    	
    	
    	} else if ( rotation_center_piece == 27 ) {
    		if ( [16,14,4,22].indexOf( pointer_center_piece ) > -1 ) {
    			ret = -1;
    		} else  {
    			ret = 1;
    		}

    	} else if ( rotation_center_piece == 28 ) {
    		if ( [4].indexOf( pointer_center_piece ) > -1 ) {
    			ret = 1;
    		} else  {
    			ret = -1;
    		}	
    		
    	}


    	return ret;
    }


    //------------------
    find_center_cube_id_by_cubeframe() {
    	
    	let center_piece = -1;
    	let cfunit = this.cubesize + 0.01;
    	let cubeframe_transform = this.cubeframe.getComponent(Transform);

    	if ( cubeframe_transform.scale.x == 3 * cfunit && cubeframe_transform.scale.y == 3 * cfunit ) {
    		if ( cubeframe_transform.position.z == -1 * cfunit ) {
    			center_piece = 12;
    		} else if ( cubeframe_transform.position.z == 1 * cfunit ) { 
    			center_piece = 14;
    		} else {
    			center_piece = 27;
    		}
    	} else if ( cubeframe_transform.scale.z == 3 * cfunit && cubeframe_transform.scale.y == 3 * cfunit ) {
    		if ( cubeframe_transform.position.x == -1 * cfunit ) {
    			center_piece = 10;
    		} else if ( cubeframe_transform.position.x == 1 * cfunit ) {
    			center_piece = 16;
    		} else {
    			center_piece = 28;
    		}

    	} else if ( cubeframe_transform.scale.x == 3 * cfunit && cubeframe_transform.scale.z == 3 * cfunit ) {
    		if ( cubeframe_transform.position.y == -1 * cfunit ) {
    			center_piece = 4;
    		} else if ( cubeframe_transform.position.y == 1 * cfunit ) {
    			center_piece = 22;
    		} else {
    			center_piece = 29;
    		}
    	}
    	return center_piece;
    }


    //----------------------------
    find_center_cube_id_by_face_id( faceid ) {

    	let i,j,k;
    	let center_piece = -1;
    	for ( i = 0 ; i < this.orifaces.length ; i++ ) {
		
			if ( this.orifaces[i].indexOf( faceid ) > -1 ) {

				for ( j = 0 ; j < this.center_pieces.length ; j++ ) {
					
					let centerid = this.center_pieces[j];

					//log( "Looking for ", centerid , "in" , this.orifaces[i] );
					for ( k = 0 ; k < this.orifaces[i].length ; k++ ) {
						
						let face_k = this.orifaces[i][k];
						let cube_k = this.face_arr[ face_k ].cube_id;

						if ( cube_k == centerid ) {
							center_piece = cube_k;
							break;
						}
					}
					if ( center_piece != -1 ) {
						break;
					}
				}
				break;
			}
		} 
		return center_piece;
    }

    //--------
    reposition_cubeframe() {

    	let cfunit = this.cubesize + 0.01;
    	let x = 0;
    	let y = 0;
    	let z = 0;
    	let sx = 1;
		let sy = 1;
    	let sz = 1;

    	
		
		if ( this.sel_center_piece == 12 ) { 

			if ( this.rot_mode == 0 ) {
    			z = -1 ;
    			sx = 3 ;
    			sy = 3 ;
    		} else if ( this.rot_mode == 1 ) {
    			sz = 3;
    			sx = 3;
    			y  = this.sel_row;
    		} else if ( this.rot_mode == 2 ) {
    			sz = 3;
    			sy = 3;
    			x = this.sel_col;
    		}


    	} else if ( this.sel_center_piece == 10 ) {
    		

    		if ( this.rot_mode == 0 ) {
    			x = -1;
    			sy = 3 ;
    			sz = 3 ;

    		} else if ( this.rot_mode == 1 ) {
    			sz = 3;
    			sx = 3;
    			y  = this.sel_row;

    		} else if ( this.rot_mode == 2 ) {
    			sx = 3;
    			sy = 3;
    			z = this.sel_col;
    		}

    	} else if ( this.sel_center_piece == 16 ) {
    		

    		if ( this.rot_mode == 0 ) {
    			x =  1;
    			sy = 3 ;
    			sz = 3 ;

    		} else if ( this.rot_mode == 1 ) {
    			sz = 3;
    			sx = 3;
    			y  = this.sel_row;

    		} else if ( this.rot_mode == 2 ) {
    			sx = 3;
    			sy = 3;
    			z = this.sel_col;
    		}


    	} else if ( this.sel_center_piece == 4 ) {
    		
    		if ( this.rot_mode == 0 ) {
    			y = -1;
    			sx = 3 ;
    			sz = 3 ;

    		} else if ( this.rot_mode == 1 ) {
    			sx = 3;
    			sy = 3;
    			 z  = this.sel_row;
    		} else if ( this.rot_mode == 2 ) {
    			sz = 3;
    			sy = 3;
    			x = this.sel_col;
    		}	


    	} else if ( this.sel_center_piece == 14 ) {
    		
    		if ( this.rot_mode == 0 ) {
    			z = 1;
    			sx = 3 ;
    			sy = 3 ;
    		} else if ( this.rot_mode == 1 ) {
    			sz = 3;
    			sx = 3;
    			y  = this.sel_row;
    		} else if ( this.rot_mode == 2 ) {
    			sz = 3;
    			sy = 3;
    			x = this.sel_col;
    		}


    	} else if ( this.sel_center_piece == 22 ) {
    		
    		if ( this.rot_mode == 0 ) {
    			y = 1;
	    		sx = 3 ;
    			sz = 3 ;

    		} else if ( this.rot_mode == 1 ) {
    			sx = 3;
    			sy = 3;
    			 z  = this.sel_row;
    		} else if ( this.rot_mode == 2 ) {
    			sz = 3;
    			sy = 3;
    			x = this.sel_col;
    		}	
    	}
    	
    	this.cubeframe.getComponent(Transform).position = new Vector3( x * cfunit, y  * cfunit ,  z * cfunit );
    	this.cubeframe.getComponent(Transform).scale    = new Vector3(sx * cfunit, sy * cfunit , sz * cfunit );


    }	



}
