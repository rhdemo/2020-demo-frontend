extends StaticBody

onready var bankNode = preload("res://Bank.tscn")

func _ready():
	connect("input_event", self, "on_input_event")

func on_input_event(camera, event, click_position, click_normal, shape_idx):
	var mouse_click = event as InputEventMouseButton
	if mouse_click and mouse_click.button_index == 1 and mouse_click.pressed:
		print("clicked",click_position)
		spawn_bank(click_position)

func spawn_bank(coords : Vector3):
	var new_bank : RigidBody = bankNode.instance()
	new_bank.translation = Vector3(coords)+Vector3(0,9.5,0)
	get_parent().add_child(new_bank)
