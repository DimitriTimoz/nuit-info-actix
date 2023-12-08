use serde_json::json;
use uuid::Uuid;
use crate::{prelude::*, measure::replace_measure};
use std::collections::{HashMap, HashSet};
use tokio::sync::RwLock;

lazy_static::lazy_static! {
    pub static ref GAMES : RwLock<HashMap<Uuid, Game>> = RwLock::new(HashMap::new());
}

pub struct Game {
    social: isize,
    economic: isize,
    environmental: isize,
    scientist: isize,
    united_nations: isize,
    cartel: isize,
    pub current_measure: String,
    pub already_seen_measures: HashSet<String>,
}

impl Game {
    fn new() -> Self {
        let mut game = Game {
            social: 50,
            economic: 50,
            environmental: 50,
            scientist: 50,
            united_nations: 50,
            cartel: 50,
            current_measure: String::new(),
            already_seen_measures: HashSet::new(),
        };
        crate::measure::replace_measure(&mut game);
        game
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

pub async fn answer(request: &HttpRequest, factor: isize) -> impl Responder {
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

    let mut games = GAMES.write().await;

    let game = match games.get_mut(&uuid) {
        Some(game) => game,
        None => return HttpResponse::BadRequest().body("No game found"),
    };

    let measure = match crate::measure::MEASURES.get(&game.current_measure) {
        Some(measure) => measure,
        None => return HttpResponse::InternalServerError().body("Measure not found"),
    };

    game.social += measure.acceptation_impact.social * factor;
    game.economic += measure.acceptation_impact.economic * factor;
    game.environmental += measure.acceptation_impact.environmental * factor;
    game.scientist += measure.acceptation_impact.factions.scientist * factor;
    game.united_nations += measure.acceptation_impact.factions.united_nations * factor;
    game.cartel += measure.acceptation_impact.factions.cartel * factor;

    game.already_seen_measures.insert(game.current_measure.clone());
    replace_measure(game);

    HttpResponse::Ok().body("OK")
}

#[post("/accept")]
pub async fn accept(request: HttpRequest) -> impl Responder {
    answer(&request, 1).await
}

#[post("/reject")]
pub async fn reject(request: HttpRequest) -> impl Responder {
    answer(&request, -1).await
}
