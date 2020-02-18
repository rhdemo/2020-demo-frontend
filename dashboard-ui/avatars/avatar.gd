extends Area2D

enum STATE{
	Resting,
	Happy,
	Sad
}
export (STATE) var State = STATE.Resting;


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	$Eyes.frame = self.State;
	$Mouth.frame = self.State;




func _on_Area2D_input_event(viewport, event, shape_idx):
	RandomNumberGenerator
	var random_emote = (rand_range(0,3));
	var mouse_click = event as InputEventMouseButton
	if mouse_click and mouse_click.button_index == 1 and mouse_click.pressed:
		self.State = random_emote;
