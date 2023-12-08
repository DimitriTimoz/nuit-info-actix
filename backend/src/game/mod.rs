use crate::prelude::*;
use config::Value;
use serde::Deserialize;
use serde_json::json;
use std::{collections::HashMap, ptr::null};
use tokio::sync::RwLock;
use uuid::Uuid;

mod authorization;
pub use authorization::*;
mod measure;
pub use measure::*;
mod penalty;
pub use penalty::*;

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
    notification: Option<String>,
    pub current_measure: String,
    pub already_seen_measures: Vec<String>,
}

impl Game {
    fn new(pseudo: String) -> Self {
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
            notification: None,
            current_measure: String::new(),
            already_seen_measures: Vec::new(),
        };
        
        let random_measure = match get_random_measure(&game) {
            Ok(measure) => measure,
            Err(_) => panic!("Measure not found"),
        };

        game.set_current_measure(random_measure);

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

    pub fn apply_measure(&mut self, measure: &RawMeasure, factor: isize) {
        self.social += measure.acceptation_impact.social * factor;
        self.economic += measure.acceptation_impact.economic * factor;
        self.environmental += measure.acceptation_impact.environmental * factor;
        self.scientist += measure.acceptation_impact.factions.scientist * factor;
        self.united_nations += measure.acceptation_impact.factions.united_nations * factor;
        self.cartel += measure.acceptation_impact.factions.cartel * factor;
    }

    pub fn set_current_measure(&mut self, measure: String) {
        self.current_measure = (*measure).to_owned();
    }

    pub fn contains_measure(&self, measure: &str) -> bool {
        self.already_seen_measures.contains(&measure.to_owned())
    }

    pub fn is_game_over(&self) -> bool {
        self.social <= 5 || self.economic <= 5 || self.environmental <= 5
    }

    pub fn clear_some_measures(&mut self) {
        for _ in 0..5 {
            self.already_seen_measures.remove(0);
        }
    }

    pub fn get_scientist_penalty_probability(&self) -> isize {
        100 - self.scientist
    }

    pub fn get_united_nations_penalty_probability(&self) -> isize {
        100 - self.united_nations
    }

    pub fn get_cartel_penalty_probability(&self) -> isize {
        100 - self.cartel
    }

    pub fn set_notification(&mut self, notification: String) {
        self.notification = Some(notification);
    }

    pub fn pop_notification(&mut self) -> Option<String> {
        if self.notification.is_none() {
            return None;
        }

        let notification = self.notification.clone();
        self.notification = None;
        Some(notification.unwrap())
    }
}

#[derive(Deserialize)]
struct Pseudo {
    pseudo: String,
}

#[post("/create_game")]
pub async fn create_game(_: HttpRequest, body: web::Json<Pseudo>) -> impl Responder {
    let game = Game::new(body.pseudo.clone());
    let id = Uuid::new_v4();

    GAMES.write().await.insert(id, game);

    HttpResponse::Ok().body(id.to_string())
}

#[get("/game")]
pub async fn get_game(request: HttpRequest) -> impl Responder {
    let authorization = match Authorization::try_from(request.headers()) {
        Ok(authorization) => authorization,
        Err(e) => return HttpResponse::BadRequest().body(e),
    };

    let mut games = GAMES.write().await;

    let game = match games.get_mut(&authorization.clone().into()) {
        Some(game) => Some(game),
        None => return HttpResponse::BadRequest().body("No game found"),
    };

    let game = match game {
        Some(game) => game,
        None => return HttpResponse::BadRequest().body("No game found"),
    };

    let game_informations = json!(
        {
            "social": game.social,
            "economic": game.economic,
            "environmental": game.environmental,
            "scientist": game.scientist,
            "united_nations": game.united_nations,
            "cartel": game.cartel,
            "current_year": game.current_year,
            "current_month": game.current_month,
            "game_over": game.is_game_over(),
            "notification": game.pop_notification(),
        }
    );

    if game.is_game_over() {
        games.remove_entry(&authorization.into());
    }

    HttpResponse::Ok().body(game_informations.to_string())
}

pub async fn answer(request: &HttpRequest, factor: isize) -> impl Responder {
    let authorization = match Authorization::try_from(request.headers()) {
        Ok(authorization) => authorization,
        Err(e) => return HttpResponse::BadRequest().body(e),
    };

    let mut games = GAMES.write().await;

    let game = match games.get_mut(&authorization.into()) {
        Some(game) => game,
        None => return HttpResponse::BadRequest().body("No game found"),
    };

    let measure = match MEASURES.get(&game.current_measure) {
        Some(measure) => measure,
        None => return HttpResponse::InternalServerError().body("Measure not found"),
    };

    game.apply_measure(measure, factor);
    game.next_month();

    game.already_seen_measures
        .push(game.current_measure.clone());


    let random_measure = get_random_measure(game);

    if random_measure.is_err() {
        game.clear_some_measures();
    }

    let random_measure = match get_random_measure(game) {
        Ok(measure) => measure,
        Err(_) => return HttpResponse::InternalServerError().body("Random measure not found"),
    };

    game.set_current_measure(random_measure);



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
    let authorization = match Authorization::try_from(request.headers()) {
        Ok(authorization) => authorization,
        Err(e) => return HttpResponse::BadRequest().body(e),
    };

    let mut games = GAMES.write().await;

    let game = match games.get_mut(&authorization.into()) {
        Some(game) => game,
        None => return HttpResponse::BadRequest().body("No game found"),
    };

    if !game.forty_nine_three {
        return HttpResponse::BadRequest().body("Already used 49.3");
    }

    if let Some(latest_measure_string) = game.already_seen_measures.pop() {
        let latest_measure = match MEASURES.get(&latest_measure_string) {
            Some(measure) => measure,
            None => return HttpResponse::InternalServerError().body("Measure not found"),
        };

        game.apply_measure(latest_measure, -1);

        game.forty_nine_three = false;
    }

    HttpResponse::Ok().body("OK")
}
