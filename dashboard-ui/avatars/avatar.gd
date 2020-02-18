extends Area2D

enum STATE{
	Resting,
	Happy,
	Sad
}
enum COLOR_SET{
	Red,
	Orange,
	Yellow,
	Green,
	Blue
}
export (STATE) var State = STATE.Resting;
export (COLOR_SET) var colors = COLOR_SET.Blue;

var color_set = [
	PoolColorArray([Color('e800e8'),Color('600068')]),
	PoolColorArray([Color('ff7c1a'),Color('964700')]),
	PoolColorArray([Color('ffec00'),Color('756e11')]),
	PoolColorArray([Color('11e500'),Color('006611')]),
	PoolColorArray([Color('7be6ff'),Color('274b4f')])
]


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	$Eyes.frame = self.State;
	$Mouth.frame = self.State;
	$Background.material.set_shader_param("light_color", color_set[colors][0]);
	$Background.material.set_shader_param("dark_color", color_set[colors][1]);


func _on_Area2D_input_event(viewport, event, shape_idx):
	RandomNumberGenerator
	var random_emote = (rand_range(0,3));
	var random_color = (rand_range(0,5));
	var mouse_click = event as InputEventMouseButton
	if mouse_click and mouse_click.button_index == 1 and mouse_click.pressed:
		self.State = random_emote;
		self.colors = random_color;
