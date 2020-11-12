

export class Txface extends Entity {

	public id;
	public transform;
	public parent;
	public matid;
	public cube_id;

	//-----------------------
	constructor( id, parent, transform_args , stage , rotationVec3, material , matid , cube_id ) {

		super();
		
		this.id = id;
		this.transform = new Transform( transform_args );
		this.matid = matid;
		this.cube_id = cube_id;

		this.setParent( parent );
		this.addComponent( new PlaneShape() );
		this.addComponent( this.transform );
		this.getComponent( Transform ).rotation.eulerAngles = rotationVec3;
		this.addComponent( material );
		this.addComponent( 
			new OnPointerDown(
				(e) => {
					stage.global_input_down( e , this.id ); 
				},{
					hoverText: "E/F to rotate. Left click to change rotation axis"
				}

			)
		);
	}

	//-----------------
	changeMaterial( otherMaterial ) {
				
		this.removeComponent( Material );
		this.addComponent( otherMaterial );

	}
}