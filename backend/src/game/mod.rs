use serde_json::json;
use serde::Deserialize;
use uuid::Uuid;
use crate::{prelude::*, measure::replace_measure};
use std::collections::HashMap;
use tokio::sync::RwLock;


lazy_static::lazy_static! {
    pub static ref GAMES : RwLock<HashMap<Uuid, Game>> = RwLock::new(HashMap::new());
}

pub struct Game {
    pseudo: String,
    social: isize,
    economic: isize,
    environmental: isize,
    scientist: isize,
    united_nations: isize,
    cartel: isize,
    forty_nine_three: bool,
    current_year: usize,
    current_month: u8,
    pub current_measure: String,
    pub already_seen_measures: Vec<String>,
}

impl Game {
    fn new(pseudo : String) -> Self {
        let mut game = Game {
            pseudo,
            social: 50,
            economic: 50,
            environmental: 50,
            scientist: 50,
            united_nations: 50,
            cartel: 50,
            forty_nine_three: true,
            current_year: 2023,
            current_month: 1,
            current_measure: String::new(),
            already_seen_measures: Vec::new(),
        };
        crate::measure::replace_measure(&mut game);
        game
    }

    fn next_month(&mut self) {
        self.current_month += 1;
        if self.current_month > 12 {
            self.current_month = 1;
            self.current_year += 1;
            self.forty_nine_three = true;
        }

    }

    pub fn apply_measure(&mut self, measure: &crate::measure::RawMeasure, factor: isize) {
        self.social += measure.acceptation_impact.social * factor;
        self.economic += measure.acceptation_impact.economic * factor;
        self.environmental += measure.acceptation_impact.environmental * factor;
        self.scientist += measure.acceptation_impact.factions.scientist * factor;
        self.united_nations += measure.acceptation_impact.factions.united_nations * factor;
        self.cartel += measure.acceptation_impact.factions.cartel * factor;
    }


}

#[derive(Deserialize)]
struct Pseudo {
    pseudo: String,
}

#[post("/create_game")]
pub async fn create_game(request: HttpRequest, body : web::Json<Pseudo>) -> impl Responder {
    let game = Game::new(body.pseudo.clone());
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
            "current_year": game.unwrap().current_year,
            "current_month": game.unwrap().current_month,
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

    game.apply_measure(measure, factor);
    game.next_month();

    game.already_seen_measures.push(game.current_measure.clone());
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

#[post("/forty_nine_three")]
pub async fn forty_nine_three(request: HttpRequest) -> impl Responder {
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

    if !game.forty_nine_three {
        return HttpResponse::BadRequest().body("Already used 49.3");
    }

    if let Some(latest_measure_string) = game.already_seen_measures.pop() {
        let latest_measure = match crate::measure::MEASURES.get(&latest_measure_string) {
            Some(measure) => measure,
            None => return HttpResponse::InternalServerError().body("Measure not found"),
        };

        game.apply_measure(latest_measure, -1);

        game.forty_nine_three = false;
    }

    HttpResponse::Ok().body("OK")
}
