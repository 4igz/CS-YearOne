use bevy::{
    prelude::*,
    sprite::collide_aabb::{collide, Collision},
};

#[derive(Component)]
struct FollowCursor;

#[derive(Component)]
struct MainCamera;

#[derive(Resource)]
struct CursorHit {
    grabbed: bool,
    x: f32,
    y: f32,
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            window: WindowDescriptor {
                width: 800.,
                height: 800.,
                position: WindowPosition::Centered,
                title: "Square".to_string(),
                present_mode: bevy::window::PresentMode::AutoNoVsync,
                ..default()
            },
            ..default()
        }))
        .insert_resource(CursorHit {
            grabbed: false,
            x: 0.,
            y: 0.,
        })
        .add_startup_system(setup)
        .add_system(get_cursor_position)
        .add_system(handle_input)
        .run();
}

fn setup(mut commands: Commands) {
    // Square that is tracked to follow cursor.
    commands.spawn((
        SpriteBundle {
            sprite: Sprite {
                color: Color::rgb(1., 1., 1.),
                custom_size: Some(Vec2::new(200., 200.)),
                ..default()
            },
            transform: Transform {
                translation: Vec3::new(0., 0., 0.),
                scale: Vec3::splat(0.15),
                ..default()
            },
            ..default()
        },
        FollowCursor,
    ));
    commands.spawn((Camera2dBundle::default(), MainCamera));
}

fn handle_input(
    mut sprite_query: Query<(&mut Transform, &Sprite), With<FollowCursor>>,
    input: Res<Input<MouseButton>>,
    mut cursor: ResMut<CursorHit>,
) {
    if cursor.grabbed || input.just_pressed(MouseButton::Left) {
        let (transform, sprite) = sprite_query.single_mut();
        let mut trns = transform.translation;
        // Check collision with sprite and cursor so the player can only move the
        // sprite when the cursor is over it.
        let cursor_collision = collide(
            Vec3::new(cursor.x, cursor.y, 0.),
            Vec2::ZERO,
            Vec3::new(trns.x, trns.y, 0.),
            sprite.custom_size.unwrap_or_default() * Vec2::splat(transform.scale.x),
        );
        if cursor.grabbed || cursor_collision == Some(Collision::Inside) {
            trns.x = cursor.x;
            trns.y = cursor.y;
            println!("{}, {}", trns.x, trns.y);
            cursor.grabbed = true;
        }
    }
    if input.just_released(MouseButton::Left) {
        cursor.grabbed = false;
    }
}

fn get_cursor_position(
    camera_query: Query<(&Camera, &GlobalTransform), With<Camera>>,
    mut cursor: ResMut<CursorHit>,
    windows: ResMut<Windows>,
) {
    let (camera, camera_transform) = camera_query.single();
    let window = windows.primary();
    let cursor_pos = window.cursor_position().unwrap_or(Vec2::ZERO);
    // check if the cursor is inside the window and get its position
    // get the size of the window
    let window_size = Vec2::new(window.width(), window.height());

    // convert screen position [0..resolution] to ndc [-1..1] (gpu coordinates)
    let ndc = (cursor_pos / window_size) * 2.0 - Vec2::ONE;

    // matrix for undoing the projection and camera transform
    let ndc_to_world = camera_transform.compute_matrix() * camera.projection_matrix().inverse();

    // use it to convert ndc to world-space coordinates
    let world_pos = ndc_to_world.project_point3(ndc.extend(-1.0));

    // reduce it to a 2D value
    let world_pos = world_pos.truncate();
    cursor.x = world_pos.x;
    cursor.y = world_pos.y;
}
