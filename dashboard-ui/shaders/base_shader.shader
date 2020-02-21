shader_type canvas_item;
render_mode blend_disabled;
uniform vec4 light_color : hint_color;
uniform vec4 dark_color : hint_color;
const vec3 light_replace = vec3(0.65);
const vec3 dark_replace = vec3(0.4);

void vertex() {
// Output:0

}

void fragment() {
// Texture:7
	vec3 color_curr;
	float alpha_curr;
	{
		vec4 uv_curr = texture( TEXTURE , UV.xy );
		color_curr = uv_curr.rgb;
		alpha_curr = uv_curr.a;
	}

// VectorOp:23
	vec3 color_out;
	color_out = color_curr;
	if(all(lessThan(color_curr,vec3(1.0)))) {
		if (all(lessThan(color_curr, light_replace))) {
			color_out = dark_color.rgb; // Dark Color
		} else if (all(greaterThan(color_curr, light_replace+vec3(0.2)))) {
			color_out = vec3(1.0) ; // Light Color
		}
		else {
			color_out = light_color.rgb; //light_color.rgb * dark_color.rgb;
		}
	}

	COLOR.rgb = color_out;
	COLOR.a = alpha_curr;

}

void light() {
// Output:0

}
