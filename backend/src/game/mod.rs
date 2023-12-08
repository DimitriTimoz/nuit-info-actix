use serde_json::json;
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

#[get("/game")]
pub async fn get_game(request: HttpRequest) -> impl Responder {
    let header_value = request.headers().get("token");

    let token_value = match header_value {
        Some(token) => token.to_str(),
        None => return HttpResponse::BadRequest().body("No token provided"),
    };

    let token_string = match token_value {
        Ok(token) => token,
        Err(_) => return HttpResponse::BadRequest().body("Token is not a string"),
    };

    let uuid = match Uuid::parse_str(token_string) {
        Ok(uuid) => uuid,
        Err(_) => return HttpResponse::BadRequest().body("Invalid token"),
    };

    let games = GAMES.read().await;

    let game = match games.get(&uuid) {
        Some(game) => Some(game),
        None => return HttpResponse::BadRequest().body("No game found"),
    };

    let game_informations = json!(
        {
            "social": game.unwrap().social,
            "economic": game.unwrap().economic,
            "environmental": game.unwrap().environmental,
            "scientist": game.unwrap().scientist,
            "united_nations": game.unwrap().united_nations,
            "cartel": game.unwrap().cartel,
        }
    );

    HttpResponse::Ok().body(game_informations.to_string())
}