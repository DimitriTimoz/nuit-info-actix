use uuid::Uuid;
use crate::prelude::*;
use std::collections::{HashMap, HashSet};
use tokio::sync::RwLock;

lazy_static::lazy_static! {
    static ref GAMES : RwLock<HashMap<Uuid, Game>> = RwLock::new(HashMap::new());
}

pub struct Game {
    social: i32,
    economic: i32,
    environmental: i32,
    scientist: i32,
    united_nations: i32,
    cartel: i32,
    already_seen_measures: HashSet<String>,
}

impl Game {
    fn new() -> Self {
        Game {
            social: 50,
            economic: 50,
            environmental: 50,
            scientist: 50,
            united_nations: 50,
            cartel: 50,
            already_seen_measures: HashSet::new(),
        }
    }
}

#[post("/create_game")]
pub async fn create_game() -> impl Responder {
    let game = Game::new();
    let id = Uuid::new_v4();
    
    GAMES.write().await.insert(id, game);

    HttpResponse::Ok().body(id.to_string())

}